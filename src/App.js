import { useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import "./App.css";

import firebaseApp from "./firebase";
import authService from "./modules/auth/auth.service"

function App() {
  const [sendOTPPhoneCode, setSendOTPPhoneCode] = useState("");
  const [sendOTPPhoneNumber, setSendOTPPhoneNumber] = useState("");
  const [sendOTPChannel, setSendOTPChannel] = useState("");
  const [sendOTPMessage, setSendOTPMessage] = useState("");


  const [verifyOTPPhoneCode, setVerifyOTPPhoneCode] = useState("");
  const [verifyOTPPhoneNumber, setVerifyOTPPhoneNumber] = useState("");
  const [verifyOTPCode, setVerifyOTPCode] = useState("");
  const [verifyOTPMessage, setVerifyOTPMessage] = useState("");

  const [user, setUser] = useState({});

  const auth = getAuth(firebaseApp);

  onAuthStateChanged(auth, (currentUser) => {
    currentUser.getIdToken()

    setUser(currentUser);
  });

  const sendOTP = async (event) => {
    event.preventDefault();

    setSendOTPMessage("");

    if (!sendOTPPhoneCode || !sendOTPPhoneNumber || !sendOTPChannel) {
      setSendOTPMessage("error: Please fill all fields");
      return;
    }

    const parsedPhoneCode = parseInt(sendOTPPhoneCode, 10);

    if (typeof parsedPhoneCode !== "number" || isNaN(parsedPhoneCode)) {
      setSendOTPMessage("error: Phone code must be a number");
      return;
    }

    setSendOTPPhoneCode(parsedPhoneCode);

    const parsedPhoneNumber = parseInt(sendOTPPhoneNumber, 10);

    if (typeof parsedPhoneNumber !== "number" || isNaN(sendOTPPhoneNumber)) {
      setSendOTPMessage("error: Phone number must be a number");
      return;
    }

    setSendOTPPhoneNumber(parsedPhoneNumber);

    const validChannels = ["sms", "wa", "call"];
    if (!validChannels.includes(sendOTPChannel)) {
      setSendOTPMessage("error: Invalid channel");
      return;
    }

    try {
      const { message } = await authService.sendOTP({
        phoneCode: parsedPhoneCode,
        phoneNumber: parsedPhoneNumber,
        channel: sendOTPChannel,
      });

      setSendOTPMessage(message);
    } catch (error) {
      setSendOTPMessage(`error: ${error.message}`);
    }
  };

  const verifyOTP = async (event) => {
    event.preventDefault();

    setVerifyOTPMessage("");

    if (!verifyOTPPhoneCode || !verifyOTPPhoneNumber || !verifyOTPCode) {
      setVerifyOTPMessage("error: Please fill all fields");
      return;
    }

    const parsedPhoneCode = parseInt(verifyOTPPhoneCode, 10);

    if (typeof parsedPhoneCode !== "number" || isNaN(parsedPhoneCode)) {
      setVerifyOTPMessage("error: Phone code must be a number");
      return;
    }

    setVerifyOTPPhoneCode(parsedPhoneCode);

    const parsedPhoneNumber = parseInt(verifyOTPPhoneNumber, 10);

    if (typeof parsedPhoneNumber !== "number" || isNaN(sendOTPPhoneNumber)) {
      setVerifyOTPMessage("error: Phone number must be a number");
      return;
    }

    setVerifyOTPPhoneNumber(parsedPhoneNumber);

    const trimmedOTPCode = verifyOTPCode.trim();

    if (!trimmedOTPCode) {
      setSendOTPMessage("error: Please enter a OTP");
      return;
    }

    try {
      await authService.verifyOTP({
        phoneCode: parsedPhoneCode,
        phoneNumber: parsedPhoneNumber,
        otp: trimmedOTPCode,
      });
    } catch (error) {
      setVerifyOTPMessage(`error: ${error.message}`);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const getIdToken = async () => {
    const idToken = await user.getIdToken();

    alert(idToken);
  };

  return (
    <div className="App">
      <div>
        <h3> Send OTP </h3>
        <form onSubmit={sendOTP}>
          <input
            placeholder="Phone code"
            name="phoneCode"
            required
            onChange={(event) => {
              setSendOTPPhoneCode(event.target.value);
            }}
          />
          <input
            placeholder="Phone number"
            name="phoneNumber"
            required
            onChange={(event) => {
              setSendOTPPhoneNumber(event.target.value);
            }}
          />
          <input
            placeholder="Channel"
            name="channel"
            required
            onChange={(event) => {
              setSendOTPChannel(event.target.value);
            }}
          />
          <button type="submit"> Send OTP </button>
        </form>
        {sendOTPMessage && <div><p>{sendOTPMessage}</p></div>}
      </div>

      <div>
        <h3> Verify OTP </h3>
        <form onSubmit={verifyOTP}>
          <input
            placeholder="Phone code"
            name="phoneCode"
            required
            onChange={(event) => {
              setVerifyOTPPhoneCode(event.target.value);
            }}
          />
          <input
            placeholder="Phone number"
            name="phoneNumber"
            required
            onChange={(event) => {
              setVerifyOTPPhoneNumber(event.target.value);
            }}
          />
          <input
            placeholder="OTP"
            name="OTP Code"
            required
            onChange={(event) => {
              setVerifyOTPCode(event.target.value);
            }}
          />
          <button type="submit"> Verify OTP </button>
        </form>
        {
          verifyOTPMessage &&
          <div><p>{verifyOTPMessage}</p></div>
        }
      </div>
      {
        user?.email &&
        <div>
          <h4> User Logged In: </h4>
          <p>{user?.email}</p>
          <button onClick={logout}> Sign Out </button>
          <br/>
          <button onClick={getIdToken}> Get the ID TOKEN </button>
        </div>
      }
    </div>
  );
}

export default App;