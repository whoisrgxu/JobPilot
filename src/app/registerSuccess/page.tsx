"use client";
import React, {/*useEffect*/} from "react";
import Link from "next/link";
import {/*useRouter*/} from "next/navigation"

export default function RegisterSuccess() {

  // const router = useRouter();

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     router.push("/login"); // redirect to login if no token
  //   }
  // }, [router]);
    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold mb-4">Registration Successful!</h1>
            <p className="mb-6">Your account has been created successfully.</p>
            <Link
            href="/login"
            className="mt-2 text-pink-500 underline hover:text-pink-600"
            >
            Go to Login
            </Link>
        </div>
    );
}