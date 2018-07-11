import {extensionSpec, AppConfig, utils, store, appActions, browserHistory} from 'jimu-core';
import {appServices} from 'jimu-for-builder';

export default class BuilderEntry implements extensionSpec.AppConfigProcessorExtension{
  id = 'app-config-processor-extension-builder-entry';
  
  process(appConfig: AppConfig): Promise<AppConfig>{
    let qo = store.getState().queryObject;
    if(qo.id || qo.app_config){
      return Promise.resolve(appConfig);
    }
    if(!qo.title){
      if(!qo.page){
        browserHistory.push('?page=template');
        return Promise.resolve(appConfig);
      }else{
        return Promise.resolve(appConfig);
      }
    }

    //if has ?title, we'll create new app
    
    return appServices.createApp({
      template: 'default',
      name: qo.title,
      description: qo.summary,
      tags: qo.tags? qo.tags.split(','): [],
      webmap: qo.webmap,
      webscene: qo.webscene,
      folder: qo.folder,
      shareWithWebmap: qo.sharewithwebmap? true: false,
      shareWithWebscene: qo.sharewithwebscene? true: false
    }).then(item => {
      let newQuery = {
        id: item.id,
        apiurl: qo.apiurl,
        locale: qo.locale
      };
      
      store.dispatch(appActions.queryObjectChanged(newQuery));
      return appConfig;
    }, err => {
      return appConfig;
    });
  }
}