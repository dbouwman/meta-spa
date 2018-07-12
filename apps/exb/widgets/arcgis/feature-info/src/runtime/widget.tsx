import { React, IMState, SeamlessImmutable, utils } from 'jimu-core';
import * as classnames from 'classnames';
import { ImmutableObject } from 'seamless-immutable';
import Query = require('esri/tasks/support/Query');
import { List } from 'jimu-ui';

import {
  BaseWidget, AllWidgetProps,
  DataSourceStatus
} from 'jimu-core';
import { Card } from 'jimu-ui';
import { FeatureLayerViewDataSource, FeatureLayerDataSource, FeatureDataRecord, ViewDataSource, DataSourceTypes } from 'jimu-arcgis';
import Graphic = require('esri/Graphic');
import { IMConfig, DescriptionTypes } from '../config';

import './css/style.scss';

console.log(FeatureLayerDataSource);

const CSSClasses = {
  featureInfo: 'feature-info',
  featureInfoFields: 'feature-info--fields'
};

interface IState {
  datasourceState: DataSourceStatus
}

export default class Widget extends BaseWidget<AllWidgetProps<IMConfig>, IState>{
  domNode: any;

  //--------------------------------------------------------------------------
  //
  //  Private methods
  //
  //--------------------------------------------------------------------------

  //--------------------------------------------------------------------------
  //
  //  Public methods
  //
  //--------------------------------------------------------------------------


  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  constructor(props) {
    super(props);

    this.state = {
      datasourceState: DataSourceStatus.Unloaded
    }

  }

  componentDidUpdate(prevProps: AllWidgetProps<IMConfig>) {
    let dsId = this.props.config.dataSourceId;
    if(!dsId){
      return;
    }
    let ds = this.props.dataSources[this.props.config.dataSourceId];

    this.setState({ datasourceState: DataSourceStatus.LoadedLoading });

    if (ds.getCurrentRecordIndexes() && ds.getCurrentRecord()) {
      this.setState({ datasourceState: DataSourceStatus.Loaded });
    } else {
      switch (ds.type) {
        case DataSourceTypes.FeatureLayer:
          //TODO
          break;
        case DataSourceTypes.SceneView:
        case DataSourceTypes.MapView:
          let mapView = (ds as ViewDataSource).mapView;
          let layerId = this.props.config.layerId;
          if (mapView && this.state.datasourceState === DataSourceStatus.LoadedLoading) {
            mapView.whenLayerView(mapView.map.findLayerById(layerId)).then(layerView => {

              let q = new Query({
                where: '1=1',
                outFields: ['*'],
                returnGeometry: true
              });

              let layerViewDs = (ds as ViewDataSource).getLayerViewDatasourceOnDemand(layerId);
              let layerDatasource = (layerViewDs as FeatureLayerViewDataSource).featureLayerDatasource as FeatureLayerDataSource;

              layerDatasource.query(q).then( response => {
                let dsInfos = utils.getDataSourceInfosFromQueryObject(this.props.queryObject);
                if (typeof dsInfos[dsId] !== 'undefined') {
                  let records = layerDatasource.getRecords();
                  if(records && records.length > 0) {
                    let selectedIndex = dsInfos[dsId];
                    let selectedRecord = records[selectedIndex];
                    (ds as ViewDataSource).highlightRecord(
                      selectedRecord.feature.attributes[layerViewDs.featureLayerDatasource.featureLayer.objectIdField], 
                      this.props.config.layerId);
                  }
                }
                this.setState({ datasourceState: DataSourceStatus.Loaded });
              }, err => {
                console.error(err.message);
              });
            });
          }
      }
    }
  }

  render() {
    const {
      config,
      dataSources
    } = this.props;

    const classes = classnames(
      CSSClasses.featureInfo,
      config.className,
      config.style && `widget-style--${config.style.name}`
    );

    let content;

    if (this.state.datasourceState === DataSourceStatus.Loaded && config.dataSourceId) {
      let ds = dataSources[config.dataSourceId];
      const currentRecord: FeatureDataRecord = ds.getCurrentRecord() as FeatureDataRecord;
      if (!currentRecord) {
        content = <div className='loading'>No selected feature</div>;
      } else {
        const f: Graphic = currentRecord.feature as Graphic;

        let descriptionContent;
        if (config.description) {
          if(config.description.type && config.description.type.toUpperCase() === DescriptionTypes.list) {
            if(Array.isArray(config.description.fields)) {
              const listItems = config.description.fields.map(fieldConfig => {
                return {
                  icon: fieldConfig.icon,
                  text: f.attributes[fieldConfig.field]
                }
              });
            descriptionContent = <List className={CSSClasses.featureInfoFields} dataSource={listItems}/>;
            } else {
              descriptionContent = "Description configuration error occurred.";
            }
          } else {
            descriptionContent = f.attributes[config.description.field];
          }
        }
        content = (
          <Card
            title={config.title ? f.attributes[config.title.field] : null}
            description={descriptionContent || null}
            textLimit={config.description && config.description.limit || null}
            isRichText={config.description && config.description.richText}
            image={config.image ? {
              height: config.image.height,
              src: f.attributes[config.image.field],
              cover: true
            } : null} />
        );
      }
    } else if(!config.dataSourceId){
      content = <>Please choose datasource in setting</>
    } else {
      let loading = <div className='loading'>waiting...</div>;
      content = loading;
    }

    return <div 
      className={classes}
      ref={ ref => this.domNode = ref}
    >
      {content}
    </div>
  }

}
