import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { io } from 'socket.io-client';
import ChatBot from './ChatBot';
import ChatButton from './ChatButton';
import Footer from './Footer';
import Header from './Header';

const Layout = () => {
  const token = localStorage.getItem('access_token');
  const user = useSelector((state) => state.auth.user);

  const [socket, setSocket] = useState(null);
  useEffect(() => {
    if (token) {
      const newSocket = io(
      'https://demo-deploy-be.onrender.com',
        {
          extraHeaders: {
            Authorization: `Bearer ${token}`,
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
        newSocket.disconnect();
      };
    }
  }, [token]);

  return (
    <div>
      <Header socket={socket} />
      <Outlet />
      <Footer />
      <div className="fixed bottom-6 right-6 z-50">
        <ChatButton token={token} socket={socket} user={user} />
      </div>
      <div className="fixed bottom-6 right-6 z-50">
        <ChatBot />
      </div>

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
