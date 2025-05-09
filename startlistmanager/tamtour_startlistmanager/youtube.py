import os
from datetime import datetime

import google.oauth2.credentials
import google_auth_oauthlib.flow
import googleapiclient.discovery
from django.http.request import HttpRequest
from django.shortcuts import reverse, redirect

from . import models

ENV_CLIENT_ID_NAME = 'OAUTH_GOOGLE_KEY'
ENV_CLIENT_SECRET_NAME = 'OAUTH_GOOGLE_SECRET'
REDIRECT_URI_VIEW_NAME = 'admin:tamtour_startlistmanager_ytaccount_oauth_callback'


class YouTubeOAuth:
    @classmethod
    def _get_flow_from_env(cls, state=None):
        return google_auth_oauthlib.flow.Flow.from_client_config({
            "web": {
                "client_id": os.getenv(ENV_CLIENT_ID_NAME),
                "client_secret": os.getenv(ENV_CLIENT_SECRET_NAME),
                # "project_id": os.getenv('OAUTH_GOOGLE_PROJECT_ID'),
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            }
        }, scopes=['https://www.googleapis.com/auth/youtube'], state=state)

    @classmethod
    def redirect_to_authorization_url(cls, request: HttpRequest, account: models.YTAccount):
        flow = cls._get_flow_from_env()
        flow.redirect_uri = request.build_absolute_uri(reverse(REDIRECT_URI_VIEW_NAME))

        authorization_url, state = flow.authorization_url(
            access_type='offline',
            prompt='consent')
        request.session['google_oauth_account_pk'] = account.pk
        request.session['google_oauth_state'] = state
        return redirect(authorization_url)

    @classmethod
    def handle_callback(cls, request: HttpRequest):
        state = request.session.pop('google_oauth_state', None)
        flow = cls._get_flow_from_env(state=state)
        flow.redirect_uri = request.build_absolute_uri(reverse(REDIRECT_URI_VIEW_NAME))

        authorization_response = request.build_absolute_uri()
        flow.fetch_token(authorization_response=authorization_response)

        account = models.YTAccount.objects.get(pk=request.session.pop('google_oauth_account_pk'))
        account.credentials = {
            'token': flow.credentials.token,
            'refresh_token': flow.credentials.refresh_token,
            'token_uri': flow.credentials.token_uri,
            'granted_scopes': flow.credentials.granted_scopes
        }
        account.save()

        channel = YouTubeAPI(account).get_own_channel()
        account.yt_account_id = channel['id']
        account.yt_account_name = channel['snippet']['title']
        account.save()
        return account


class YouTubeAPI:
    def __init__(self, account: models.YTAccount):
        credentials = google.oauth2.credentials.Credentials(
            **account.credentials,
            client_id=os.getenv(ENV_CLIENT_ID_NAME),
            client_secret=os.getenv(ENV_CLIENT_SECRET_NAME)
        )

        self.youtube = googleapiclient.discovery.build(
            'youtube', 'v3', credentials=credentials)

    def get_own_channel(self):
        request = self.youtube.channels().list(
            part="id,snippet",
            mine=True
        )
        response = request.execute()
        return response['items'][0]

    def create_broadcast_from_obj(self, stream: models.YTStream):
        request = self.youtube.liveBroadcasts().insert(
            part="snippet,status,contentDetails",
            body={
                "snippet": stream.get_api_snippet(),
                "status": {
                    "privacyStatus": "private",
                    "selfDeclaredMadeForKids": False
                },
                "contentDetails": {
                    "monitorStream": {
                        "enableMonitorStream": True,
                        "broadcastStreamDelayMs": 0
                    },
                    "enableAutoStart": False,
                    "enableAutoStop": False,
                    "enableClosedCaptions": False,
                    "enableDvr": True,
                    "enableEmbed": True,
                    "recordFromStart": True
                }
            }
        )
        response = request.execute()
        stream.yt_id = response["id"]
        stream.save()
        return response

    def update_broadcast_from_obj(self, stream: models.YTStream):
        if not stream.yt_id:
            raise Exception('YouTube ID not set, cannot update.')

        request = self.youtube.liveBroadcasts().update(
            part="snippet",
            body={
                "snippet": stream.get_api_snippet(),
                "id": stream.yt_id,
            }
        )
        response = request.execute()
        if ('actualStartTime' in response['snippet'] and response['snippet']['actualStartTime'] and
                not stream.actual_start_time):
            stream.actual_start_time = datetime.fromisoformat(response['snippet']['actualStartTime'])
            stream.save()

        return response

    def add_broadcast_to_playlist(self, stream: models.YTStream, playlist_id):
        if not stream.yt_id:
            raise Exception('YouTube ID not set, cannot add to playlist.')

        request = self.youtube.playlistItems().insert(
            part="snippet",
            body={
                "snippet": {
                    "playlistId": playlist_id,
                    "resourceId": {
                        "kind": "youtube#video",
                        "videoId": stream.yt_id
                    }
                }
            }
        )
        return request.execute()
