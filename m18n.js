// JavaScript Document
/**
 * 作者：savage
 **/
(function($, window) {
  "use strict";
  var Mi18n = {
    language: null,
    tempLanguage: [],
    config: {
      // 在获取翻译数据的时候只查询指定URL
      page: '',
      // 初始化的时候自动翻译
      autoTranslate: true,
      // 默认语言
      defaultLanguage: '',
      // 自动采集需要翻译的内容
      autoCollect: true,
      // 延时采集的时间
      collectDelay: 3000,
      // 采集后接收内容的接口URL
      insertLanguageUrl: '',
      // 获取翻译数据的接口 URL
      getLanguageUrl: '',
      // 静态配置翻译数据
      language: '',
      // 是否侦听所有 mi18n、mi18ns 的变化，true 自动侦听所有，false 手动配置
      listenerAllMi18nEvent: true,
      listenerAllMi18nsEvent: true,
      debug: true
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
    add: function(el, sourceLanguage) {
      var _this = this,
        tempLanguage = [];

      sourceLanguage = Array.from(new Set(sourceLanguage)); // 去重
      for(var i in sourceLanguage){
        if (_this.searchLanguageValueReturnKey(sourceLanguage[i]) == null){
          if (_this.tempLanguage.indexOf(sourceLanguage[i]) == -1){
            tempLanguage.push(sourceLanguage[i]);
          }
        }
      }
      if (tempLanguage.length > 0){
          $.ajax({
            type: 'POST',
            async: true,
            dataType: "json",
            url: _this.config.insertLanguageUrl,
            data: {
              language: JSON.stringify(tempLanguage),
              page: window.location.pathname
            },
            success: function(result){
              if (result == 'true') _this.tempLanguage.push(tempLanguage);
            },
            error: function() {
              setTimeout(function() {
                _this.add(el, sourceLanguage);
              }, 5000);
            }
          });
      }
    },

    /**
     * 采集需要翻译的标签
     * @param object el
     */
    gather: function(el) {
      var sourceLanguage = [],
        _this = this;
      $('.mi18n', el).each(function(i) {
        //if ($(this).children().length > 0) return true;
        if (el.attr('data-set-mi18n-stop-gather') == 1) return true;

        if ($(this).html() && $(this).html() != '') {
          if (_this.language[_this.md5($(this).html())] == undefined) {
            sourceLanguage.push(_this.transformHTML($(this)).html);
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
          if ($(this).attr('type') == 'text' && el.attr('data-set-mi18n-translate') == 1) {
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
      this.add(el, sourceLanguage);
    },

    /**
     * 查询 Language 的值返回 Key
     */
    searchLanguageValueReturnKey: function(value){
      for(var i in this.language){
        for(var ii in this.language[i]){
          if (this.language[i][ii] == value){
            return i;
          }
        }
      }
      return null;
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
        data: {'page': _this.config.page},
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
      el.off('DOMNodeInserted');
      el.off('DOMSubtreeModified');

      if (el.html() && el.html() != '') {
        var transformHTML = _this.transformHTML(el),
            mi18nVar = [],
            mi18nVarSourceHtml = [];
        if ($('.mi18n-var', $('<language>'+transformHTML.sourceHtml+'</language>')).length > 0){
            $('.mi18n-var', $('<language>'+transformHTML.sourceHtml+'</language>')).each(function(i){
              if ($(this).html() != ''){
                if (index = _this.searchLanguageValueReturnKey($(this).html())){
                  mi18nVar[i] = _this.language[index][_this.websiteLanguage];
                  mi18nVarSourceHtml[i] = $(this).html();
                }
              }
            });
        }
        if (index = this.searchLanguageValueReturnKey(transformHTML.html)) {
          var mi18nText = this.language[index][this.websiteLanguage];
        }
        el.html(mi18nText);
        if (mi18nVar.length > 0){
          $('.mi18n-var', el).each(function(i){
            if ($(this).attr('data-set-mi18n-stop-translate') != 1){
              $(this).html(mi18nVar[i]);
            } else {
              $(this).html(mi18nVarSourceHtml[i]);
            }
          });
        }
      }

      if (el.attr('data-set-mi18n-src')){
        var src = JSON.parse(el.attr('data-set-mi18n-src'));
        if (el.attr('data-set-mi18n-translate-background') == 1){
          el.css({"backgroundImage": "url('"+src[this.websiteLanguage]+"')"});
        }
        el.attr('src', src[this.websiteLanguage]);
      }

      if (el.val() && el.val() != '') {
        if (el.attr('type') == 'button' || el.attr('type') == 'submit') {
          if (index = this.searchLanguageValueReturnKey(el.val())) {
            el.val(this.language[index][this.websiteLanguage]);
          }
        }
      }
      if (el.val() && el.val() != '') {
        if (el.attr('type') == 'text' && el.attr('data-set-mi18n-translate') == 1) {
          if (index = this.searchLanguageValueReturnKey(el.val())) {
            el.val(this.language[index][this.websiteLanguage]);
          }
        }
      }
      if (el.attr('title') && el.attr('title') != '') {
        if (index = this.searchLanguageValueReturnKey(el.attr('title'))) {
          el.attr('title', this.language[index][this.websiteLanguage]);
        }
      }
      if (el.attr('placeholder') && el.attr('placeholder') != '') {
        if (index = this.searchLanguageValueReturnKey(el.attr('placeholder'))) {
          el.attr('placeholder', this.language[index][this.websiteLanguage]);
        }
      }
      if (el.attr('alt') && el.attr('alt') != '') {
        if (index = this.searchLanguageValueReturnKey(el.attr('alt'))) {
          el.attr('alt', this.language[index][this.websiteLanguage]);
        }
      }

      if (el.hasClass('mi18n-var')) return;
      _this.bindMi18nEvent(el);
    },

    /**
     * 检测是否包含变量，如果包含变量进行转换
     * @param object html
     */
    transformHTML: function(html){
      var sourceHtml = html.html();
      if ($('.mi18n-var', html).length > 0){
          $('.mi18n-var', html).empty();
      }
      return {
        'sourceHtml': sourceHtml,
         'html': html.html()
      };
    },

    /**
     * 翻译
     * @param string language; 目标语言
     * @return null;
     **/
    translate: function(el) {
      var _this = this;
      $('.mi18n', el).each(function(index, el) {
        $(el).removeAttr('data-set-mi18n-stop-gather');
        _this.replaceLanguage($(el));
      });

      // 延时采集需要翻译的内容
      if (_this.config.autoCollect) {
        setTimeout(function() {
          _this.gather(el);
        }, _this.config.collectDelay);
      }

      if (el.hasClass('mi18ns')){
        //this.bindMi18nsEvent(el);
      }
    },
    /*
    observer : function(el){
      // 选择需要观察变动的节点
      const targetNode = el;

      // 观察器的配置（需要观察什么变动）
      const config = { attributes: true, childList: true, subtree: true };

      // 当观察到变动时执行的回调函数
      const callback = function(mutationsList, observer) {
          // Use traditional 'for loops' for IE 11
          for(let mutation of mutationsList) {
              if (mutation.type === 'childList') {
                  console.log('A child node has been added or removed.');
              } else if (mutation.type === 'attributes') {
                  console.log('The ' + mutation.attributeName + ' attribute was modified.');
              }
          }
      };

      // 创建一个观察器实例并传入回调函数
      const observer = new MutationObserver(callback);

      // 以上述配置开始观察目标节点
      observer.observe(targetNode, config);

      // 之后，可停止观察
      observer.disconnect();
    },
    */

    bindMi18nEvent: function(el){
      var _this = this;
      if (el.hasClass('mi18n')){
        el.on('DOMNodeInserted', function(event){
          if (event.target.className.indexOf('mi18n-var') != -1){
            if (event.target.dataset.setMi18nStopTranslate == 1){
              // 不侦听此内容内的变量
              //$('.mi18n-var', event.target).off('DOMNodeInserted');
              return;
            }
          }
          _this.replaceLanguage(el);
        });
        if (el[0].localName == 'input' || el[0].localName == 'textarea'){
          el.on('DOMSubtreeModified', function(event){
            _this.replaceLanguage(el);
          });
        }
      } else {
        $('.mi18n', el).on('DOMNodeInserted', function(event){
          _this.replaceLanguage(el);
        });
      }
    },

    bindMi18nsEvent: function(el){
      var _this = this;
      if (el.hasClass('mi18ns')){
        // 侦听区域更新，该区域<div class="i18ns"></div>会动态更新 HTML，增加 <ins class="i18n">文本</ins>
        if (el.children('.mi18n').length > 0){
          $('.mi18n', el).off('DOMNodeInserted');
        }
        el.off('DOMNodeInserted').on('DOMNodeInserted', function(){
          $(this).off('DOMNodeInserted');
          _this.translate($(this));
          _this.bindMi18nsEvent($(this));
        });
      } else {
        // 侦听区域更新，该区域<div class="i18ns"></div>会动态更新 HTML，增加 <ins class="i18n">文本</ins>
        if ($('.mi18ns', el).children('.mi18n').length > 0){
          $('.mi18n', el).off('DOMNodeInserted');
        }
        $('.mi18ns', el).off('DOMNodeInserted').on('DOMNodeInserted', function(){
          $(this).off('DOMNodeInserted');
          _this.translate($(this));
          _this.bindMi18nsEvent($(this));
        });
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
      if (this.language){
        var index = this.searchLanguageValueReturnKey(text);
        return this.language[index] ? this.language[index] : null;
      } else {
        return text;
      }
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
      var _this = this;
      if (!this.config.language) {
        this.get();
      }
      var browserLanguage = this.getLanguage();
      this.defaultLanguage = browserLanguage ? browserLanguage : this.config.defaultLanguage;
      this.websiteLanguage = this.cookie.get('systemLanguage') ? this.cookie.get('systemLanguage') : this.defaultLanguage;

      if (this.config.listenerAllMi18nEvent) this.bindMi18nEvent($('body'));
      if (this.config.listenerAllMi18nsEvent) this.bindMi18nsEvent($('body'));
      // 开始翻译
      if (this.config.autoTranslate) this.changeLanguage();
    },

    /**
     * 修改语言
     */
    changeLanguage: function() {
      this.websiteLanguage = this.cookie.get('systemLanguage') ? this.cookie.get('systemLanguage') : this.defaultLanguage;
      if (this.language){
        var index;
        if (index = this.searchLanguageValueReturnKey($(document).attr('title'))) {
          $(document).attr('title', this.language[index][this.websiteLanguage]);
        }
      }

      // 翻译
      this.translate($('body'));
    }
  };

  if (typeof define === 'function' && define.amd) {
    define(function () {
      return Mi18n;
    })
  } else if (typeof module === 'object' && module.exports) {
    module.exports = Mi18n;
  } else {
    window.Mi18n = Mi18n;
  }
})($, window);

export default Mi18n;

console.log('https://github.com/520internet/Mi18n');
