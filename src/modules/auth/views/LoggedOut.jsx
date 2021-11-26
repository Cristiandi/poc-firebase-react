import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { GlobalContext } from '../../../App';

const LoggedOut = () => {
    const ctx = useContext(GlobalContext);
    const navigate = useNavigate();

    const { user } = ctx;

    useEffect(() => {
        if (user) {
            return navigate("/home");
        }
    }, [navigate, user]);

    return (
        <div>
            <h1>Logged Out</h1>
            <p>You have been logged out</p>
        </div>
    );
};

export default LoggedOut;