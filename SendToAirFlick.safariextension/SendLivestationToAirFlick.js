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
    var channelFlashContent = window.document.getElementById('channelMediaPlayer');
    if (channelFlashContent) {
      var button = window.document.createElement('a');
      button.id = 'sendLivestationToAirFlick';
      button.className = 'sendLivestationToAirFlick';
      button.textContent = 'send to AirFlick!';
      button.style.float = 'right';
      button.style.position = 'relative';
      button.style.marginRight = '20px';
      button.style.zIndex = '1001';
      button.onclick = function () {
        var evt = window.document.createEvent('CustomEvent');
        evt.initCustomEvent('SendToAirPlay', false, false, window.location.href.replace(/channels\/(\d+).*$/,'channels/$1/playlist.m3u8'));
        window.document.dispatchEvent(evt);
      };
      channelFlashContent.parentNode.insertBefore(button, channelFlashContent.nextSibling);
    };
  })();
}