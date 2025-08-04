"use client";

import React, { useState } from "react";
import { useAtom } from "jotai";
import { useRouter, useSearchParams } from "next/navigation";
import { menuOpenAtom } from "@/store/atoms";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import MyDropzone from "@/components/DropZone";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, Loader2 } from "lucide-react";
import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { authAtom } from '@/store/authAtom';

export default function Generate() {

  // Check if user logged in via OAuth
  const searchParams = useSearchParams();
  const isOAuthLogin = searchParams.get('oauth') === 'true';
  const setAuth = useSetAtom(authAtom); // initialize setter
  // Store token in localStorage if user logged in via OAuth
  useEffect(() => {
  const storeToken = async () => {
    const res = await fetch("/api/token");
    const data = await res.json();
    if (data?.token) {
      localStorage.setItem("token", data.token);
      const payload = JSON.parse(atob(data.token.split(".")[1]));
      const email = payload.email || "";
      setAuth({ token: data.token, email: email }); // set global state
    }};

    if (isOAuthLogin) {
      storeToken();
    }
  }, [isOAuthLogin, setAuth]);

  // State variables
  const [inputMode, setInputMode] = useState<"text" | "pdf">("text");
  const [resume, setResume] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [job, setJob] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [customIndustry, setCustomIndustry] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [menuOpen] = useAtom(menuOpenAtom);
  const router = useRouter();

  const [step, setStep] = useState(0);
  const steps = ["Analyzing resume", "Analyzing job description", "Generating report"];

  // Predefined industries
  const industries = [
    "Tech",
    "Finance",
    "Healthcare",
    "Marketing",
    "Education",
    "Retail",
    "Human Resources",
    "Legal",
    "Telecommunications",
  ];
  // Get user email from token
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  let email = "";
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      email = payload.email || "";
    } catch {
      email = "";
    }
  }

  const handleGenerate = async () => {
    setLoading(true);
    setStep(0);
    try {
      let body: FormData | string;
      let headers: HeadersInit;
      const finalIndustry = customIndustry || selectedIndustry;

      if (!resumeFile && inputMode === "pdf") {
        alert("Please upload a PDF resume.");
        setLoading(false);
        return;
      }

      if (inputMode === "pdf" && resumeFile) {
        body = new FormData();
        body.append("resume", resumeFile);
        body.append("job", job);
        body.append("email", email);
        body.append("industry", finalIndustry);
        headers = {};
      } else {
        body = JSON.stringify({ resume, job, email, industry: finalIndustry });
        headers = { "Content-Type": "application/json" };
      }

      for (let i = 0; i < steps.length; i++) {
        setStep(i);
        await new Promise((r) => setTimeout(r, 500));
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers,
        body,
      });

      const data = await response.json();
      if (data.output === "User has not registered. Register first before use.") {
        setShowAlert(true);
        setAlertMessage("User has not registered. Register first.");
        return;
      }

      if (data.output === "Usage limit reached. Please upgrade.") {
        setShowAlert(true);
        setAlertMessage("Usage limit reached. Please upgrade.");
        return;
      }

      if (data.output === "Usage temporarily limited. Please wait and try again shortly.") {
        setShowAlert(true);
        setAlertMessage("Usage temporarily limited. Please wait and try again shortly.");
        return;
      }

      localStorage.setItem("aiReport", data.output || "");
      router.push("/report");
    } catch {
      setShowAlert(true);
      setAlertMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const textAreaClass =
    "shadow-lg dark:shadow-sm dark:shadow-neutral-800 dark:bg-neutral-800 dark:border-none dark:text-white border border-neutral-200 bg-neutral-50 w-full md:w-1/2 h-48 md:h-100 p-3 placeholder-gray-500 dark:placeholder-gray-200 rounded resize-none focus:outline-none";

  return (
    <div className={`flex flex-col items-center p-4 md:mt-12 sm:p-8 w-full min-h-screen bg-[#181a23]${menuOpen ? " hidden" : ""}`}>
      {/* Mode Toggle */}
      <div className="mb-4 flex flex-col sm:flex-row gap-2">
        <FormControl>
          <FormLabel
            id="resumeContent"
            sx={{
              color: "black",
              ".dark &": { color: "white" },
              "&.Mui-focused": { color: "green" },
            }}
            className="dark:text-white"
          >
            Choose how to provide resume:
          </FormLabel>
          <RadioGroup
            name="resume-mode"
            row
            value={inputMode}
            onChange={(_, value) => setInputMode(value as "text" | "pdf")}
          >
            <FormControlLabel
              value="text"
              control={<Radio sx={{ color: "gray", "&.Mui-checked": { color: "green" } }} />}
              label={<span className="text-black dark:text-white">Paste Text</span>}
            />
            <FormControlLabel
              value="pdf"
              control={<Radio sx={{ color: "gray", "&.Mui-checked": { color: "green" } }} />}
              label={<span className="text-black dark:text-white">Upload PDF</span>}
            />
          </RadioGroup>
        </FormControl>
      </div>

      {/* Resume & Job Inputs */}
      <div className="flex flex-col md:flex-row w-full max-w-6xl gap-4 mb-6">
        {inputMode === "text" ? (
          <textarea
            className={textAreaClass}
            placeholder="Paste your resume here"
            value={resume}
            onChange={(e) => setResume(e.target.value)}
          />
        ) : (
          <div className={textAreaClass}>
            <MyDropzone setFile={setResumeFile} />
          </div>
        )}
        <textarea
          className={textAreaClass}
          placeholder="Paste the job description here"
          value={job}
          onChange={(e) => setJob(e.target.value)}
        />
      </div>

      {/* Industry Selector + Custom Input */}
      <div className="w-full max-w-6xl overflow-x-auto mb-4 mt-2 md:mt-6">
        <div className="flex flex-wrap items-center gap-2 w-max">
          <p className="flex items-center dark:text-white text-white whitespace-nowrap pr-2">Industries:</p>
          {industries.map((industry) => (
            <button
              key={industry}
              onClick={() => {
                setSelectedIndustry(industry);
                setCustomIndustry("");
              }}
              className={`px-3 py-1 rounded-full border text-sm whitespace-nowrap transition ${
                selectedIndustry === industry && !customIndustry
                  ? "bg-pink-600 text-white"
                  : "bg-neutral-200 dark:bg-neutral-700 dark:text-white text-gray-800"
              }`}
            >
              {industry}
            </button>
          ))}
          <input
            type="text"
            placeholder="Other..."
            value={customIndustry}
            onChange={(e) => {
              setCustomIndustry(e.target.value);
              setSelectedIndustry("");
            }}
            className="px-3 py-1 rounded-full border text-sm text-black dark:text-white bg-white dark:bg-neutral-800 border-gray-300 dark:border-gray-600"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="h-8" />
      <div className="card" style={{ padding: "1px" }}>
        <div className="w-full max-w-3xl flex justify-center">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-6 py-2 whitespace-pre-wrap dark:bg-gray-950 dark:text-rose-50 bg-gray-50 text-neutral-700 rounded-[8px] transition duration-300 ease-in-out shadow-lg hover:shadow-pink-500/50 hover:border-pink-400 w-full sm:w-auto"
          >
            {loading ? "Analyzing..." : "Analyze Resume-to-Job Fit"} <AutoAwesomeIcon />
          </button>
        </div>
      </div>
      {/* Step Indicators – moved here */}
{loading && (
  <div className="w-full mt-6 flex justify-center">
    <div className="space-y-2 w-fit">
      {steps.map((label, index) => (
        <div key={index} className="flex items-center space-x-2">
          {step > index ? (
            <Check className="text-green-400" size={18} />
          ) : step === index ? (
            <Loader2 className="animate-spin text-yellow-400" size={18} />
          ) : (
            <div className="w-4 h-4 border rounded-full border-gray-400" />
          )}
          <span>{label}</span>
        </div>
      ))}
    </div>
  </div>
)}

      {/* Alert */}
      <div>
        {showAlert && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
