import {React, IMState} from 'jimu-core';
import * as classnames from 'classnames';

import {BaseWidget, AllWidgetProps, DataSourceManager, DataSourceStatus} from 'jimu-core';
import {FeatureLayerDataSource} from 'jimu-arcgis'
import Query = require('esri/tasks/support/Query');

console.log(FeatureLayerDataSource);

interface Props{
  queryString: string;
}
export default class Widget extends BaseWidget<AllWidgetProps<{}> & Props, {}>{
  static mapExtraStateProps = (state: IMState, ownProps: AllWidgetProps<{}>) => {
    return {
      queryString: state.widgetState[ownProps.id] && state.widgetState[ownProps.id]['queryString']
    }
  };

  componentDidUpdate(prevProps: AllWidgetProps<{}> & Props){
    let ds: FeatureLayerDataSource = this.props.dataSources[this.props.useDataSources[0]] as FeatureLayerDataSource;
    if(ds && this.props.queryString !== prevProps.queryString){
      let q = new Query({
        where: this.props.queryString,
        outFields: ['areaname']
      })
      ds.query(q);
    }
  }

  render(){
    let isLoaded = this.props.dataSourceStatus[this.props.useDataSources[0]] === DataSourceStatus.Loaded;

    let ds: FeatureLayerDataSource = this.props.dataSources[this.props.useDataSources[0]] as FeatureLayerDataSource;
    let list = isLoaded? ds.getRecords().map((r, i) => {
      return <div key={i}>{r.getData()['areaname']}</div>
    }): null;
    return <div>
      <div>The query string: {this.props.queryString}</div>
      <div>query state: {this.props.dataSourceStatus[this.props.useDataSources[0]]}</div>
      {list}
    </div>;
  }
}
