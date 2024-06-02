import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './components/Login';
import Registration from './components/Registration';
import Logout from './components/Logout';
import ChangePassword from './components/ChangePassword';

const ChangePasswordPage = () => { //test 2+ components on one page
    return (
        <div>
            <Logout />
            <ChangePassword />
        </div>
    );
};


const AppRouter = () => { 
    return (
        <BrowserRouter>
            <Routes>
                <Route path = "/" element = {<Navigate to = "/registration" />} />
                <Route path = "/login" element = {<Login />} />
                <Route path = "/registration" element = {<Registration />} />
                <Route path = "/logout" element = {<Logout />} />
                <Route path = "/change-password" element = {<ChangePasswordPage />} />
            </Routes>
        </BrowserRouter>
    );
};


export default AppRouter;
