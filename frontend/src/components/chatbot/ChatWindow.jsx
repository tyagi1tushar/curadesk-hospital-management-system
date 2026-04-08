import { useState, useEffect, useRef } from "react";
import axios from "axios";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

const ChatWindow = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi 👋 Tell me your symptoms.",
    },
  ]);

  const [loading, setLoading] = useState(false);

  // 🔥 AUTO SCROLL REF
  const bottomRef = useRef(null);

  // 🔥 AUTO SCROLL EFFECT
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  const sendMessage = async (text) => {
    const userMsg = { sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:4000/api/chatbot",
        {
          message: text,
        }
      );

      const botMsg = {
        sender: "bot",
        text: res.data.reply,
        doctors: res.data.doctors,
        type: res.data.type,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("CHAT ERROR:", err);
    }

    setLoading(false);
  };

  return (
    <div
      className="fixed bottom-20 right-6 w-80 
  backdrop-blur-xl bg-white/20 
  border border-white/30 
  rounded-2xl shadow-2xl flex flex-col z-50"
    >

      {/* HEADER */}
      <div className="flex justify-between items-center p-3 border-b border-white/20 backdrop-blur-md">
        <span className="font-semibold text-gray-800">Health Assistant</span>
        <button onClick={onClose} className="text-red-500">✖</button>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 p-3 overflow-y-auto max-h-96">
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}

        {/* 🔥 TYPING INDICATOR */}
        {loading && (
          <div className="text-sm text-gray-500">
            Bot is typing...
          </div>
        )}

        {/* 🔥 AUTO SCROLL ANCHOR */}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <ChatInput sendMessage={sendMessage} />
    </div>
  );
};

export default ChatWindow;