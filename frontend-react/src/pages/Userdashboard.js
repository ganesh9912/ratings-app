import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stores, setStores] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [search, setSearch] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (!loggedInUser) {
      navigate("/");
      return;
    }

    const userData = JSON.parse(loggedInUser);
    if (userData.role !== "user") {
      navigate("/");
      return;
    }

    setUser(userData);
    fetchStores();
    fetchUserRatings(userData.id);
  }, [navigate]);

  const fetchStores = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/stores");
      setStores(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUserRatings = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/auth/ratings/user/${userId}`);
      const ratingsMap = {};
      res.data.forEach((r) => {
        ratingsMap[r.store_id] = r.rating;
      });
      setUserRatings(ratingsMap);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleRatingSubmit = async (storeId, rating) => {
    try {
      const currentRating = userRatings[storeId];
      const newRating = currentRating === rating ? null : rating;

      if (newRating === null) {
        await axios.delete(`http://localhost:5000/api/auth/ratings/${user.id}/${storeId}`);
      } else {
        await axios.post("http://localhost:5000/api/auth/ratings", {
          user_id: user.id,
          store_id: storeId,
          rating: newRating,
        });
      }

      setUserRatings({ ...userRatings, [storeId]: newRating });
      fetchStores();
      fetchUserRatings(user.id);
    } catch (err) {
      console.error(err);
    }
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
    return regex.test(password);
  };

  const handleUpdatePassword = async () => {
    if (!newPassword) {
      alert("Enter a new password");
      return;
    }
    if (!validatePassword(newPassword)) {
      alert(
        "Password must be 8-16 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }
    try {
      await axios.put(`http://localhost:5000/api/auth/user/updatepassword/${user.id}`, { newPassword });
      alert("Password updated successfully");
      setNewPassword("");
      setShowPasswordForm(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update password");
    }
  };

  if (!user) return <p>Loading...</p>;

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(search.toLowerCase()) ||
      store.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="ui container" style={{ marginTop: "2em" }}>
      <div className="ui inverted blue menu">
        <div className="header item">User Dashboard</div>
        <div className="right menu">
          <div className="item">
            <button className="ui yellow button" onClick={() => setShowPasswordForm(!showPasswordForm)}>
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
        Welcome, {user.name}
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

      <div className="ui icon input" style={{ marginTop: "1em", marginBottom: "2em", width: "100%" }}>
        <input
          type="text"
          placeholder="Search stores by name or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <i className="search icon"></i>
      </div>

      <div className="ui cards">
        {filteredStores.map((store) => (
          <div className="ui card" key={store.id} style={{ width: "300px" }}>
            <div className="content">
              <div className="header">{store.name}</div>
              <div className="meta">{store.email}</div>
              <div className="description">
                <p>
                  <strong>Address:</strong> {store.address}
                </p>
                <p>
                  <strong>Overall Rating:</strong> {store.rating ? Number(store.rating).toFixed(1) : "No ratings yet"}
                </p>
                <p>
                  <strong>Your Rating:</strong> {userRatings[store.id] || "Not rated"}
                </p>
              </div>
            </div>
            <div className="extra content">
              <div className="ui buttons">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    className={`ui button ${userRatings[store.id] === r ? "teal" : ""}`}
                    onClick={() => handleRatingSubmit(store.id, r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
