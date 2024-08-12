import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
function Signup() {
  const [SignupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    const copySignupInfo = { ...SignupInfo };
    copySignupInfo[name] = value;
    setSignupInfo(copySignupInfo);
  };

  //   console.log("loginInfo ->", SignupInfo);
  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = SignupInfo;
    if (!name || !email || !password) {
      return handleError("name,email and password are required");
    }
    try {
      const url = "https://deploy-mern-app-1-api-psi.vercel.app/auth/signup";
      const response = await fetch(url, {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(SignupInfo),
      });
      const result = await response.json();

      const { success, message, error } = result;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else if (error) {
        const details = error?.details[0].message;
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
      console.log(result);
    } catch (error) {
      handleError(error);
    }
  };
  return (
    <div className="container">
      <h1>Signup</h1>
      <form onSubmit={handleSignup}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            onChange={handleChange}
            type="text"
            name="name"
            autoFocus
            placeholder="Enter your Name..."
            value={SignupInfo.name}
          />
        </div>
        <div>
          <label htmlFor="emial">Email</label>
          <input
            onChange={handleChange}
            type="email"
            name="email"
            placeholder="Enter your email..."
            value={SignupInfo.email}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            onChange={handleChange}
            type="password"
            name="password"
            placeholder="Enter Password..."
            value={SignupInfo.password}
          />
        </div>
        <button>Signup</button>
        <span>
          Already have an account ? <Link to="/login">Login</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Signup;
