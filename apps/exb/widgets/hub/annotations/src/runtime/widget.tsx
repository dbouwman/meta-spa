import {React} from 'jimu-core';

import {BaseWidget, AllWidgetProps, DataSourceStatus} from 'jimu-core';
import { IQueryFeaturesRequestOptions } from '@esri/arcgis-rest-feature-service';
import {IMConfig} from '../config';
import { buildWhereClause, getThumbnailUrl } from './utils';
import { HubAnnotation } from './HubAnnotation';
import { HubAnnotationForm } from './HubAnnotationForm';
// TODO: import this from 'jimu-hub' once we create that extension
import { HubAnnotationsDataSource } from 'jimu-core/lib/data-source-manager';
import { ImageProps } from 'jimu-ui';

import './css/style.scss';

const getFeatureIdFromProps = (props) => {
  const config = props.config;
  const targetDsId = config.targetDataSourceId;
  if (!targetDsId) {
    // we're not getting the target feature_id dynamically from another data source
    // just use the static feature_id from the config (if any)
    return config.feature_id
  }

  // we need to get the target feature_id dynamically from another data source
  let feature_id;

  // for now we try to derive the feature_id from the query params
  const queryObject = props.queryObject;
  const data = queryObject.data;
  const dataParts = data && data.split(':');
  feature_id = dataParts && dataParts[0] === targetDsId && parseInt(dataParts[1], 10);

  return feature_id;
}

export default class Widget extends BaseWidget<AllWidgetProps<IMConfig>, {}>{

  constructor(props){
    super(props);

    this.onAddAnnotation = this.onAddAnnotation.bind(this);
  }

  _query(ds) {
    let q: IQueryFeaturesRequestOptions = {
      url: ds.url,
      where: buildWhereClause(this.props.config),
      outFields: ['OBJECTID', 'author', 'description', 'feature_id']
    };
    return ds.query(q);
  }

  onAddAnnotation (description: string) {
    const dsId = this.props.useDataSources && this.props.useDataSources[0];
    const ds = (this.props.dataSources[dsId] as HubAnnotationsDataSource);
    const feature_id = getFeatureIdFromProps(this.props);
    // TODO: first check if ds exists? and is loaded?
    return ds.addAnnotation(description, this.props.config.target, feature_id)
    .then(() => {
      if (this.props.config.status === 'pending') {
        // this is showing pending annotations, we need to refresh the list
        // NOTE: this will fail for the case when this widget is showing approved
        // but there is another widget showing the pending using a different data source
        // re-query the annotations
        this._query(ds);
      }
    });
  }

  componentDidUpdate(){
    const dsId = this.props.useDataSources && this.props.useDataSources[0]
    const ds = (this.props.dataSources[dsId] as HubAnnotationsDataSource)
    const dsInfo = this.props.dataSourcesInfo[dsId];
    if(ds && dsInfo && dsInfo.status === DataSourceStatus.Unloaded){
      // query the annotations
      this._query(ds);
    }
  }

  render(){
    // TODO: i18n...

    // check for data source
    const dsId = this.props.useDataSources && this.props.useDataSources[0];
    const ds = this.props.dataSources[dsId];
    if (!ds) {
      return 'Please set a data source';
    }

    // check if data source loaded
    const dsInfo = this.props.dataSourcesInfo[dsId];
    const isLoaded = dsInfo && dsInfo.status === DataSourceStatus.Loaded
    if (!isLoaded) {
      return 'waiting...';
    }

    // configure add comment form if user is logged in
    const user = this.props.user;
    let addComment;
    if (user) {
      // show the add comment form
      // first, get thumbnail image props from user/portal
      let title = `${user.fullName} (${user.username})`;
      const thumbnailProps: ImageProps = {
        src: getThumbnailUrl(this.props.portalUrl, user, this.props.token),
        title,
        alt: `thumbnail image of ${title}`
      };
      addComment = (<HubAnnotationForm thumbnailProps={thumbnailProps} onSave={this.onAddAnnotation} />);
    } else {
      // show a sign in message
      addComment = (<p>You must be <a onClick={this.props.onSignIn}>signed in</a> to add a comment</p>);
    }

    // we have a loaded data source, get the records
    const records = ds.getRecords();
    const feature_id = getFeatureIdFromProps(this.props);
    const filterByFeature = feature_id !== undefined;
    // console.log({feature_id});
    // render a list of annotations, filtering by feature id if needed
    let annotations = [];
    records.reduce((annotations, r, i) => {
      const data = r.getData();
      if (!filterByFeature || data.feature_id === feature_id) {
        annotations.push(<HubAnnotation data={data} key={i} />);
      }
      return annotations;
    }, annotations);
    let content;
    if (annotations.length === 0) {
      // no annotations, show a message
      const status = this.props.config.status;
      // TODO: i18n and allow consumers to format this message: "comments" vs "annotations", "feature"
      content = <p>There are no {status ? status : ''} comments{filterByFeature ? ' for this feature' : ''}.</p>;
    } else {
      // show the annotations
      content = annotations;
    }

    return <div className='widget-annotations'>
      {this.props.config.header && <header className='jimu-widget--header'><h5>{this.props.config.header.title && this.props.config.header.title.text || ''}</h5></header>}
      {addComment}<div>{content}</div>
      </div>
  }
}
