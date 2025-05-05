import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  CloseOutlined,
  SendOutlined,
  UploadOutlined,
  CustomerServiceOutlined,
} from '@ant-design/icons';
import { Tooltip } from 'antd';
import { useFormik } from 'formik';
import { chatService } from '../features/chat/chatService';
import { toast } from 'react-toastify';
import { formatMessageTime } from '../utils/dayConvert';
import { uploadImg } from '../utils/api';
import IconButtonUpload from './IconButtonUpload';

function ChatButton({ token, socket, user }) {
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  const [chatRoom, setChatRoom] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleChatToggle = useCallback(async () => {
    const res = await chatService.getChatRoom();
    if (res.error) {
      toast.error('Something Went Wrong');
    } else {
      const newChatRoom = res.data;
      const messageRes = await chatService.getMessages(newChatRoom._id);
      if (messageRes.error) {
        toast.error('Something Went Wrong');
      }

      setChatRoom(newChatRoom);
      setMessages(messageRes.data.result);
      setShowChat(true);
      socket.on(`chat-rooms/${newChatRoom._id}`, (newMsg) => {
        setMessages((messages) => [...messages, newMsg]);
      });
    }
  }, [socket]);

  const handleCloseChat = useCallback(() => {
    setShowChat(false);
    setChatRoom(null);
    setMessages([]);
    socket.off(`chat-rooms/${chatRoom._id}`);
  }, [socket, chatRoom]);

  const handleImageUpload = async ({ file }) => {
    if (file.status === 'done') {
      console.log(file);
      await chatService.sendMessage({
        content: '',
        chatRoom: chatRoom._id,
        messageType: 'file',
        fileUrl: [file.fileUrl],
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      message: '',
    },
    onSubmit: async (values, { resetForm }) => {
      await chatService.sendMessage({
        content: values.message,
        chatRoom: chatRoom._id,
        messageType: 'text',
        fileUrl: [],
      });
      resetForm();
    },
  });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!token || !user) {
    return;
  }

  return (
    <div>
      {/* Floating Chat Button - Only renders if showChat is false */}
      {!showChat && (
        <button
          onClick={handleChatToggle}
          style={{
            position: 'fixed',
            bottom: '250px',
            right: '25px',
            backgroundColor: 'transparent', // No background for the button
            border: 'none',
            borderRadius: '50%',
            padding: 0, // Remove padding to fit icon exactly
            cursor: 'pointer',
            zIndex: 1000,
          }}
        >
          {/* Tooltip to show text when hovering */}
          <Tooltip title="Nhấn để hỗ trợ" placement="top">
            {/* Customer Service Icon (Ant Design) with padding */}
            <CustomerServiceOutlined
              style={{
                fontSize: '34px', // Adjust size to match the image size (64px)
                color: '#ff5a5a', // Set a color similar to the image background
                cursor: 'pointer',
                boxShadow: 'rgba(17, 1, 9, 0.2) 0px 4px 8px 0px', // Shadow effect
                borderRadius: '50%', // Circular shape (optional)
                padding: '10px', // Add padding around the icon
                backgroundColor: 'white', // Optional: Add a background color for better visibility
              }}
            />
          </Tooltip>
        </button>
      )}

      {/* Chat interface (hidden or shown based on state) */}
      {showChat && (
        <div
          className="chat-container" // Added class for animation
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '25px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            width: '370px', // Increased width
            height: '450px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            padding: '15px',
            zIndex: 999,
            animation: 'slideIn 0.5s ease-out', // Animation when chat opens
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Chat Header with Divider */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '2px solid #ddd', // Divider in header
              paddingBottom: '10px',
              marginBottom: '10px',
            }}
          >
            <h4 style={{ margin: 0 }}>Hỗ trợ (CSKH)</h4>
            <div style={{ fontSize: '18px', cursor: 'pointer' }}>
              <button onClick={handleCloseChat}>
                <CloseOutlined /> {/* Close icon */}
              </button>
            </div>
          </div>

          {/* Chat messages */}
          <div
            ref={chatContainerRef}
            style={{
              flexGrow: 1,
              height: '300px',
              overflowY: 'auto',
              paddingRight: '5px', // To prevent scroll bar from covering the input
            }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: message.isSystem
                    ? 'center'
                    : message.sender &&
                      (message.sender === user._id ||
                        message.sender._id === user._id)
                    ? 'flex-end'
                    : 'flex-start',

                  marginBottom: '10px',
                }}
              >
                <div
                  style={{
                    maxWidth: '70%',
                    padding: '10px',
                    borderRadius: '10px',
                    backgroundColor: message.isSystem
                      ? '#f8f8f8'
                      : message.sender &&
                        (message.sender === user._id ||
                          message.sender._id === user._id)
                      ? '#ff5a5a'
                      : '#f0f0f0',
                    color: message.isSystem
                      ? '#777'
                      : message.sender &&
                        (message.sender === user._id ||
                          message.sender._id === user._id)
                      ? 'white'
                      : 'black',
                    border: message.isSystem
                      ? '1px solid #eee'
                      : '1px solid #ddd',
                    textAlign: 'left',
                    position: 'relative',
                    fontSize: message.isSystem ? '0.65em' : '1em', // Smaller font size for system messages
                    fontStyle: message.isSystem ? 'italic' : 'normal', // Italic for system messages
                    ...(message.isSystem && {
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    }), // Subtler shadow
                    minWidth: '70px',
                  }}
                >
                  {message.messageType === 'file' && (
                    <a
                      href={message.fileUrl[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'block' }} // Make the link fill the container
                      className="mb-3"
                    >
                      <img
                        src={message.fileUrl[0]}
                        style={{
                          maxWidth: '100px',
                          height: 'auto',
                          borderRadius: '5px',
                        }}
                      />
                    </a>
                  )}
                  {message.messageType === 'text' && (
                    <div className="mb-2">{message.content}</div>
                  )}
                  <div
                    style={{
                      fontSize: '10px',
                      position: 'absolute',
                      bottom: '5px',
                      right: '5px',
                      color: '#777',
                    }}
                  >
                    {formatMessageTime(message.createdAt)}
                  </div>
                </div>
              </div>
            ))}
            <div
              ref={messagesEndRef}
              style={{ float: 'left', clear: 'both' }}
            />
          </div>

          {/* Message Input Section with Send and Upload File Icons */}

          <form
            onSubmit={formik.handleSubmit}
            className="d-flex flex-column gap-15"
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                borderTop: '2px solid #ddd',
                paddingTop: '10px',
              }}
            >
              {/* File Upload Icon */}
              <IconButtonUpload onChange={handleImageUpload} />

              {/* Message Input Field */}
              <input
                type="text"
                placeholder="Type your message..."
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  marginRight: '10px',
                }}
                value={formik.values.message}
                onChange={formik.handleChange('message')}
                onBlur={formik.handleBlur('message')}
              />

              {/* Send Icon */}
              <SendOutlined
                type="submit"
                style={{
                  fontSize: '24px',
                  color: '#ff5a5a',
                  cursor: 'pointer',
                }}
              />
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ChatButton;
