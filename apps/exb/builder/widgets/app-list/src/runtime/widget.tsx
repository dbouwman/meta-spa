import * as classnames from 'classnames';

import {BaseWidget} from 'jimu-core';
import {AllWidgetProps, appConfigUtils, appActions, React, changePage} from 'jimu-core';
import {appServices} from 'jimu-for-builder';
import './css/style.scss';
import {Link} from 'jimu-ui';
import {IItem} from '@esri/arcgis-rest-common-types';

interface WState{
  apps: IItem[]
}
export default class Widget extends BaseWidget<AllWidgetProps<{}>, WState>{

  constructor(props){
    super(props);
    this.state = {
      apps: []
    };
  }
  componentDidMount(){
    this.refresh();
  }

  refresh(){
    appServices.searchApp().then(apps => {
      this.setState({apps: apps});
    });
  }

  // editApp = (appId: string) => {
  //   this.props.dispatch(appActions.queryObjectChanged({
  //     id: appId,
  //     page: undefined
  //   }));
  // }

  deleteApp = (appId: string) => {
    appServices.deleteApp(appId).then(() => {
      this.refresh();
    });
  }

  render(){
    return <div className="app-list">
      <button onClick={() => changePage('template')}>Create</button>
      <button onClick={() => this.refresh()}>Refresh</button>
      {this.state.apps.length? 
        (<table>
          <thead>
            <tr>
              <td>App Name</td>
              <td>Create time</td>
              <td>Action</td>
            </tr>
          </thead>
          <tbody>
            {this.state.apps.map((app: PortalItem) => {
              return <tr key={app.id}>
                <td>{app.title}</td>
                <td>{new Date(app.created).toLocaleDateString()}</td>
                <td>
                  {/* <button onClick={() => this.editApp(app.id)}>Edit</button> */}
                  <Link to={`?id=${app.id}`}>Edit</Link>
                  <button onClick={() => this.deleteApp(app.id)}>Delete</button>
                </td>
              </tr>;
            })}
          </tbody>
        </table>): 'No app.'
      }
      
    </div>;
  }
}
