import React from "react";
import Link from "next/link";

export default function RegisterSuccess() {
    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <h1>Registration Successful!</h1>
            <p>Your account has been created successfully.</p>
            <Link
                href="/login"
                style={{ marginTop: 20, color: "#0070f3", textDecoration: "underline" }}
            >
                Go to Login
            </Link>
        </div>
    );
}