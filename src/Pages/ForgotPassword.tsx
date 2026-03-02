import { useState } from "react";
import axios from "axios";
import "../styles/forgot.css";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await axios.post("http://localhost:8000/auth/forgot-password/", {
                email,
            });

            setMessage("If an account exists, a reset link has been sent.");


        } catch (error) {
            setMessage("Something went wrong. Try again.");
        }
    };

    return (
        <div className="forgot-container">
            <div className="forgot-card">
                <h2>Forgot Password</h2>
                <p className="subtitle">
                    Enter your email and we’ll send you a reset link.
                </p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field"
                    />

                    <button type="submit" className="submit-btn">
                        Send Reset Link
                    </button>
                </form>

                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
};

export default ForgotPassword;