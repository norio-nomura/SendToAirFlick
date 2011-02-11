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
    var getVideoUrl = function (player) {
          var a = player.config, c = 'h264', g = null;
          if (((new Date).getTime() / 1E3).round() - player.loadedTime > 3540) {
            a.request = (new XHR).getWithCredentials("http://" + a.request.player_url + "/config/" + a.video.id).request
          }
          if (c) {
            g = "http://" + a.request.player_url + "/play_redirect";
            g += "?quality=hd";
            g += "&codecs=" + c;
            g += "&clip_id=" + a.video.id;
            g += "&time=" + a.request.timestamp;
            g += "&sig=" + a.request.signature;
            g += "&type=html5_desktop_" + (a.embed.on_site ? "local" : "embed")
          }
          return g;
        },
        onclick = function (event) {
          var vimeoHolders = event.target.parentNode.getElementsByClassName('vimeo_holder');
          if (vimeoHolders.length) {
            var players = vimeoHolders[0].getElementsByClassName('player');
            if (players.length) {
              var player = window[players[0].id.replace(/^player_/i, 'player')];
              if (player) {
                var iframe = window.document.getElementById('sendVimeoToAirFlickIframe') || window.document.createElement('iframe');
                iframe.id = 'sendVimeoToAirFlickIframe';
                iframe.height = '0';
                iframe.width = '0';
                iframe.style.visibility = 'hidden';
                iframe.src = getVideoUrl(player);
                window.document.body.appendChild(iframe);
              }
            }
          }
        },
        createA = function (element) {
          var a = window.document.createElement('a');
          a.className = 'sendVimeoToAirFlick';
          a.textContent = 'send to AirFlick!';
          a.style.float = 'right';
          a.style.position = 'relative';
          a.style.marginLeft = '20px';
          a.style.marginRight = '20px';
          a.style.zIndex = '1001';
          a.onclick = onclick;
          element.parentNode.insertBefore(a, element.nextSibling);
          return a;
        },
        vimeoHolders = window.document.getElementsByClassName('vimeo_holder'),
        clip = window.document.getElementById('clip');
    if (vimeoHolders) {
      for (var i = 0; i < vimeoHolders.length; i++) {
        createA(vimeoHolders[i]);
      }
    }
    if (clip) {
        createA(clip);
    }
  })();
} else {
  (function () {
    var mediaElement = window.document.body.children[0];
    if (mediaElement.tagName === 'VIDEO' || mediaElement.tagName === 'EMBED') {
      var evt = window.document.createEvent('CustomEvent');
      evt.initCustomEvent('SendUrlToAirPlay', false, false, mediaElement.src);
      window.document.dispatchEvent(evt);
      window.document.body.removeChild(mediaElement);
    } else {
      console.log('SendVimeoToAirFlick: Sorry, I can not send video.');
    }
  })();
}