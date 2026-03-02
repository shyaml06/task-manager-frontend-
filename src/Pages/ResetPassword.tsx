import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/resetpassword.css";

const ResetPassword = () => {
    const { uid, token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        try {
            await axios.post(
                `http://localhost:8000/auth/reset-password/${uid}/${token}/`,
                {
                    email: email,
                    password: password,
                    confirm_password: confirmPassword,
                }
            );

            setMessage("Password reset successful. Redirecting...");
            setTimeout(() => navigate("/login"), 2000);

        } catch (error) {
            setMessage("Invalid or expired token.");
        }
    };

    return (
        <div className="reset-container">
            <div className="reset-card">
                <h2>Reset Password</h2>
                <p className="subtitle">
                    Enter your email and choose a new password.
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
                    <div className="password-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="New Password"
                            value={password}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                        />
                        <button onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    <div className="password-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            required
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="input-field"
                        />
                        <button onClick={() => setShowPassword(!showPassword)}   >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>


                    <button type="submit" className="submit-btn">
                        Reset Password
                    </button>
                </form>

                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
};

export default ResetPassword;