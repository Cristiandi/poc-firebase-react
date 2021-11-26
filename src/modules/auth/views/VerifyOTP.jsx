import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import authService from '../auth.service';

import { GlobalContext } from '../../../App';

const VerifyOTP = () => {
    const [verifyOTPPhoneCode, setVerifyOTPPhoneCode] = useState("");
    const [verifyOTPPhoneNumber, setVerifyOTPPhoneNumber] = useState("");
    const [verifyOTPCode, setVerifyOTPCode] = useState("");
    const [verifyOTPMessage, setVerifyOTPMessage] = useState("");

    const ctx = useContext(GlobalContext);
    const navigate = useNavigate();

    const { user } = ctx;

    useEffect(() => {
      if (user) {
          return navigate("/home");
      }
  }, [navigate, user]);

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
    
        if (typeof parsedPhoneNumber !== "number" || isNaN(parsedPhoneNumber)) {
          setVerifyOTPMessage("error: Phone number must be a number");
          return;
        }
    
        setVerifyOTPPhoneNumber(parsedPhoneNumber);
    
        const trimmedOTPCode = verifyOTPCode.trim();
    
        if (!trimmedOTPCode) {
          setVerifyOTPMessage("error: Please enter a OTP");
          return;
        }
    
        try {
          await authService.verifyOTP({
            phoneCode: parsedPhoneCode,
            phoneNumber: parsedPhoneNumber,
            otp: trimmedOTPCode,
          });

          navigate("/home");
        } catch (error) {
          setVerifyOTPMessage(`error: ${error.message}`);
        }
      };

    return (
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
    );
}

export default VerifyOTP;