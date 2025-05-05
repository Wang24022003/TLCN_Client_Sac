import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { io } from 'socket.io-client';

const Layout = () => {
  const token = localStorage.getItem('access_token');

  const [socket, setSocket] = useState(null);
  useEffect(() => {
    if (token) {
      const newSocket = io(
        process.env.REACT_APP_SOCKET_URL || 'http://localhost:3006',
        {
          extraHeaders: {
            Authorization: `Bearer ${token}`, // Send token in the Authorization header
          },
        },
      );

      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('Connected to server with token');
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      return () => {
        newSocket.disconnect(); // Disconnect the socket on unmount
      };
    }
  }, [token]);

  return (
    <div>
      <Header socket={socket} />
      <Outlet />
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Layout;
