import { useState, useRef, useEffect } from "react";
import axios from "axios";
import useAuth from "../context/AuthContext";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { BsChat } from "react-icons/bs";
import MessageBox from "./MessageBox";
import { API } from '../api';

const Chat = () => {
  const { user, logout } = useAuth();
  const [socket, setSocket] = useState(null);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selecteduser, setSelectedUser] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});

  const bottomRef = useRef();
  const navigate = useNavigate();

  // Init socket
  useEffect(() => {
    const newSocket = io(`${API}`);
    setSocket(newSocket);

    newSocket.emit("userOnline", user.username);

    return () => {
      newSocket.disconnect();
    };
  }, [user.username]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("onlineUsers", (list) => {
      setOnlineUsers(list);
    });

    socket.on("receiveMessage", (msg) => {
      if (msg.sender !== user.username) {
        // Show message only if current chat
        if (msg.sender === selecteduser) {
          setMessages((prev) => [...prev, msg]);
        }

        // Unread count
        if (msg.sender !== selecteduser) {
          setUnreadCounts((prev) => ({
            ...prev,
            [msg.sender]: (prev[msg.sender] || 0) + 1,
          }));
        }
      }
    });

    return () => {
      socket.off("onlineUsers");
      socket.off("receiveMessage");
    };
  }, [socket, selecteduser, user.username]);

  // Fetch users
  useEffect(() => {
    axios
      .get(`${API}/api/auth/users`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then(({ data }) => setUsers(data))
      .catch((err) =>
        console.error(
          "User fetch error:",
          err.response?.status,
          err.response?.data,
        ),
      );
  }, [user.token]);

  // Fetch messages
  useEffect(() => {
    if (!selecteduser) return;

    setUnreadCounts((prev) => ({ ...prev, [selecteduser]: 0 }));

    axios
      .get(`${API}/api/messages/${selecteduser}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then(({ data }) => setMessages(data));
  }, [selecteduser, user.token]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send Message
  const sendMessage = async () => {
    if (!text.trim() || !selecteduser || !socket) return;

    const { data } = await axios.post(
      `${API}/api/messages`,
      { text, receiver: selecteduser },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      },
    );

    setMessages((prev) => [...prev, data]);
    socket.emit("sendMessage", data);
    setText("");
  };

  // Logout
  const handleLogout = () => {
    socket?.disconnect(); // 
    logout();
    navigate("/");
  };

  return (
    <div className="h-screen bg-[#e5fffb] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-[#007E6E] flex items-center justify-between px-6 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#007E6E] font-bold">
            {user.username[0].toUpperCase()}
          </div>
          <div>
            <p className="text-white font-semibold">{user.username}</p>
            <p className="text-green-400 text-sm">Online</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-400 cursor-pointer"
        >
          Logout
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentUser={user.username}
          users={users}
          onlineUsers={onlineUsers}
          selectedUser={selecteduser}
          onSelectUser={(username) => setSelectedUser(username)}
          unreadCounts={unreadCounts}
        />

        {/* Chat Area */}
        <div className="flex flex-col flex-1">
          {!selecteduser ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <BsChat size={40} />
              <p>Select a conversation</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                {messages.map((msg) => (
                  <MessageBox
                    key={msg._id || msg.createdAt}
                    msg={msg}
                    currentUser={user.username}
                  />
                ))}
                <div ref={bottomRef} />
              </div>

              <div className="p-4 flex gap-2 border-t">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1 border p-2 rounded"
                  placeholder="Type a message"
                />
                <button
                  onClick={sendMessage}
                  className="bg-[#0c4b43] text-white px-4 rounded-lg cursor-pointer hover:bg-[#007E6E]"
                >
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
