import React, { useState } from "react";
import { FaRegQuestionCircle } from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";
import { IoMdSend } from "react-icons/io";
import { useSelector } from "react-redux";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn về thời trang hôm nay?" }
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);

  const handleSend = async () => {
    if (!input.trim()) return;

    const timestamp = new Date().toISOString();
    const userMessage = { from: "user", text: input, timestamp };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");

    // Gửi yêu cầu đến OpenAI API (hoặc server proxy của bạn)
    const response = await fetch("http://localhost:8800/api/v1/chatbot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: input })
    });

    const data = await response.json();
    const botMessage = { from: "bot", text: data.reply || "Xin lỗi, tôi chưa hiểu ý bạn.",  timestamp: new Date().toISOString() };
    setMessages([...updatedMessages, botMessage]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="text-sm font-sans">
      {isOpen ? (
        <div className="w-80 h-[400px] bg-white border-3 border-[#006156] shadow-xl rounded-xl flex flex-col">
          <div className="bg-black text-white px-4 py-2 rounded-t-xl flex justify-between items-center">
          {/* Bên trái: Avatar + Tên + Trạng thái */}
          <div className="flex items-center space-x-3">
            <img
              src="images/sac.png" // ← đổi đường dẫn ảnh tại đây
              alt="Avatar"
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            <div className="leading-tight">
              <div className="font-semibold">Trợ lý ảo Sắc</div>
              <div className="text-xs text-green-400">(Online)</div>
            </div>
          </div>

          {/* Nút đóng */}
          <button onClick={() => setIsOpen(false)} className="text-white text-xl">×</button>
        </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, index) => (
              <div
              key={index}
              className={`flex items-start gap-2 ${msg.from === "bot" ? "" : "flex-row-reverse"}`}
            >
              <div className="relative">
                <img
                  src={msg.from === "bot" ? "images/sac.png" : user?.avatar || "/images/default-user.png"}
                  alt={msg.from === "bot" ? "Bot Avatar" : "User Avatar"}
                  className="w-8 h-8 rounded-full border border-white"
                />
                {msg.from === "bot" && (
                  <span className="absolute bottom-0 right-0 block w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>

                <div className="flex flex-col items-start max-w-[75%]">
                  <div
                    className={`p-2 rounded-lg ${
                      msg.from === "bot"
                        ? "bg-gray-100 text-left text-black"
                        : "bg-[#013f37] text-right text-white"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div
                    className={`text-[10px] mt-1 text-gray-500 ${
                      msg.from === "bot" ? "text-left" : "text-right self-end"
                    }`}
                  >
                    {msg.timestamp && new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-2 border-t flex items-center gap-2">
            <input
              className="flex-1 border rounded-lg px-3 py-1 text-sm focus:outline-none"
              type="text"
              value={input}
              placeholder="Hỏi tôi về phối đồ, màu sắc, sự kiện..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button onClick={handleSend}>
              <IoMdSend className="text-xl text-blue-500" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-black text-white p-2 rounded-full shadow-lg hover:scale-105 transition"
        >
          <FaRegQuestionCircle size={39} />
        </button>

      )}
    </div>
  );
};

export default ChatBot;