define(["jimu-core","jimu-ui","jimu-arcgis","esri/tasks/support/Query"],function(e,t,r,n){return function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=379)}({100:function(e,t,r){"use strict";var n=new RegExp("%[a-f0-9]{2}","gi"),o=new RegExp("(%[a-f0-9]{2})+","gi");function a(e,t){try{return decodeURIComponent(e.join(""))}catch(e){}if(1===e.length)return e;t=t||1;var r=e.slice(0,t),n=e.slice(t);return Array.prototype.concat.call([],a(r),a(n))}function i(e){try{return decodeURIComponent(e)}catch(o){for(var t=e.match(n),r=1;r<t.length;r++)t=(e=a(t,r).join("")).match(n);return e}}e.exports=function(e){if("string"!=typeof e)throw new TypeError("Expected `encodedURI` to be of type `string`, got `"+typeof e+"`");try{return e=e.replace(/\+/g," "),decodeURIComponent(e)}catch(t){return function(e){for(var t={"%FE%FF":"��","%FF%FE":"��"},r=o.exec(e);r;){try{t[r[0]]=decodeURIComponent(r[0])}catch(e){var n=i(r[0]);n!==r[0]&&(t[r[0]]=n)}r=o.exec(e)}t["%C2"]="�";for(var a=Object.keys(t),c=0;c<a.length;c++){var s=a[c];e=e.replace(new RegExp(s,"g"),t[s])}return e}(e)}}},101:function(e,t,r){"use strict";e.exports=function(e){return encodeURIComponent(e).replace(/[!'()*]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})}},102:function(e,t,r){"use strict";var n=r(101),o=r(18),a=r(100);function i(e,t){return t.encode?t.strict?n(e):encodeURIComponent(e):e}function c(e){var t=e.indexOf("?");return-1===t?"":e.slice(t+1)}function s(e,t){var r=function(e){var t;switch(e.arrayFormat){case"index":return function(e,r,n){t=/\[(\d*)\]$/.exec(e),e=e.replace(/\[\d*\]$/,""),t?(void 0===n[e]&&(n[e]={}),n[e][t[1]]=r):n[e]=r};case"bracket":return function(e,r,n){t=/(\[\])$/.exec(e),e=e.replace(/\[\]$/,""),t?void 0!==n[e]?n[e]=[].concat(n[e],r):n[e]=[r]:n[e]=r};default:return function(e,t,r){void 0!==r[e]?r[e]=[].concat(r[e],t):r[e]=t}}}(t=o({arrayFormat:"none"},t)),n=Object.create(null);return"string"!=typeof e?n:(e=e.trim().replace(/^[?#&]/,""))?(e.split("&").forEach(function(e){var t=e.replace(/\+/g," ").split("="),o=t.shift(),i=t.length>0?t.join("="):void 0;i=void 0===i?null:a(i),r(a(o),i,n)}),Object.keys(n).sort().reduce(function(e,t){var r=n[t];return Boolean(r)&&"object"==typeof r&&!Array.isArray(r)?e[t]=function e(t){return Array.isArray(t)?t.sort():"object"==typeof t?e(Object.keys(t)).sort(function(e,t){return Number(e)-Number(t)}).map(function(e){return t[e]}):t}(r):e[t]=r,e},Object.create(null))):n}t.extract=c,t.parse=s,t.stringify=function(e,t){!1===(t=o({encode:!0,strict:!0,arrayFormat:"none"},t)).sort&&(t.sort=function(){});var r=function(e){switch(e.arrayFormat){case"index":return function(t,r,n){return null===r?[i(t,e),"[",n,"]"].join(""):[i(t,e),"[",i(n,e),"]=",i(r,e)].join("")};case"bracket":return function(t,r){return null===r?i(t,e):[i(t,e),"[]=",i(r,e)].join("")};default:return function(t,r){return null===r?i(t,e):[i(t,e),"=",i(r,e)].join("")}}}(t);return e?Object.keys(e).sort(t.sort).map(function(n){var o=e[n];if(void 0===o)return"";if(null===o)return i(n,t);if(Array.isArray(o)){var a=[];return o.slice().forEach(function(e){void 0!==e&&a.push(r(n,e,a.length))}),a.join("&")}return i(n,t)+"="+i(o,t)}).filter(function(e){return e.length>0}).join("&"):""},t.parseUrl=function(e,t){return{url:e.split("?")[0]||"",query:s(c(e),t)}}},103:function(e,t){e.exports=n},18:function(e,t,r){"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/var n=Object.getOwnPropertySymbols,o=Object.prototype.hasOwnProperty,a=Object.prototype.propertyIsEnumerable;e.exports=function(){try{if(!Object.assign)return!1;var e=new String("abc");if(e[5]="de","5"===Object.getOwnPropertyNames(e)[0])return!1;for(var t={},r=0;r<10;r++)t["_"+String.fromCharCode(r)]=r;if("0123456789"!==Object.getOwnPropertyNames(t).map(function(e){return t[e]}).join(""))return!1;var n={};return"abcdefghijklmnopqrst".split("").forEach(function(e){n[e]=e}),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},n)).join("")}catch(e){return!1}}()?Object.assign:function(e,t){for(var r,i,c=function(e){if(null===e||void 0===e)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(e)}(e),s=1;s<arguments.length;s++){for(var u in r=Object(arguments[s]))o.call(r,u)&&(c[u]=r[u]);if(n){i=n(r);for(var l=0;l<i.length;l++)a.call(r,i[l])&&(c[i[l]]=r[i[l]])}}return c}},2:function(e,t,r){var n;
/*!
  Copyright (c) 2017 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/*!
  Copyright (c) 2017 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
!function(){"use strict";var r={}.hasOwnProperty;function o(){for(var e=[],t=0;t<arguments.length;t++){var n=arguments[t];if(n){var a=typeof n;if("string"===a||"number"===a)e.push(n);else if(Array.isArray(n)&&n.length){var i=o.apply(null,n);i&&e.push(i)}else if("object"===a)for(var c in n)r.call(n,c)&&n[c]&&e.push(c)}}return e.join(" ")}void 0!==e&&e.exports?(o.default=o,e.exports=o):void 0===(n=function(){return o}.apply(t,[]))||(e.exports=n)}()},21:function(e,t){e.exports=r},3:function(t,r){t.exports=e},377:function(e,t,r){(e.exports=r(7)(!1)).push([e.i,".feature-list {\n  font-size: 0.875rem; }\n  .feature-list .card-body {\n    overflow: hidden; }\n  .feature-list h5.card-title {\n    font-size: 1rem; }\n  .feature-list .card-title {\n    white-space: nowrap;\n    text-overflow: ellipsis;\n    overflow: hidden; }\n  .feature-list .card-text {\n    max-height: 3.9375rem;\n    overflow: hidden;\n    line-height: 1.5;\n    -webkit-line-clamp: 3;\n    text-overflow: ellipsis;\n    display: -webkit-box;\n    -webkit-box-orient: vertical; }\n  .feature-list.horizontal {\n    height: auto;\n    width: 100%; }\n",""])},378:function(e,t,r){var n=r(377);"string"==typeof n&&(n=[[e.i,n,""]]);var o={transform:void 0};r(6)(n,o);n.locals&&(e.exports=n.locals)},379:function(e,t,r){"use strict";var n=this&&this.__extends||function(){var e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])};return function(t,r){function n(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}}();Object.defineProperty(t,"__esModule",{value:!0});var o=r(3),a=r(2),i=r(3),c=r(9),s=r(21),u=r(103),l=r(102);r(378),console.log(s.SceneViewDataSource),console.log(s.FeatureLayerDataSource);var f="feature-list",p=function(e){function t(t){var r=e.call(this,t)||this;return r.intialized=!1,r._handleItemChange=r._handleItemChange.bind(r),r}return n(t,e),t.prototype._handleItemChange=function(e){var t=this.props.dataSources[this.props.config.dataSourceId],r=e.props.data;switch(t.type){case s.DataSourceTypes.FeatureLayer:t.selectRecord(r._dataIndex);break;case s.DataSourceTypes.MapView:case s.DataSourceTypes.SceneView:var n=this.layerDatasource.featureLayer.id;t.selectRecord(r._dataIndex,n)}},t.prototype._createItem=function(e,t,r){var n=this.props.config,o=n.title,a=n.description,i=n.image,c=e.getData();return{_dataIndex:r,objectId:c[t],title:o?c[o.field]:null,description:a?c[a.field]:null,image:i?{src:c[i.field],alt:o?c[o.field]:"",shape:i.shape,height:i.height||64,cover:"circle"!==i.shape}:null,horizontal:!this.props.config.horizontal}},t.prototype.init=function(){var e=this,t=this.props.config.dataSourceId;if(t){var r=this.props.dataSources[t];switch(this.setState({datasourceState:i.DataSourceStatus.LoadedLoading}),r.type){case s.DataSourceTypes.FeatureLayer:this.layerDatasource=r,this.queryAllRecords();break;case s.DataSourceTypes.SceneView:case s.DataSourceTypes.MapView:var n=this.props.config.layerId,o=r.mapView,a=r.getLayerViewDatasourceOnDemand(n);a?(this.layerDatasource=a.featureLayerDatasource,this.queryAllRecords(),this.setState({datasourceState:i.DataSourceStatus.Loaded})):o&&o.whenLayerView(o.map.findLayerById(n)).then(function(t){a=r.getLayerViewDatasourceOnDemand(n),e.layerDatasource=a.featureLayerDatasource,e.queryAllRecords()})}}},t.prototype.queryAllRecords=function(){var e=this,t=new u({where:"1=1",outFields:["*"],returnGeometry:!0});this.layerDatasource.query(t).then(function(t){var r=o.utils.getDataSourceInfosFromQueryObject(e.props.queryObject),n=e.props.config.dataSourceId,a=e.props.dataSources[n];void 0!==r[n]&&a.selectRecord(r[n],e.props.config.layerId),e.setState({datasourceState:i.DataSourceStatus.Loaded}),e.intialized=!e.intialized},function(e){console.error(e.message)})},t.prototype.createList=function(e){var t=this,r=this.props.config,n=e,a=n.featureLayer&&n.featureLayer.objectIdField,i=n.getRecords();Array.isArray(i)&&r.limit&&(i=i.slice(0,r.limit));var s,u=i.map(function(e,r){return t._createItem(e,a,r)}),f=r.dataSourceId,p=this.props.dataSources[f].getCurrentRecordIndexes()||[],d=this.props.queryObject;r.onItemSelect&&(r.onItemSelect.goto.page&&(d=d.set("page",r.onItemSelect.goto.page)),r.onItemSelect.goto.views&&(d=d.set("views",r.onItemSelect.goto.views.join(","))),s="?"+l.stringify(d));this.props.config.onItemSelect;return o.React.createElement(c.List,{dataSource:u,selectable:!0,selectedIndexes:p,highlightSelection:this.props.config.highlightSelection,to:s,onChange:this._handleItemChange,horizontal:this.props.config.horizontal,cardWidth:this.props.config.cardWidth})},t.prototype.componentDidUpdate=function(e){this.layerDatasource||this.init()},t.prototype.render=function(){var e=this.props.config,t=a(f,{horizontal:e.horizontal},e.style&&"widget-style--"+e.style.name),r=e.dataSourceId?o.React.createElement("div",{className:"loading"},"waiting..."):o.React.createElement(o.React.Fragment,null,"Please choose datasource in setting"),n=this.list=this.layerDatasource&&this.state.datasourceState===i.DataSourceStatus.Loaded?this.createList(this.layerDatasource):null;return o.React.createElement("div",{className:t},e.header&&o.React.createElement("header",{className:"jimu-widget--header"},o.React.createElement("h5",null,e.header.title&&e.header.title.text||"")),!(this.layerDatasource&&this.state.datasourceState===i.DataSourceStatus.Loaded)&&r,n)},t}(i.BaseWidget);t.default=p},5:function(e,t){e.exports=function(e){var t="undefined"!=typeof window&&window.location;if(!t)throw new Error("fixUrls requires window.location");if(!e||"string"!=typeof e)return e;var r=t.protocol+"//"+t.host,n=r+t.pathname.replace(/\/[^\/]*$/,"/");return e.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,function(e,t){var o,a=t.trim().replace(/^"(.*)"$/,function(e,t){return t}).replace(/^'(.*)'$/,function(e,t){return t});return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(a)?e:(o=0===a.indexOf("//")?a:0===a.indexOf("/")?r+a:n+a.replace(/^\.\//,""),"url("+JSON.stringify(o)+")")})}},6:function(e,t,r){var n={},o=function(e){var t;return function(){return void 0===t&&(t=e.apply(this,arguments)),t}}(function(){return window&&document&&document.all&&!window.atob}),a=function(e){var t={};return function(e){return void 0===t[e]&&(t[e]=function(e){return document.querySelector(e)}.call(this,e)),t[e]}}(),i=null,c=0,s=[],u=r(5);function l(e,t){for(var r=0;r<e.length;r++){var o=e[r],a=n[o.id];if(a){a.refs++;for(var i=0;i<a.parts.length;i++)a.parts[i](o.parts[i]);for(;i<o.parts.length;i++)a.parts.push(v(o.parts[i],t))}else{var c=[];for(i=0;i<o.parts.length;i++)c.push(v(o.parts[i],t));n[o.id]={id:o.id,refs:1,parts:c}}}}function f(e,t){for(var r=[],n={},o=0;o<e.length;o++){var a=e[o],i=t.base?a[0]+t.base:a[0],c={css:a[1],media:a[2],sourceMap:a[3]};n[i]?n[i].parts.push(c):r.push(n[i]={id:i,parts:[c]})}return r}function p(e,t){var r=a(e.insertInto);if(!r)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var n=s[s.length-1];if("top"===e.insertAt)n?n.nextSibling?r.insertBefore(t,n.nextSibling):r.appendChild(t):r.insertBefore(t,r.firstChild),s.push(t);else{if("bottom"!==e.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");r.appendChild(t)}}function d(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e);var t=s.indexOf(e);t>=0&&s.splice(t,1)}function h(e){var t=document.createElement("style");return e.attrs.type="text/css",y(t,e.attrs),p(e,t),t}function y(e,t){Object.keys(t).forEach(function(r){e.setAttribute(r,t[r])})}function v(e,t){var r,n,o,a;if(t.transform&&e.css){if(!(a=t.transform(e.css)))return function(){};e.css=a}if(t.singleton){var s=c++;r=i||(i=h(t)),n=m.bind(null,r,s,!1),o=m.bind(null,r,s,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(r=function(e){var t=document.createElement("link");return e.attrs.type="text/css",e.attrs.rel="stylesheet",y(t,e.attrs),p(e,t),t}(t),n=function(e,t,r){var n=r.css,o=r.sourceMap,a=void 0===t.convertToAbsoluteUrls&&o;(t.convertToAbsoluteUrls||a)&&(n=u(n));o&&(n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */");var i=new Blob([n],{type:"text/css"}),c=e.href;e.href=URL.createObjectURL(i),c&&URL.revokeObjectURL(c)}.bind(null,r,t),o=function(){d(r),r.href&&URL.revokeObjectURL(r.href)}):(r=h(t),n=function(e,t){var r=t.css,n=t.media;n&&e.setAttribute("media",n);if(e.styleSheet)e.styleSheet.cssText=r;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(r))}}.bind(null,r),o=function(){d(r)});return n(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;n(e=t)}else o()}}e.exports=function(e,t){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(t=t||{}).attrs="object"==typeof t.attrs?t.attrs:{},t.singleton||(t.singleton=o()),t.insertInto||(t.insertInto="head"),t.insertAt||(t.insertAt="bottom");var r=f(e,t);return l(r,t),function(e){for(var o=[],a=0;a<r.length;a++){var i=r[a];(c=n[i.id]).refs--,o.push(c)}e&&l(f(e,t),t);for(a=0;a<o.length;a++){var c;if(0===(c=o[a]).refs){for(var s=0;s<c.parts.length;s++)c.parts[s]();delete n[c.id]}}}};var g=function(){var e=[];return function(t,r){return e[t]=r,e.filter(Boolean).join("\n")}}();function m(e,t,r,n){var o=r?"":n.css;if(e.styleSheet)e.styleSheet.cssText=g(t,o);else{var a=document.createTextNode(o),i=e.childNodes;i[t]&&e.removeChild(i[t]),i.length?e.insertBefore(a,i[t]):e.appendChild(a)}}},7:function(e,t){e.exports=function(e){var t=[];return t.toString=function(){return this.map(function(t){var r=function(e,t){var r=e[1]||"",n=e[3];if(!n)return r;if(t&&"function"==typeof btoa){var o=function(e){return"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(e))))+" */"}(n),a=n.sources.map(function(e){return"/*# sourceURL="+n.sourceRoot+e+" */"});return[r].concat(a).concat([o]).join("\n")}return[r].join("\n")}(t,e);return t[2]?"@media "+t[2]+"{"+r+"}":r}).join("")},t.i=function(e,r){"string"==typeof e&&(e=[[null,e,""]]);for(var n={},o=0;o<this.length;o++){var a=this[o][0];"number"==typeof a&&(n[a]=!0)}for(o=0;o<e.length;o++){var i=e[o];"number"==typeof i[0]&&n[i[0]]||(r&&!i[2]?i[2]=r:r&&(i[2]="("+i[2]+") and ("+r+")"),t.push(i))}},t}},9:function(e,r){e.exports=t}})});
//# sourceMappingURL=widget.js.map