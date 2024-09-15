let $ytLiveChatEmbed = $("#youtube-livechat-embed");

function askAndSetYTLiveID() {
    let ytId = prompt("Enter YouTube Video ID:");
    if (ytId) setYTLiveID(ytId);
}

function setYTLiveID(videoId) {
    let url = `https://www.youtube.com/live_chat?v=${videoId}&embed_domain=${location.host}`;
    $ytLiveChatEmbed.attr("src", url);
}