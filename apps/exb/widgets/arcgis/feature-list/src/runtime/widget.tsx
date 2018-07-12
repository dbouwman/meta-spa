import { React, IMState, utils } from 'jimu-core';
import * as classnames from 'classnames';

import {
  BaseWidget, AllWidgetProps,
  DataSourceStatus, DataRecord
} from 'jimu-core';
import { List, ListItem, ListProps, CardProps } from 'jimu-ui';
import { DataSourceTypes, MapViewDataSource, SceneViewDataSource, FeatureLayerDataSource, FeatureLayerViewDataSource } from 'jimu-arcgis';
import Query = require('esri/tasks/support/Query');
import { IMConfig, gotoProps } from '../config';
import * as queryString from 'query-string';

import './css/style.scss';

console.log(SceneViewDataSource);
console.log(FeatureLayerDataSource);

const CSSClasses = {
  featureList: 'feature-list'
};


interface IState {
  datasourceState: DataSourceStatus
}

export interface ListItemCardProps extends CardProps {
  _dataIndex: number,
  objectId: number
}

export default class Widget extends BaseWidget<AllWidgetProps<IMConfig>, IState>{
  layerDatasource: FeatureLayerDataSource;
  intialized: boolean = false;
  list: List;

  //--------------------------------------------------------------------------
  //
  //  Private methods
  //
  //--------------------------------------------------------------------------

  private _handleItemChange(listItem: ListItem) {
    let ds = this.props.dataSources[this.props.config.dataSourceId];
    let itemData = (listItem.props.data as ListItemCardProps);

    switch (ds.type) {
      case DataSourceTypes.FeatureLayer:
        ds.selectRecord(itemData._dataIndex);
        break;
      case DataSourceTypes.MapView:
      case DataSourceTypes.SceneView:
        let layerId = this.layerDatasource.featureLayer.id;
        ds.selectRecord(itemData._dataIndex, layerId);
        break;
    }
  }

  private _createItem(record: DataRecord, objectIdField: string, index: number): ListItemCardProps {
    const {
      title,
      description,
      image
    } = this.props.config;
    let itemData = record.getData();
    
    return {
      _dataIndex: index,
      objectId: itemData[objectIdField] as number,
      title: title ? itemData[title.field] as string : null,
      description: description ? itemData[description.field] as string : null,
      image: image ? {
        src: itemData[image.field],
        alt: title ? itemData[title.field] : '',
        shape: image.shape,
        height: image.height || 64,
        cover: image.shape !== 'circle'
      } : null,
      horizontal: !this.props.config.horizontal // the content of a list item will align vertically if the list is aligned horzontally
    } as ListItemCardProps;
  }

  //--------------------------------------------------------------------------
  //
  //  Public methods
  //
  //--------------------------------------------------------------------------

  init() {
    let dsId = this.props.config.dataSourceId;
    if(!dsId){
      return;
    }
    let ds = this.props.dataSources[dsId];

    this.setState({ datasourceState: DataSourceStatus.LoadedLoading });
    switch (ds.type) {
      case DataSourceTypes.FeatureLayer:
        this.layerDatasource = ds as FeatureLayerDataSource;
        this.queryAllRecords();
        break;
      case DataSourceTypes.SceneView:
      case DataSourceTypes.MapView:
        let layerId = this.props.config.layerId;
        let mapView = (ds as MapViewDataSource | SceneViewDataSource).mapView;
        let layerViewDs = (ds as MapViewDataSource | SceneViewDataSource).getLayerViewDatasourceOnDemand(layerId);
        if (layerViewDs) {
          this.layerDatasource = (layerViewDs as FeatureLayerViewDataSource).featureLayerDatasource as FeatureLayerDataSource;
          this.queryAllRecords();
          this.setState({ datasourceState: DataSourceStatus.Loaded });
        } else if (mapView) {
          mapView.whenLayerView(mapView.map.findLayerById(layerId)).then(layerView => {
            layerViewDs = (ds as MapViewDataSource | SceneViewDataSource).getLayerViewDatasourceOnDemand(layerId);
            this.layerDatasource = (layerViewDs as FeatureLayerViewDataSource).featureLayerDatasource as FeatureLayerDataSource;
            this.queryAllRecords();
          });
        }
        break;
    }
  }

  queryAllRecords() {
    let q = new Query({
      where: '1=1',
      outFields: ['*'],
      returnGeometry: true
    });

    this.layerDatasource.query(q).then(records => {
      let dsInfos = utils.getDataSourceInfosFromQueryObject(this.props.queryObject);
      let dsId = this.props.config.dataSourceId;
      let ds = this.props.dataSources[dsId];
      if (typeof dsInfos[dsId] !== 'undefined') {
        (ds as MapViewDataSource | SceneViewDataSource).selectRecord(dsInfos[dsId], this.props.config.layerId);
      }
      this.setState({ datasourceState: DataSourceStatus.Loaded });
      this.intialized = !this.intialized;
    }, err => {
      console.error(err.message);
    });
  }

  createList(dataCollection: FeatureLayerDataSource): React.ReactElement<ListProps> {
    const config = this.props.config;
    let fds = dataCollection;
    let objectIdField = fds.featureLayer && fds.featureLayer.objectIdField;
    let records = fds.getRecords();
    if (Array.isArray(records) && config.limit) {
      records = records.slice(0, config.limit);
    }
    let listItems: ListItemCardProps[] = records.map((r, i) => {
      return this._createItem(r, objectIdField, i);
    });

    // get current selected indexes
    let dsId = config.dataSourceId;
    let ds = this.props.dataSources[dsId];
    let currentIndexes = ds.getCurrentRecordIndexes() || [];

    // get links to
    let queryObject = this.props.queryObject;
    let search;
    if (config.onItemSelect) {
      if (config.onItemSelect.goto.page) {
        queryObject = queryObject.set('page', config.onItemSelect.goto.page);
      }
      if (config.onItemSelect.goto.views) {
        queryObject = queryObject.set('views', config.onItemSelect.goto.views.join(','));
      }
      search = '?' + queryString.stringify(queryObject);
    }

    // check if is selectable
    const isSelectable = this.props.config.onItemSelect

    return <List
      dataSource={listItems}
      selectable
      selectedIndexes={currentIndexes}
      highlightSelection={this.props.config.highlightSelection}
      to={search}
      onChange={this._handleItemChange}
      horizontal={this.props.config.horizontal}
      cardWidth={this.props.config.cardWidth}/>
  }

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  constructor(props) {
    super(props);

    this._handleItemChange = this._handleItemChange.bind(this);
  }

  componentDidUpdate(prevProps: AllWidgetProps<IMConfig>) {
    if (!this.layerDatasource) {
      this.init();
    }
  }

  render() {
    const {
      config
    } = this.props;

    const classes = classnames(
      CSSClasses.featureList,
      {'horizontal': config.horizontal},
      config.style && `widget-style--${config.style.name}`
    );

    //let dsId = this.props.useDataSources[0];

    let loading = config.dataSourceId ? <div className='loading'>waiting...</div> : <>Please choose datasource in setting</>;
    let list = this.list = this.layerDatasource && this.state.datasourceState === DataSourceStatus.Loaded ?
      this.createList(this.layerDatasource as FeatureLayerDataSource) : null;

    return <div className={classes}>
      {config.header && <header className='jimu-widget--header'><h5>{config.header.title && config.header.title.text || ''}</h5></header>}
      {!(this.layerDatasource && this.state.datasourceState === DataSourceStatus.Loaded) && loading}
      {list}
    </div>
  }
}
