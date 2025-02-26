let $ytLiveChatEmbed = $("#youtube-livechat-embed");

function askAndSetYTLiveID() {
    let ytId = prompt("Enter YouTube Video ID:");
    setYTLiveID(ytId);
}

function setYTLiveID(videoId) {
    if (location.protocol === 'file:') {
        alert("YouTube-Embeds funktionieren nicht in file:/// URLs.")
        return;
    }

    let url;
    if (videoId) {
        url = `https://www.youtube.com/live_chat?v=${videoId}&embed_domain=${location.host}`;
    } else {
        url = 'about:blank';
    }
    $ytLiveChatEmbed.attr("src", url);
}
