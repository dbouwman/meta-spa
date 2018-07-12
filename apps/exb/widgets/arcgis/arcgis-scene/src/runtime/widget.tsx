import { React, SeamlessImmutable, IMDataSourceJson, utils } from 'jimu-core';
import * as classnames from 'classnames';
import { ImmutableObject } from 'seamless-immutable';

import { BaseWidget, IMState, AllWidgetProps, DataSourceManager } from 'jimu-core';
import { WebSceneDataSource, SceneViewDataSource, DataSourceTypes } from 'jimu-arcgis';
import { IMConfig } from '../config';
import SceneView = require('esri/views/SceneView');
import EsriWidget = require('esri/widgets/Widget');
import Query = require('esri/tasks/support/Query');
import Graphic = require('esri/Graphic');

import './css/style.scss';

console.log(WebSceneDataSource);

export default class Widget extends BaseWidget<AllWidgetProps<IMConfig>, {}>{
  sceneContainer: HTMLDivElement;
  sceneView: SceneView;
  webSceneDS: WebSceneDataSource;
  navigateBtn?: EsriWidget;
  compassBtn?: EsriWidget;
  zoomBtn?: EsriWidget;
  homeBtn?: EsriWidget;
  locateBtn?: EsriWidget;

  currentWebsceneId: string;

  dsManager = DataSourceManager.getInstance();

  constructor(props) {
    super(props);
  }

  private updateSceneView(config: IMConfig | {}) {
    this.sceneView.ui.components = [];

    let dsManager = DataSourceManager.getInstance();
    let outputDsId = this.props.outputDataSources[0];
    let ds = dsManager.getDataSource(outputDsId) as SceneViewDataSource;
    let layerView;
    // turn back on the layer first if it has been turned off by "excludeUnselected" or "centerAt" proeprties
    if (ds && ds.currentLayerView) {
      let layerId = ds.currentLayerView.id;
      layerView = ds.mapView.allLayerViews.find(view => {
        return view.layer.id === layerId;
      });
      if (layerView) {
        layerView.layer.visible = true;
      }]
    }

    for (let key in config) {
      switch (key) {
        case 'canZoom':
          if (!this.zoomBtn) {
            const ZoomBtn = require('esri/widgets/Zoom');
            const zoomBtn = new ZoomBtn({ view: this.sceneView });
            this.zoomBtn = zoomBtn;
          }
          if (!config[key]) {
            this.sceneView.ui.remove(this.zoomBtn);
          } else {
            this.sceneView.ui.add(this.zoomBtn, 'top-left');
          }
          break;
        case 'canGoHome':
          if (!this.homeBtn) {
            const HomeBtn = require('esri/widgets/Home');
            const homeBtn = new HomeBtn({ view: this.sceneView });
            this.homeBtn = homeBtn;
          }
          if (config[key]) {
            this.sceneView.ui.add(this.homeBtn, 'top-left');
          } else {
            this.sceneView.ui.remove(this.homeBtn);
          }
          break;
        case 'canLocate':
          if (!this.locateBtn) {
            const LocateBtn = require('esri/widgets/Locate');
            const locateBtn = new LocateBtn({ view: this.sceneView });
            this.locateBtn = locateBtn;
          }
          if (config[key]) {
            this.sceneView.ui.add(this.locateBtn, 'top-left');
          } else {
            this.sceneView.ui.remove(this.locateBtn);
          }
          break;
        case 'canNavigate':
          if (!this.navigateBtn) {
            const NavigateBtn = require('esri/widgets/NavigationToggle');
            const navigateBtn = new NavigateBtn({ view: this.sceneView });
            this.navigateBtn = navigateBtn;
          }
          if (config[key]) {
            this.sceneView.ui.add(this.navigateBtn, 'top-left');
          } else {
            this.sceneView.ui.remove(this.navigateBtn);
          }
          break;
        case 'canCompass':
          if (!this.compassBtn) {
            const CompassBtn = require('esri/widgets/Compass');
            const compassBtn = new CompassBtn({ view: this.sceneView });
            this.compassBtn = compassBtn;
          }
          if (config[key]) {
            this.sceneView.ui.add(this.compassBtn, 'top-left');
          } else {
            this.sceneView.ui.remove(this.compassBtn);
          }
          break;
        case 'disablePopup':
          if (config[key]) {
            if(this.sceneView.popupManager) this.sceneView.popupManager.enabled = false;
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
              this.sceneView.ui.padding = UISettings.padding;
            }
          }
          break;
        // case 'excludeUnselected':
        // case 'centerAt':
        //   if (config[key] && ds) {
        //     let currentRecord = ds.getCurrentRecord();
        //     if (layerView && currentRecord) {
        //       layerView.layer.visible = false;
        //       let selectedFeature = currentRecord.feature;
        //       let q = new Query({
        //         objectIds: [selectedFeature.attributes[layerView.layer.objectIdField]],
        //         returnGeometry: true
        //       });
        //       console.log(selectedFeature.attributes[layerView.layer.objectIdField]);
        //       layerView.layer.queryFeatures(q).then(response => {
        //         let graphic = response.features[0];

        //         if (key === 'excludeUnselected') {
        //           var pointGraphic = new Graphic({
        //             geometry: graphic.geometry,
        //             symbol: layerView.layer.renderer.symbol
        //           });
        //           this.sceneView.graphics.add(pointGraphic);
        //         } else if (key === 'centerAt') {
        //           this.sceneView.center = graphic.geometry;
        //         }
        //       });
        //     }
        //   }
        //   break;
        default:
          break;
      }
    }
  }
  
  private zoomAndCenter(graphic: Graphic, zoom?: number, tilt?: number):Promise<any>  {
    if(this.sceneView) {
      let gotoTarget = {
        target: graphic
      };
      if(zoom) gotoTarget.zoom = zoom;
      if(zoom) gotoTarget.tilt = tilt;
      return this.sceneView.goTo(gotoTarget);
    } else {
      return Promise.resolve();
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
      let layerViewDs: FeatureLayerViewDataSource = ds.currentLayerView && ds.currentLayerView.featureLayerDatasource as FeatureLayerViewDataSource;
      if(layerViewDs) {
        let record = layerViewDs.findRecord(dsInfos[outputDsId]);
        if(record) {
          (ds as MapViewDataSource | SceneViewDataSource).highlightRecord(record.feature.attributes[layerViewDs.featureLayer.objectIdField], layerViewDs.id);
          if(config.centerAt && config.centerAt.target === 'selected') {
            this.zoomAndCenter(record.feature, config.centerAt.zoom, config.centerAt.tilt);
          }
        }
      }
    }
  }

  componentDidUpdate(prevProps: AllWidgetProps<IMConfig>) {
    // TODO: similiar logic as arcgis-scene widget, 
    // will move to a util class
    let config = this.props.config;
    let dsId = config.websceneId;
    if (!dsId) {
      return;
    }
    if (this.currentWebsceneId !== dsId) {
      if (this.sceneView) {
        this.sceneView.destroy();
        this.sceneView = null;
      }
      this.dsManager.destroyDataSource(this.currentWebsceneId);

      this.currentWebsceneId = dsId;
    }

    let webSceneDS: WebSceneDataSource = this.props.dataSources[dsId] as WebSceneDataSource;

    if (!webSceneDS) {
      let dsJson = SeamlessImmutable({
        id: dsId,
        label: 'webscene',
        type: DataSourceTypes.WebScene,
        itemId: dsId,
      }) as IMDataSourceJson;

      webSceneDS = this.dsManager.createDataSource(dsJson) as WebSceneDataSource;
    }

    if (!this.sceneView) {
      this.sceneView = window.viewds = new SceneView({
        map: webSceneDS.webScene,
        container: this.sceneContainer,
      });

      this.webSceneDS = webSceneDS;

      this.sceneView.when(() => {
        if (this.props.outputDataSources) {
          let dsManager = DataSourceManager.getInstance();
          let outputDsId = this.props.outputDataSources[0];
          let ds = dsManager.getDataSource(outputDsId) as SceneViewDataSource;
          if (!ds) {
            ds = dsManager.createDataSource(outputDsId) as SceneViewDataSource;
          }

          ds.setView(this.sceneView);

          this.highlightQueryObject();
        }
      });

      this.sceneView.on('click', event => {
        let screenPoint = {
          x: event.x,
          y: event.y
        };

        this.sceneView.hitTest(screenPoint).then(response => {
          if (response.results.length) {
            let graphic = response.results[0].graphic;
            let dsManager = DataSourceManager.getInstance();
            let outputDsId = this.props.outputDataSources[0];
            let ds = dsManager.getDataSource(outputDsId) as SceneViewDataSource;
            if (ds) {
              let records = ds.getRecords();
              ds.highlightRecord(graphic.attributes[graphic.layer.objectIdField], graphic.layer.id);
              if(config.centerAt && config.centerAt.target === 'selected') {
                this.zoomAndCenter(graphic, config.centerAt.zoom, config.centerAt.tilt).then(response => {
                  ds.highlightRecord(graphic.attributes[graphic.layer.objectIdField], graphic.layer.id);
                });
              }
            }
          }
        });
      });
    } else {
      this.highlightQueryObject();
    }
    // update and init scene
    this.updateSceneView(this.props.config);
  }

  render() {
    if (!this.props.config.websceneId) {
      return 'Please choose webscene in setting';
    }
    return <div className="widget-scene" ref={(dom) => { this.sceneContainer = dom; }}></div>;
  }

  getOutputData(): SceneView {
    return this.sceneView;
  }

}
