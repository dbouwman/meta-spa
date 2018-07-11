import * as React from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

export class Page3 extends React.PureComponent {
  render() {
    return (
      <div>
        <h2>Form</h2>
        {/* FORM: START */}
        <Form>
          <FormGroup>
            {/* Text */}
            <Label for='exampleText'>Text</Label>
            <Input type='text' name='text' id='exampleText' placeholder='placeholder' />
          </FormGroup>
          <FormGroup>
            {/* Email */}
            <Label for='exampleEmail'>Email</Label>
            <Input type='email' name='email' id='exampleEmail' placeholder='placeholder' />
          </FormGroup>
          <FormGroup>
            {/* Password */}
            <Label for='examplePassword'>Password</Label>
            <Input type='password' name='password' id='examplePassword' placeholder='placeholder' />
          </FormGroup>
          <FormGroup>
            {/* Select */}
            <Label for='exampleSelect'>Select</Label>
            <Input type='select' name='select' id='exampleSelect'>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </Input>
          </FormGroup>
          <FormGroup>
            {/* Text Area */}
            <Label for='exampleTextArea'>Text Area</Label>
            <Input type='textarea' name='text' id='exampleTextArea' />
          </FormGroup>
          <FormGroup tag='fieldset'>
            {/* Radios */}
            Radio Buttons:
            <FormGroup check>
              <Label check>
                <Input type='radio' name='radio1' defaultChecked />{' '}
                Option one
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label>
                <Input type='radio' name='radio1' />{' '}
                Option two
             </Label>
            </FormGroup>
            <FormGroup check disabled>
              <Label>
                <Input type='radio' name='radio1' disabled />{' '}
                Option three (disabled)
             </Label>
            </FormGroup>
          </FormGroup>
          {/* Checks */}
          Checkboxes:
          <FormGroup tag='fieldset'>
            <FormGroup check>
              <Label check className='mr-5'>
                <Input type='checkbox' defaultChecked/>{' '}
                Checkbox 1
              </Label>
              <Label className='mr-5'>
                <Input type='checkbox' />{' '}
                Checkbox 2
              </Label>
              <Label>
                <Input type='checkbox' defaultChecked />{' '}
                Checkbox 3
              </Label>
            </FormGroup>
          </FormGroup>
        </Form>
        {/* FORM: END */}
      </div>
    )
  }
}