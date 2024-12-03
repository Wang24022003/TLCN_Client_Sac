import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectUser = () => {
     const authState = useSelector((state) => state?.auth);

    if (authState.user) {
        return <Outlet/>
    } else {
        return <Navigate to='/login' replace={true} />
    }
};

export default ProtectUser;