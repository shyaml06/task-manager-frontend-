import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/Login.css"; // Import the CSS file here!

export default function Login() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  // ✅ Validation schema
  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  return (
    <div className="login-container">
      <h2>Login</h2>

      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setServerError("");

          try {
            // Login
            await axios.post(
              "http://localhost:8000/auth/login/",
              values,
              { withCredentials: true }
            );

            // 🔐 Verify session
            await axios.get(
              "http://localhost:8000/auth/me/",
              { withCredentials: true }
            );

            // Redirect after successful login and verification
            navigate("/dashboard");

          } catch (error) {
            if (error.response?.data?.error) {
              setServerError(error.response.data.error);
            } else if (error.response?.status === 401) {
              setServerError("Invalid username or password");
            } else {
              setServerError("Login failed. Try again.");
            }
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="login-form">
            {/* Username */}
            <div className="input-group">
              <Field
                type="text"
                name="username"
                placeholder="Username"
                className="login-input"
              />
              <ErrorMessage
                name="username"
                component="div"
                className="error-message"
              />
            </div>

            {/* Password */}
            <div className="input-group">
              <Field
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="login-input"
              />
              <button onClick={() => setShowPassword(!showPassword)} className="password-toggle" type="button">
                {showPassword ? "Hide" : "Show"}
              </button>
              <ErrorMessage
                name="password"
                component="div"
                className="error-message"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="login-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>

            {/* Server Error */}
            {serverError && (
              <div className="server-error">{serverError}</div>
            )}
          </Form>
        )}

      </Formik>
      <p className="forgot-password">
        <Link to="/forgot-password">Forgot Password?</Link>
      </p>
    </div>
  );
}
