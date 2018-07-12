import * as React from 'react';
import {
  Button, ButtonGroup, ButtonDropdown,
  DropdownToggle, DropdownMenu, DropdownItem,
  Pagination, PaginationItem, PaginationLink
} from 'reactstrap';

export class Page2 extends React.PureComponent<{}, any> {
  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false
    };

    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  toggleDropdown() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  render() {
    return (
      <div>
        <h2>Button</h2>
        {/* BUTTONS: START */}
        <h6>Default Button:</h6>
        <div className='mb-3'>
          <Button>default</Button>
        </div>
        <h6>With Colors:</h6>
        <div className='mb-3'>
          <Button color='primary'>primary</Button>{' '}
          <Button color='secondary'>secondary</Button>{' '}
          <Button color='success'>success</Button>{' '}
          <Button color='info'>info</Button>{' '}
          <Button color='warning'>warning</Button>{' '}
          <Button color='danger'>danger</Button>{' '}
          <Button color='link'>link</Button>
        </div>
        <h6>Outline Buttons:</h6>
        <div className='mb-3'>
          <Button outline color='primary'>primary</Button>{' '}
          <Button outline color='secondary'>secondary</Button>{' '}
          <Button outline color='success'>success</Button>{' '}
          <Button outline color='info'>info</Button>{' '}
          <Button outline color='warning'>warning</Button>{' '}
          <Button outline color='danger'>danger</Button>
        </div>
        <h6>Button Group:</h6>
        <div className='mb-3'>
          <ButtonGroup>
            <Button>Left</Button>
            <Button>Middle</Button>
            <Button>Right</Button>
          </ButtonGroup>
        </div>
        <h6>Button Dropdown:</h6>
        <div className='mb-3'>
          <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
            <DropdownToggle caret>
              Button Dropdown
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>Header</DropdownItem>
              <DropdownItem disabled>Action</DropdownItem>
              <DropdownItem>Another Action</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Another Action</DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        </div>
        <h6>Pagination:</h6>
        <div>
          <Pagination>
            <PaginationItem>
              <PaginationLink previous href='#' />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href='#'>
                1
          </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href='#'>
                2
          </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href='#'>
                3
          </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink next href='#' />
            </PaginationItem>
          </Pagination>
        </div>
        {/* BUTTONS: END */}
      </div>
    )
  }
}