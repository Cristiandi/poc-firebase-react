import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import "./App.css";

import firebaseApp from "./firebase";

import LoggedOut from "./modules/auth/views/LoggedOut";
import SendOTP from "./modules/auth/views/SendOTP";
import VerifyOTP from "./modules/auth/views/VerifyOTP";
import Home from "./modules/main/views/Home";

export const GlobalContext = React.createContext();

const App = () => {
  const [user, setUser] = useState({});

  const auth = getAuth(firebaseApp);

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
});

  return (
    <div className="App">
      <GlobalContext.Provider value={{ user }}>
      <Router>
        <nav style={{ margin: 10 }}>
          <Link to="/send-otp" style={{ padding: 5 }}>
            Send OTP
          </Link>
          |
          <Link to="/verify-otp" style={{ padding: 5 }}>
            Verify OTP
          </Link>
          |
          <Link to="/home" style={{ padding: 5 }}>
            Home
          </Link>
        </nav>
        <Routes>
          <Route path="/" element={<LoggedOut />} />
          <Route path="/send-otp" element={<SendOTP />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/home" element={<Home user={user} />} />
        </Routes>
      </Router>
      </GlobalContext.Provider>
    </div>
  );
}

export default App;