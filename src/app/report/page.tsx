"use client";

import { useEffect, useState } from "react";
import MatchScoreFromAI from "@/components/MatchScoreCircle";
import MatchFeedbackCards from "@/components/MatchFeedbackCards";

export default function ReportPage() {
  const [output, setOutput] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("aiReport");
    if (stored) {
      setOutput(stored);
    }
  }, []);

  if (!output) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-red-600 dark:text-red-400 text-lg">
          ❗ No report data found. Please return and generate again.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-4 py-10 text-black dark:text-white flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-center">🎯 Resume-to-Job Fit Report</h1>
      <div className="w-full max-w-xl flex justify-center mb-10">
        <MatchScoreFromAI aiResponse={output} />
      </div>
      <div className="w-full max-w-8xl px-4">
        <MatchFeedbackCards aiResponse={output} />
      </div>
    </div>
  );
}
