// JavaScript Document
/**
 * 作者：www.520internet.com
 * 所有单个元素需要国际化的使用<ins class="i18n">中文</ins>
 * 所有通过js异步修改的元素需要国际化的使用<div class="i18ns"><ins class="i18n">中文</ins></div>
 * *M* 效率仍然需要优化
 **/
(function($, window) {
  "use strict";
  var Mi18n = {
    language: null,
    tempLanguage: '',
    config: {
      defaultLanguage: '',
      autoCollect: true,
      collectDelay: 3000,
      insertLanguageUrl: '',
      getLanguageUrl: '',
      language: ''
    },

    // 浏览器语言
    getLanguage: function() {
      var language = navigator.browserLanguage ? navigator.browserLanguage : navigator.language;
      var name = language.toLowerCase().split('-');
      return name[0];
    },

    /**
     * MD5
     * @param string string
     * @return string
     */
    md5: function(string) {
      function RotateLeft(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
      }

      function AddUnsigned(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
          return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
          if (lResult & 0x40000000) {
            return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
          } else {
            return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
          }
        } else {
          return (lResult ^ lX8 ^ lY8);
        }
      }

      function F(x, y, z) {
        return (x & y) | ((~x) & z);
      }

      function G(x, y, z) {
        return (x & z) | (y & (~z));
      }

      function H(x, y, z) {
        return (x ^ y ^ z);
      }

      function I(x, y, z) {
        return (y ^ (x | (~z)));
      }

      function FF(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
      };

      function GG(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
      };

      function HH(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
      };

      function II(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
      };

      function ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
          lWordCount = (lByteCount - (lByteCount % 4)) / 4;
          lBytePosition = (lByteCount % 4) * 8;
          lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
          lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
      };

      function WordToHex(lValue) {
        var WordToHexValue = "",
          WordToHexValue_temp = "",
          lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
          lByte = (lValue >>> (lCount * 8)) & 255;
          WordToHexValue_temp = "0" + lByte.toString(16);
          WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        }
        return WordToHexValue;
      };

      function Utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
          var c = string.charCodeAt(n);
          if (c < 128) {
            utftext += String.fromCharCode(c);
          } else if ((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
          } else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
          }
        }
        return utftext;
      };
      var x = Array();
      var k, AA, BB, CC, DD, a, b, c, d;
      var S11 = 7,
        S12 = 12,
        S13 = 17,
        S14 = 22;
      var S21 = 5,
        S22 = 9,
        S23 = 14,
        S24 = 20;
      var S31 = 4,
        S32 = 11,
        S33 = 16,
        S34 = 23;
      var S41 = 6,
        S42 = 10,
        S43 = 15,
        S44 = 21;
      string = Utf8Encode(string);
      x = ConvertToWordArray(string);
      a = 0x67452301;
      b = 0xEFCDAB89;
      c = 0x98BADCFE;
      d = 0x10325476;
      for (k = 0; k < x.length; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = AddUnsigned(a, AA);
        b = AddUnsigned(b, BB);
        c = AddUnsigned(c, CC);
        d = AddUnsigned(d, DD);
      }
      var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
      return temp.toLowerCase();
    },

    /**
     * Cookie
     * set、get
     */
    cookie: {
      enabled: navigator.cookieEnabled,
      expireTime: 30 * 24 * 60 * 60 * 1000,

      /**
       * 设置 COOKIE
       * @param string cName, COOKIE 名称;
       * @param string cValue, COOKIE 值;
       * @param string cPath, 作用路径;
       * @param string cDomain, 作用域;
       * @param int cExpireTime, 有效期以秒为单位;
       * @return boolean;
       **/
      set: function(cName, cValue, cPath, cDomain, cExpireTime) {
        if (!this.enabled) return false;
        var value = cName + '=' + escape(cValue) + '; ',
          date = new Date(),
          expireTime = cExpireTime ? cExpireTime : this.expireTime,
          path,
          domain;
        date.setTime(date.getTime() + expireTime);
        path = cPath ? 'path=' + cPath + ';' : '';
        domain = cDomain ? 'domain=' + cDomain + ';' : '';
        document.cookie = value + path + domain + 'expires=' + date.toGMTString();
        return true;
      },

      /**
       * 获取指定 COOKIE 的值
       * @param string cName; COOKIE 键名
       * @return string;
       **/
      get: function(cName) {
        if (!this.enabled) return false;
        var temp, cookieArr = document.cookie.split('; ');
        for (var i = 0; i < cookieArr.length; i++) {
          temp = cookieArr[i].split('=');
          if (temp[0] == cName) return unescape(temp[1]);
        }
      },
    },

    /**
     * 添加采集的内容至数据库
     * @param string sourceLanguage; 源语言
     * @return null;
     **/
    add: function(sourceLanguage) {
      var _this = this;
      sourceLanguage = Array.from(new Set(sourceLanguage));
      if (sourceLanguage.length > 0) {
        $.ajax({
          type: 'POST',
          async: true,
          dataType: "json",
          url: _this.config.insertLanguageUrl,
          data: {
            language: JSON.stringify(sourceLanguage),
            page: window.location.href
          },
          error: function() {
            setTimeout(function() {
              _this.add(sourceLanguage);
            }, 5000);
          }
        });
      }
    },

    /**
     * 采集需要翻译的标签
     * @param object el
     */
    collection: function(el) {
      var sourceLanguage = [],
        _this = this;
      $('.i18n', el).each(function(i) {
        if ($(this).children().length > 0) return true;
        if ($(this).text() && $(this).text() != '') {
          if (_this.language[_this.md5($(this).text())] == undefined) {
            sourceLanguage.push($(this).text());
          }
        }
        if ($(this).attr('title') && $(this).attr('title') != '') {
          if (_this.language[_this.md5($(this).attr('title'))] == undefined) {
            sourceLanguage.push($(this).attr('title'));
          }
        }
        if ($(this).attr('alt') && $(this).attr('alt') != '') {
          if (_this.language[_this.md5($(this).attr('alt'))] == undefined) {
            sourceLanguage.push($(this).attr('alt'));
          }
        }
        if ($(this).attr('placeholder') && $(this).attr('placeholder') != '') {
          if (_this.language[_this.md5($(this).attr('placeholder'))] == undefined) {
            sourceLanguage.push($(this).attr('placeholder'));
          }
        }
        if ($(this).val() && $(this).val() != '') {
          if ($(this).attr('type') == 'button' || $(this).attr('type') == 'submit') {
            if (_this.language[_this.md5($(this).val())] == undefined) {
              sourceLanguage.push($(this).val());
            }
          }
          if ($(this).attr('type') == 'text' && el.attr('data-set-translate') == 1) {
            if (_this.language[_this.md5($(this).val())] == undefined) {
              sourceLanguage.push($(this).val());
            }
          }
        }
      });
      if ($(document).attr('title') && $(document).attr('title') != '') {
        if (_this.language[_this.md5($(document).attr('title'))] == undefined) {
          sourceLanguage.push($(document).attr('title'));
        }
      }
      this.add(sourceLanguage);
    },

    /**
     * 从数据库获取内容
     * @return array;
     **/
    get: function() {
      if (this.language) return;
      var _this = this;
      var result = $.ajax({
        url: _this.config.getLanguageUrl,
        async: false
      }).responseText;
      this.language = JSON.parse(result);
    },

    /**
     * 替换内容
     * @param Object el
     */
    replaceLanguage: function(el) {
      var _this = this,
        index = '';
      if (el.text() && el.text() != '') {
        index = _this.md5(el.text());
        if (this.language[index] && this.language[index][this.websiteLanguage]) {
          el.text(this.language[index][this.websiteLanguage]);
          this.language[_this.md5(this.language[index][this.websiteLanguage])] = this.language[index];
        }
      }
      if (el.val() && el.val() != '') {
        if (el.attr('type') == 'button' || el.attr('type') == 'submit') {
          index = _this.md5(el.val());
          if (this.language[index] && this.language[index][this.websiteLanguage]) {
            el.val(this.language[index][this.websiteLanguage]);
            this.language[_this.md5(this.language[index][this.websiteLanguage])] = this.language[index];
          }
        }
      }
      if (el.val() && el.val() != '') {
        if (el.attr('type') == 'text' && el.attr('data-set-translate') == 1) {
          index = _this.md5(el.val());
          if (this.language[index] && this.language[index][this.websiteLanguage]) {
            el.val(this.language[index][this.websiteLanguage]);
            this.language[_this.md5(this.language[index][this.websiteLanguage])] = this.language[index];
          }
        }
      }
      if (el.attr('title') && el.attr('title') != '') {
        index = _this.md5(el.attr('title'));
        if (this.language[index] && this.language[index][this.websiteLanguage]) {
          el.attr('title', this.language[index][this.websiteLanguage]);
          this.language[_this.md5(this.language[index][this.websiteLanguage])] = this.language[index];
        }
      }
      if (el.attr('placeholder') && el.attr('placeholder') != '') {
        index = _this.md5(el.attr('placeholder'));
        if (this.language[index] && this.language[index][this.websiteLanguage]) {
          el.attr('placeholder', this.language[index][this.websiteLanguage]);
          this.language[_this.md5(this.language[index][this.websiteLanguage])] = this.language[index];
        }
      }
      if (el.attr('alt') && el.attr('alt') != '') {
        index = _this.md5(el.attr('alt'));
        if (this.language[index] && this.language[index][this.websiteLanguage]) {
          el.attr('alt', this.language[index][this.websiteLanguage]);
          this.language[_this.md5(this.language[index][this.websiteLanguage])] = this.language[index];
        }
      }

      el.off('DOMSubtreeModified').on('DOMSubtreeModified', function() {
        $(this).off('DOMSubtreeModified');
        _this.replaceLanguage($(this));
      });
    },

    /**
     * 翻译
     * @param string language; 目标语言
     * @return null;
     **/
    translate: function(el) {
      // *M* 此处还需要优化
      var _this = this;
      $('.i18n', el).each(function(i) {
        _this.replaceLanguage($(this));
      });

      $('.i18ns').off('DOMSubtreeModified').on('DOMSubtreeModified', function() {
        $(this).off('DOMSubtreeModified');
        _this.translate($(this));
      });

      // 延时采集需要翻译的内容
      if (_this.config.autoCollect) {
        setTimeout(function() {
          _this.collection(el);
        }, _this.config.collectDelay);
      }
    },

    /**
     * 翻译传入的文本
     * @param string text
     */
    translateText: function(text){
      if (!this.config.language) {
        this.get();
      }
      var index = this.md5(text);
      return this.language[index] ? this.language[index] : null;
    },

    /**
     * 将需要翻译的文本生成key
     * @param string text
     */
    keygen: function(text){
      return this.md5(text);
    },

    /**
     * 初始化
     */
    init: function() {
      if (!this.config.language) {
        this.get();
      }
      var _this = this;
      switch (_this.getLanguage()) {
        case 'en':
          this.defaultLanguage = 'en';
          break;
        case 'ja':
          this.defaultLanguage = 'ja';
          break;
        case 'ko':
          this.defaultLanguage = 'ko';
          break;
        case 'de':
          this.defaultLanguage = 'de';
          break;
        case 'zh':
          this.defaultLanguage = 'zh';
          break;
        default:
          this.defaultLanguage = this.config.defaultLanguage;
          break;
      }

      this.websiteLanguage = _this.cookie.get('systemLanguage') ? _this.cookie.get('systemLanguage') : this.defaultLanguage;
      this.changeLanguage();
    },

    /**
     * 修改语言
     */
    changeLanguage: function() {
      var _this = this;
      this.websiteLanguage = _this.cookie.get('systemLanguage') ? _this.cookie.get('systemLanguage') : this.defaultLanguage;
      if (this.language[_this.md5($(document).attr('title'))]) {
        $(document).attr('title', this.language[_this.md5($(document).attr('title'))][this.websiteLanguage]);
      }
      $('.i18n').off('DOMSubtreeModified');
      $('.i18ns').off('DOMSubtreeModified');
      this.translate($('body'));

      // 延时采集需要翻译的内容
      /*
      setTimeout(function(){
        _this.collection($('body'));
      }, 15000);
      */
    }
  };

  window.Mi18n = Mi18n;
})($, window);

console.log('https://github.com/520internet/Mi18n');
