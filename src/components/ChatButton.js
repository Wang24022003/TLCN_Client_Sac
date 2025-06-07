import {
  CloseOutlined,
  CustomerServiceOutlined,
  MenuOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { notification, Tooltip } from 'antd';
import { useFormik } from 'formik';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { toast } from 'react-toastify';
import { chatService } from '../features/chat/chatService';
import { formatMessageTime } from '../utils/dayConvert';
import IconButtonUpload from './IconButtonUpload';
import { Drawer, Button, List } from 'antd';

const suggestions = [
  { id: 1, question: 'Làm thế nào để đăng ký?' },
  { id: 2, question: 'Phí dịch vụ là bao nhiêu?' },
  { id: 3, question: 'Tôi cần chuẩn bị giấy tờ gì?' },
];

const Context = React.createContext({ name: 'Default' });
function ChatButton({ token, socket, user }) {
  const [api, contextHolder] = notification.useNotification();
  const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

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
  const [openDrawer, setOpenDrawer] = useState(false);

  const openNotification = useCallback(
    (placement, sender, message) => {
      if (showChat) {
        return;
      }

      api.info({
        message: (
          <span>
            Tin nhắn từ <b>{sender.name}</b>
          </span>
        ),
        description: (
          <Context.Consumer>{({ name }) => `${message}`}</Context.Consumer>
        ),
        placement,
      });
    },
    [api, showChat],
  );

  const handleChatToggle = useCallback(async () => {
    const messageRes = await chatService.getMessages(chatRoom._id);
    if (messageRes.error) {
      toast.error('Something Went Wrong');
    }

    setMessages(messageRes.data.result);
    setShowChat(true);
  }, [chatRoom]);

  const handleCloseChat = useCallback(() => {
    setShowChat(false);
    setMessages([]);
  }, []);

  const handleImageUpload = async ({ file }) => {
    if (file.status === 'done') {
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
      questionId: '',
    },
    onSubmit: async (values, { resetForm }) => {
      await chatService.sendMessage({
        content: values.message,
        chatRoom: chatRoom._id,
        messageType: 'text',
        fileUrl: [],
        questionId: values.questionId,
      });
      resetForm();
    },
  });

  useEffect(() => {
    const init = async () => {
      const res = await chatService.getChatRoom();
      if (res.error) {
        toast.error('Something Went Wrong');
        return;
      }

      const newChatRoom = res.data;
      setChatRoom(newChatRoom);
      socket.on(`chat-rooms/${newChatRoom._id}`, (newMsg) => {
        setMessages((messages) => [...messages, newMsg]);
        openNotification('topRight', newMsg.sender, newMsg.content);
      });
    };

    if (socket) {
      init();
    }
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!token || !user) {
    return;
  }

  return (
    <div>
      {!showChat && (
        <>
          <button
            onClick={handleChatToggle}
            style={{
              position: 'fixed',
              bottom: '90px',
              right: '25px',
              backgroundColor: 'transparent', // No background for the button
              border: 'none',
              borderRadius: '50%',
              padding: 0, // Remove padding to fit icon exactly
              cursor: 'pointer',
              zIndex: 1000,
            }}
          >
            <Tooltip title="Nhấn để hỗ trợ" placement="top">
              <CustomerServiceOutlined
                style={{
                  fontSize: '34px',
                  color: '#002E29',
                  cursor: 'pointer',
                  boxShadow: 'rgba(17, 1, 9, 0.2) 0px 4px 8px 0px',
                  borderRadius: '50%',
                  padding: '10px',
                  backgroundColor: 'white',
                }}
              />
            </Tooltip>
          </button>
          <Context.Provider value={contextValue}>
            {contextHolder}
          </Context.Provider>
        </>
      )}

      {showChat && (
        <div
          className="chat-container"
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '25px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            width: '370px',
            height: '450px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            padding: '15px',
            zIndex: 999,
            animation: 'slideIn 0.5s ease-out',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '2px solid #ddd',
              paddingBottom: '10px',
              marginBottom: '10px',
            }}
          >
            <h4 style={{ margin: 0 }}>Hỗ trợ (CSKH)</h4>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button size="small" onClick={() => setOpenDrawer(true)}>
                Gợi ý
              </Button>
              <button onClick={handleCloseChat}>
                <CloseOutlined />
              </button>
            </div>
          </div>

          <div
            ref={chatContainerRef}
            style={{
              flexGrow: 1,
              height: '300px',
              overflowY: 'auto',
              paddingRight: '5px',
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
                      ? '#002E29'
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

            <Drawer
              title="Câu hỏi gợi ý"
              placement="left"
              onClose={() => setOpenDrawer(false)}
              open={openDrawer}
            >
              <List
                dataSource={suggestions}
                renderItem={(item) => (
                  <List.Item
                    key={item.id}
                    onClick={() => {
                      formik.setFieldValue('message', item.question);
                      formik.setFieldValue('questionId', item.id);
                      setTimeout(() => {
                        formik.submitForm();
                      }, 0);
                      setOpenDrawer(false);
                    }}
                  >
                    {item.question}
                  </List.Item>
                )}
              />
            </Drawer>
          </div>

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
              <IconButtonUpload onChange={handleImageUpload} />

              <input
                type="text"
                placeholder="Soạn tin nhắn..."
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

              <SendOutlined
                type="submit"
                style={{
                  fontSize: '24px',
                  color: '#002E29',
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
