import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Image from 'react-bootstrap/Image';
import './NavBarGraph.css';

function NavBarGraph({logged}) {
    const dropdownItems = (logged) ? (
        <>
            <NavDropdown.Item>Ver grafos</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item>Sair</NavDropdown.Item>
        </>
    ) : (
            <>
                <NavDropdown.Item>Cadastrar</NavDropdown.Item>
                <NavDropdown.Item>Entrar</NavDropdown.Item>
            </>
        );


    return (
        <Navbar className="navbar-graph p-2">
            <Navbar.Brand href="#" className="text-white ms-3">[LOGO]</Navbar.Brand>

            <NavDropdown
                id="profile-dropdown"
                align="end"
                className="no-caret ms-auto me-3"
                title={
                    <div className="rounded-circle bg-white p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
                            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                        </svg>
                    </div>
                }
            >
            {dropdownItems}

            </NavDropdown>
        </Navbar>
    );
}

export default NavBarGraph;
