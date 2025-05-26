import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout = () => {
    const [responseMessage, setResponseMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleLogout = async () => {
        setResponseMessage("");
        setErrorMessage("");

        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
            setErrorMessage("No active session found. Redirecting...");
            setTimeout(() => navigate("/api/user/login"), 1500);
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:8001/api/user/logout/${userId}`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200 && response.data.status === 200) {
                setResponseMessage(response.data.message || "Logout successful.");
                localStorage.clear();
                setTimeout(() => navigate("/api/user/login"), 1500);
            } else {
                setErrorMessage(response.data.message || "Logout failed.");
            }
        } catch (error) {
            console.error("Logout error:", error);
            const message = error.response?.data?.message || "Something went wrong. Please try again.";
            setErrorMessage(message);
        }
    };

    return (
        <div style={styles.container}>
            <h2>Are you sure you want to logout?</h2>
            <button onClick={handleLogout} style={styles.button}>
                Logout
            </button>
            {responseMessage && <div style={styles.success}>{responseMessage}</div>}
            {errorMessage && <div style={styles.error}>{errorMessage}</div>}
        </div>
    );
};

const styles = {
    container: {
        fontFamily: "Arial, sans-serif",
        padding: "40px",
        textAlign: "center",
    },
    button: {
        padding: "10px 20px",
        fontSize: "16px",
        cursor: "pointer",
        marginTop: "20px",
    },
    success: {
        marginTop: "20px",
        color: "green",
    },
    error: {
        marginTop: "20px",
        color: "red",
    },
};

export default Logout;
