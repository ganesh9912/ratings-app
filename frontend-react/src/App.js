import './App.css';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, {Suspense, lazy} from "react";
import Dashboard from './pages/Dashboard';
import AddStoreForm from './pages/Addstores';
import UserDashboard from './pages/Userdashboard';
import OwnerDashboard from './pages/ownerdashboard';

const  Login = lazy(()=> import("./pages/Login"));
const Signup = lazy(() => import("./pages/userRegistration"));

function App() {
  return (
   <Router>
     <Routes>
      <Route path = "/" element={<Login />} />
      <Route path = "/login" element={<Login />} />
      <Route path = "/register" element={<Signup />} />
      <Route path = "/dashboard" element={<Dashboard />} />
      <Route path = "/addstore" element={<AddStoreForm />} />
      <Route path = "/userdashboard" element={<UserDashboard/>} />
      <Route path = "/ownerdashboard" element={<OwnerDashboard/>} />
     </Routes>
   </Router>
  );
}

export default App;
