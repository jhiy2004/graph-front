import React from 'react'
import NavBarGraph from '../../components/NavbarGraph/NavbarGraph.js';
import UserGraphsHeader from '../../components/UserGraphsHeader/UserGraphsHeader.js';

function UserGraphs() {
    return (
        <>
            <NavBarGraph logged={true}/>
            <UserGraphsHeader/>
        </>
    )
}

export default UserGraphs;