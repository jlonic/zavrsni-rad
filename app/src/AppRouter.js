import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './components/Login';
import Registration from './components/Registration';
import Logout from './components/Logout';
import ChangePassword from './components/ChangePassword';
import Artist from './components/Artist';
import Album from './components/Album';
import Track from './components/Track';
import Search from './components/Search';
import User from './components/User';
import Charts from './components/Charts';
import Dashboard from './components/Dashboard';
import Notifications from './components/Notifications';
import Inbox from './components/Inbox';
import Messages from './components/Messages';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/registration" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/artists/:artist_id" element={<Artist />} />
                <Route path="/albums/:album_id" element={<Album />} />
                <Route path="/tracks/:track_id" element={<Track />} />
                <Route path="/search" element={<Search />} />
                <Route path="/users/:username" element={<User />} />
                <Route path="/charts" element={<Charts />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/messages" element={<Inbox />} />
                <Route path="/messages/:receiver_id" element={<Messages />} />
            </Routes>
        </BrowserRouter>
    );
};


export default AppRouter;
