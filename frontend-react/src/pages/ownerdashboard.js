import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stores, setStores] = useState([]);
  const [newPassword, setNewPassword] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (!loggedInUser) {
      navigate("/");
      return;
    }

    const userData = JSON.parse(loggedInUser);
    if (userData.role !== "owner") {
      navigate("/");
      return;
    }

    setUser(userData);
    fetchStores(userData.id);
  }, [navigate]);

  const fetchStores = async (ownerId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/auth/stores/${ownerId}`);
      setStores(res.data);
    } catch (err) {
      console.error("Error fetching stores:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    return regex.test(password);
  };

  const handleUpdatePassword = async () => {
    if (!newPassword) {
      alert("Enter a new password");
      return;
    }

    if (!validatePassword(newPassword)) {
      alert(
        "Password must be 8-20 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/auth/owner/updatepassword/${user.id}`,
        { newPassword }
      );

      alert("Password updated successfully");
      setNewPassword("");
      setShowPasswordForm(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update password");
    }
  };

  return (
    <div className="ui container" style={{ marginTop: "2em" }}>
      <div className="ui inverted teal menu">
        <div className="header item">Store Owner Dashboard</div>
        <div className="right menu">
          <div className="item">
            <button
              className="ui yellow button"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
            >
              Update Password
            </button>
          </div>
          <div className="item">
            <button className="ui red button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <h2 className="ui header" style={{ marginTop: "1em" }}>
        Welcome, {user?.name}
      </h2>

      {showPasswordForm && (
        <div className="ui segment" style={{ marginBottom: "2em" }}>
          <h3>Update Password</h3>
          <div className="ui action input">
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button className="ui blue button" onClick={handleUpdatePassword}>
              Confirm
            </button>
          </div>
        </div>
      )}

      {stores.map((store) => (
        <div className="ui segment" key={store.id} style={{ marginBottom: "2em" }}>
          <h3>Store: {store.name}</h3>
          <h4>Average Rating: {Number(store.averageRating).toFixed(1)}</h4>

          <table className="ui celled table">
            <thead>
              <tr>
                <th>User</th>
                <th>Rating</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {store.ratings.map((r, index) => (
                <tr key={index}>
                  <td>{r.user_name}</td>
                  <td>{r.rating}</td>
                  <td>{new Date(r.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {store.ratings.length === 0 && <p>No ratings yet.</p>}
        </div>
      ))}
    </div>
  );
};

export default OwnerDashboard;
