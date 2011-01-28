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
  var contentScripts = window.top === window ?
      [
        {
          matcher: /^https?:\/\/www\.ustream\.tv\/(?:channel|recorded)\/.*/i,
          file: 'sendUstreamToAirFlick.js'
        },
        {
          matcher: /^https?:\/\/vimeo\.com\/.*/i,
          file: 'SendVimeoToAirFlick.js'
        },
        {
          matcher: /^https?:\/\/www\.livestream\.com\/.*/i,
          file: 'SendLivestreamToAirFlick.js'
        }
      ] :
      [
        {
          matcher: /^https?:\/\/av\.vimeo\.com\/.*/i,
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
})();
