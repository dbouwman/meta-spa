import * as React from 'react';

export class Page1 extends React.PureComponent<{}, any> {
  render() {
    return (
      <div>
        <h2 className='mb-3'>Typography (non-components):</h2>
        {/* HEADINGS: START */}
        <h6 className='mt-5 mb-3'>Headings:</h6>
        <div className='mb-3'>
          <h1>h1. Bootstrap heading</h1>
          <h2>h2. Bootstrap heading</h2>
          <h3>h3. Bootstrap heading</h3>
          <h4>h4. Bootstrap heading</h4>
          <h5>h5. Bootstrap heading</h5>
          <h6>h6. Bootstrap heading</h6>
        </div>
        {/* HEADINGS: END */}
        {/* INLINE TEXT ELEMENTS: START */}
        <h6 className='mt-5 mb-3'>Inline Text Elements:</h6>
        <div className='mb-3'>
          <p>You can use the mark tag to <mark>highlight</mark> text.</p>
          <p><del>This line of text is meant to be treated as deleted text.</del></p>
          <p><s>This line of text is meant to be treated as no longer accurate.</s></p>
          <p><ins>This line of text is meant to be treated as an addition to the document.</ins></p>
          <p><u>This line of text will render as underlined</u></p>
          <p><small>This line of text is meant to be treated as fine print.</small></p>
          <p><strong>This line rendered as bold text.</strong></p>
          <p><em>This line rendered as italicized text.</em></p>
        </div>
        {/* INLINE TEXT ELEMENTS: END */}
      </div>
    )
  }
}