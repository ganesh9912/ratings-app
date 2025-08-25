import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalStores, setTotalStores] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [userFilter, setUserFilter] = useState({ name: "", email: "", address: "", role: "" });
  const [storeFilter, setStoreFilter] = useState({ name: "", email: "", address: "" });

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (!loggedInUser) {
      navigate("/");
      return;
    }

    const userData = JSON.parse(loggedInUser);
    if (userData.role !== "admin") {
      navigate("/");
      return;
    }

    setUser(userData);

    const fetchData = async () => {
      try {
        const usersRes = await axios.get("http://localhost:5000/api/auth/users");
        setUsers(usersRes.data);
        setTotalUsers(usersRes.data.length);

        const storesRes = await axios.get("http://localhost:5000/api/auth/stores");
        setStores(storesRes.data);
        setTotalStores(storesRes.data.length);

        const ratingsRes = await axios.get("http://localhost:5000/api/auth/ratings/count");
        setTotalRatings(ratingsRes.data.total);
      } catch (err) {
        console.error("Error fetching admin data:", err);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userFilter.name.toLowerCase()) &&
    u.email.toLowerCase().includes(userFilter.email.toLowerCase()) &&
    u.address.toLowerCase().includes(userFilter.address.toLowerCase()) &&
    u.role.toLowerCase().includes(userFilter.role.toLowerCase())
  );

  const filteredStores = stores.filter(s =>
    s.name.toLowerCase().includes(storeFilter.name.toLowerCase()) &&
    s.email.toLowerCase().includes(storeFilter.email.toLowerCase()) &&
    s.address.toLowerCase().includes(storeFilter.address.toLowerCase())
  );

  return (
    <div className="ui container" style={{ marginTop: "2em" }}>
      <div className="ui inverted teal menu">
        <div className="header item">Admin Dashboard</div>
        <div className="right menu">
          <div className="item">
            <button className="ui red button" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>

      <h2 className="ui header" style={{ marginTop: "1em" }}>Welcome, {user?.name}</h2>

      <div className="ui three statistics" style={{ marginBottom: "2em" }}>
        <div className="statistic">
          <div className="value">{totalUsers}</div>
          <div className="label">Total Users</div>
        </div>
        <div className="statistic">
          <div className="value">{totalStores}</div>
          <div className="label">Total Stores</div>
        </div>
        <div className="statistic">
          <div className="value">{totalRatings}</div>
          <div className="label">Total Submitted Ratings</div>
        </div>
      </div>

      <div style={{ marginBottom: "2em" }}>
        <button className="ui blue button" onClick={() => navigate("/register")}>Add User</button>
        <button className="ui green button" onClick={() => navigate("/register")}>Add Admin</button>
        <button className="ui orange button" onClick={() => navigate("/Addstore")}>Add Store</button>
      </div>

      <div className="ui raised segment" style={{ marginBottom: "2em" }}>
        <h3 className="ui dividing header">Users</h3>
        <div className="ui form" style={{ marginBottom: "1em" }}>
          <div className="fields">
            <input placeholder="Name" value={userFilter.name} onChange={e => setUserFilter({ ...userFilter, name: e.target.value })} />
            <input placeholder="Email" value={userFilter.email} onChange={e => setUserFilter({ ...userFilter, email: e.target.value })} />
            <input placeholder="Address" value={userFilter.address} onChange={e => setUserFilter({ ...userFilter, address: e.target.value })} />
            <input placeholder="Role" value={userFilter.role} onChange={e => setUserFilter({ ...userFilter, role: e.target.value })} />
          </div>
        </div>

        <table className="ui celled table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Role</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.address}</td>
                <td>{u.role}</td>
                <td>{u.role === "owner" ? Number(u.rating).toFixed(1) : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ui raised segment">
        <h3 className="ui dividing header">Stores</h3>
        <div className="ui form" style={{ marginBottom: "1em" }}>
          <div className="fields">
            <input placeholder="Name" value={storeFilter.name} onChange={e => setStoreFilter({ ...storeFilter, name: e.target.value })} />
            <input placeholder="Email" value={storeFilter.email} onChange={e => setStoreFilter({ ...storeFilter, email: e.target.value })} />
            <input placeholder="Address" value={storeFilter.address} onChange={e => setStoreFilter({ ...storeFilter, address: e.target.value })} />
          </div>
        </div>

        <table className="ui celled table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Owner</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {filteredStores.map(s => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.address}</td>
                <td>{s.owner_name}</td>
                <td>{s.rating !== null ? Number(s.rating).toFixed(1) : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
