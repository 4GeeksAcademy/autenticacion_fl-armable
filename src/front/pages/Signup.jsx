// Signup.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {Demo} from "./Demo";

import useglobalReducer from "../hooks/useGlobalReducer"; // Custom hook for accessing the global state

export const Signup = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const [isSuscribed, setIsSubscribed] = useState(false); // State to track subscription status
    const { store, dispatch } = useglobalReducer(); // Access the global state and dispatch function
    const user = store.user; // Extract the user from the global state
    const navigate = useNavigate(); // Hook to programmatically navigate

    useEffect(() => {
        // If user is logged in, redirect to the demo page after 1 second delay
        if (user) {
            const timeout = setTimeout(() => {
                navigate("/demo");
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [user, navigate]);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setMessage("");
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL
            let path = "";
            if (isSuscribed) {
                path = "/api/login";
            } else {
                path = "/api/signup";
            }
            // Send a POST request to the backend for signup or login
            const resp = await fetch(backendUrl + path, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await resp.json();
            if (resp.status === 201 || resp.status === 200) {
                dispatch({ type: "add_user", payload: form.email });
            }
            if (resp.status === 200) {
                sessionStorage.setItem("token", data.access_token);
            }
            if (data.message) {
                setMessage(data.message);
                setForm({ email: "", password: "" });
            } else {
                setMessage("Error al crear o autenticar usuario");
            }
        } catch (error) {
            setMessage(`Error de red: ${error.message || error}`);
            console.error("Error en handleSubmit:", error);
        }
    };


    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body">
                            <h3 className="card-title mb-4 text-center">
                                {isSuscribed === false ? "Sign up" : "Log in"}
                            </h3>
                            <form onSubmit={handleSubmit}>
                                { isSuscribed === false &&                                
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Fullname</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="Fullname"
                                            name="Fullname"
                                        />
                                    </div>}
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">
                                    Submit
                                </button>
                            </form>
                            <div className="d-flex align-items-center my-3">
                                <hr className="flex-grow-1" />
                                <span className="mx-2 text-muted">OR</span>
                                <hr className="flex-grow-1" />
                            </div>
                            <button
                                type="button"
                                className="btn btn-secondary w-100"
                                onClick={() => setIsSubscribed(!isSuscribed)}
                            >
                                {isSuscribed ? "Signup" : "Login"}
                            </button>
                            {message && (
                                <div
                                    className={`alert mt-3 ${
                                        message.toLowerCase().includes("successfully")
                                            ? "alert-success"
                                            : "alert-danger"
                                    }`}
                                    role="alert"
                                >
                                    {message}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}