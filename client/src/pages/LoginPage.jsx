import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const schema = Yup.object({
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

function Login() {
  const navigate = useNavigate();

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: async (vals) => {
      try {
        const res = await fetch("https://lead-dashboard-nn92.onrender.com/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(vals),
        });
        const data = await res.json();
        if (data.message === "Login successful") {
          localStorage.setItem("token", data.token);
          localStorage.setItem("loginInfo", JSON.stringify(data.user));
          navigate("/dashboard");
        } else {
          toast.error(data.message);
        }
      } catch {
        toast.error("Server error. Please try again.");
      }
    },
  });

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <h3 className="text-center mb-4">Admin Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className={`form-control ${touched.email && errors.email ? "is-invalid" : ""}`}
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="admin@futeservices.com"
            />
            {touched.email && errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className={`form-control ${touched.password && errors.password ? "is-invalid" : ""}`}
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="••••••••"
            />
            {touched.password && errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
          <p className="text-center small mt-3 mb-0">
            Don't have an account? <Link to="/register" className="text-primary">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
