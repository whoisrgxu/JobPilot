"use client";
import { useState } from "react";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import UploadIcon from '@mui/icons-material/Upload';

export default function Generate() {
  const [inputMode, setInputMode] = useState<"text" | "pdf">("text");
  const [resume, setResume] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [job, setJob] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setOutput("");

    try {
      let body: FormData | string;
      let headers: HeadersInit;
      console.log("Input Mode:", inputMode);
      if (!resumeFile && inputMode === "pdf") {
        alert("Please upload a PDF resume.");
        return;
      }
      if (inputMode === "pdf" && resumeFile) {
        body = new FormData();
        body.append("resume", resumeFile);
        body.append("job", job);
        headers = {}; // FormData sets headers automatically
      } else {
        body = JSON.stringify({ resume, job });
        console.log("body:", body);
        headers = { "Content-Type": "application/json" };
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers,
        body,
      });

      const data = await response.json();
      setOutput(data.output || "No response received.");
    } catch (err) {
      console.error("Error generating cover letter:", err);
      setOutput("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-8">
      {/* Mode Toggle */}
      <div className="mb-4">
        <button
          className={`px-4 py-2 mr-2 border-pink-600 border-2 rounded ${
            inputMode === "text" ? "bg-pink-600 text-white" : "bg-[#1c1f2b] border-pink-500 border-2"
          }`}
          onClick={() => setInputMode("text")}
        >
          Paste Text <ContentCopyIcon fontSize="small"/>
        </button>
        <button
          className={`px-4 py-2  border-pink-600 border-2 rounded ${
            inputMode === "pdf" ? "bg-pink-600 text-white" : "bg-[#1c1f2b] border-[#2d2d2d]"
          }`}
          onClick={() => setInputMode("pdf")}
        >
          Upload PDF
          <UploadIcon fontSize="small"/>
        </button>
      </div>

      {/* Resume Input */}
      <div className="flex w-full max-w-3xl gap-4 mb-6">
        {inputMode === "text" ? (
          <textarea
            className="w-1/2 h-80 p-3 border placeholder-gray-350 rounded resize-none focus:outline-none focus:ring-2 focus:border-none focus:ring-pink-600"
            placeholder="Paste your resume here"
            value={resume}
            onChange={(e) => setResume(e.target.value)}
          />
        ) : (
          <input
            type="file"
            accept=".pdf"
            className="w-1/2 p-3 border rounded"
            onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
          />
        )}
        <textarea
          className="w-1/2 h-80 p-3 border rounded placeholder-gray-350 resize-none focus:outline-none focus:ring-2 focus:border-none focus:ring-pink-600"
          placeholder="Paste the job description here"
          value={job}
          onChange={(e) => setJob(e.target.value)}
        />
      </div>

      {/* Button */}
      <div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-6 py-2 text-white border-2 border-pink-500 rounded transition duration-300 ease-in-out shadow-lg hover:shadow-pink-500/50 hover:border-pink-400"
        >
          {loading ? "Generating..." : "Generate Cover Letter"}
          <ArrowDropDownIcon/>
        </button>
      </div>
      <div className="h-8" />
      {/* Output */}
      <div className="card">
        <div className="w-full h-100 whitespace-pre-wrap bg-[#1c1f2b] p-8 rounded-[10px]">
          {output || "Your generated cover letter will appear here..."}
        </div>
      </div>
    </div>
  );
}
