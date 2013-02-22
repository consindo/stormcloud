/*!
* FitText.js 1.1
*
* Copyright 2011, Dave Rupert http://daverupert.com
* Released under the WTFPL license
* http://sam.zoy.org/wtfpl/
*
* Date: Thu May 05 14:23:00 2011 -0600
*
* Modified to work off height & use jQuery JS
*/

(function( $ ){

  $.fn.fitText = function( kompressor, options ) {

    // Setup options
    var compressor = kompressor || 1,
        settings = $.extend({
          'minFontSize' : Number.NEGATIVE_INFINITY,
          'maxFontSize' : Number.POSITIVE_INFINITY
        }, options);

    return this.each(function(){

      // Store the object
      var $this = $(this);

      // Resizer() resizes items based on the object width divided by the compressor * 10
      var resizer = function () {
        $this.css('font-size', Math.max(Math.min($this.height() / (compressor*10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)));
      };

      // Call once to set.
      resizer();

      // Call on resize. Opera debounces their resize by default.
      $(window).on('resize', resizer);

    });

  };

})( jQuery );

/*
 * Swipe 1.0
 *
 * Brad Birdsall, Prime
 * Copyright 2011, Licensed GPL & MIT
 *
*/
window.Swipe=function(e,t){if(!e)return null;var n=this;this.options=t||{},this.index=this.options.startSlide||0,this.speed=this.options.speed||300,this.callback=this.options.callback||function(){},this.delay=this.options.auto||0,this.container=e,this.element=this.container.children[0],this.container.style.overflow="hidden",this.element.style.listStyle="none",this.element.style.margin=0,this.setup(),this.begin(),this.element.addEventListener&&(this.element.addEventListener("touchstart",this,!1),this.element.addEventListener("touchmove",this,!1),this.element.addEventListener("touchend",this,!1),this.element.addEventListener("webkitTransitionEnd",this,!1),this.element.addEventListener("msTransitionEnd",this,!1),this.element.addEventListener("oTransitionEnd",this,!1),this.element.addEventListener("transitionend",this,!1),window.addEventListener("resize",this,!1))},Swipe.prototype={setup:function(){this.slides=this.element.children,this.length=this.slides.length;if(this.length<2)return null;this.width="getBoundingClientRect"in this.container?this.container.getBoundingClientRect().width:this.container.offsetWidth;if(!this.width)return null;this.container.style.visibility="hidden",this.element.style.width=this.slides.length*this.width+"px";var e=this.slides.length;while(e--){var t=this.slides[e];t.style.width=this.width+"px",t.style.display="table-cell",t.style.verticalAlign="top"}this.slide(this.index,0),this.container.style.visibility="visible"},slide:function(e,t){var n=this.element.style;t==undefined&&(t=this.speed),n.webkitTransitionDuration=n.MozTransitionDuration=n.msTransitionDuration=n.OTransitionDuration=n.transitionDuration=t+"ms",n.MozTransform=n.webkitTransform="translate3d("+ -(e*this.width)+"px,0,0)",n.msTransform=n.OTransform="translateX("+ -(e*this.width)+"px)",this.index=e},getPos:function(){return this.index},prev:function(e){this.delay=e||0,clearTimeout(this.interval),this.index&&this.slide(this.index-1,this.speed)},next:function(e){this.delay=e||0,clearTimeout(this.interval),this.index<this.length-1?this.slide(this.index+1,this.speed):this.slide(0,this.speed)},begin:function(){var e=this;this.interval=this.delay?setTimeout(function(){e.next(e.delay)},this.delay):0},stop:function(){this.delay=0,clearTimeout(this.interval)},resume:function(){this.delay=this.options.auto||0,this.begin()},handleEvent:function(e){switch(e.type){case"touchstart":this.onTouchStart(e);break;case"touchmove":this.onTouchMove(e);break;case"touchend":this.onTouchEnd(e);break;case"webkitTransitionEnd":case"msTransitionEnd":case"oTransitionEnd":case"transitionend":this.transitionEnd(e);break;case"resize":this.setup()}},transitionEnd:function(e){this.delay&&this.begin(),this.callback(e,this.index,this.slides[this.index])},onTouchStart:function(e){this.start={pageX:e.touches[0].pageX,pageY:e.touches[0].pageY,time:Number(new Date)},this.isScrolling=undefined,this.deltaX=0,this.element.style.MozTransitionDuration=this.element.style.webkitTransitionDuration=0},onTouchMove:function(e){if(e.touches.length>1||e.scale&&e.scale!==1)return;this.deltaX=e.touches[0].pageX-this.start.pageX,typeof this.isScrolling=="undefined"&&(this.isScrolling=!!(this.isScrolling||Math.abs(this.deltaX)<Math.abs(e.touches[0].pageY-this.start.pageY))),this.isScrolling||(e.preventDefault(),clearTimeout(this.interval),this.deltaX=this.deltaX/(!this.index&&this.deltaX>0||this.index==this.length-1&&this.deltaX<0?Math.abs(this.deltaX)/this.width+1:1),this.element.style.MozTransform=this.element.style.webkitTransform="translate3d("+(this.deltaX-this.index*this.width)+"px,0,0)")},onTouchEnd:function(e){var t=Number(new Date)-this.start.time<250&&Math.abs(this.deltaX)>20||Math.abs(this.deltaX)>this.width/2,n=!this.index&&this.deltaX>0||this.index==this.length-1&&this.deltaX<0;this.isScrolling||this.slide(this.index+(t&&!n?this.deltaX<0?1:-1:0),this.speed)}}

// lib/handlebars/base.js
/*jshint eqnull:true*/this.Handlebars={},function(e){e.VERSION="1.0.rc.1",e.helpers={},e.partials={},e.registerHelper=function(e,t,n){n&&(t.not=n),this.helpers[e]=t},e.registerPartial=function(e,t){this.partials[e]=t},e.registerHelper("helperMissing",function(e){if(arguments.length===2)return undefined;throw new Error("Could not find property '"+e+"'")});var t=Object.prototype.toString,n="[object Function]";e.registerHelper("blockHelperMissing",function(r,i){var s=i.inverse||function(){},o=i.fn,u="",a=t.call(r);return a===n&&(r=r.call(this)),r===!0?o(this):r===!1||r==null?s(this):a==="[object Array]"?r.length>0?e.helpers.each(r,i):s(this):o(r)}),e.K=function(){},e.createFrame=Object.create||function(t){e.K.prototype=t;var n=new e.K;return e.K.prototype=null,n},e.registerHelper("each",function(t,n){var r=n.fn,i=n.inverse,s=0,o="",u;n.data&&(u=e.createFrame(n.data));if(t&&typeof t=="object")if(t instanceof Array)for(var a=t.length;s<a;s++)u&&(u.index=s),o+=r(t[s],{data:u});else for(var f in t)t.hasOwnProperty(f)&&(u&&(u.key=f),o+=r(t[f],{data:u}),s++);return s===0&&(o=i(this)),o}),e.registerHelper("if",function(r,i){var s=t.call(r);return s===n&&(r=r.call(this)),!r||e.Utils.isEmpty(r)?i.inverse(this):i.fn(this)}),e.registerHelper("unless",function(t,n){var r=n.fn,i=n.inverse;return n.fn=i,n.inverse=r,e.helpers["if"].call(this,t,n)}),e.registerHelper("with",function(e,t){return t.fn(e)}),e.registerHelper("log",function(t){e.log(t)})}(this.Handlebars);var errorProps=["description","fileName","lineNumber","message","name","number","stack"];Handlebars.Exception=function(e){var t=Error.prototype.constructor.apply(this,arguments);for(var n=0;n<errorProps.length;n++)this[errorProps[n]]=t[errorProps[n]]},Handlebars.Exception.prototype=new Error,Handlebars.SafeString=function(e){this.string=e},Handlebars.SafeString.prototype.toString=function(){return this.string.toString()},function(){var e={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},t=/[&<>"'`]/g,n=/[&<>"'`]/,r=function(t){return e[t]||"&amp;"};Handlebars.Utils={escapeExpression:function(e){return e instanceof Handlebars.SafeString?e.toString():e==null||e===!1?"":n.test(e)?e.replace(t,r):e},isEmpty:function(e){return typeof e=="undefined"?!0:e===null?!0:e===!1?!0:Object.prototype.toString.call(e)==="[object Array]"&&e.length===0?!0:!1}}}(),Handlebars.VM={template:function(e){var t={escapeExpression:Handlebars.Utils.escapeExpression,invokePartial:Handlebars.VM.invokePartial,programs:[],program:function(e,t,n){var r=this.programs[e];return n?Handlebars.VM.program(t,n):r?r:(r=this.programs[e]=Handlebars.VM.program(t),r)},programWithDepth:Handlebars.VM.programWithDepth,noop:Handlebars.VM.noop};return function(n,r){return r=r||{},e.call(t,Handlebars,n,r.helpers,r.partials,r.data)}},programWithDepth:function(e,t,n){var r=Array.prototype.slice.call(arguments,2);return function(n,i){return i=i||{},e.apply(this,[n,i.data||t].concat(r))}},program:function(e,t){return function(n,r){return r=r||{},e(n,r.data||t)}},noop:function(){return""},invokePartial:function(e,t,n,r,i,s){var o={helpers:r,partials:i,data:s};if(e===undefined)throw new Handlebars.Exception("The partial "+t+" could not be found");if(e instanceof Function)return e(n,o);if(!Handlebars.compile)throw new Handlebars.Exception("The partial "+t+" could not be compiled when running in runtime-only mode");return i[t]=Handlebars.compile(e,{data:s!==undefined}),i[t](n,o)}},Handlebars.template=Handlebars.VM.template;

/*
 * jQuery i18n plugin
 * @requires jQuery v1.1 or later
 *
 * See http://recursive-design.com/projects/jquery-i18n/
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Version: 0.9.2 (201204070102)
 */
 (function($) {
/**
 * i18n provides a mechanism for translating strings using a jscript dictionary.
 *
 */


/*
 * i18n property list
 */
$.i18n = {

  dict: null,

/**
 * setDictionary()
 * Initialise the dictionary and translate nodes
 *
 * @param property_list i18n_dict : The dictionary to use for translation
 */
  setDictionary: function(i18n_dict) {
    this.dict = i18n_dict;
  },

/**
 * _()
 * The actual translation function. Looks the given string up in the
 * dictionary and returns the translation if one exists. If a translation
 * is not found, returns the original word
 *
 * @param string str : The string to translate
 * @param property_list params : params for using printf() on the string
 * @return string : Translated word
 *
 */
  _: function (str, params) {
    var transl = str;
    if (this.dict && this.dict[str]) {
      transl = this.dict[str];
    }
    return this.printf(transl, params);
  },

/**
 * toEntity()
 * Change non-ASCII characters to entity representation
 *
 * @param string str : The string to transform
 * @return string result : Original string with non-ASCII content converted to entities
 *
 */
  toEntity: function (str) {
    var result = '';
    for (var i=0;i<str.length; i++) {
      if (str.charCodeAt(i) > 128)
        result += "&#"+str.charCodeAt(i)+";";
      else
        result += str.charAt(i);
    }
    return result;
  },

/**
 * stripStr()
 *
 * @param string str : The string to strip
 * @return string result : Stripped string
 *
 */
  stripStr: function(str) {
    return str.replace(/^\s*/, "").replace(/\s*$/, "");
  },

/**
 * stripStrML()
 *
 * @param string str : The multi-line string to strip
 * @return string result : Stripped string
 *
 */
  stripStrML: function(str) {
    // Split because m flag doesn't exist before JS1.5 and we need to
    // strip newlines anyway
    var parts = str.split('\n');
    for (var i=0; i<parts.length; i++)
      parts[i] = stripStr(parts[i]);

    // Don't join with empty strings, because it "concats" words
    // And strip again
    return stripStr(parts.join(" "));
  },

/*
 * printf()
 * C-printf like function, which substitutes %s with parameters
 * given in list. %%s is used to escape %s.
 *
 * Doesn't work in IE5.0 (splice)
 *
 * @param string S : string to perform printf on.
 * @param string L : Array of arguments for printf()
 */
  printf: function(S, L) {
    if (!L) return S;

    var nS     = "";
    var search = /%(\d+)\$s/g;
    // replace %n1$ where n is a number
    while (result = search.exec(S)) {
      var index = parseInt(result[1], 10) - 1;
      S = S.replace('%' + result[1] + '\$s', (L[index]));
      L.splice(index, 1);
    }
    var tS = S.split("%s");

    if (tS.length > 1) {
      for(var i=0; i<L.length; i++) {
        if (tS[i].lastIndexOf('%') == tS[i].length-1 && i != L.length-1)
          tS[i] += "s"+tS.splice(i+1,1)[0];
        nS += tS[i] + L[i];
      }
    }
    return nS + tS[tS.length-1];
  }

};

/*
 * _t
 * Allows you to translate a jQuery selector
 *
 * eg $('h1')._t('some text')
 *
 * @param string str : The string to translate
 * @param property_list params : params for using printf() on the string
 * @return element : chained and translated element(s)
*/
$.fn._t = function(str, params) {
  return $(this).text($.i18n._(str, params));
};


})( jQuery );


/*
 * Collapse plugin for jQuery
 * --
 * source: http://github.com/danielstocks/jQuery-Collapse/
 * site: http://webcloud.se/code/jQuery-Collapse
 *
 * @author Daniel Stocks (http://webcloud.se)
 * Copyright 2012, Daniel Stocks
 * Released under the MIT, BSD, and GPL Licenses.
 */

!function($) {

  // Constructor
  function Collapse (el, options) {
    var _this = this,
      options = options || {},
      query = options.query || "> :even";

    $.extend(_this, {
      $el: el,
      options : options,
      sections: [],
      isAccordion : options.accordion || false,
      db : options.persist ? new jQueryCollapseStorage(el[0].id) : false
    });

    // Figure out what sections are open if storage is used
    _this.states = _this.db ? _this.db.read() : [];

    // For every pair of elements in given
    // element, create a section
    _this.$el.find(query).each(function() {
      var section = new Section($(this), _this);
      _this.sections.push(section);
      _this.states[section._index()] || section.$summary.hasClass("open") ?
        section.open(true) : section.close(true);
    });

    // Capute ALL the clicks!
    (function(scope) {
      _this.$el.on("click", "[data-collapse-summary]",
        $.proxy(_this.handleClick, scope));
    }(_this));
  }

  Collapse.prototype = {
    handleClick: function(e) {
      e.preventDefault();
      var sections = this.sections,
        parent = $(e.target).parent(),
        l = sections.length;
      while(l--) {
        if(sections[l].$summary.find("a").is(e.target)) {
          sections[l].toggle();
          break;
        }
      }
    },
    open : function(eq) {
      if(isFinite(eq)) return this.sections[eq].open();
      $.each(this.sections, function() {
        this.open();
      });
    },
    close: function(eq) {
      if(isFinite(eq)) return this.sections[eq].close();
      $.each(this.sections, function() {
        this.close();
      });
    }
  };

  // Section constructor
  function Section($el, parent) {
    $.extend(this, {
      isOpen : false,
      $summary : $el
        .attr("data-collapse-summary", "")
        .wrapInner('<a href="#"/>'),
      $details : $el.next(),
      options: parent.options,
      parent: parent
    });
  }

  Section.prototype = {
    toggle : function() {
      this.isOpen ? this.close() : this.open();
    },
    close: function(bypass) {
      this._changeState("close", bypass)
    },
    open: function(bypass) {
      var _this = this;
      if(_this.options.accordion && !bypass) {
        $.each(_this.parent.sections, function() {
          this.close();
        });
      }
      _this._changeState("open", bypass)
    },
    _index: function() {
      return $.inArray(this, this.parent.sections);
    },
    _changeState: function(state, bypass) {

      var _this = this;
      _this.isOpen = state == "open"
      if($.isFunction(_this.options[state]) && !bypass) {
        _this.options[state].apply(_this.$details)
      } else {
        _this.isOpen ? _this.$details.show() : _this.$details.hide();
      }
      _this.$summary.removeClass("open close").addClass(state);
      _this.$details.attr("aria-hidden", state == "close");
      _this.parent.$el.trigger(state, _this);
      if(_this.parent.db) {
        _this.parent.db.write(_this._index(), _this.isOpen);
      }
    }
  }

  // Expose in jQuery API
  $.fn.extend({
    collapse: function(options, scan) {
      var nodes = (scan) ? $("body").find("[data-collapse]") : $(this);
      return nodes.each(function() {
        var settings = (scan) ? {} : options,
          values = $(this).attr("data-collapse") || "";
        $.each(values.split(" "), function(i,v) {
          if(v) settings[v] = true;
        });
        new jQueryCollapse($(this), settings).$el;
      });
    }
  });

  //jQuery DOM Ready
  $(function() {
    $.fn.collapse(false, true)
  });

  // Expose constructor to
  // global namespace
  jQueryCollapse = Collapse;

}(window.jQuery);
