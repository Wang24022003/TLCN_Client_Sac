import React, { useEffect, useRef, useState } from "react";
import { FaRegQuestionCircle, FaThumbsUp } from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";
import { IoMdSend } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { chatbot } from "../features/user/userSlice";
import "./../Css/CssChatBot.css";
import { useNavigate } from "react-router-dom";
const ChatBot = () => {
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("chatMessages");
      return savedMessages
        ? JSON.parse(savedMessages)
        : [{ from: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn về thời trang hôm nay?" }];
  });


useEffect(() => {
  localStorage.setItem("chatMessages", JSON.stringify(messages));
}, [messages]);
  const textareaRef = useRef(null);

  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

useEffect(() => {
  if (textareaRef.current) {
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
  }
}, [input]);


//  const handleSend = async () => {
//   if (!input.trim()) return;
//   // if (!user) {
//   //     const timestamp = new Date().toISOString();
//   //     const warningMsg = {
//   //       from: "bot",
//   //       text: "Để sử dụng Trợ lý ảo Sắc, bạn vui lòng đăng nhập hoặc đăng ký tài khoản nhé!",
//   //       timestamp,
//   //     };
//   //     // Gửi tin nhắn người dùng trước rồi tới tin nhắn bot cảnh báo
//   //     const userMessage = { from: "user", text: input, timestamp };
//   //     setMessages((prev) => [...prev, userMessage, warningMsg]);
//   //     setInput("");
//   //     return;
//   //   }
//   const timestamp = new Date().toISOString();
//   const userMessage = { from: "user", text: input, timestamp };
//   const updatedMessages = [...messages, userMessage];
//   setMessages(updatedMessages);
//   setInput("");
//   setIsLoading(true);

//   try {
//     const res = await dispatch(chatbot(input));

//     setIsLoading(false);

//     if (res.payload?.data?.answer) {
//       const botMessage = {
//         from: "bot",
//         text: res.payload.data.answer,
//         timestamp: new Date().toISOString(),
//       };
//       setMessages([...updatedMessages, botMessage]);
//     } else {
//       const errorMsg = {
//         from: "bot",
//         text: "Xin lỗi, tôi chưa hiểu ý bạn.",
//         timestamp: new Date().toISOString(),
//       };
//       setMessages([...updatedMessages, errorMsg]);
//     }
//   } catch (error) {
//     setIsLoading(false); 
//     const errorMsg = {
//       from: "bot",
//       text: "Đã xảy ra lỗi khi gọi trợ lý. Vui lòng thử lại.",
//       timestamp: new Date().toISOString(),
//     };
//     setMessages([...updatedMessages, errorMsg]);
//   }
// };

const handleSend = async (customText) => {
  const messageText = customText ?? input;
  if (!messageText.trim()) return;

  const timestamp = new Date().toISOString();
  const userMessage = { from: "user", text: messageText, timestamp };
  const updatedMessages = [...messages, userMessage];
  setMessages(updatedMessages);
  setInput("");
  setIsLoading(true);

  try {
    const res = await dispatch(chatbot(messageText)); // dùng messageText thay vì input

    setIsLoading(false);

    if (res.payload?.data?.answer) {
      const botMessage = {
        from: "bot",
        text: res.payload.data.answer,
        timestamp: new Date().toISOString(),
      };
      setMessages([...updatedMessages, botMessage]);
    } else {
      const errorMsg = {
        from: "bot",
        text: "Xin lỗi, tôi chưa hiểu ý bạn.",
        timestamp: new Date().toISOString(),
      };
      setMessages([...updatedMessages, errorMsg]);
    }
  } catch (error) {
    setIsLoading(false);
    const errorMsg = {
      from: "bot",
      text: "Đã xảy ra lỗi khi gọi trợ lý. Vui lòng thử lại.",
      timestamp: new Date().toISOString(),
    };
    setMessages([...updatedMessages, errorMsg]);
  }
};

const handleKeyPress = (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault(); // tránh xuống dòng
    handleSend();
  }
};


  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  
  function extractLinks(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex) || [];
}

const navigate = useNavigate();

const renderMessageWithLinks = (text) => {
  return text.replace(
    /\*\*(.*?)\*\* - ID: `([a-f0-9]{24})`/g,
    (_, name, id) =>
      `<strong>${name}</strong> - <a href="#" onclick="navigateToProduct('${id}')" class="text-green-600 underline">Xem chi tiết</a>`
  );
};


useEffect(() => {
  window.navigateToProduct = (id) => {
    navigate("/product/" + id);
  };
}, []);

const chatBoxRef = useRef(null);

const handleScroll = () => {
  if (chatBoxRef.current) {
    const scrollTop = chatBoxRef.current.scrollTop;
    localStorage.setItem("chatScrollPosition", scrollTop);
  }
};

useEffect(() => {
  if (isOpen) {
    setTimeout(() => {
      const savedScroll = localStorage.getItem("chatScrollPosition");
      if (chatBoxRef.current && savedScroll) {
        chatBoxRef.current.scrollTop = parseInt(savedScroll, 10);
      }
    }, 100); // Delay nhẹ để khung chat render xong
  }
}, [isOpen]);


  return (
    <div className="text-sm font-sans">
      {isOpen ? (
        <div className="w-80 h-[400px] bg-white border-3 border-[#006156] shadow-xl rounded-xl flex flex-col">
          <div style={{ backgroundColor: "#002E27" }} className=" text-white px-4 py-2 rounded-t-xl flex justify-between items-center">
          {/* Bên trái: Avatar + Tên + Trạng thái */}
          <div className="flex items-center space-x-3">
            <img
              src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748926638/sac_i6km92.png" // ← đổi đường dẫn ảnh tại đây
              alt="Avatar"
              className="w-10 h-10 rounded-full border-2 border-black"
            />
            <div className="leading-tight">
              <div className="font-semibold">Trợ lý ảo Sắc</div>
              <div className="text-xs text-green-400">(Online)</div>
            </div>
          </div>

          {/* Nút đóng */}
          <button onClick={() => setIsOpen(false)} className="text-white text-xl">×</button>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-3  scrollbar-hide"  
        ref={chatBoxRef}
        onScroll={handleScroll}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start ${msg.from === "bot" ? "flex-row" : "flex-row-reverse"} gap-2`}
            >
              {/* Avatar */}
              {/* <div className="relative flex-shrink-0">
                <img
                  src={msg.from === "bot" ? "https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748926638/sac_i6km92.png" : user?.avatar || "https://www.w3schools.com/howto/img_avatar.png"}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover border-[2px] border-#181818FF"
                />
                {msg.from === "bot" && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
                {msg.from === "user" && (
                  <span className="absolute bottom-0 left-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div> */}


              {/* Nội dung tin nhắn */}
              <div className="flex flex-col max-w-[calc(100%-2.5rem)]">
                <div
                  className={`p-2 rounded-lg break-words whitespace-pre-wrap shadow-md transition duration-300 ease-in-out transform hover:scale-[1.02] ${
                    msg.from === "bot"
                      ? "bg-gray-100 text-left text-black rounded-bl-none"
                      : "bg-gradient-to-r from-[#00796B] to-[#004D40] text-left text-white rounded-br-none"
                  }`}
                >
                <span
                  dangerouslySetInnerHTML={{
                    __html: renderMessageWithLinks(
                      msg.text.replace(
                        /(https?:\/\/[^\s]+)/g,
                        (url) =>
                          `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline break-all">${url}</a>`
                      )
                    ),
                  }}
                />

                </div>

                <div
                  className={`text-[10px] mt-1 text-gray-500 ${
                    msg.from === "bot" ? "text-left" : "text-right self-end"
                  }`}
                >
                  {msg.timestamp &&
                    new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </div>
              </div>

            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {isLoading && (
          <div className="flex items-start flex-row gap-2">
            {/* Avatar bot */}
            <div className="relative flex-shrink-0">
              <img
                src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748926638/sac_i6km92.png"
                alt="Bot Avatar"
                className="w-8 h-8 rounded-full object-cover border-[2px] border-black"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            </div>

            {/* Dấu 3 chấm nhảy */}
            <div className="flex flex-col max-w-[calc(100%-2.5rem)]">
              <div className="bg-gray-100 text-black p-2 rounded-lg">
                <span className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                </span>
              </div>
            </div>
          </div>
        )}

          <div className="p-2 border-t flex items-center gap-2">
           <textarea
              ref={textareaRef}
              className="flex-1 border rounded-lg px-3 py-1 text-sm focus:outline-none resize-none max-h-32 overflow-y-auto scrollbar-hide"
              value={input}
              placeholder="Hỏi Sắc về thời trang..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              rows={1}
            />


            {input.trim() === "" ? (
              <button
                onClick={() => handleSend("👍")}
                className="text-2xl text-green-600 hover:text-green-700 transition duration-200"
                title="Gửi Like"
              >
                <FaThumbsUp />
              </button>

            ) : (
              <button
                onClick={handleSend}
                style={{ color: "#002E27" }}
                className="text-xl hover:scale-110 transition"
                onMouseEnter={(e) => (e.currentTarget.style.color = "#005248")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#002E27")}
                title="Gửi tin nhắn"
              >
                <IoMdSend />
              </button>
            )}


          </div>
        </div>
      ) : (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-black p-2 rounded-full shadow-lg hover:scale-105 transition relative w-14 h-14 flex items-center justify-center"
        style={{
          boxShadow: "0 4px 15px rgba(255, 0, 128, 0.7), 0 0 10px rgba(255, 140, 0, 0.6), 0 0 20px rgba(64, 224, 208, 0.8)",
        }}
      >
        {/* Hai viền hình vuông nằm trong vòng tròn */}
        <span
          className="absolute w-10 h-10 border-2 pointer-events-none"
          style={{
            borderImage: "linear-gradient(270deg, #ff0080, #ff8c00, #40e0d0) 1",
            animation: "borderSpin 6s linear infinite",
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(0deg)',
            borderRadius: '0', // hình vuông
          }}
        />
        <span
          className="absolute w-10 h-10 border-2 pointer-events-none"
          style={{
            borderImage: "linear-gradient(270deg, #40e0d0, #ff0080, #ff8c00) 1",
            animation: "borderSpinReverse 8s linear infinite",
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(45deg)',
            borderRadius: '0', // hình vuông
          }}
        />

        {/* Chữ AI nằm trên cùng */}
        <span
          className="relative text-lg font-bold bg-clip-text text-transparent"
          style={{
            backgroundImage: "linear-gradient(270deg, #ff0080, #ff8c00, #40e0d0)",
            backgroundSize: "600% 600%",
            animation: "gradientText 4s ease infinite",
          }}
        >
          AI
        </span>
      </button>



      )}
    </div>
  );
};

export default ChatBot;