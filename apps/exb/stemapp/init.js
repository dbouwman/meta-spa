//to make react devtools works in iframe.
if (window.parent !== window) {
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.parent.__REACT_DEVTOOLS_GLOBAL_HOOK__;
}

(function(argument) {
  var appPath = getPath();
  
  initConfig();
  
  ////////////////////// utils functions
  function initConfig(){
    window.jimuConfig = {
      locale: 'en',
      isBuilder: false,
      isInBuilder: isInBuilder(),
      appPath: appPath
    };

    dojoConfig = {
      parseOnLoad: false,
      async: true,
      tlmSiblingOfDojo: false,
    };

    dojoConfig.baseUrl = appPath;

    dojoConfig.packages = [{
      name: "jimu-core",
      location: "../jimu-core",
      main: "index"
    },{
      name: "jimu-layouts",
      location: "../jimu-layouts"
    }, {
      name: "jimu-arcgis",
      location: "../jimu-arcgis",
      main: "index"
    }, {
      name: "jimu-for-builder",
      location: "../jimu-for-builder",
      main: "index"
    }, {
      name: "jimu-ui",
      location: "../jimu-ui",
      main: "index"
    }, {
      name: "widgets",
      location: "../widgets"
    }, {
      name: "skins",
      location: "../skins"
    },
    //packages for arcgis js api
    {
      name: "dojo",
      location: window.arcgisApiUrl + "dojo"
    }, {
      name: "dijit",
      location: window.arcgisApiUrl + "dijit"
    }, {
      name: "dojox",
      location: window.arcgisApiUrl + "dojox"
    }, {
      name: "dgrid",
      location: window.arcgisApiUrl + "dgrid"
    }, {
      name: "esri",
      location: window.arcgisApiUrl + "esri"
    }, {
      name: "moment",
      location: window.arcgisApiUrl + "moment"
    }, {
      name: "@dojo",
      location: window.arcgisApiUrl + "node_modules/@dojo"
    }, {
      name: "tslib",
      location: window.arcgisApiUrl + "node_modules/tslib",
      main: "tslib"
    }, {
      name: "cldrjs",
      location: window.arcgisApiUrl + "node_modules/cldrjs",
      main: "dist/cldr"
    }, {
      name: "globalize",
      location: window.arcgisApiUrl + "node_modules/globalize",
      main: "dist/globalize"
    }, {
      name: "maquette",
      location: window.arcgisApiUrl + "maquette",
      main: "dist/maquette.umd"
    }, {
      name: "maquette-jsx",
      location: window.arcgisApiUrl + "maquette-jsx",
      main: "dist/maquette-jsx.umd"
    }, {
      name: "maquette-css-transitions",
      location: window.arcgisApiUrl + "maquette-css-transitions",
      main: "dist/maquette-css-transitions.umd"
    }
    
    ]
  }

  function isInBuilder(){
    return window !== window.top && window.top._builderPubsub? true: false;
  }

  function getPath() {
    var fullPath, path;

    fullPath = window.location.pathname;
    if (fullPath === '/' || fullPath.substr(fullPath.length - 1) === '/') {
      path = fullPath;
    }else{
      var sections = fullPath.split('/');
      var lastSection = sections.pop();
      if (/\.html$/.test(lastSection) || /\.aspx$/.test(lastSection) ||
         /\.jsp$/.test(lastSection) || /\.php$/.test(lastSection)) {
        //index.html may be renamed to index.jsp, etc.
        path = sections.join('/') + '/';
      } else {
        return false;
      }
    }
    return path;
  }
})();