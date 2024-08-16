import React, { useState } from "react";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import UserPool from "../UserPool";
import "./SignIn.css";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from 'jwt-decode';


const getUsernameFromToken = (idToken) => {
    try {
        const decodedToken = jwtDecode(idToken);
        const username = decodedToken.email;
        return username;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};


const SignIn = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const toggleSignIn = () => {
        navigate('/signup');
    };

    const onSubmit = (event) => {
        event.preventDefault();
        setError(null);

        const user = new CognitoUser({
            Username: email,
            Pool: UserPool
        });

        const authDetails = new AuthenticationDetails({
            Username: email,
            Password: password
        });

        user.authenticateUser(authDetails, {
            onSuccess: (data) => {
                const idToken = data.getIdToken().getJwtToken();
                const username = getUsernameFromToken(idToken);
                localStorage.setItem("idToken", idToken);
                localStorage.setItem('username', username);
                navigate('/home'); 
            },
            onFailure: (err) => {
                console.error("onFailure:", err);
                setError(err.message || "An error occurred during sign in");
            },
            newPasswordRequired: (data) => {
                console.log("newPasswordRequired:", data);
                // Handle new password required here
            }
        });
    };

    return (
        <div className="signin-container">
            <h1>Job Tracker</h1>
            <form onSubmit={onSubmit} className="signin-form">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <div className="error-message">{error}</div>}
                <button type="submit">Sign In</button>
                <button type="button" onClick={toggleSignIn} className="btn">Not registered yet? Register!</button>
            </form>
        </div>
    );
};

export default SignIn;
