import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login Data:", credentials);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        credentials
      );

      if (response.data.success) {
        
        localStorage.setItem("user", JSON.stringify(response.data.user));

        const user = response.data.user;

       
        if (user.role === "admin") {
          navigate("/dashboard");
        } else if (user.role === "user") {
          navigate("/userdashboard");
        } else if (user.role === "owner") {
          navigate("/ownerdashboard");
        } else {
          navigate("/"); 
        }
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="ui middle aligned center aligned grid"
      style={{ height: "100vh" }}
    >
      <div className="column" style={{ maxWidth: "450px" }}>
        <h2 className="ui teal image header">
          <i className="user circle icon"></i>
          <div className="content">Log in to your account</div>
        </h2>

        <form className="ui large form" onSubmit={handleSubmit}>
          <div className="ui stacked segment">
            <div className="field">
              <div className="ui left icon input">
                <i className="user icon"></i>
                <input
                  type="text"
                  name="email"
                  placeholder="Email"
                  value={credentials.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="field">
              <div className="ui left icon input">
                <i className="lock icon"></i>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="ui fluid large teal button">
              Login
            </button>
          </div>
        </form>

        <div className="ui message">
          New here? <a href="/register">Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
