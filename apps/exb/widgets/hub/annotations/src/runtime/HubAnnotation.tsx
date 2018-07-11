import { React } from 'jimu-core'
import { Card, ImageProps } from 'jimu-ui'

// NOTE: datasetRecord.getData() returns any
export class HubAnnotation extends React.PureComponent<{data: any}>{

  render(){
    const {
      data
    } = this.props
    const thumbnailImage: ImageProps = {
      // NOTE: default profile image is 150x150
      src: 'https://cdn-a.arcgis.com/cdn/18397E9/js/arcgisonline/css/images/no-user-thumb.jpg',
      alt: data.author,
      shape: 'circle',
      // NOTE: this only seems to put a gray box around the image
      // type: 'thumbnail',
      height: 32
    }
    return <Card
      title={data.author}
      description={data.description}
      image={thumbnailImage}
      className="hub-annotation"
      horizontal />
  }
}
