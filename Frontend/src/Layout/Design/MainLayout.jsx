import React from 'react';
import Navbar from '../../Component/NavBar/Navbar';
import Footer from '../../Component/Footer/Footer';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div className='ubuntu'>
            <Navbar />
            <div className="mt-20">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default MainLayout;