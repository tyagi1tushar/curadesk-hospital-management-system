import { useState } from "react";

const ChatInput = ({ sendMessage }) => {
  const [text, setText] = useState("");

  return (
    <div className="flex border-t">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 p-2 outline-none"
        placeholder="Type symptoms..."
      />
      <button
        onClick={() => {
          if (!text) return;
          sendMessage(text);
          setText("");
        }}
        className="bg-blue-500 text-white px-4"
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;