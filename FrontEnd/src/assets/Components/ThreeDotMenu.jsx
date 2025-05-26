import React, { useState, useRef, useEffect } from "react";
import axios from 'axios';


const ThreeDotMenu = ({ messageId, onEdit, onDelete }) => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef();

    const handleClickOutside = (e) => {
        if (menuRef.current && !menuRef.current.contains(e.target)) {
            setShowMenu(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleEdit = () => {
        setShowMenu(false);
        if (onEdit) {
            onEdit(messageId);
        }
    };



    const handleDelete = async () => {
        setShowMenu(false);
        if (window.confirm("Are you sure you want to delete this message?")) {
            try {
                const response = await axios.delete(`http://localhost:8001/api/message/delete/${messageId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });


                console.log('response: ', response);

                // Call the parent's delete handler to update UI
                if (onDelete) {
                    onDelete(messageId);
                }
            } catch (error) {
                console.error("Failed to delete message:", error);
                alert("Failed to delete the message.");
            }
        }
    };

    return (
        <div style={{ position: "relative" }} ref={menuRef}>
            <button
                onClick={() => setShowMenu(prev => !prev)}
                style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "18px",
                    color: "#555",
                }}
                title="Options"
            >
                ⋮
            </button>

            {showMenu && (
                <div
                    style={{
                        position: "absolute",
                        top: "20px",
                        right: 0,
                        background: "white",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                        zIndex: 1000,
                        width: "120px"
                    }}
                >
                    <div
                        onClick={handleEdit}
                        style={menuItemStyle}
                    >
                        ✏️ Edit
                    </div>

                    <div
                        onClick={handleDelete}
                        style={{ ...menuItemStyle, color: "#d9534f" }}
                    >
                        🗑️ Delete
                    </div>
                </div>
            )}
        </div>
    );
};

const menuItemStyle = {
    padding: "10px",
    cursor: "pointer",
    fontSize: "14px",
    borderBottom: "1px solid #eee",
    backgroundColor: "#fff",
    transition: "background 0.2s",
};

export default ThreeDotMenu;
