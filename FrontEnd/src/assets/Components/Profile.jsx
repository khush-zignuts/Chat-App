import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Profile = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:8001/api/action/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data?.data) {
                    setUser(response.data.data);
                    setFormData(response.data.data);
                } else {
                    setError("User not found");
                }
            } catch (err) {
                setError(err.response?.data?.error || "Failed to fetch user");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };


    const handleSave = async () => {
        try {
            setSaving(true);
            await axios.put(`http://localhost:8001/api/action/user/update/${userId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUser(formData);
            setEditMode(false);
        } catch (err) {
            console.log('err: ', err.message);
            alert("Failed to save changes.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p>Loading profile...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div style={styles.container}>
            <h2>User Profile</h2>
            <div style={styles.profileBox}>
                <img
                    src={user.profilePic || "https://www.gravatar.com/avatar/?d=mp&s=100"}
                    alt={user.name}
                    style={styles.avatar}
                />
                <div>
                    <div style={styles.field}>
                        <strong>Name:</strong>
                        {editMode ? (
                            <input name="name" value={formData.name} onChange={handleChange} />
                        ) : (
                            <span> {user.name}</span>
                        )}
                    </div>
                    <div style={styles.field}>
                        <strong>Email:</strong>
                        <span> {user.email}</span>

                    </div>
                    <div style={styles.field}>
                        <strong>Status:</strong>
                        {editMode ? (
                            <input name="status" value={formData.status} onChange={handleChange} />
                        ) : (
                            <span> {user.status}</span>
                        )}
                    </div>
                    <div style={styles.field}>
                        <strong>Online:</strong>
                        <span> {user.isOnline ? "Yes ✅" : "No ❌"}</span>
                    </div>

                    {editMode ? (
                        <button onClick={handleSave} disabled={saving} style={styles.button}>
                            {saving ? "Saving..." : "Save"}
                        </button>
                    ) : (
                        <button onClick={() => setEditMode(true)} style={styles.button}>
                            Edit
                        </button>
                    )}
                    <button onClick={() => navigate("/api/user/wp")} style={styles.backButton}>
                        ⬅️ Back to Chat-Dashboard
                    </button>

                </div>
            </div>
        </div>
    );
};

const styles = {
    backButton: {
        marginBottom: "15px",
        padding: "5px 8px",
        margin: "7px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },

    container: {
        maxWidth: "500px",
        margin: "30px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
    },
    profileBox: {
        display: "flex",
        alignItems: "center",
        gap: "20px",
    },
    avatar: {
        width: "100px",
        height: "100px",
        borderRadius: "50%",
        border: "2px solid #ccc",
    },
    field: {
        marginBottom: "10px",
    },
    button: {
        marginTop: "10px",
        padding: "8px 12px",
        backgroundColor: "#5cb85c",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
};

export default Profile;
