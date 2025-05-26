import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useNavigate } from "react-router-dom";
import ThreeDotMenu from './ThreeDotMenu';


const socket = io('http://localhost:8001');

const Wp = () => {
    const [loggedInUser, setLoggedInUser] = useState({});
    const [users, setUsers] = useState([]);
    const [currentReceiver, setCurrentReceiver] = useState(null);
    const [chatId, setChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [showSettingsMenu, setShowSettingsMenu] = useState(false);
    const [editingMessageId, setEditingMessageId] = useState(null);


    const navigate = useNavigate();
    const chatBoxRef = useRef(null);
    const token = localStorage.getItem("token");

    // Fetch logged-in user
    const fetchLoginUser = async () => {
        try {
            const res = await axios.get("http://localhost:8001/api/action/getLoginUser", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const user = res.data.data;
            setLoggedInUser(user);
            socket.emit("register", user);
        } catch (err) {
            console.error("Error fetching logged-in user:", err.message);
        }
    };

    // Fetch user list
    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:8001/api/action/getUser", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(res.data.data);
            console.log('res.data.data: ', res.data.data);
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    // Fetch or create chat
    const fetchOrCreateChat = async (user1Id, user2Id) => {
        try {
            const res = await axios.post(
                "http://localhost:8001/api/chat/getOrCreateChatId",
                { user1Id, user2Id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setChatId(res.data.data.id);
        } catch (err) {
            console.error("Failed to get or create chat:", err);
        }
    };

    // Load chat messages
    const loadMessages = async () => {
        try {
            const res = await axios.get(`http://localhost:8001/api/message/get/${chatId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const sortedMessages = res.data.data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            console.log('sortedMessages: ', sortedMessages);

            setMessages(sortedMessages);
        } catch (err) {
            console.error("Error loading messages:", err);
        }
    };

    // Scroll chat to bottom
    const scrollToBottom = () => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    };

    // Handle selecting a user to chat with
    const openChatBox = async (user) => {
        setCurrentReceiver(user);
        await fetchOrCreateChat(loggedInUser.id, user.id);
    };

    // Handle message send (text or image)
    const sendMessage = async () => {
        if (!message.trim() && !selectedImage) return;

        try {
            const formData = new FormData();
            formData.append('chatId', chatId);
            formData.append('senderId', loggedInUser.id);
            formData.append('receiverId', currentReceiver.id);
            formData.append('message', message);

            if (selectedImage) {
                formData.append('image', selectedImage);
            }

            let newMessage;

            if (editingMessageId) {
                // Handle update
                const res = await axios.put(`http://localhost:8001/api/message/update/${editingMessageId}`, {
                    message
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                newMessage = res.data.data;

                setEditingMessageId(null);
            } else {
                // Handle send new message
                const res = await axios.post("http://localhost:8001/api/message/send", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
                newMessage = res.data.data;
            }
            socket.emit("message", newMessage);

            setMessages((prev) => [...prev, newMessage]);
            scrollToBottom();

            setMessage('');
            setSelectedImage(null);
            loadMessages();
        } catch (error) {
            console.error("Failed to send/update message:", error);
        }
    };

    // Handle image upload input change
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    // Remove selected image
    const removeSelectedImage = () => {
        setSelectedImage(null);
    };



    useEffect(() => {
        socket.on("message", (data) => {
            console.log('Incoming message via socket:', data);

            const messageWithTimestamp = {
                ...data,
                created_at: data.created_at || new Date().toISOString()
            };

            if (
                (data.senderId === loggedInUser.id && data.receiverId === currentReceiver?.id) ||
                (data.senderId === currentReceiver?.id && data.receiverId === loggedInUser.id)
            ) {
                setMessages((prev) => [...prev, messageWithTimestamp]);
                scrollToBottom();
            }
        });
    }, [loggedInUser, currentReceiver]);


    // Initial load
    useEffect(() => {
        fetchLoginUser();
        fetchUsers();
    }, []);

    useEffect(() => {
        if (chatId) {
            loadMessages();
        }
    }, [chatId]);



    const handleLogout = () => {
        navigate('/api/user/logOut');
    };


    const formatTime = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('en-GB');
    };

    const formatDateKey = (dateStr) => {
        const date = new Date(dateStr);
        const today = new Date();

        const isToday =
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();

        return isToday ? "Today" : date.toDateString();
    };

    const handleMessageDelete = (id) => {
        setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id));
    };


    const menuItemStyle = {
        padding: "10px",
        cursor: "pointer",
        borderBottom: "1px solid #eee",
        fontSize: "14px",
        backgroundColor: "#fff",
        transition: "background 0.2s",
    };


    return (
        <div
            style={{
                display: "flex",
                height: "100vh",
                marginBottom: "10px",
                fontFamily: "Arial, sans-serif",
                overflow: "hidden",

            }}
        >
            {/* Left Panel */}
            <div
                style={{
                    width: "30%",
                    backgroundColor: "#f0f0f0",
                    padding: "20px",
                    borderRight: "1px solid #ccc",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                }}
            >
                <div>
                    <h2>Your Contact List:</h2>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {users
                            .filter((u) => u.id !== loggedInUser.id)
                            .map((user) => (
                                <li
                                    key={user.id}
                                    onClick={() => openChatBox(user)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "10px",
                                        margin: "10px 0",
                                        backgroundColor: "#ddd",
                                        borderRadius: "5px",
                                        cursor: "pointer"
                                    }}
                                >
                                    <img
                                        src={user.profilePic || "https://www.gravatar.com/avatar/?d=mp&s=40"}
                                        alt={user.name}
                                        style={{
                                            width: "30px",
                                            height: "30px",
                                            borderRadius: "50%",
                                            marginRight: "10px"
                                        }}
                                    />
                                    <span style={{ fontWeight: "bold" }}>{user.name}</span>

                                </li>
                            ))}
                    </ul>
                </div>




                <div
                    style={{
                        padding: "15px",
                        marginBottom: "20px",
                        backgroundColor: "#f5f5f5",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        width: "100%",
                        boxSizing: "border-box",
                        position: "relative",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "15px",
                        }}
                    >
                        <img
                            src={loggedInUser.profilePic || "https://www.gravatar.com/avatar/?d=mp&s=40"}
                            alt={loggedInUser.name}
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                marginRight: "10px",
                            }}
                        />
                        <p style={{ margin: 0 }}>
                            <strong>Logged in as:</strong> <span>{loggedInUser.name}</span>
                        </p>
                    </div>

                    {/* Settings Button */}
                    <button
                        onClick={() => setShowSettingsMenu(prev => !prev)}
                        style={{
                            padding: "10px",
                            width: "100%",
                            backgroundColor: "#5bc0de",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            marginBottom: "10px",
                        }}
                    >
                        Settings ⚙️
                    </button>

                    {/* Dropdown Settings Menu */}
                    {showSettingsMenu && (
                        <div
                            style={{
                                position: "absolute",
                                top: "12px",
                                left: "180px",
                                backgroundColor: "#fff",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                                zIndex: 10,
                                width: "calc(100% - 30px)",
                            }}
                        >
                            <div
                                onClick={() => {
                                    setShowSettingsMenu(false);
                                    navigate(`/api/user/wp/profile/${loggedInUser.id}`);

                                }}
                                style={menuItemStyle}
                            >
                                👤 Show Profile
                            </div>

                            <div
                                onClick={() => {
                                    setShowSettingsMenu(false);
                                    handleLogout();
                                }}
                                style={{ ...menuItemStyle, color: "#d9534f" }}
                            >
                                🚪 Logout
                            </div>
                        </div>
                    )}
                </div>


            </div>

            {/* Right Panel */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#fff"
                }}
            >
                <div
                    style={{
                        padding: "15px 20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px"
                    }}
                >
                    {currentReceiver && (
                        <img
                            src={currentReceiver.profilePic || "https://www.gravatar.com/avatar/?d=mp&s=40"}
                            alt={currentReceiver.name}
                            style={{ width: "35px", height: "35px", borderRadius: "50%" }}
                        />
                    )}

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <h3 style={{ margin: 0 }}>Chat with {currentReceiver?.name || "..."}</h3>
                        <span style={{ padding: "2px", margin: "px 0px 0px 0px ", fontSize: "10px", color: "#666", }}>
                            {currentReceiver?.status || "status"}
                        </span>
                    </div>
                </div>



                <div
                    ref={chatBoxRef}
                    style={{
                        flex: 1,
                        padding: "20px",
                        overflowY: "auto",
                        backgroundColor: "#f9f9f9",
                        minHeight: 0
                    }}
                >
                    {messages.map((msg, idx) => {
                        const msgDate = formatDateKey(msg.created_at);
                        const prevDate = idx > 0 ? formatDateKey(messages[idx - 1].created_at) : null;
                        const showDate = msgDate !== prevDate;
                        const isOwnMessage = msg.senderId === loggedInUser.id;

                        return (
                            <React.Fragment key={msg.id || idx}>
                                {showDate && (
                                    <div
                                        style={{
                                            textAlign: "center",
                                            margin: "10px 0",
                                            fontSize: "12px",
                                            color: "#666"
                                        }}
                                    >
                                        {msgDate}
                                    </div>
                                )}
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: isOwnMessage ? "flex-end" : "flex-start",
                                        marginBottom: "10px",
                                        position: "relative",
                                        paddingRight: isOwnMessage ? "10px" : "0px",
                                    }}
                                >
                                    <div
                                        style={{
                                            backgroundColor: isOwnMessage ? "#d1ffd6" : "#e0e0e0",
                                            padding: "10px",
                                            borderRadius: "10px",
                                            maxWidth: "60%",
                                            wordWrap: "break-word",
                                            position: "relative",
                                        }}
                                    >
                                        {/* 3-dot menu */}
                                        {isOwnMessage && !msg.is_deleted && (
                                            <div
                                                style={{
                                                    padding: "1px",
                                                    margin: "1px",
                                                    position: "absolute",
                                                    top: "1px",
                                                    right: "-4px",
                                                    zIndex: 1,
                                                }}
                                            >
                                                <ThreeDotMenu
                                                    messageId={msg.id}
                                                    onEdit={(msg) => {
                                                        setMessage(msg.message);
                                                        setEditingMessageId(msg.id);
                                                    }}
                                                    onDelete={handleMessageDelete}
                                                />
                                            </div>
                                        )}


                                        {msg.is_deleted ? (
                                            <div style={{ fontStyle: "italic", color: "#999", fontSize: "14px" }}>
                                                {isOwnMessage ? "You" : currentReceiver?.name} deleted this message.
                                            </div>
                                        ) : msg.image ? (
                                            <img
                                                src={msg.image}
                                                alt="sent-img"
                                                style={{ maxWidth: "100%", borderRadius: "8px", marginBottom: 5 }}
                                            />
                                        ) : (
                                            <div style={{ fontSize: "14px" }}>
                                                {isOwnMessage ? "You" : currentReceiver?.name}: {msg.message}
                                            </div>
                                        )}


                                        <div style={{ fontSize: "11px", color: "#888", textAlign: "right" }}>
                                            {formatTime(msg.created_at)}
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>

                        );
                    })}
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "15px 20px",
                        borderTop: "1px solid #ccc",
                        backgroundColor: "#eee",
                    }}
                >
                    {/* + Button for Image Upload */}
                    <label
                        htmlFor="imageUpload"
                        style={{
                            display: "inline-flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            backgroundColor: "#2196f3",
                            color: "white",
                            fontSize: "20px",
                            cursor: "pointer",
                            marginRight: "10px"
                        }}
                    >
                        +
                    </label>
                    <input
                        type="file"
                        id="imageUpload"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleImageUpload}
                    />

                    {/* Show thumbnail preview and remove button if image selected */}
                    {selectedImage && (
                        <div style={{ position: 'relative', marginRight: '10px' }}>
                            <img
                                src={URL.createObjectURL(selectedImage)}
                                alt="preview"
                                style={{ width: 40, height: 40, borderRadius: 4, objectFit: 'cover' }}
                            />
                            <button
                                onClick={removeSelectedImage}
                                style={{
                                    position: 'absolute',
                                    top: -5,
                                    right: -5,
                                    background: 'red',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: 18,
                                    height: 18,
                                    cursor: 'pointer',
                                    fontSize: 12,
                                    lineHeight: '16px',
                                    padding: 0,
                                }}
                                title="Remove image"
                            >
                                ×
                            </button>
                        </div>
                    )}

                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        style={{
                            flex: 1,
                            padding: "10px",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                            marginRight: "10px",
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                    />
                    <button
                        onClick={sendMessage}
                        style={{
                            padding: "10px 20px",
                            border: "none",
                            backgroundColor: "#4caf50",
                            color: "white",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        Send
                    </button>
                </div>

            </div>
        </div>
    );

};

export default Wp;
