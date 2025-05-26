import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', profilePic: '' });
    const [profileFile, setProfileFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleImageChange = (e) => {
        setProfileFile(e.target.files[0]);
    };

    const uploadToCloudinary = async () => {
        const data = new FormData();
        data.append('file', profileFile);
        data.append('upload_preset', 'unsigned_upload_preset');
        data.append('cloud_name', 'dhylukije');

        setUploading(true);

        try {
            const res = await axios.post(
                'https://api.cloudinary.com/v1_1/dhylukije/image/upload',
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            setUploading(false);
            return res.data.secure_url;
        } catch (error) {
            console.error("Cloudinary upload error:", error);
            setUploading(false);
            throw new Error("Failed to upload image to Cloudinary.");
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            let profileUrl = '';

            if (profileFile) {
                profileUrl = await uploadToCloudinary();
            }

            const payload = {
                ...formData,
                profilePic: profileUrl,
            };


            const res = await axios.post("http://localhost:8001/api/user/signup", payload, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log('res: ', res);
            const data = res.data;
            console.log('Signup response:', data);

            if (res.status === 200 && data.status) {
                alert(data.message || "Signup successful!");
                localStorage.setItem("email", formData.email);
                navigate("/verifyOtp");
            } else {
                if (data.error?.password) {
                    setError(data.error.password.join(" "));
                } else {
                    setError(data.message || "Signup failed.");
                }
            }
        } catch (err) {
            console.error("Signup error:", err);
            const msg = err.response?.data?.message || "Something went wrong. Please try again.";
            setError(msg);
        }
    };


    return (
        <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
            <h2>Signup</h2>
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
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{ margin: "10px 0", padding: "10px" }}
                />
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

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ margin: "10px 0", padding: "10px" }}
                />
                <img
                    src={
                        profileFile
                            ? URL.createObjectURL(profileFile)
                            : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt="Profile Preview"
                    style={{ width: "auto", height: "auto", borderRadius: "50%", marginBottom: "10px", objectFit: "cover" }}
                />


                {uploading && <p style={{ fontSize: "12px", color: "#888" }}>Uploading image...</p>}

                <button type="submit" style={{ padding: "10px", margin: "10px 0" }}>
                    Sign Up
                </button>
                {error && <div style={{ color: "red", fontSize: "14px" }}>{error}</div>}
            </form>

            <div style={{ textAlign: "center", marginTop: "20px", fontSize: "14px" }}>
                Already have an account? <Link to="/api/user/login">Log In</Link>
            </div>
        </div>
    );
};

export default Signup;
