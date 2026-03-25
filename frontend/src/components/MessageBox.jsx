import React from "react";

const MessageBox = ({ msg, currentUser }) => {
  const isME = msg.sender === currentUser;
  return (
    <div className={`flex flex-col ${isME ? "items-end" : "items-start"}`}>
      {!isME && (
        <span className="text-sm text-gray-900 mb-1 px-1">{msg.sender}</span>
      )}

      <div
        className={`px-4 py-2.5 rounded-2xl max-w-xs lg:max-w-md text-sm leading-relaxed wrap-break-word ${isME ? "bg-[#007E6E] text-white rounded-br-sm" : "bg-[#1e1e1e] text-gray-100 rounded-bl-sm"}`}
      >
        {msg.text}
      </div>
      <span className="text-gray-600 text-xs mt-1 px-1">
        {new Date(msg.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>
  );
};

export default MessageBox;
