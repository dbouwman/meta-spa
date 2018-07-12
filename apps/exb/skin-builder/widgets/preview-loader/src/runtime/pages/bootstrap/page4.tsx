import * as React from 'react';
import {
  Nav, NavItem, NavLink,
  Dropdown, DropdownItem, DropdownToggle, DropdownMenu,
  Breadcrumb, BreadcrumbItem
} from 'reactstrap';

export class Page4 extends React.PureComponent {
  render() {
    return (
      <div>
        <h2>Navs</h2>
        {/* Navs: START */}
        <h6>Links:</h6>
        <Nav className='mb-3'>
          <NavItem>
            <NavLink href='#'>Link</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href='#'>Link</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href='#'>Another Link</NavLink>
          </NavItem>
          <NavItem>
            <NavLink disabled href='#'>Disabled Link</NavLink>
          </NavItem>
        </Nav>
        <h6>Tabs:</h6>
        <Nav tabs className='mb-3'>
          <NavItem>
            <NavLink href='#' active>Link</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href='#'>Link</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href='#'>Another Link</NavLink>
          </NavItem>
          <NavItem>
            <NavLink disabled href='#'>Disabled Link</NavLink>
          </NavItem>
        </Nav>
        <h6>Pills:</h6>
        <Nav pills className='mb-3'>
          <NavItem>
            <NavLink href='#' active>Link</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href='#'>Link</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href='#'>Another Link</NavLink>
          </NavItem>
          <NavItem>
            <NavLink disabled href='#'>Disabled Link</NavLink>
          </NavItem>
        </Nav>
        <h6>Breadcrumb:</h6>
        <Breadcrumb>
          <BreadcrumbItem><a href='#'>Home</a></BreadcrumbItem>
          <BreadcrumbItem><a href='#'>Library</a></BreadcrumbItem>
          <BreadcrumbItem active>Data</BreadcrumbItem>
        </Breadcrumb>
        {/* NAVS: END */}
      </div>
    )
  }
}