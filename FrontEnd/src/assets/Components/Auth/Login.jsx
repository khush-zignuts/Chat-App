import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsSuccess(false);

        try {
            const res = await axios.post("http://localhost:8001/api/user/login", formData);

            const data = res.data;

            if (data.status === 200 && data.data?.token) {
                localStorage.setItem("token", data.data.token);
                localStorage.setItem("userId", data.data.userId);
                setMessage("Login successful!");
                setIsSuccess(true);
                setTimeout(() => {
                    navigate('/api/user/wp');
                }, 1500);
            } else {
                setMessage(data.message || "Login failed.");
            }
        } catch (error) {
            console.error("Login error:", error);
            setMessage(
                error.response?.data?.message ||
                "Something went wrong. Please try again."
            );
        }
    };

    return (
        <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
            <h2>Login</h2>
            <form
                onSubmit={handleSubmit}
                style={{
                    maxWidth: "400px",
                    margin: "auto",
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{ margin: "10px 0", padding: "10px" }}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={{ margin: "10px 0", padding: "10px" }}
                />
                <button type="submit" style={{ padding: "10px", margin: "10px 0" }}>
                    Log In
                </button>
                {message && (
                    <div
                        style={{
                            color: isSuccess ? "green" : "red",
                            fontSize: "14px"
                        }}
                    >
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
};

export default Login;
