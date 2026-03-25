import React from "react";

const Sidebar = ({
  users,
  selectedUser,
  onlineUsers,
  onSelectUser,
  unreadCounts,
  currentUser,
}) => {
  const filteredUsers = users.filter((u) => u.username !== currentUser);
  return (
    <div className="w-72 h-full flex flex-col bg-[#e5fffb] border-r border-[#007e6d61]">
      <div className="px-7 py-4 border-gray-800">
        <h1 className="text-[#007E6E] text-xl font-bold">ChatBox</h1>
        <p className="text-sm text-gray-500 mt-0.5">Direct messages</p>
      </div>
      {/* Users List */}
      <div className="flex flex-col flex-1 overflow-y-auto px-5 py-3 gap-1">
        <p className="text-[#007E6E] text-xs uppercase tracking-widest mb-2 px-2 font-bold">
          All Users - {filteredUsers.length}
        </p>
        {filteredUsers.length === 0 && (
          <p className="text-sm text-gray-600 px-2">No users yet</p>
        )}
        {filteredUsers
          .map((user) => {
            const isOnline = onlineUsers.includes(user.username);
            const isSelected = selectedUser === user.username;
            const unread = unreadCounts[user.username] || 0;
            return (
              <button
                key={user._id}
                onClick={() => onSelectUser(user.username)}
                className={`w-full flex items-center mx-0 py-3 gap-3 transition-all text-start cursor-pointer hover:scale-103  border-[#007E6E]`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-[#007E6E] text-white">
                    {user.username[0].toUpperCase()}
                  </div>
                  {/* Online Dot */}
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${isOnline ? "bg-[#007E6E]" : "bg-[#1e1e1e]"} border-2 border-white`}
                  ></div>
                </div>
                {/* Name and status */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate text-[#007E6E]">
                    {user.username}
                  </p>
                  <p
                    className={`text-xs ${isOnline ? "text-green-400" : "text-black"}`}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </p>
                </div>
                {/* Unread badge */}
                {unread > 0 && !isSelected && (
                  <span className="bg-blue-600 text-xs text-white font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </button>
            );
          })}
      </div>
    </div>
  );
};

export default Sidebar;
