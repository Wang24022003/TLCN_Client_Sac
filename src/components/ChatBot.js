import React, { useState } from "react";
import { FiMessageSquare } from "react-icons/fi";
import { IoMdSend } from "react-icons/io";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn về thời trang hôm nay?" }
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
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
    const botMessage = { from: "bot", text: data.reply || "Xin lỗi, tôi chưa hiểu ý bạn." };
    setMessages([...updatedMessages, botMessage]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="text-sm font-sans">
      {isOpen ? (
        <div className="w-80 h-[400px] bg-white border shadow-xl rounded-xl flex flex-col">
          <div className="bg-black text-white px-4 py-2 rounded-t-xl flex justify-between items-center">
            <span>Trợ lý thời trang</span>
            <button onClick={() => setIsOpen(false)} className="text-white">×</button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg max-w-[75%] ${
                  msg.from === "bot" ? "bg-gray-100 text-left" : "bg-blue-100 ml-auto text-right"
                }`}
              >
                {msg.text}
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
          className="bg-black text-white p-3 rounded-full shadow-lg hover:scale-105 transition"
        >
          <FiMessageSquare className="text-xl" />
        </button>
      )}
    </div>
  );
};

export default ChatBot;