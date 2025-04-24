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
                    <Image
                        src="https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"
                        roundedCircle
                        width={32}
                        height={32}
                        alt="User"
                    />
                }
            >
            {dropdownItems}

            </NavDropdown>
        </Navbar>
    );
}

export default NavBarGraph;
