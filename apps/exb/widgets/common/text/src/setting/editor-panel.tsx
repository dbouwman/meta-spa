import { React, ReactDOM } from 'jimu-core';
import { utils, ColorPicker } from 'jimu-for-builder/';
import { Label, Input } from 'jimu-ui';
import { InlineFont, BlockHeadersSelect } from 'jimu-for-builder';

interface Props {
    editorState: Draft.EditorState;
    onChange: any;
}

export default class EditPanel extends React.Component<Props, any> {
    catchBlockType: string;
    constructor(props) {
        super(props);
    }


    render() {
        const { editorState } = this.props;
        return <div className="edit-panel">
            <Label className="label" for="headers-select">Quick style</Label>
            <BlockHeadersSelect editorState={editorState} onChange={this.props.onChange} />
            <Label className="label">Font</Label>
            <InlineFont editorState={editorState} onChange={this.props.onChange} />
        </div>
    }
}
