import {BaseWidget, AllWidgetProps, React} from 'jimu-core';
import {IMConfig} from '../config';
import {BSCard, CardImg, CardBody, CardTitle, CardText, CardSubtitle, Link} from 'jimu-ui';
import {builderActions} from 'jimu-for-builder';

import './css/style.scss';

interface Props{

}

interface ListImage{
  src: string;
}

interface ListItem{
  title: string;
  image?: ListImage;
}
export default class Widget extends BaseWidget<AllWidgetProps<IMConfig> & Props, any>{

  constructor(props){
    super(props);
  }

  listInfo = this.getListInfo()

  onCreateClick = (templateName: string) => {
    this.props.dispatch(builderActions.selectTemplate(templateName));
  }

  getListInfo(): ListItem[]{
    const templatesInfo = require('../../../../../templates/templates-info.json');
    let config = {};
    let listInfo = templatesInfo.map(t => {
      // config = require(`../../../../../templates/${t.name}/config.json`);
      let listItem = {
        title: t.name,
        image: {
          src: `../templates/${t.name}/thumbnail.png`
        }
      };
      return listItem;
    })
    return listInfo;
  }

  getListItemJSX = item => {
    // TODO: add author info
    const cardContent = <div className='template-card-button'>
                          <Link onClick={evt => this.onCreateClick(item.title)} to={`?page=create`}>
                            Start
                          </Link>
                        </div>;
    return(
        <BSCard key={item.title} className='template-card'>
          <CardImg top width='100%' src={item.image.src} alt={item.title} />
          <CardBody>
            <CardTitle className='text-capitalize'>{item.title}</CardTitle>
            <CardSubtitle>By esri</CardSubtitle>
              {cardContent}
          </CardBody>
        </BSCard>
    );
  }

  render(){
    return (
      <main className='widget-choose-template'>
        <header className='widget-title'>
          <h1>Choose a template to start</h1>
        </header>
        <section className='templates-list'>
          {this.listInfo.map(l => this.getListItemJSX(l) )}
        </section>
      </main>
    );
  }
}
