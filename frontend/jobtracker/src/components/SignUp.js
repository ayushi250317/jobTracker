import React, { useState } from "react";
// import { CognitoUserPool } from "amazon-cognito-identity-js";
import UserPool from "../UserPool";
import "./SignUp.css"
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const navigate=useNavigate();

    const toggleSignUp = () => {
        navigate('/');
      };

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    const onSubmit = (event) => {
        event.preventDefault();

        const attributeList = [
            {
                Name: "phone_number",
                Value: phone
            },
            {
                Name: "name",
                Value: name
            },
            {
                Name: "email",
                Value: email
            }
        ];

        UserPool.signUp(email, password, attributeList, null, (err, data) => {
            if (err) {
                console.error(err);
            } else {
                console.log(data);
                navigate("/");
            }
        });
    };

    return (
        <div className="signup-container">
            <h1>Job Tracker</h1>
            <form onSubmit={onSubmit} className="signup-form">
                <label htmlFor="email">Email</label>
                <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />
                <label htmlFor="password">Password</label>
                <input
                    type = "password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />
                <label htmlFor="name">Name</label>
                <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />
                <label htmlFor="phone">Phone</label>
                <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                />
                <button type="submit">Sign Up</button>
                <button onClick={toggleSignUp} className="btn">Already Registered? Login!</button>
            </form>
           
        </div>
    );
};

export default SignUp;
