import React from 'react';
import { Outlet } from 'react-router-dom';

const Agent = () => {
    return (
        <div>
            <Outlet></Outlet>
        </div>
    );
};

export default Agent;