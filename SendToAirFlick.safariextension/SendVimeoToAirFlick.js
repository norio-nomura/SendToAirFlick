/*

The MIT License

Copyright (c) 2011 Norio Nomura

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the 'Software'), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

if (window.top === window) {
  (function () {
    var isPlayer = /^player\d+_\d+$/i,
        isPlayerElement = /^player\d+_\d+_element$/i,
        player = null,
        playerElement = null;
    for (var i in window) {
      if (isPlayer.test(i)) {
        player = window[i];
      } else if (isPlayerElement.test(i)) {
        playerElement = window[i];
      }
    }
    if (player && playerElement) {
      var getVideoUrl = function (b) {
            b = 'hd';
            var a = this.config, c = 'h264', g = null;
            if (((new Date).getTime() / 1E3).round() - this.loadedTime > 3540) {
              a.request = (new XHR).getWithCredentials("http://" + a.request.player_url + "/config/" + a.video.id).request
            }
            if (c) {
              g = "http://" + a.request.player_url + "/play_redirect";
              g += "?quality=" + b;
              g += "&codecs=" + c;
              g += "&clip_id=" + a.video.id;
              g += "&time=" + a.request.timestamp;
              g += "&sig=" + a.request.signature;
              g += "&type=html5_desktop_" + (a.embed.on_site ? "local" : "embed")
            }
            return g;
          },
          button = window.document.createElement('a');
      button.id = 'sendVimeoToAirFlick';
      button.className = 'sendVimeoToAirFlick';
      button.textContent = 'send to AirFlick!';
      button.style.float = 'right';
      button.style.position = 'relative';
      button.style.marginRight = '20px';
      button.style.zIndex = '1001';
      playerElement.parentNode.parentNode.appendChild(button);
      button.addEventListener('click', function (event) {
        var iframe = window.document.getElementById('sendVimeoToAirFlickIframe') || window.document.createElement('iframe');
        iframe.id = 'sendVimeoToAirFlickIframe';
        iframe.height = '0';
        iframe.width = '0';
        iframe.style.visibility = 'hidden';
        iframe.src = getVideoUrl.call(player, 'hd');
        window.document.body.appendChild(iframe);
      }, false);
    }
  })();
} else {
  (function () {
    debugger;
    var mediaElement = window.document.body.children[0];
    if (mediaElement.tagName === 'VIDEO' || mediaElement.tagName === 'EMBED') {
      var src = 'airflick://play-media?MediaLocation='+encodeURIComponent(mediaElement.src);
      window.document.body.removeChild(mediaElement);
      window.location = src;
    }
  })();
}