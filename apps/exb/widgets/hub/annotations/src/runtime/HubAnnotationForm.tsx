import { React } from 'jimu-core';
import { Image, ImageProps } from 'jimu-ui';
import { Card as BSCard, Alert, CardBody, Form, FormGroup, Label, Input, Button } from 'reactstrap';

export class HubAnnotationForm extends React.PureComponent<{thumbnailProps?: ImageProps, onSave: (description: string) => Promise<any> }, { description: string, statusMessage: string }>{

  constructor(props) {
    super(props);
    this.state = {
      description: '',
      statusMessage: ''
    };

    this.onInput = this.onInput.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  // capture the description as it changes
  onInput(event) {
    this.setState({description: event.target.value});
  }

  // add the annotation
  onClick(event) {
    event.preventDefault();
    if (this.props.onSave) {
      this.props.onSave(this.state.description)
      .then(() => {
        // show status message and clear form
        this.setState({
          // TODO: i18n
          statusMessage: 'Your comments have been received. Thank you!',
          description: ''
        });
      });
    }
  }

  // dismiss status message and show form
  onDismiss() {
    this.setState({
      statusMessage: ''
    });
  }

  render(){
    const {
      thumbnailProps
    } = this.props;


    const content = this.state.statusMessage ?
    <Alert color="success" isOpen={!!this.state.statusMessage} toggle={this.onDismiss}>
      {this.state.statusMessage}
    </Alert> : (
    // TODO: can we just use jimu card for this and use the form as the content?
    <BSCard className="jimu-card card-horizontal">
      <Image
        className="card-img"
        src={thumbnailProps.src}
        alt={thumbnailProps.alt}
        title={thumbnailProps.title}
        shape='circle'
        width='32' />
      <CardBody className="d-flex flex-column">
        <Form>
          <FormGroup>
            <Label>Add Comment</Label>
            <Input type='textarea' onInput={this.onInput} value={this.state.description} />
          </FormGroup>
          <Button color="primary" onClick={this.onClick}>Save</Button>
        </Form>
      </CardBody>
    </BSCard>);
    return content;
  }
}
