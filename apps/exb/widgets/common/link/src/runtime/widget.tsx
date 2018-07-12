import { React } from 'jimu-core';
import * as classnames from 'classnames';
import { BaseWidget, AllWidgetProps } from 'jimu-core';
import { Link, Icon } from 'jimu-ui';
import { IMConfig, LinkStyles } from '../config';
import * as queryString from 'query-string';

const CSSClasses = {
  featureList: 'widget-link'
};

export default class Widget extends BaseWidget<AllWidgetProps<IMConfig>>{

  constructor(props) {
    super(props);
  }

  render() {
    const {
      config,
      ...otherProps
    } = this.props;

    let tempalte = <>Please config Link in setting</>;

    if(config.goto){
      const isButton = config.style.toUpperCase() === LinkStyles.Button || config.style.toUpperCase() === LinkStyles.Button_Outline;
      const isButtonOutline = config.style.toUpperCase() === LinkStyles.Button_Outline;

      const classes = classnames(
        CSSClasses.featureList,
        config.className,
        config.color && `btn-${isButtonOutline ? 'outline-': ''}${config.color}`,
        {'btn': isButton }
      );

      const CSSStyles = {
        "width": config.width
      };

      let queryObject = this.props.queryObject;

      if (config.goto.page) {
        queryObject = queryObject.set('page', config.goto.page);
      }
      if (config.goto.views) {
        queryObject = queryObject.set('views', config.goto.views.join(','));
      }

      let search = '?' + queryString.stringify(queryObject);

      tempalte = <Link className={classes} style={CSSStyles} to={search}>
                        {config.icon&&<Icon icon={config.icon.name}/>}
                        {config.icon ? <span>{config.name}</span> : config.name}
                      </Link>;
    }
    return <>
            {tempalte}
          </>
  }
}
