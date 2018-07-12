import { React } from 'jimu-core';
import { Card, ImageProps } from 'jimu-ui';
import { getThumbnailUrl } from './utils';

// NOTE: datasetRecord.getData() returns any
export class HubAnnotation extends React.PureComponent<{data: any, portalUrl?: string, token?: string}>{

  render(){
    const {
      data
    } = this.props
    const user = data.user;
    const title = user && (user.fullName || user.username);
    const thumbnailImage: ImageProps = {
      src: getThumbnailUrl(this.props.portalUrl, user, this.props.token),
      alt: title,
      title,
      shape: 'circle',
      // NOTE: this only seems to put a gray box around the image
      // type: 'thumbnail',
      height: 32
    }
    return <Card
      title={title}
      description={data.description}
      image={thumbnailImage}
      className="hub-annotation"
      horizontal />
  }
}
