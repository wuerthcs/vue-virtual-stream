(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.VueVirtualStream = {})));
}(this, (function (exports) { 'use strict';

  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */
  function isObject(value) {
    var type = typeof value;
    return value != null && (type == 'object' || type == 'function');
  }

  var isObject_1 = isObject;

  var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

  var _freeGlobal = freeGlobal;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = _freeGlobal || freeSelf || Function('return this')();

  var _root = root;

  /**
   * Gets the timestamp of the number of milliseconds that have elapsed since
   * the Unix epoch (1 January 1970 00:00:00 UTC).
   *
   * @static
   * @memberOf _
   * @since 2.4.0
   * @category Date
   * @returns {number} Returns the timestamp.
   * @example
   *
   * _.defer(function(stamp) {
   *   console.log(_.now() - stamp);
   * }, _.now());
   * // => Logs the number of milliseconds it took for the deferred invocation.
   */
  var now = function() {
    return _root.Date.now();
  };

  var now_1 = now;

  /** Built-in value references. */
  var Symbol = _root.Symbol;

  var _Symbol = Symbol;

  /** Used for built-in method references. */
  var objectProto = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString = objectProto.toString;

  /** Built-in value references. */
  var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

  /**
   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the raw `toStringTag`.
   */
  function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag),
        tag = value[symToStringTag];

    try {
      value[symToStringTag] = undefined;
    } catch (e) {}

    var result = nativeObjectToString.call(value);
    {
      if (isOwn) {
        value[symToStringTag] = tag;
      } else {
        delete value[symToStringTag];
      }
    }
    return result;
  }

  var _getRawTag = getRawTag;

  /** Used for built-in method references. */
  var objectProto$1 = Object.prototype;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString$1 = objectProto$1.toString;

  /**
   * Converts `value` to a string using `Object.prototype.toString`.
   *
   * @private
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   */
  function objectToString(value) {
    return nativeObjectToString$1.call(value);
  }

  var _objectToString = objectToString;

  /** `Object#toString` result references. */
  var nullTag = '[object Null]',
      undefinedTag = '[object Undefined]';

  /** Built-in value references. */
  var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

  /**
   * The base implementation of `getTag` without fallbacks for buggy environments.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  function baseGetTag(value) {
    if (value == null) {
      return value === undefined ? undefinedTag : nullTag;
    }
    return (symToStringTag$1 && symToStringTag$1 in Object(value))
      ? _getRawTag(value)
      : _objectToString(value);
  }

  var _baseGetTag = baseGetTag;

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return value != null && typeof value == 'object';
  }

  var isObjectLike_1 = isObjectLike;

  /** `Object#toString` result references. */
  var symbolTag = '[object Symbol]';

  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */
  function isSymbol(value) {
    return typeof value == 'symbol' ||
      (isObjectLike_1(value) && _baseGetTag(value) == symbolTag);
  }

  var isSymbol_1 = isSymbol;

  /** Used as references for various `Number` constants. */
  var NAN = 0 / 0;

  /** Used to match leading and trailing whitespace. */
  var reTrim = /^\s+|\s+$/g;

  /** Used to detect bad signed hexadecimal string values. */
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

  /** Used to detect binary string values. */
  var reIsBinary = /^0b[01]+$/i;

  /** Used to detect octal string values. */
  var reIsOctal = /^0o[0-7]+$/i;

  /** Built-in method references without a dependency on `root`. */
  var freeParseInt = parseInt;

  /**
   * Converts `value` to a number.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to process.
   * @returns {number} Returns the number.
   * @example
   *
   * _.toNumber(3.2);
   * // => 3.2
   *
   * _.toNumber(Number.MIN_VALUE);
   * // => 5e-324
   *
   * _.toNumber(Infinity);
   * // => Infinity
   *
   * _.toNumber('3.2');
   * // => 3.2
   */
  function toNumber(value) {
    if (typeof value == 'number') {
      return value;
    }
    if (isSymbol_1(value)) {
      return NAN;
    }
    if (isObject_1(value)) {
      var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
      value = isObject_1(other) ? (other + '') : other;
    }
    if (typeof value != 'string') {
      return value === 0 ? value : +value;
    }
    value = value.replace(reTrim, '');
    var isBinary = reIsBinary.test(value);
    return (isBinary || reIsOctal.test(value))
      ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
      : (reIsBadHex.test(value) ? NAN : +value);
  }

  var toNumber_1 = toNumber;

  /** Error message constants. */
  var FUNC_ERROR_TEXT = 'Expected a function';

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeMax = Math.max,
      nativeMin = Math.min;

  /**
   * Creates a debounced function that delays invoking `func` until after `wait`
   * milliseconds have elapsed since the last time the debounced function was
   * invoked. The debounced function comes with a `cancel` method to cancel
   * delayed `func` invocations and a `flush` method to immediately invoke them.
   * Provide `options` to indicate whether `func` should be invoked on the
   * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
   * with the last arguments provided to the debounced function. Subsequent
   * calls to the debounced function return the result of the last `func`
   * invocation.
   *
   * **Note:** If `leading` and `trailing` options are `true`, `func` is
   * invoked on the trailing edge of the timeout only if the debounced function
   * is invoked more than once during the `wait` timeout.
   *
   * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
   * until to the next tick, similar to `setTimeout` with a timeout of `0`.
   *
   * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
   * for details over the differences between `_.debounce` and `_.throttle`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Function
   * @param {Function} func The function to debounce.
   * @param {number} [wait=0] The number of milliseconds to delay.
   * @param {Object} [options={}] The options object.
   * @param {boolean} [options.leading=false]
   *  Specify invoking on the leading edge of the timeout.
   * @param {number} [options.maxWait]
   *  The maximum time `func` is allowed to be delayed before it's invoked.
   * @param {boolean} [options.trailing=true]
   *  Specify invoking on the trailing edge of the timeout.
   * @returns {Function} Returns the new debounced function.
   * @example
   *
   * // Avoid costly calculations while the window size is in flux.
   * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
   *
   * // Invoke `sendMail` when clicked, debouncing subsequent calls.
   * jQuery(element).on('click', _.debounce(sendMail, 300, {
   *   'leading': true,
   *   'trailing': false
   * }));
   *
   * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
   * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
   * var source = new EventSource('/stream');
   * jQuery(source).on('message', debounced);
   *
   * // Cancel the trailing debounced invocation.
   * jQuery(window).on('popstate', debounced.cancel);
   */
  function debounce(func, wait, options) {
    var lastArgs,
        lastThis,
        maxWait,
        result,
        timerId,
        lastCallTime,
        lastInvokeTime = 0,
        leading = false,
        maxing = false,
        trailing = true;

    if (typeof func != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    wait = toNumber_1(wait) || 0;
    if (isObject_1(options)) {
      leading = !!options.leading;
      maxing = 'maxWait' in options;
      maxWait = maxing ? nativeMax(toNumber_1(options.maxWait) || 0, wait) : maxWait;
      trailing = 'trailing' in options ? !!options.trailing : trailing;
    }

    function invokeFunc(time) {
      var args = lastArgs,
          thisArg = lastThis;

      lastArgs = lastThis = undefined;
      lastInvokeTime = time;
      result = func.apply(thisArg, args);
      return result;
    }

    function leadingEdge(time) {
      // Reset any `maxWait` timer.
      lastInvokeTime = time;
      // Start the timer for the trailing edge.
      timerId = setTimeout(timerExpired, wait);
      // Invoke the leading edge.
      return leading ? invokeFunc(time) : result;
    }

    function remainingWait(time) {
      var timeSinceLastCall = time - lastCallTime,
          timeSinceLastInvoke = time - lastInvokeTime,
          timeWaiting = wait - timeSinceLastCall;

      return maxing
        ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
        : timeWaiting;
    }

    function shouldInvoke(time) {
      var timeSinceLastCall = time - lastCallTime,
          timeSinceLastInvoke = time - lastInvokeTime;

      // Either this is the first call, activity has stopped and we're at the
      // trailing edge, the system time has gone backwards and we're treating
      // it as the trailing edge, or we've hit the `maxWait` limit.
      return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
        (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
    }

    function timerExpired() {
      var time = now_1();
      if (shouldInvoke(time)) {
        return trailingEdge(time);
      }
      // Restart the timer.
      timerId = setTimeout(timerExpired, remainingWait(time));
    }

    function trailingEdge(time) {
      timerId = undefined;

      // Only invoke if we have `lastArgs` which means `func` has been
      // debounced at least once.
      if (trailing && lastArgs) {
        return invokeFunc(time);
      }
      lastArgs = lastThis = undefined;
      return result;
    }

    function cancel() {
      if (timerId !== undefined) {
        clearTimeout(timerId);
      }
      lastInvokeTime = 0;
      lastArgs = lastCallTime = lastThis = timerId = undefined;
    }

    function flush() {
      return timerId === undefined ? result : trailingEdge(now_1());
    }

    function debounced() {
      var time = now_1(),
          isInvoking = shouldInvoke(time);

      lastArgs = arguments;
      lastThis = this;
      lastCallTime = time;

      if (isInvoking) {
        if (timerId === undefined) {
          return leadingEdge(lastCallTime);
        }
        if (maxing) {
          // Handle invocations in a tight loop.
          timerId = setTimeout(timerExpired, wait);
          return invokeFunc(lastCallTime);
        }
      }
      if (timerId === undefined) {
        timerId = setTimeout(timerExpired, wait);
      }
      return result;
    }
    debounced.cancel = cancel;
    debounced.flush = flush;
    return debounced;
  }

  var debounce_1 = debounce;

  /** Error message constants. */
  var FUNC_ERROR_TEXT$1 = 'Expected a function';

  /**
   * Creates a throttled function that only invokes `func` at most once per
   * every `wait` milliseconds. The throttled function comes with a `cancel`
   * method to cancel delayed `func` invocations and a `flush` method to
   * immediately invoke them. Provide `options` to indicate whether `func`
   * should be invoked on the leading and/or trailing edge of the `wait`
   * timeout. The `func` is invoked with the last arguments provided to the
   * throttled function. Subsequent calls to the throttled function return the
   * result of the last `func` invocation.
   *
   * **Note:** If `leading` and `trailing` options are `true`, `func` is
   * invoked on the trailing edge of the timeout only if the throttled function
   * is invoked more than once during the `wait` timeout.
   *
   * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
   * until to the next tick, similar to `setTimeout` with a timeout of `0`.
   *
   * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
   * for details over the differences between `_.throttle` and `_.debounce`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Function
   * @param {Function} func The function to throttle.
   * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
   * @param {Object} [options={}] The options object.
   * @param {boolean} [options.leading=true]
   *  Specify invoking on the leading edge of the timeout.
   * @param {boolean} [options.trailing=true]
   *  Specify invoking on the trailing edge of the timeout.
   * @returns {Function} Returns the new throttled function.
   * @example
   *
   * // Avoid excessively updating the position while scrolling.
   * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
   *
   * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
   * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
   * jQuery(element).on('click', throttled);
   *
   * // Cancel the trailing throttled invocation.
   * jQuery(window).on('popstate', throttled.cancel);
   */
  function throttle(func, wait, options) {
    var leading = true,
        trailing = true;

    if (typeof func != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT$1);
    }
    if (isObject_1(options)) {
      leading = 'leading' in options ? !!options.leading : leading;
      trailing = 'trailing' in options ? !!options.trailing : trailing;
    }
    return debounce_1(func, wait, {
      'leading': leading,
      'maxWait': wait,
      'trailing': trailing
    });
  }

  var throttle_1 = throttle;

  var getBrowser = function () {
      var ua = navigator.userAgent.toLowerCase();

      if (ua.indexOf('chrome') > -1) {
          return 'google-chrome'
      }
      
      if (ua.indexOf('safari') > -1) {
          return 'safari'
      }

      return 'general'
  };

  //
  //
  //
  //
  //
  //

  var script = {
      data: function data() {
          return {
              dimension: null
          }
      },
      props: {
          id: {
              type: String,
              required: true,
          },
          index: {
              type: Number,
              required: true,
          },
          maxIndex: {
              type: Number,
              required: true,
          }
      },
      mounted: function mounted() {
          var this$1 = this;

          this.$parent.$on('dimensions', function (d) {
              this$1.dimension = (d[this$1.id]) ? d[this$1.id] : null;
          });

          this.ro = new ResizeObserver(function (elements) {
              elements.forEach(function (el, i) {
                  this$1.$emit('resizeitem', {
                      id: this$1.id,
                      dimensions: {
                          w: el.target.offsetWidth,
                          h: el.target.offsetHeight,
                      }
                  });
              });

          });

          this.ro.observe(this.$el);
      },
      computed: {
          styles: function styles() {
              if (!this.dimension) { return '' }
              var top = (!this.$parent.reversed) ? this.dimension.top : this.dimension.top * -1;
              var position = (!this.$parent.reversed) ? "top: 0;" : "bottom: 0;";
              return ("transform: translate3d(0, " + top + "px, 0); " + position)
          }
      }
  };

  /* script */
              var __vue_script__ = script;
              
  /* template */
  var __vue_render__ = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      {
        ref: "item",
        staticClass: "VirtualStream__Item",
        style: _vm.styles,
        attrs: { "data-id": "id" }
      },
      [_vm._t("default")],
      2
    )
  };
  var __vue_staticRenderFns__ = [];
  __vue_render__._withStripped = true;

    /* style */
    var __vue_inject_styles__ = function (inject) {
      if (!inject) { return }
      inject("data-v-4f9927ad_0", { source: "\n.VirtualStream__Item[data-v-4f9927ad] {\n    position: absolute;\n    left: 0;\n    right: 0;\n}\n", map: {"version":3,"sources":["/Users/dominikbiedebach/www/opensource/vue-virtual-stream/src/components/Item.vue"],"names":[],"mappings":";AA2DA;IACA,mBAAA;IACA,QAAA;IACA,SAAA;CACA","file":"Item.vue","sourcesContent":["<template>\n    <div class=\"VirtualStream__Item\" ref=\"item\" :style=\"styles\" data-id=\"id\">\n        <slot />\n    </div>\n</template>\n\n<script>\nexport default {\n    data() {\n        return {\n            dimension: null\n        }\n    },\n    props: {\n        id: {\n            type: String,\n            required: true,\n        },\n        index: {\n            type: Number,\n            required: true,\n        },\n        maxIndex: {\n            type: Number,\n            required: true,\n        }\n    },\n    mounted() {\n        this.$parent.$on('dimensions', (d) => {\n            this.dimension = (d[this.id]) ? d[this.id] : null\n        })\n\n        this.ro = new ResizeObserver(elements => {\n            elements.forEach((el, i) => {\n                this.$emit('resizeitem', {\n                    id: this.id,\n                    dimensions: {\n                        w: el.target.offsetWidth,\n                        h: el.target.offsetHeight,\n                    }\n                })\n            })\n\n        })\n\n        this.ro.observe(this.$el)\n    },\n    computed: {\n        styles() {\n            if (!this.dimension) return ''\n            const top = (!this.$parent.reversed) ? this.dimension.top : this.dimension.top * -1\n            const position = (!this.$parent.reversed) ? `top: 0;` : `bottom: 0;`\n            return `transform: translate3d(0, ${top}px, 0); ${position}`\n        }\n    }\n}\n</script>\n\n<style scoped>\n    .VirtualStream__Item {\n        position: absolute;\n        left: 0;\n        right: 0;\n    }\n</style>\n"]}, media: undefined });

    };
    /* scoped */
    var __vue_scope_id__ = "data-v-4f9927ad";
    /* module identifier */
    var __vue_module_identifier__ = undefined;
    /* functional template */
    var __vue_is_functional_template__ = false;
    /* component normalizer */
    function __vue_normalize__(
      template, style, script$$1,
      scope, functional, moduleIdentifier,
      createInjector, createInjectorSSR
    ) {
      var component = (typeof script$$1 === 'function' ? script$$1.options : script$$1) || {};

      // For security concerns, we use only base name in production mode.
      component.__file = "/Users/dominikbiedebach/www/opensource/vue-virtual-stream/src/components/Item.vue";

      if (!component.render) {
        component.render = template.render;
        component.staticRenderFns = template.staticRenderFns;
        component._compiled = true;

        if (functional) { component.functional = true; }
      }

      component._scopeId = scope;

      {
        var hook;
        if (style) {
          hook = function(context) {
            style.call(this, createInjector(context));
          };
        }

        if (hook !== undefined) {
          if (component.functional) {
            // register for functional component in vue file
            var originalRender = component.render;
            component.render = function renderWithStyleInjection(h, context) {
              hook.call(context);
              return originalRender(h, context)
            };
          } else {
            // inject component registration as beforeCreate hook
            var existing = component.beforeCreate;
            component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
          }
        }
      }

      return component
    }
    /* style inject */
    function __vue_create_injector__() {
      var head = document.head || document.getElementsByTagName('head')[0];
      var styles = __vue_create_injector__.styles || (__vue_create_injector__.styles = {});
      var isOldIE =
        typeof navigator !== 'undefined' &&
        /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

      return function addStyle(id, css) {
        if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

        var group = isOldIE ? css.media || 'default' : id;
        var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

        if (!style.ids.includes(id)) {
          var code = css.source;
          var index = style.ids.length;

          style.ids.push(id);

          if (isOldIE) {
            style.element = style.element || document.querySelector('style[data-group=' + group + ']');
          }

          if (!style.element) {
            var el = style.element = document.createElement('style');
            el.type = 'text/css';

            if (css.media) { el.setAttribute('media', css.media); }
            if (isOldIE) {
              el.setAttribute('data-group', group);
              el.setAttribute('data-next-index', '0');
            }

            head.appendChild(el);
          }

          if (isOldIE) {
            index = parseInt(style.element.getAttribute('data-next-index'));
            style.element.setAttribute('data-next-index', index + 1);
          }

          if (style.element.styleSheet) {
            style.parts.push(code);
            style.element.styleSheet.cssText = style.parts
              .filter(Boolean)
              .join('\n');
          } else {
            var textNode = document.createTextNode(code);
            var nodes = style.element.childNodes;
            if (nodes[index]) { style.element.removeChild(nodes[index]); }
            if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
            else { style.element.appendChild(textNode); }
          }
        }
      }
    }
    /* style inject SSR */
    

    
    var Item = __vue_normalize__(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      __vue_create_injector__,
      undefined
    );

  //

  var browser = getBrowser();

  var script$1 = {
    name: 'VirtualStream',
    components: {
      Item: Item
    },
    props: {
      items: {
        type: Array,
        required: true,
      },
      reversed: {
        type: Boolean,
        default: false,
      },
      count: {
        type: Number,
        default: 40,
      },
      offset: {
        type: Number,
        default: 5,
      }
    },
    data: function data() {
      return {
        position: 0,
        dimensions: {},
        totalHeight: 0,
        ready: false,
        trigger: {
          start: false,
          end: false,
        },
        triggerDimensions: false,
      }
    },
    computed: {
      correctedCount: function correctedCount() {
        return Math.round(this.count / 2)
      },
      currentView: function currentView() {
        var startPos = (this.position - this.correctedCount < 0) ? 0 : this.position - this.correctedCount;
        var endPos = (this.position + this.correctedCount > this.items.length) ? this.items.length : this.position + this.correctedCount;
        return this.items.slice(startPos, endPos)
      },
      identifier: function identifier() {
        var indexes = [];
        var ids = {};
        this.items.forEach(function (item, index) {
          indexes[index] = item.id;
          ids[item.id] = index;
        });
        return { indexes: indexes, ids: ids }
      },
    },
    methods: {
      updateCurrentPosition: function updateCurrentPosition() {
        if (!this.ready) { return false }
        var positions = {};

        positions.start = (!this.reversed) ?
          this.$refs.wrapper.scrollTop :
          this.totalHeight - (this.$refs.wrapper.scrollTop + this.$refs.wrapper.offsetHeight);

        positions.end = (!this.reversed) ?
          this.$refs.wrapper.offsetHeight + this.$refs.wrapper.scrollTop :
          this.totalHeight - this.$refs.wrapper.scrollTop;

        if (this.triggerDimensions && this.triggerDimensions.start) {
          if (this.position > 0 && (positions.start <= this.triggerDimensions.start.end)) {
            this.updatePosition(this.trigger.start.id);
          }
        }

        if (this.triggerDimensions && this.triggerDimensions.end) {
          if (positions.end >= this.triggerDimensions.end.start) {
            this.updatePosition(this.trigger.end.id);
          }
        }

        if (positions.start < this.triggerDimensions.start.start || positions.end > this.triggerDimensions.end.end) {
          var dimensions = Object.values(this.dimensions);

          var currentPosition = dimensions.filter(function (dimension) {
            var dimensionEnd = dimension.top + dimension.height;
            return ((positions.end >= dimension.top && positions.end <= dimensionEnd))
          });

          if (currentPosition[0]) {
            this.updatePosition(currentPosition[0].id);
          }
        }
      },
      handleScroll: throttle_1(function() {
        this.updateCurrentPosition();
        this.$emit('scroll');
      }, 100),
      updatePosition: function updatePosition(id) {
        this.position = this.identifier.ids[id];
      },
      getPreviousItemHeight: function getPreviousItemHeight(item) {
        var this$1 = this;

        var id = item.id;

        var previousIndex = (function () {
          var index = this$1.identifier.ids[id] - 1;
          return (index >= 0) ? index : false
        })();

        var previousId = (function () {
          var id = (previousIndex !== false) ? this$1.identifier.indexes[previousIndex] : false;
          return (id) ? id : false
        })();

        return this.getItemHeight(previousId)
      },
      getItemHeight: function getItemHeight(id) {
        var dimensionItem = this.dimensions[id] || false;
        return (dimensionItem) ? dimensionItem.top + dimensionItem.height : 0
      },
      updateItemDimensions: function updateItemDimensions() {
        var this$1 = this;

        this.ready = false;
        var sortedItems = this.$refs.items.sort(function (a, b) {
          if (a.index > b.index) { return 1 }
          if (a.index < b.index) { return -1 }
          return 0
        });

        sortedItems.forEach(function (item, i) {
          var top = this$1.getPreviousItemHeight(item);
          this$1.dimensions[item.id] = { height: item.$el.offsetHeight, width: item.$el.offsetWidth, id: item.id, top: top };
        });

        var oldTotalHeight = this.totalHeight;
        var oldScrollTop = this.$refs.wrapper.scrollTop;

        this.totalHeight = Object.values(this.dimensions).reduce(function (dimensionA, dimensionB) {
          var aVal = (dimensionA.height) ? dimensionA.height : dimensionA;
          var bVal = (dimensionB.height) ? dimensionB.height : dimensionB;
          return aVal + bVal
        });

        if (oldScrollTop !== 0) {
          if (this.reversed && oldTotalHeight < this.totalHeight) {
            var heightDiff = this.totalHeight - oldTotalHeight;
            window.requestAnimationFrame(function () {
              this$1.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'auto';
              this$1.$refs.wrapper.scrollTop = oldScrollTop + heightDiff;
              this$1.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'touch';
            });
          }
        }

        this.trigger = {
          start: sortedItems[0],
          end: sortedItems[this.$refs.items.length - this.offset]
        };

        this.triggerDimensions = {
          full: {
            start: this.dimensions[this.trigger.start.id],
            end: this.dimensions[this.trigger.end.id],
          },
          start: {
            start: this.dimensions[this.trigger.start.id].top,
            end: this.dimensions[this.trigger.start.id].top + this.dimensions[this.trigger.start.id].height
          },
          end: {
            start: this.dimensions[this.trigger.end.id].top,
            end: this.dimensions[this.trigger.end.id].top + this.dimensions[this.trigger.end.id].height
          }
        };

        this.$refs.track.style.height = this.totalHeight + 'px';
        this.$emit('dimensions', this.dimensions);

        window.setTimeout(function () {
          this$1.ready = true;
        }, 100);
      },
      updateItemDimension: function updateItemDimension(d) {
        Object.assign(this.dimensions[d.id], d.dimensions);
      },
    },
    watch: {
      currentView: function currentView(n) {
        var this$1 = this;

        this.$nextTick(function () {
          this$1.updateItemDimensions();
        });
      },
      items: function items() {
        var this$1 = this;

        this.$nextTick(function () {
          this$1.updateCurrentPosition();
        });
      }
    },
    mounted: function mounted() {
      var this$1 = this;

      this.$nextTick(function () {
        this$1.updateItemDimensions();
        this$1.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'auto';
        if (this$1.reversed) { this$1.$refs.wrapper.scrollTop = this$1.totalHeight; }
        this$1.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'touch';

        this$1.updateCurrentPosition();

        window.setTimeout(function () {
          this$1.ready = true;
        }, 100);

        window.addEventListener('resize', debounce_1(function () {
          this$1.$refs.track.style.height = 0;
          this$1.updateItemDimensions();
        }, 60));
      });
    }
  };

  /* script */
              var __vue_script__$1 = script$1;
              
  /* template */
  var __vue_render__$1 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { ref: "container", staticClass: "VirtualStream__Scroller" },
      [
        _c(
          "div",
          {
            ref: "wrapper",
            staticClass: "VirtualStream__Wrapper",
            on: {
              "&scroll": function($event) {
                return _vm.handleScroll($event)
              }
            }
          },
          [
            _c(
              "div",
              { ref: "track", staticClass: "VirtualStream__Track" },
              _vm._l(_vm.currentView, function(item, index) {
                return _c(
                  "Item",
                  {
                    key: item.id,
                    ref: "items",
                    refInFor: true,
                    attrs: {
                      id: item.id || index,
                      index: index,
                      maxIndex: _vm.currentView.length - 1
                    },
                    on: { resizeitem: _vm.updateItemDimension }
                  },
                  [_vm._t("default", null, { item: item, index: index })],
                  2
                )
              }),
              1
            )
          ]
        )
      ]
    )
  };
  var __vue_staticRenderFns__$1 = [];
  __vue_render__$1._withStripped = true;

    /* style */
    var __vue_inject_styles__$1 = function (inject) {
      if (!inject) { return }
      inject("data-v-2e44d814_0", { source: "\n.VirtualStream__Scroller[data-v-2e44d814] {\n  height: 100%;\n  left: 0;\n  overflow: auto;\n  position: absolute;\n  top: 0;\n  transform: translate3d(0,0,0);\n  width: 100%;\n}\n.VirtualStream__Wrapper[data-v-2e44d814] {\n  /* -webkit-overflow-scrolling: touch; */\n  height: 100%;\n  overflow: auto;\n  transform: translate3d(0,0,0);\n  width: 100%;\n}\n.VirtualStream__Track[data-v-2e44d814] {\n  position: relative;\n}\n.VirtualStream__Items[data-v-2e44d814] {\n  transform: translate3d(0,0,0);\n}\n", map: {"version":3,"sources":["/Users/dominikbiedebach/www/opensource/vue-virtual-stream/src/components/VirtualStream.vue"],"names":[],"mappings":";AAsPA;EACA,aAAA;EACA,QAAA;EACA,eAAA;EACA,mBAAA;EACA,OAAA;EACA,8BAAA;EACA,YAAA;CACA;AAEA;EACA,wCAAA;EACA,aAAA;EACA,eAAA;EACA,8BAAA;EACA,YAAA;CACA;AAEA;EACA,mBAAA;CACA;AAEA;EACA,8BAAA;CACA","file":"VirtualStream.vue","sourcesContent":["<template>\n  <div class=\"VirtualStream__Scroller\" ref=\"container\">\n    <div class=\"VirtualStream__Wrapper\" ref=\"wrapper\" @scroll.passive=\"handleScroll\">\n      <div class=\"VirtualStream__Track\" ref=\"track\">\n        <Item\n          v-for=\"(item, index) in currentView\"\n          :key=\"item.id\" ref=\"items\"\n          :id=\"item.id || index\"\n          :index=\"index\"\n          :maxIndex=\"currentView.length - 1\"\n          @resizeitem=\"updateItemDimension\"\n        >\n          <slot :item=\"item\" :index=\"index\" />\n        </Item>\n      </div>\n    </div>\n  </div>\n</template>\n\n<script>\n  import throttle from 'lodash/throttle'\n  import debounce from 'lodash/debounce'\n  import getBrowser from '../utils/getBrowser'\n  import Item from './Item.vue'\n\n  const browser = getBrowser()\n  let locked = false\n\n  export default {\n    name: 'VirtualStream',\n    components: {\n      Item\n    },\n    props: {\n      items: {\n        type: Array,\n        required: true,\n      },\n      reversed: {\n        type: Boolean,\n        default: false,\n      },\n      count: {\n        type: Number,\n        default: 40,\n      },\n      offset: {\n        type: Number,\n        default: 5,\n      }\n    },\n    data() {\n      return {\n        position: 0,\n        dimensions: {},\n        totalHeight: 0,\n        ready: false,\n        trigger: {\n          start: false,\n          end: false,\n        },\n        triggerDimensions: false,\n      }\n    },\n    computed: {\n      correctedCount() {\n        return Math.round(this.count / 2)\n      },\n      currentView() {\n        const startPos = (this.position - this.correctedCount < 0) ? 0 : this.position - this.correctedCount\n        const endPos = (this.position + this.correctedCount > this.items.length) ? this.items.length : this.position + this.correctedCount\n        return this.items.slice(startPos, endPos)\n      },\n      identifier() {\n        let indexes = []\n        let ids = {}\n        this.items.forEach((item, index) => {\n          indexes[index] = item.id\n          ids[item.id] = index\n        })\n        return { indexes, ids }\n      },\n    },\n    methods: {\n      updateCurrentPosition() {\n        if (!this.ready) return false\n        const positions = {}\n\n        positions.start = (!this.reversed) ?\n          this.$refs.wrapper.scrollTop :\n          this.totalHeight - (this.$refs.wrapper.scrollTop + this.$refs.wrapper.offsetHeight)\n\n        positions.end = (!this.reversed) ?\n          this.$refs.wrapper.offsetHeight + this.$refs.wrapper.scrollTop :\n          this.totalHeight - this.$refs.wrapper.scrollTop\n\n        if (this.triggerDimensions && this.triggerDimensions.start) {\n          if (this.position > 0 && (positions.start <= this.triggerDimensions.start.end)) {\n            this.updatePosition(this.trigger.start.id)\n          }\n        }\n\n        if (this.triggerDimensions && this.triggerDimensions.end) {\n          if (positions.end >= this.triggerDimensions.end.start) {\n            this.updatePosition(this.trigger.end.id)\n          }\n        }\n\n        if (positions.start < this.triggerDimensions.start.start || positions.end > this.triggerDimensions.end.end) {\n          const dimensions = Object.values(this.dimensions)\n\n          const currentPosition = dimensions.filter(dimension => {\n            const dimensionEnd = dimension.top + dimension.height\n            return ((positions.end >= dimension.top && positions.end <= dimensionEnd))\n          })\n\n          if (currentPosition[0]) {\n            this.updatePosition(currentPosition[0].id)\n          }\n        }\n      },\n      handleScroll: throttle(function() {\n        this.updateCurrentPosition()\n        this.$emit('scroll')\n      }, 100),\n      updatePosition(id) {\n        this.position = this.identifier.ids[id]\n      },\n      getPreviousItemHeight(item) {\n        const id = item.id\n\n        const previousIndex = (() => {\n          const index = this.identifier.ids[id] - 1\n          return (index >= 0) ? index : false\n        })()\n\n        const previousId = (() => {\n          const id = (previousIndex !== false) ? this.identifier.indexes[previousIndex] : false\n          return (id) ? id : false\n        })()\n\n        return this.getItemHeight(previousId)\n      },\n      getItemHeight(id) {\n        const dimensionItem = this.dimensions[id] || false\n        return (dimensionItem) ? dimensionItem.top + dimensionItem.height : 0\n      },\n      updateItemDimensions() {\n        this.ready = false\n        const sortedItems = this.$refs.items.sort((a, b) => {\n          if (a.index > b.index) return 1\n          if (a.index < b.index) return -1\n          return 0\n        })\n\n        sortedItems.forEach((item, i) => {\n          const top = this.getPreviousItemHeight(item)\n          this.dimensions[item.id] = { height: item.$el.offsetHeight, width: item.$el.offsetWidth, id: item.id, top }\n        })\n\n        const oldTotalHeight = this.totalHeight\n        const oldScrollTop = this.$refs.wrapper.scrollTop\n\n        this.totalHeight = Object.values(this.dimensions).reduce((dimensionA, dimensionB) => {\n          const aVal = (dimensionA.height) ? dimensionA.height : dimensionA\n          const bVal = (dimensionB.height) ? dimensionB.height : dimensionB\n          return aVal + bVal\n        })\n\n        if (oldScrollTop !== 0) {\n          if (this.reversed && oldTotalHeight < this.totalHeight) {\n            const heightDiff = this.totalHeight - oldTotalHeight\n            window.requestAnimationFrame(() => {\n              this.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'auto'\n              this.$refs.wrapper.scrollTop = oldScrollTop + heightDiff\n              this.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'touch'\n            })\n          }\n        }\n\n        this.trigger = {\n          start: sortedItems[0],\n          end: sortedItems[this.$refs.items.length - this.offset]\n        }\n\n        this.triggerDimensions = {\n          full: {\n            start: this.dimensions[this.trigger.start.id],\n            end: this.dimensions[this.trigger.end.id],\n          },\n          start: {\n            start: this.dimensions[this.trigger.start.id].top,\n            end: this.dimensions[this.trigger.start.id].top + this.dimensions[this.trigger.start.id].height\n          },\n          end: {\n            start: this.dimensions[this.trigger.end.id].top,\n            end: this.dimensions[this.trigger.end.id].top + this.dimensions[this.trigger.end.id].height\n          }\n        }\n\n        this.$refs.track.style.height = this.totalHeight + 'px'\n        this.$emit('dimensions', this.dimensions)\n\n        window.setTimeout(() => {\n          this.ready = true\n        }, 100)\n      },\n      updateItemDimension(d) {\n        Object.assign(this.dimensions[d.id], d.dimensions)\n      },\n    },\n    watch: {\n      currentView(n) {\n        this.$nextTick(() => {\n          this.updateItemDimensions()\n        })\n      },\n      items() {\n        this.$nextTick(() => {\n          this.updateCurrentPosition()\n        })\n      }\n    },\n    mounted() {\n      this.$nextTick(() => {\n        this.updateItemDimensions()\n        this.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'auto'\n        if (this.reversed) this.$refs.wrapper.scrollTop = this.totalHeight\n        this.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'touch'\n\n        this.updateCurrentPosition()\n\n        window.setTimeout(() => {\n          this.ready = true\n        }, 100)\n\n        window.addEventListener('resize', debounce(() => {\n          this.$refs.track.style.height = 0\n          this.updateItemDimensions()\n        }, 60))\n      })\n    }\n  }\n</script>\n\n<style scoped>\n  .VirtualStream__Scroller {\n    height: 100%;\n    left: 0;\n    overflow: auto;\n    position: absolute;\n    top: 0;\n    transform: translate3d(0,0,0);\n    width: 100%;\n  }\n\n  .VirtualStream__Wrapper {\n    /* -webkit-overflow-scrolling: touch; */\n    height: 100%;\n    overflow: auto;\n    transform: translate3d(0,0,0);\n    width: 100%;\n  }\n\n  .VirtualStream__Track {\n    position: relative;\n  }\n\n  .VirtualStream__Items {\n    transform: translate3d(0,0,0);\n  }\n</style>\n"]}, media: undefined });

    };
    /* scoped */
    var __vue_scope_id__$1 = "data-v-2e44d814";
    /* module identifier */
    var __vue_module_identifier__$1 = undefined;
    /* functional template */
    var __vue_is_functional_template__$1 = false;
    /* component normalizer */
    function __vue_normalize__$1(
      template, style, script,
      scope, functional, moduleIdentifier,
      createInjector, createInjectorSSR
    ) {
      var component = (typeof script === 'function' ? script.options : script) || {};

      // For security concerns, we use only base name in production mode.
      component.__file = "/Users/dominikbiedebach/www/opensource/vue-virtual-stream/src/components/VirtualStream.vue";

      if (!component.render) {
        component.render = template.render;
        component.staticRenderFns = template.staticRenderFns;
        component._compiled = true;

        if (functional) { component.functional = true; }
      }

      component._scopeId = scope;

      {
        var hook;
        if (style) {
          hook = function(context) {
            style.call(this, createInjector(context));
          };
        }

        if (hook !== undefined) {
          if (component.functional) {
            // register for functional component in vue file
            var originalRender = component.render;
            component.render = function renderWithStyleInjection(h, context) {
              hook.call(context);
              return originalRender(h, context)
            };
          } else {
            // inject component registration as beforeCreate hook
            var existing = component.beforeCreate;
            component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
          }
        }
      }

      return component
    }
    /* style inject */
    function __vue_create_injector__$1() {
      var head = document.head || document.getElementsByTagName('head')[0];
      var styles = __vue_create_injector__$1.styles || (__vue_create_injector__$1.styles = {});
      var isOldIE =
        typeof navigator !== 'undefined' &&
        /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

      return function addStyle(id, css) {
        if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

        var group = isOldIE ? css.media || 'default' : id;
        var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

        if (!style.ids.includes(id)) {
          var code = css.source;
          var index = style.ids.length;

          style.ids.push(id);

          if (isOldIE) {
            style.element = style.element || document.querySelector('style[data-group=' + group + ']');
          }

          if (!style.element) {
            var el = style.element = document.createElement('style');
            el.type = 'text/css';

            if (css.media) { el.setAttribute('media', css.media); }
            if (isOldIE) {
              el.setAttribute('data-group', group);
              el.setAttribute('data-next-index', '0');
            }

            head.appendChild(el);
          }

          if (isOldIE) {
            index = parseInt(style.element.getAttribute('data-next-index'));
            style.element.setAttribute('data-next-index', index + 1);
          }

          if (style.element.styleSheet) {
            style.parts.push(code);
            style.element.styleSheet.cssText = style.parts
              .filter(Boolean)
              .join('\n');
          } else {
            var textNode = document.createTextNode(code);
            var nodes = style.element.childNodes;
            if (nodes[index]) { style.element.removeChild(nodes[index]); }
            if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
            else { style.element.appendChild(textNode); }
          }
        }
      }
    }
    /* style inject SSR */
    

    
    var VirtualStream = __vue_normalize__$1(
      { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
      __vue_inject_styles__$1,
      __vue_script__$1,
      __vue_scope_id__$1,
      __vue_is_functional_template__$1,
      __vue_module_identifier__$1,
      __vue_create_injector__$1,
      undefined
    );

  function install(Vue) {
      if (install.installed) { return }
  	install.installed = true;
  	Vue.component('VirtualStream', VirtualStream);
  }

  var plugin = {
      install: install,
  };

  var GlobalVue = null;
  if (typeof window !== 'undefined') {
      GlobalVue = window.Vue;
  } else if (typeof global !== 'undefined') {
      GlobalVue = global.Vue;
  }

  if (GlobalVue) {
      GlobalVue.use(plugin);
  }

  exports.install = install;
  exports.default = VirtualStream;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
