import { BaseWidget, React, AllWidgetProps, IMState } from 'jimu-core';
import { IMConfig } from '../config';
import { Tab, Tabs } from 'jimu-ui';
import { Page1, Page2, Page3, Page4, Page5, Page6 } from './pages/bootstrap';
import { Page1 as Page7 } from './pages/jimu-ui';
import { Page1 as ForBuilderPage1 } from './pages/jimu-ui-for-builder';
import { Page1 as IconsPage1 } from './pages/icons';

export default class Widget extends BaseWidget<AllWidgetProps<IMConfig>> {

  onTabSelected = (title: string) => {

  }

  renderPreviewPage = (libraryName: string) => {
    switch (libraryName) {
      case 'bootstrap':
        return (
          <main className='p-2'>
            <Page1 />
            <hr />
            <Page2 />
            <hr />
            <Page3 />
            <hr />
            <Page4 />
            <hr />
            <Page5 />
            <hr />
            <Page6 />
          </main>
        )
      case 'jimu-ui':
        return (
          <main className='p-2'>
            <Page7 />
          </main>
        )
      case 'jimu-ui-for-builder':
        return <main className='p-3'>
          <ForBuilderPage1 />
        </main>
      case 'icons':
        return <main className='p-3'>
          <IconsPage1 />
        </main>
      default:
        return <div>Nothing to preview</div>
    }
  }

  render() {
    const librariesToPreview = this.props.config.libraries;

    return (
      <div className='bg-white p-3'>
        <Tabs onTabSelect={this.onTabSelected}>
          {librariesToPreview.map((libraryName, i) => {
            return <Tab key={'' + i} title={libraryName} active={i === 0}>
              {this.renderPreviewPage(libraryName)}
            </Tab>;
          })}
        </Tabs>
      </div>
    )
  }
}
