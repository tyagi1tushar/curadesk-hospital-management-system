import { useState, useEffect } from "react";
import axios from "axios";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

const ChatWindow = ({ onClose }) => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chatHistory");
    return saved
      ? JSON.parse(saved)
      : [
          {
            sender: "bot",
            text: "Hi 👋 Tell me your symptoms.",
          },
        ];
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async (text) => {
    const userMsg = { sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);

    setLoading(true);

    try {
      const res = await axios.post("/api/chatbot", {
        message: text,
      });

      const botMsg = {
        sender: "bot",
        text: res.data.reply,
        doctors: res.data.doctors,
        type: res.data.type,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="fixed bottom-20 right-6 w-80 bg-white rounded-xl shadow-2xl flex flex-col z-50">
      
      <div className="flex justify-between p-3 border-b">
        <span>Health Assistant</span>
        <button onClick={onClose}>❌</button>
      </div>

      <div className="flex-1 p-3 overflow-y-auto max-h-96">
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}

        {loading && (
          <div className="text-sm text-gray-500">
            Bot is typing...
          </div>
        )}
      </div>

      <ChatInput sendMessage={sendMessage} />
    </div>
  );
};

export default ChatWindow;