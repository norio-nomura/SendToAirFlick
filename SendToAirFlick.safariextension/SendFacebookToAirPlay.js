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
    var onclick = function (event) {
          var swf = window['swf_'+event.target.previousSibling.id];
          if (swf && swf.variables) {
            var evt = window.document.createEvent('CustomEvent'),
                videoUrl = decodeURIComponent(swf.variables.highqual_src || swf.variables.lowqual_src || swf.variables.video_src);
            evt.initCustomEvent('SendUrlToAirPlay', false, false, videoUrl);
            window.document.dispatchEvent(evt);
          }
        },
        createA = function (element) {
          if (/^id_[^_]+/.test(element.id)) {
            var a = window.document.createElement('a');
            a.className = 'sendFacebookToAirPlay';
            a.textContent = 'send to AirPlay!';
            a.style.backgroundColor = 'transparent';
            a.style.color = 'blue';
            a.style.cursor = 'pointer';
            a.style.float = 'right';
            a.style.position = 'relative';
            a.style.fontSize = 'medium';
            a.style.padding = '15px';
            a.style.textDecoration = 'none';
            a.style.textShadow = [
              'rgba(255, 255, 255, 1) 0px 5px 5px',
              'rgba(255, 255, 255, 1) 5px 5px 5px',
              'rgba(255, 255, 255, 1) 5px 0px 5px',
              'rgba(255, 255, 255, 1) 5px -5px 5px',
              'rgba(255, 255, 255, 1) 0px -5px 5px',
              'rgba(255, 255, 255, 1) -5px -5px 5px',
              'rgba(255, 255, 255, 1) -5px 0px 5px',
              'rgba(255, 255, 255, 1) -5px 5px 5px'
            ].join(',');
            a.style.zIndex = '1001';
            a.onclick = onclick;
            element.parentNode.appendChild(a);
          }
        },
        mvpPlayers = window.document.getElementsByClassName('mvp_player');
    window.addEventListener('beforeload', function (event) {
      if (event.target.tagName === 'EMBED') {
        createA(event.target.parentNode);
      }
    }, true);
  })();
}
