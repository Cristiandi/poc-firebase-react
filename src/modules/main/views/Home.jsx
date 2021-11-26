import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
    getAuth,
    signOut,
} from "firebase/auth";

import firebaseApp from "../../../firebase";

import { GlobalContext } from '../../../App';


function Home() {
    const ctx = useContext(GlobalContext);
    const navigate = useNavigate();

    const { user } = ctx;

    const auth = getAuth(firebaseApp);

    useEffect(() => {
        if (!user) {
            return navigate("/");
        }
    }, [navigate, user]);

    const logout = async (event) => {
        event.preventDefault();

        await signOut(auth);

        navigate("/");
    };

    const getIdToken = async () => {
        const idToken = await user.getIdToken();

        alert(idToken);
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>Home View</h1>
            {
                user?.email &&
                <div>
                    <h4> User Logged In: </h4>
                    <p>{user?.email}</p>
                    <button onClick={logout}> Sign Out </button>
                    <br />
                    <button onClick={getIdToken}> Get the ID TOKEN </button>
                </div>
            }
        </div>
    );
}

export default Home;