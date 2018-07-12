import * as classnames from 'classnames';

import {BaseWidget, AllWidgetProps, appActions, DataSourceJson, React} from 'jimu-core';
import {Modal, ModalHeader, ModalBody, ModalFooter, Button} from 'jimu-ui';
import {DataSourceTypes} from 'jimu-arcgis';
import {ExternalDataSourceChooser, DataSourceInfo, appStateActions} from 'jimu-for-builder';

interface State{
  showDataSourcePopup: boolean;
  selectedDataSource: DataSourceInfo;
}
export default class Widget extends BaseWidget<AllWidgetProps<{}>, State>{
  constructor(props){
    super(props);
    this.state = {
      showDataSourcePopup: false,
      selectedDataSource: null
    };
  }

  onDataSourceSelect = (dsInfo: DataSourceInfo) => {
    this.setState({
      selectedDataSource: dsInfo
    });
  }

  onOk = () => {
    if(!this.state.selectedDataSource){
      return;
    }
    let dsInfo = this.state.selectedDataSource;
    let dsJson: DataSourceJson;
    if(dsInfo.type === DataSourceTypes.WebMap){
      dsJson = {
        id: `${DataSourceTypes.WebMap}-${dsInfo.itemId}`,
        label: dsInfo.itemTitle,
        type: dsInfo.type,
        itemId: dsInfo.itemId
      }
      this.props.dispatch(appStateActions.inBuilderEditAppAddDataSource(dsJson));
      this.setState({showDataSourcePopup: false})
    }
  }

  onCancel = () => {
    this.setState({showDataSourcePopup: false})
  }

  render(){
    return <div className="widget-ds-config">
    <button onClick={() => this.setState({showDataSourcePopup: true})}>Choose Data Source</button>

    <div className="data-sources">
    {
      this.props.appState && this.props.appState.appConfig && this.props.appState.appConfig.dataSources &&
        Object.keys(this.props.appState.appConfig.dataSources).map(dsId => {
          return <div key={dsId}>{JSON.stringify(this.props.appState.appConfig.dataSources[dsId])}</div>
       })
     }
    </div>
    
    <Modal
      isOpen={this.state.showDataSourcePopup} size="lg"
      toggle={() => this.setState({showDataSourcePopup: !this.state.showDataSourcePopup})}>
        <ModalHeader>Choose ds</ModalHeader>
        <ModalBody>
          <ExternalDataSourceChooser portalUrl={this.props.portalUrl} onDataSourceSelect={this.onDataSourceSelect}></ExternalDataSourceChooser>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.onOk}>Ok</Button>{' '}
          <Button color="secondary" onClick={this.onCancel}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>;
  }
}
