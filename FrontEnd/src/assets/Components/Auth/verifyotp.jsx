import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VerifyOtp = () => {
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsSuccess(false);

        const email = localStorage.getItem('email');

        if (!email) {
            setMessage('Email not found. Please signup again.');
            return;
        }

        try {
            const res = await fetch('http://localhost:8001/api/user/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp }),
            });

            const data = await res.json();

            if (data.status) {
                setIsSuccess(true);
                setMessage(data.message || 'OTP verified successfully!');
                setTimeout(() => {
                    navigate('/login');  
                }, 1500);
            } else {
                setMessage(data.error || data.message || 'Invalid OTP.');
            }
        } catch (err) {
            console.error('Verification error:', err);
            setMessage('Something went wrong. Please try again.');
        }
    };

    return (
        <div style={styles.container}>
            <h2>Verify OTP</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    name="otp"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>
                    Verify
                </button>
                <div style={{ ...styles.message, color: isSuccess ? 'green' : 'red' }}>
                    {message}
                </div>
            </form>
        </div>
    );
};

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        padding: '40px',
        textAlign: 'center',
    },
    form: {
        maxWidth: '400px',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
    },
    input: {
        margin: '10px 0',
        padding: '10px',
    },
    button: {
        margin: '10px 0',
        padding: '10px',
    },
    message: {
        fontSize: '14px',
        marginTop: '10px',
    },
};

export default VerifyOtp;
