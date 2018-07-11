import { React, IMState, utils } from 'jimu-core';

import { BaseWidget, AllWidgetProps, DataSourceManager, SeamlessImmutable, IMDataSourceJson } from 'jimu-core';
import { WebMapDataSource, MapViewDataSource, FeatureLayerViewDataSource, DataSource, DataSourceTypes, FeatureDataRecordTypes } from 'jimu-arcgis';
import { IMConfig } from '../config';
import MapView = require('esri/views/MapView');
import FeatureLayerView = require('esri/views/layers/FeatureLayerView');
import FeatureLayer = require("esri/layers/FeatureLayer");
import Extent = require('esri/geometry/Extent');
import Graphic = require('esri/Graphic');
import { config } from 'shelljs';
import EsriWidget = require('esri/widgets/Widget');

import './css/style.scss';

export default class Widget extends BaseWidget<AllWidgetProps<IMConfig>, {}>{
  mapContainer: HTMLDivElement;
  mapView: MapView;
  overviewMapView?: MapView;
  webMapDS: WebMapDataSource;
  extentContainer?: HTMLDivElement;
  overviewContainer?: HTMLDivElement;
  zoomBtn?: EsriWidget;
  scaleBar?: EsriWidget;
  homeBtn?: EsriWidget;
  locateBtn?: EsriWidget;

  currentWebmapId: string;
  currentOverviewWebmapId: string;
  dsManager = DataSourceManager.getInstance();

  constructor(props) {
    super(props);
  }

  private createOverviewMapWidget() {
    const overviewContainer = document.createElement('div');
    const extentContainer = document.createElement('div');
    extentContainer.className = 'extent-container';
    overviewContainer.className = 'overview-container';
    overviewContainer.appendChild(extentContainer);

    this.extentContainer = extentContainer;
    this.overviewContainer = overviewContainer;

    this.initOverviewMapDatasource();

  }

  private initOverviewMapDatasource() {
    const WebMap = require('esri/WebMap');
    const watchUtils = require('esri/core/watchUtils');
    const lang = require('dojo/_base/lang');

    const overveiwMap = this.webMapDS.webMap;
    const overviewMapView = new MapView({
      map: overveiwMap,
      container: this.overviewContainer
    });

    this.overviewMapView = overviewMapView;
    this.currentOverviewWebmapId = this.currentWebmapId;

    this.overviewMapView.when(lang.hitch(this, function () {
      this.mapView.watch('extent', lang.hitch(this, this.updateOverviewExtent));
      this.overviewMapView.watch('extent', lang.hitch(this, this.updateOverviewExtent));

      watchUtils.when(this.mapView, 'stationary', lang.hitch(this, this.updateOverview));
    }));

    this.overviewMapView.ui.components = [];
  }

  private updateOverview() {
    this.overviewMapView.goTo({
      extent: this.mapView.extent,
      scale: this.mapView.scale * 2 * Math.max(this.mapView.width /
        this.overviewMapView.width,
        this.mapView.height / this.overviewMapView.height)
    });
  }

  private updateOverviewExtent() {
    const extent = this.mapView.extent;
    const Point = require('esri/geometry/Point');
    const p1 = new Point(extent.xmin, extent.ymin, extent.spatialReference);
    const p2 = new Point(extent.xmax, extent.ymax, extent.spatialReference);

    const bottomLeft = this.overviewMapView.toScreen(p1);
    const topRight = this.overviewMapView.toScreen(p2);

    this.extentContainer.style.top = topRight.y + 'px';
    this.extentContainer.style.left = bottomLeft.x + 'px';
    this.extentContainer.style.height = (bottomLeft.y - topRight.y) + 'px';
    this.extentContainer.style.width = (topRight.x - bottomLeft.x) + 'px';
  }

  private updateMapView(config: IMConfig | {}) {
    this.mapView.ui.components = [];

    for (let key in config) {
      switch (key) {
        case 'extent':
          this.mapView.extent = new Extent(config[key]);
          break;
        case 'canZoom':
          if (!this.zoomBtn) {
            const ZoomBtn = require('esri/widgets/Zoom');
            const zoomBtn = new ZoomBtn({ view: this.mapView });
            this.zoomBtn = zoomBtn;
          }
          if (!config[key]) {
            this.mapView.ui.remove(this.zoomBtn);
          } else {
            this.mapView.ui.add(this.zoomBtn, 'top-left');
          }
          break;
        case 'canScale':
          if (!this.scaleBar) {
            const ScaleBar = require('esri/widgets/ScaleBar');
            const scaleBar = new ScaleBar({ view: this.mapView, unit: 'dual' });
            this.scaleBar = scaleBar;
          }
          if (config[key]) {
            this.mapView.ui.add(this.scaleBar, 'bottom-left');
          } else {
            this.mapView.ui.remove(this.scaleBar);
          }
          break;
        case 'canGoHome':
          if (!this.homeBtn) {
            const HomeBtn = require('esri/widgets/Home');
            const homeBtn = new HomeBtn({ view: this.mapView });
            this.homeBtn = homeBtn;
          }
          if (config[key]) {
            this.mapView.ui.add(this.homeBtn, 'top-left');
          } else {
            this.mapView.ui.remove(this.homeBtn);
          }
          break;
        case 'canOverviewMap':
          // TODO: overviewmap is using `dom` too much
          if (!this.overviewContainer) {
            this.createOverviewMapWidget();
          } else if(this.currentOverviewWebmapId !== this.currentWebmapId) {
            this.overviewMapView && this.overviewMapView.destroy();
            this.initOverviewMapDatasource();
          }
          if (!config[key] && this.mapContainer.getElementsByClassName('overview-container').length > 0) {
            this.mapContainer.getElementsByClassName('overview-container')[0].parentNode.removeChild(this.overviewContainer);
          } else if (config[key] && this.mapContainer.getElementsByClassName('overview-container').length < 1) {
            this.mapContainer.appendChild(this.overviewContainer);
          }
          break;
        case 'canLocate':
          if (!this.locateBtn) {
            const LocateBtn = require('esri/widgets/Locate');
            const locateBtn = new LocateBtn({ view: this.mapView });
            this.locateBtn = locateBtn;
          }
          if (config[key]) {
            this.mapView.ui.add(this.locateBtn, 'top-left');
          } else {
            this.mapView.ui.remove(this.locateBtn);
          }
          break;
        case 'disablePopup':
          if (config[key]) {
            if (this.mapView.popupManager) this.mapView.popupManager.enabled = false;
          }
          break;
        case 'ui':
          const UISettings = config[key];
          if (UISettings.padding) {
            if(!isNaN(UISettings.padding) || 
                isNaN(UISettings.padding.top) || 
                isNaN(UISettings.padding.left) || 
                isNaN(UISettings.padding.right) || 
                isNaN(UISettings.padding.bottom) ) {
              this.mapView.ui.padding = UISettings.padding;
            }
          }
          break;
        //TODO: extent history
        /* case 'canGoExtent':
          if(config[key]){
            this.createNavigationExtent();
          }
          break; */
        default:
          break;
      }
    }
  }

  private zoomAndCenter(graphic: Graphic, zoom?: number) {
    if (this.mapView) {
      let gotoTarget = {
        target: graphic
      };
      if (zoom) gotoTarget.zoom = zoom;
      this.mapView.goTo(gotoTarget);
    }
  },

  private highlightQueryObject() {
    // highlight feature
      // TODO: move to a util class
      let config = this.props.config;
      let dsInfos = utils.getDataSourceInfosFromQueryObject(this.props.queryObject);
      // let preDsIndos = utils.getDataSourceInfosFromQueryObject(prevProps.queryObject);
      let outputDsId = this.props.outputDataSources[0];
      if (typeof dsInfos[outputDsId] !== 'undefined') {
        let dsManager = DataSourceManager.getInstance();
        let ds = dsManager.getDataSource(outputDsId) as SceneViewDataSource;
        if (ds && ds.currentLayerView) {
          let layerViewDs: FeatureLayerViewDataSource = ds.currentLayerView.featureLayerDatasource as FeatureLayerViewDataSource;
          if (layerViewDs) {
            let record = layerViewDs.findRecord(dsInfos[outputDsId]);
            if (record) {
              (ds as MapViewDataSource).highlightRecord(record.feature.attributes[layerViewDs.featureLayer.objectIdField], layerViewDs.id);
              if (config.centerAt && config.centerAt.target === 'selected') {
                this.zoomAndCenter(record.feature, config.centerAt.zoom);
              }
            }
          }
        }
      }
  }

  componentDidUpdate(prevProps: AllWidgetProps<IMConfig>) {
    // TODO: similiar logic as arcgis-scene widget, 
    // will move to a util class
    let config = this.props.config;
    let dsId = config.webmapId;
    if (!dsId) {
      return;
    }
    if (this.currentWebmapId !== dsId) {
      if (this.mapView) {
        this.mapView.destroy();
        this.mapView = null;
      }
      this.dsManager.destroyDataSource(this.currentWebmapId);

      this.currentWebmapId = dsId;
    }

    let webMapDS: WebMapDataSource = this.props.dataSources[dsId] as WebMapDataSource;

    if (!webMapDS) {
      let dsJson = SeamlessImmutable({
        id: dsId,
        label: 'webmap',
        type: DataSourceTypes.WebMap,
        itemId: dsId,
      }) as IMDataSourceJson;

      webMapDS = this.dsManager.createDataSource(dsJson) as WebMapDataSource;
    }

    if (!this.mapView) {
      this.mapView = new MapView({
        map: webMapDS.webMap,
        container: this.mapContainer
      });

      this.webMapDS = webMapDS;

      this.mapView.when(() => {
        if (this.props.outputDataSources) {
          let dsManager = DataSourceManager.getInstance();
          let outputDsId = this.props.outputDataSources[0];
          let ds = dsManager.getDataSource(outputDsId) as MapViewDataSource;
          if (!ds) {
            ds = dsManager.createDataSource(outputDsId) as MapViewDataSource;
          }

          ds.setView(this.mapView);

          this.highlightQueryObject();
        }
      });

      this.mapView.on('click', event => {
        let screenPoint = {
          x: event.x,
          y: event.y
        };

        this.mapView.hitTest(screenPoint).then(response => {
          if (response.results.length) {
            let graphic = response.results[0].graphic;
            let dsManager = DataSourceManager.getInstance();
            let outputDsId = this.props.outputDataSources[0];
            let ds = dsManager.getDataSource(outputDsId) as SceneViewDataSource;
            if (ds) {
              ds.highlightRecord(graphic.attributes[graphic.layer.objectIdField], graphic.layer.id);
              if (config.centerAt && config.centerAt.target === 'selected') {
                this.zoomAndCenter(graphic, config.centerAt.zoom);
              }
            }
          }
        });
      });

    } else {
      this.highlightQueryObject();
    }
    // init and update map
    this.updateMapView(this.props.config);

  }

  render() {
    if (!this.props.config.webmapId) {
      return 'Please choose webmap in setting';
    }
    return (
      <div className="widget-map" ref={(dom) => { this.mapContainer = dom; }}></div>
    );
  }

  // UT
}
