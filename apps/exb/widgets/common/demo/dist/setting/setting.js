define(["jimu-core","jimu-for-builder"],function(e,t){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=372)}({10:function(e,n){e.exports=t},3:function(t,n){t.exports=e},372:function(e,t,n){"use strict";var r=this&&this.__extends||function(){var e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])};return function(t,n){function r(){this.constructor=t}e(t,n),t.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}();Object.defineProperty(t,"__esModule",{value:!0});var o=n(3),u=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.onP1Change=function(e){t.props.onConfigChange(t.props.id,t.props.config.set("p1",e.currentTarget.value))},t.onP2Change=function(e){t.props.onConfigChange(t.props.id,t.props.config.set("p2",e.currentTarget.value))},t}return r(t,e),t.prototype.render=function(){return o.React.createElement("div",null,o.React.createElement("div",null,"p1: ",o.React.createElement("input",{defaultValue:this.props.config.p1,onChange:this.onP1Change})),o.React.createElement("div",null,"p2: ",o.React.createElement("input",{defaultValue:this.props.config.p2,onChange:this.onP2Change})))},t}(n(10).BaseWidgetSetting);t.default=u}})});
//# sourceMappingURL=setting.js.map