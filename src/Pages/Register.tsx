import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/Register.css"; // Import the CSS file here!

export default function Register() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");  

  // ✅ Validation Schema
  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Minimum 3 characters")
      .required("Username is required"),

    email: Yup.string()
      .email("Invalid email")
      .required("Email is required"),

    password: Yup.string()
      .min(8, "Minimum 8 characters")
      .required("Password is required")
  });

  return (
    <div className="register-container">
      <h2>Register</h2>

      <Formik
        initialValues={{
          username: "",
          email: "",
          password: ""
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setServerError("");

          try {
            await axios.post(
              "http://127.0.0.1:8000/auth/register/",
              values,
              { withCredentials: true }
            );

            alert("Registration successful!");
            navigate("/login");

          } catch (error) {
            if (error.response?.data?.error) {
              setServerError(error.response.data.error);
            } else {
              setServerError("Something went wrong");
            }
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="register-form">
            
            {/* Username */}
            <div className="input-group">
              <Field
                type="text"
                name="username"
                placeholder="Username"
                className="register-input"
              />
              <ErrorMessage name="username" component="div" className="error-message" />
            </div>

            {/* Email */}
            <div className="input-group">
              <Field
                type="email"
                name="email"
                placeholder="Email"
                className="register-input"
              />
              <ErrorMessage name="email" component="div" className="error-message" />
            </div>

            {/* Password */}
            <div className="input-group">
              <Field
                type="password"
                name="password"
                placeholder="Password"
                className="register-input"
              />
              <ErrorMessage name="password" component="div" className="error-message" />
            </div>

            {/* Submit */}
            <button type="submit" className="register-button" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register"}
            </button>

            {/* Server Error */}
            {serverError && (
              <div className="server-error">{serverError}</div>
            )}

          </Form>
        )}
      </Formik>
    </div>
  );
}