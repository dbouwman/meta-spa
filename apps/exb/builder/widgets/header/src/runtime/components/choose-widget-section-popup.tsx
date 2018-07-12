import {React, classNames as classnames, appConfigUtils, IMState, WidgetJson, WidgetManager, IMWidgetJson, SeamlessImmutable, IMSectionJson} from 'jimu-core';
import {BSCard, CardImg, CardBody} from 'jimu-ui';
import {builderAppSync, appConfigActions} from 'jimu-for-builder';

interface WidgetImage{
  src: string;
  alt?: string;
}
interface ItemType{
  name: string;
  label: string;
  path: string;
  image: WidgetImage;
}
interface Props{
  isOnScreen: boolean;
  onTogglePopup: (isOnScreen: boolean) => void;
  appState: IMState;
  dispatch: any;
  currentPageId: string;
  currentViewId: string;
}
interface State{
  selectedItem: string;
}
export class ChooseWidgetSectionPopup extends React.PureComponent<Props, State>{

  constructor(props) {
    super(props);
    this.state = {
      selectedItem: ''
    }
  }
  popup: HTMLElement

  widgetList: ItemType[] = this.getWidgetListInfo()
  sectionList = [{
    image:{src: './widgets/header/dist/runtime/assets/section.svg'},
    name: '_section',
    label: 'Section',
    path: ''
  }]

  componentDidMount(){
    this.initHeight();
    setTimeout(()=>{
      this.popup.style.display = 'block';
    }, 10);
  }

  onClose = () => {
    if(!this.props.isOnScreen){
      return;
    }

    this.props.onTogglePopup(false);
  }

  initHeight(){
    const height = document.body.scrollHeight;
    // TODO: header height is 80, how to init popup height
    this.popup.style.height = (height - 80) + 'px';
  }

  getWidgetListInfo(){
    const widgetInfo = require('../../../../../../widgets/widgets-info.json');
    const list = widgetInfo.map(v => {
      let listItemTemplate:ItemType = {
        name: v.name,
        label: v.label,
        path: v.path,
        image: {
          src: '',
          alt: ''
        }
      };

      listItemTemplate.image.src = '../' + v.icon;
      listItemTemplate.image.alt = v.label;

      return listItemTemplate;
    });
    return list;
  }

  getListItemJSX = (item: ItemType) => {
    return (
      <BSCard className='float-left widget-card-item' onClick={e => this.onSelectItem(e, item)} key={item.name}>
        <div className='widget-card-image'>
          <div>
            <CardImg top width='100%' src={item.image.src}/>
          </div>
        </div>
        <CardBody className='widget-card-content' style={{padding: '2px 4px'}}>
          <span className='text-capitalize' title={item.label}>{item.label}</span>
        </CardBody>
      </BSCard>
    );
  }
  stopBubble(e) {
    if (e && e.stopPropagation){
      e.stopPropagation();
    }else if(window.event){
      window.event.cancelBubble = true;
    }
  }
  onSelectItem = (e, item: ItemType) => {
    this.stopBubble(e);

    let selectedItemName = item.name;
    this.setState({
      selectedItem: selectedItemName
    });

    if(!selectedItemName){
      return;
    }

    let layoutInfo = {
      layoutId: this.getLayoutId()
    };
    if(selectedItemName === '_section'){
      let sectionId = appConfigUtils.getUniqueId(this.props.appState.appConfig, 'section');
      let sectionJson = SeamlessImmutable({
        id: sectionId
      }) as IMSectionJson;
      this.props.dispatch(appConfigActions.actions.inBuilderEditAppAddSection(sectionJson, layoutInfo));
      builderAppSync.publishAddSectionToApp(sectionId, layoutInfo);
    }else{
      let widgetId = appConfigUtils.getUniqueId(this.props.appState.appConfig, 'widget');

      let widgetJson = {
        id: widgetId,
        label: appConfigUtils.getUniqueLabel(this.props.appState.appConfig, 'widget'),
        uri: item.path,
        context: appConfigUtils.getWidgetContext(item.path)
      } as WidgetJson;

      WidgetManager.getInstance().handleNewWidgetJson(widgetJson).then(widgetJson => {
        let imWidgetJson = SeamlessImmutable(widgetJson) as IMWidgetJson;
        this.props.dispatch(appConfigActions.actions.inBuilderEditAppAddWidget(imWidgetJson, layoutInfo));
        builderAppSync.publishAddWidgetToApp(widgetId, layoutInfo);
      });
    }
  }

  getLayoutId(): string{
    return this.props.currentViewId? this.props.appState.appConfig.views[this.props.currentViewId].layout:
    this.props.appState.appConfig.pages[this.props.currentPageId].layout;
  }

 render(){
    return(
      <div className='widget-builder-header-choose-widget-popup'>
        <div style={{display: 'none'}} className={classnames('choose-widget-popup-content', {'widget-popup-show-animation': this.props.isOnScreen},
        {'widget-popup-hide-animation': !this.props.isOnScreen})} ref={n => this.popup = n}
        onClick={() => {this.setState({selectedItem: ''})}}>
          <section>
            <h3>Elements</h3>
            <span className='choose-widget-popup-close' onClick={this.onClose}></span>
          </section>
          <section>
            <h5>Section</h5>
            <div className='clearfix'>
            {this.sectionList.map(l => this.getListItemJSX(l))}
            </div>
          </section>
          {/* <section>
            <h5>Controler</h5>
            <div className='clearfix'>
            </div>
          </section> */}
          <section>
            <h5>Widget</h5>
            <div className='clearfix'>
              {this.widgetList.map(l => this.getListItemJSX(l))}
            </div>
          </section>
        </div>
      </div>
    );
  }
}
