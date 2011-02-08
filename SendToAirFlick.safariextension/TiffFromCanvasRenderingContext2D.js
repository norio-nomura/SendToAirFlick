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

if (window.BlobBuilder && window.ArrayBuffer && window.Uint8Array) {
  
  var TiffFromCanvasRenderingContext2D = function () {
    if (arguments.length) {
      TiffFromCanvasRenderingContext2D.prototype.init.apply(this, arguments);
    }  
  };
  TiffFromCanvasRenderingContext2D.prototype.init = function (context, sx, sy, sw, sh) {
    this.context = context;
    this.sx = sx || 0;
    this.sy = sy || 0;
    this.sw = sw || this.context.canvas.width;
    this.sh = sh || this.context.canvas.height;
    this.ifdTypeOfImageSize = (this.sw > 0xFFFF || this.sh > 0xFFFF) ? 'LONG' : 'SHORT';
        
    this.ifdEntries = {};
    this.addEntry('ImageWidth', this.ifdTypeOfImageSize, this.sw);
    this.addEntry('ImageLength', this.ifdTypeOfImageSize, this.sh);
    this.addEntry('BitsPerSample', 'SHORT', 4, 8, 8, 8, 8);
    this.addEntry('Compression', 'SHORT', 1);
    this.addEntry('PhotometricInterpretation', 'SHORT', 2);
    this.addEntry('StripOffsets', 'SHORT', 8);
    this.addEntry('Orientation', 'SHORT', 1);
    this.addEntry('SamplesPerPixel', 'SHORT', 4);
    this.addEntry('RowsPerStrip', this.ifdTypeOfImageSize, sh);
    this.addEntry('StripByteCounts', this.sw * this.sh * 4 > 0xFFFF ? 'LONG' : 'SHORT', this.sw * this.sh * 4);
    this.addEntry('XResolution', 'RATIONAL', 1, 72, 1);
    this.addEntry('YResolution', 'RATIONAL', 1, 72, 1);
    this.addEntry('PlanarConfiguration', 'SHORT', 1);
    this.addEntry('ResolutionUnit', 'SHORT', 2);
    this.addEntry('ExtraSamples', 'SHORT', 2);
    this.addEntry('SampleFormat', 'SHORT', 4, 1, 1, 1, 1);
  };
  TiffFromCanvasRenderingContext2D.IFD_TAG = {
    'ImageWidth': 0x100,
    'ImageLength': 0x101,
    'BitsPerSample': 0x102,
    'Compression': 0x103,
    'PhotometricInterpretation': 0x106,
    'StripOffsets': 0x111,
    'Orientation': 0x112,
    'SamplesPerPixel': 0x115,
    'RowsPerStrip': 0x116,
    'StripByteCounts': 0x117,
    'XResolution': 0x11A,
    'YResolution': 0x11B,
    'PlanarConfiguration': 0x11C,
    'ResolutionUnit': 0x128,
    'ExtraSamples': 0x152,
    'SampleFormat': 0x153
  };
  TiffFromCanvasRenderingContext2D.IFD_TYPE = {
    'BYTE': 1,
    'ASCII': 2,
    'SHORT': 3,
    'LONG': 4,
    'RATIONAL': 5
  };
  TiffFromCanvasRenderingContext2D.prototype.addEntry = function (tag, type, countOrValue) {
    if (arguments.length > 3) {
      this.ifdEntries[TiffFromCanvasRenderingContext2D.IFD_TAG[tag]] = {
        'tag': TiffFromCanvasRenderingContext2D.IFD_TAG[tag],
        'type': TiffFromCanvasRenderingContext2D.IFD_TYPE[type],
        'count': countOrValue,
        'value': Array.prototype.slice.call(arguments,3)
      };
    } else {
      this.ifdEntries[TiffFromCanvasRenderingContext2D.IFD_TAG[tag]] = {
        'tag': TiffFromCanvasRenderingContext2D.IFD_TAG[tag],
        'type': TiffFromCanvasRenderingContext2D.IFD_TYPE[type],
        'count': 1,
        'value': [countOrValue]
      };
    }
  };
  TiffFromCanvasRenderingContext2D.prototype.getBlob = function (sx, sy, sw, sh) {
    this.sx = sx || this.sx;
    this.sy = sy || this.sy;
    this.sw = sw || this.sw;
    this.sh = sh || this.sh;
    
    this.ifdTypeOfImageSize = (this.sw > 0xFFFF || this.sh > 0xFFFF) ? 'LONG' : 'SHORT';
    this.addEntry('ImageWidth', this.ifdTypeOfImageSize, this.sw);
    this.addEntry('ImageLength', this.ifdTypeOfImageSize, this.sh);
    this.addEntry('RowsPerStrip', this.ifdTypeOfImageSize, this.sh);
    this.addEntry('StripByteCounts', this.sw * this.sh * 4 > 0xFFFF ? 'LONG' : 'SHORT', this.sw * this.sh * 4);
    
    var BytesFromNumbers = function () {
          var array = Array.isArray(arguments[0]) ? arguments[0] : arguments,
              data = new ArrayBuffer(array.length * Uint8Array.BYTES_PER_ELEMENT),
              bytes = new Uint8Array(data, 0, array.length);
          for (var i = 0; i < array.length; i++) {
            bytes[i] = array[i];
          }
          return data;
        },
        NetworkShortsFromNumbers = function () {
          var array = Array.isArray(arguments[0]) ? arguments[0] : arguments,
              data = new ArrayBuffer(array.length * Uint16Array.BYTES_PER_ELEMENT);
          for (var i = 0; i < array.length; i++) {
            bytes = new Uint8Array(data, i * Uint16Array.BYTES_PER_ELEMENT, Uint16Array.BYTES_PER_ELEMENT);
            bytes[0] = (array[i]&0x0000ff00)>>>8;
            bytes[1] = (array[i]&0x000000ff);
          }
          return data;
        },
        NetworkLongsFromNumbers = function () {
          var array = Array.isArray(arguments[0]) ? arguments[0] : arguments,
              data = new ArrayBuffer(array.length * Uint32Array.BYTES_PER_ELEMENT);
          for (var i = 0; i < array.length; i++) {
            bytes = new Uint8Array(data, i * Uint32Array.BYTES_PER_ELEMENT, Uint32Array.BYTES_PER_ELEMENT);
            bytes[0] = (array[i]&0xff000000)>>>24;
            bytes[1] = (array[i]&0x00ff0000)>>>16;
            bytes[2] = (array[i]&0x0000ff00)>>>8;
            bytes[3] = (array[i]&0x000000ff);
          }
          return data;
        },
        imageData = this.context.getImageData(this.sx, this.sy, this.sw, this.sh),
        bb = new BlobBuilder();
    
    bb.append(BytesFromNumbers(0x4d, 0x4d, 0x0, 0x2a));
    bb.append(NetworkLongsFromNumbers(8 + imageData.data.length));
    
    var strip = new Uint8Array(imageData.data);
    bb.append(strip.buffer);
    
    var keys = Object.keys(this.ifdEntries).sort(),
        offset = 8 + imageData.data.length + 2 + keys.length * 12,
        extras = [];
        
    bb.append(NetworkShortsFromNumbers(keys.length));
      
    for (var i = 0; i < keys.length; i++) {
      var ifdEntry = this.ifdEntries[keys[i]];
      bb.append(NetworkShortsFromNumbers(ifdEntry.tag));
      bb.append(NetworkShortsFromNumbers(ifdEntry.type));
      bb.append(NetworkLongsFromNumbers(ifdEntry.count));
      var values = null;
      switch (ifdEntry.type) {
      case TiffFromCanvasRenderingContext2D.IFD_TYPE.BYTE:
      case TiffFromCanvasRenderingContext2D.IFD_TYPE.ASCII: {
          values = BytesFromNumbers(ifdEntry.value);
          break;
        }
      case TiffFromCanvasRenderingContext2D.IFD_TYPE.SHORT: {
          values = NetworkShortsFromNumbers(ifdEntry.value);
          break;
        }
      case TiffFromCanvasRenderingContext2D.IFD_TYPE.LONG: {
          values = NetworkLongsFromNumbers(ifdEntry.value);
          break;
        }
      case TiffFromCanvasRenderingContext2D.IFD_TYPE.RATIONAL: {
          values = NetworkLongsFromNumbers(ifdEntry.value);
          break;
        }
      default:
        console.log('unsupported type!');
        debugger;
      };
      if (values.byteLength > 4) {
        extras.push(values);
        bb.append(NetworkLongsFromNumbers(offset));
        offset += values.byteLength;
      } else {
        bb.append(values);
        var padLen = 4 - values.byteLength;
        if (padLen) {
          bb.append(BytesFromNumbers(new Array(padLen)));
        }
      }
    }
    extras.forEach(function (element) {
      bb.append(element);
    });
    
    return bb.getBlob();
  };
  TiffFromCanvasRenderingContext2D.GetBlob = function (context, sx, sy, sw, sh) {
    var tiff = new TiffFromCanvasRenderingContext2D();
    TiffFromCanvasRenderingContext2D.prototype.init.apply(tiff, arguments);
    return tiff.getBlob();
  };
}  // window.BlobBuilder && window.ArrayBuffer && window.Uint8Array