import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const schema = Yup.object({
  name: Yup.string().min(2, "Name must be at least 2 characters").required("Name is required"),
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});

function Register() {
  const navigate = useNavigate();

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
    initialValues: { name: "", email: "", password: "", confirmPassword: "" },
    validationSchema: schema,
    onSubmit: async (vals, { resetForm }) => {
      try {
        const res = await fetch("http://localhost:8000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: vals.name, email: vals.email, password: vals.password }),
        });
        const data = await res.json();
        if (data.message === "User registered successfully") {
          toast.success("Registered successfully! Please login.");
          resetForm();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } catch {
        toast.error("Server error. Please try again.");
      }
    },
  });

  const fields = [
    { name: "name", label: "Full Name", type: "text", placeholder: "John Doe" },
    { name: "email", label: "Email", type: "email", placeholder: "you@example.com" },
    { name: "password", label: "Password", type: "password", placeholder: "••••••••" },
    { name: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "••••••••" },
  ];

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "420px" }}>
        <h3 className="text-center mb-4">Create Account</h3>
        <form onSubmit={handleSubmit}>
          {fields.map(f => (
            <div className="mb-3" key={f.name}>
              <label className="form-label">{f.label}</label>
              <input
                type={f.type}
                name={f.name}
                className={`form-control ${touched[f.name] && errors[f.name] ? "is-invalid" : ""}`}
                value={values[f.name]}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={f.placeholder}
              />
              {touched[f.name] && errors[f.name] && (
                <div className="invalid-feedback">{errors[f.name]}</div>
              )}
            </div>
          ))}
          <button type="submit" className="btn btn-primary w-100">Register</button>
          <p className="text-center small mt-3 mb-0">
            Already have an account? <Link to="/" className="text-primary">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
