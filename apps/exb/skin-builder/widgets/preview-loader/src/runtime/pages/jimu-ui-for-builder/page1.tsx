import * as React from 'react';
import { ExternalDataSourceChooser, ItemChooser, DataSourceInfo } from 'jimu-for-builder';
import { portalService } from 'jimu-arcgis/portal';
import { IItem } from '@esri/arcgis-rest-common-types';

interface State{
  webMap: IItem;

  dataSourceInfo: DataSourceInfo;
}
export class Page1 extends React.PureComponent<{}, State> {
  portalUrl: string = 'https://www.arcgis.com';

  constructor(props){
    super(props);
    portalService.createPortal(this.portalUrl);
    this.state = {
      webMap: null,
      dataSourceInfo: null
    }
  }

  render() {
    return (
      <div>
        <h2>WebMap Chooser</h2>
        <h5>Selected web map: {this.state.webMap && this.state.webMap.id}</h5>
        <ItemChooser portalUrl={this.portalUrl} onSelect={item => this.setState({webMap: item})} itemType="Web Map"/>
        <hr/>


        <h2>External Datasource Chooser</h2>
        <h5>Selected data source: {JSON.stringify(this.state.dataSourceInfo)}</h5>
        <ExternalDataSourceChooser portalUrl={this.portalUrl} onDataSourceSelect={dsInfo => this.setState({dataSourceInfo: dsInfo})}></ExternalDataSourceChooser>
      </div>
    )
  }
}