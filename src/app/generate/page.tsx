"use client";

import { useState } from "react";

export default function Generate() {
  const [resume, setResume] = useState("");
  const [job, setJob] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setOutput("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, job }),
      });
      console.log("Response status:", response.status);
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
      <div className="flex w-full max-w-3xl gap-4 mb-6">
        <textarea
          className="w-1/2 h-80 p-3 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Paste your resume here"
          value={resume}
          onChange={(e) => setResume(e.target.value)}
        />
        <textarea
          className="w-1/2 h-80 p-3 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Paste the job description here"
          value={job}
          onChange={(e) => setJob(e.target.value)}
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="px-6 py-2 mb-8 text-white bg-blue-600 rounded hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Cover Letter"}
      </button>

      <div className="w-full max-w-3xl h-100 border rounded shadow p-6 overflow-y-auto whitespace-pre-wrap">
        {output || "Your generated cover letter will appear here..."}
      </div>
    </div>
  );
}
