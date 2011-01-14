/*

The MIT License

Copyright (c) 2011 Norio Nomura

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

if (window.top === window) {
  window.document.addEventListener('beforeload', function(event) {
    if (event.url) {
      var maybeMedia = /^https?:\/\/.*(.mov|.mp4|.m4v|.mp3|.m4a|.m3u8)(\?.*)?$/i,
          maybePicture = /^https?:\/\/.*(.png|.gif|.jpg|.svg)(\?.*)?$/i;
      if (maybeMedia.test(event.url) && event.target.parentNode.tagName !== 'OBJECT' ||
          !maybePicture.test(event.url) && event.target.tagName === 'VIDEO') {
        var a = window.document.createElement('a');
        a.id = 'sendUstreamToAirFlick';
        a.className = 'sendUstreamToAirFlick';
        a.textContent = 'send to AirFlick!';
        a.style.float = 'right';
        a.style.position = 'relative';
        a.style.marginRight = '20px';
        a.style.webkitTransitionDuration = '0.3s';
        a.style.zIndex = '1001';
        a.href = 'airflick://play-media?MediaLocation='+encodeURIComponent(event.url);
        event.target.parentNode.appendChild(a);
        a.addEventListener('mouseover', function() {a.style.removeProperty('color');}, false);
        a.addEventListener('mouseout', function() {a.style.color = 'transparent';}, false);
        window.setTimeout(function(){try{a.style.color = 'transparent';}catch(e){};}, 5000);
      }
    }
  }, true);
}