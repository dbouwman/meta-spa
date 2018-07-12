import * as React from 'react';
import { Icon } from 'jimu-ui';

const iconNames = ["close", "drag-horizontal", "drag-vertical", "handle-horizontal", "handle-vertical", "check-mark", "left-triangle-arrow", "right-triangle-arrow", "down-arrow", "up-arrow", "overview-arrow-bottom-left", "overview-arrow-bottom-right", "overview-arrow-top-left", "overview-arrow-top-right", "maximize", "minimize", "checkbox-unchecked", "checkbox-checked", "radio-unchecked", "radio-checked", "up-arrow-circled", "down-arrow-circled", "left-arrow-circled", "right-arrow-circled", "zoom-out-fixed", "zoom-in-fixed", "refresh", "edit", "authorize", "map-pin", "blank-map-pin", "table", "plus", "minus", "beginning", "reverse", "pause", "play", "forward", "end", "erase", "up-down-arrows", "left", "right", "announcement", "notice-round", "notice-triangle", "home", "locate", "expand", "collapse", "layer-list", "basemap", "globe", "applications", "arrow-up-circled", "arrow-down-circled", "arrow-left-circled", "arrow-right-circled", "minus-circled", "plus-circled", "add-attachment", "attachment", "calendar", "close-circled", "browser", "collection", "comment", "configure-popup", "contact", "dashboard", "deny", "description", "directions", "directions2", "documentation", "duplicate", "review", "environment-settings", "error", "error2", "experimental", "feature-layer", "filter", "grant", "group", "key", "labels", "tag", "layers", "left-arrow", "right-arrow", "link-external", "link", "loading-indicator", "maps", "marketplace", "media", "media2", "menu", "mobile", "phone", "navigation", "pan", "printer", "pie-chart", "chart", "line-chart", "question", "resend-invitation", "rotate", "save", "settings", "settings2", "share", "sign-out", "support", "user", "time-clock", "trash", "upload", "download", "zoom-in-magnifying-glass", "search", "zoom-out-magnifying-glass", "locked", "unlocked", "favorites", "compass", "down", "up", "chat", "dock-bottom", "dock-left", "dock-right", "organization", "north-navigation", "locate-circled", "dial", "polygon", "polyline", "visible", "non-visible", "link-vertical", "unlocked-link-vertical", "link-horizontal", "unlocked-link-horizontal", "swap", "cta-link-external", "reply", "public", "share2", "launch-link-external", "rotate-back", "pan2", "tracking", "expand2", "arrow-down", "arrow-up", "hollow-eye", "play-circled", "volume-off", "volume-on"];


export class Page1 extends React.PureComponent<{}> {
  render() {

    const style = {
      width: 100,
      lineHeight: 1.5,
      verticalAlign: 'top'
    }

    const classes = 'd-inline-block mr-1 mb-5 text-center';

    const content = iconNames.map((iconName, i) => {
      return <span key={i} style={style} className={classes}>
        <Icon icon={iconName} />
        <span className='d-block'>{iconName}</span>
      </span>
    });

    return (
      <div>
        {/* Icon: START */}
        <h2 className='pb-3'>Icons: </h2>
        <h5 className='pb-3'>Usage: </h5>
        <code className='d-block'>
          import &#123;Icon&#125; from &#x27;jimu-ui&#x27;;
        </code>
        <code className='pb-5 d-block'>
          &#x3C;Icon icon=&#x27;iconName&#x27;/&#x3E;
        </code>
        {content}

        <hr/>

        <h5 className='py-3'> Different sizes and colors: </h5>

        {/* You can use "size" to define an icon's size */}
        <Icon size='16' fill='blue' icon='close' />
        <Icon size='24' icon='close' />
        {/* You can also define "width" and "height" separately */}
        <Icon width={36} height={36} fill='#dc3545' icon='close' />
        <Icon size='56' fill='#007bff' icon='close' />

      </div>
    )
  }
}