import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import authService from '../auth.service';

import { GlobalContext } from '../../../App';

function SendOTP() {
    const [sendOTPPhoneCode, setSendOTPPhoneCode] = useState("");
    const [sendOTPPhoneNumber, setSendOTPPhoneNumber] = useState("");
    const [sendOTPChannel, setSendOTPChannel] = useState("");
    const [sendOTPMessage, setSendOTPMessage] = useState("");

    const ctx = useContext(GlobalContext);
    const navigate = useNavigate();

    const { user } = ctx;

    useEffect(() => {
        if (user) {
            return navigate("/home");
        }
    }, [navigate, user]);

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

    return (
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
    );
}

export default SendOTP;