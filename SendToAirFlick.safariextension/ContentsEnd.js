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

(function () {
  var getObjectFromGlobal = function (message) {
        var isHttp = /^https?:/i;
        if (isHttp.test(message)) {
          window.location = 'airflick://play-media?MediaLocation='+encodeURIComponent(message);
        }
      },
      port, 
      sendMessage = typeof(safari) !== 'undefined' ?
        function (name, obj) {safari.self.tab.dispatchMessage(name, obj);} :
        typeof(chrome) !== 'undefined' ?
        function (name, obj) {
          if (!port) {
            port = chrome.extension.connect({'name': name});
            port.onMessage.addListener(getObjectFromGlobal);
          }
          port.postMessage(obj);
        } : null,
      sendUrlToAirPlay = function (obj) {sendMessage('SendUrlToAirPlay', obj);};
  if (typeof(safari) !== 'undefined') {
    safari.self.addEventListener('message', function (eventMessage) {
      getObjectFromGlobal.call(eventMessage, eventMessage.message);
    }, false);
  }
  window.document.addEventListener('SendUrlToAirPlay', function (evt) {sendUrlToAirPlay(evt.detail);}, true);

  var contentScripts = window.top === window ?
      [
        {
          matcher: /^https?:\/\/www\.ustream\.tv\/.*/i,
          file: 'SendUstreamToAirFlick.js'
        },
        {
          matcher: /^https?:\/\/vimeo\.com\/.*/i,
          file: 'SendVimeoToAirFlick.js'
        },
        {
          matcher: /^https?:\/\/www\.livestation\.com\/channels\/.*/i,
          file: 'SendLivestationToAirFlick.js'
        },
        {
          matcher: /^https?:\/\/www\.livestream\.com\/.*/i,
          file: 'SendLivestreamToAirFlick.js'
        }
      ] :
      [
        {
          matcher: /^https?:\/\/(?:av|player)\.vimeo\.com\/.*/i,
          file: 'SendVimeoToAirFlick.js'
        }
      ],
      getExtensionURL = typeof(safari) !== 'undefined' ?
      function (fileName) {return safari.extension.baseURI + fileName;} :
      typeof(chrome) !== 'undefined' ? chrome.extension.getURL : null;

  contentScripts.forEach(function (contentScript) {
    if (contentScript.matcher.test(window.location)) {
      var script = window.document.createElement('script');
      script.src = getExtensionURL(contentScript.file) + '?datetime=' + Date.now();
      (window.document.head || window.document.body).appendChild(script);
    }
  });

  if (window.top === window) {
    var thresholdImgSize = 300 * 200,  // From instagr.am default size, Yes, I like instagram.
        largestImg,
        sendImgToAirPlay = function (obj) {sendMessage('SendImgToAirPlay', obj);},
        sendLargestImgToAirPlay = function (obj) {sendMessage('SendLargestImgToAirPlay', obj);},
        button = window.document.createElement('a'),
        mouseOverImg,
        timeoutId,
        handleMouseMove = function (mouseEvent) {
          var currentMouseOverImg;
          if (Array.prototype.some.call(window.document.images, function (img) {
                if (img.naturalHeight * img.naturalWidth >= thresholdImgSize) {
                  var rect = img.getBoundingClientRect();
                  if (rect.left <= this.clientX && this.clientX <= rect.right &&
                      rect.top <= this.clientY && this.clientY <= rect.bottom) {
                    currentMouseOverImg = img;
                    return true;
                  }
                }
                return false;
              }, mouseEvent)) {
            if (mouseOverImg !== currentMouseOverImg) {
              mouseOverImg = currentMouseOverImg;
              if (button.parentNode !== mouseOverImg.offsetParent) {
                if (button.parentNode) {
                  button.parentNode.removeChild(button);
                }
                mouseOverImg.offsetParent.appendChild(button);
              }
              button.onclick = function (clickEvent) {
                sendImgToAirPlay(mouseOverImg.src);
                clickEvent.preventDefault();
              };
              window.setTimeout(function () {
                button.style.opacity = '1';
              }, 500);
              timeoutId = window.setTimeout(function () {
                button.style.opacity = '0';
              }, 2000);
            }
            if (button.offsetParent === window.document.body) {
              var rect = mouseOverImg.getBoundingClientRect();
              button.style.top = rect.top.toString() + 'px';
              button.style.left = (rect.right - button.clientWidth).toString() + 'px';
            } else {
              button.style.top = mouseOverImg.offsetTop.toString() + 'px';
              button.style.left = (mouseOverImg.offsetLeft + mouseOverImg.offsetWidth - button.clientWidth).toString() + 'px';
            }
          } else {
            button.style.opacity = '0';
            mouseOverImg = null;
          }
        };
    button.textContent = 'send to AirPlay!';
    button.style.backgroundColor = 'white';
    button.style.color = 'blue';
    button.style.cursor = 'pointer';
    button.style.float = 'right';
    button.style.opacity = '0';
    button.style.position = 'absolute';
    button.style.webkitTransitionDuration = '0.3s';
    button.style.zIndex = 1001;
    window.document.addEventListener('mousemove', handleMouseMove, true);
    button.onmouseover = function () {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
        timeoutId = null;
      }
      button.style.opacity = '1';
    };
    button.onmouseout = function () {
      button.style.opacity = '0';
    };
  }
})();
