import React, { useEffect, useState } from "react";

interface MatchScoreCircleProps {
  aiResponse: string;
}

const MatchScoreCircle: React.FC<MatchScoreCircleProps> = ({ aiResponse }) => {
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!aiResponse || aiResponse.trim() === "") return;

    try {
      const cleaned = aiResponse.replace(/```json|```/g, "").trim();
      if (!cleaned.startsWith("{") || !cleaned.endsWith("}")) return;

      const parsed = JSON.parse(cleaned);
      const extractedScore =
        typeof parsed.matchScore === "string"
          ? parseInt(parsed.matchScore)
          : parsed.matchScore;

      let progress = 0;
      const interval = setInterval(() => {
        progress += 1;
        setScore(progress);
        if (progress >= extractedScore) clearInterval(interval);
      }, 10);

      return () => clearInterval(interval);
    } catch (err) {
      console.error("Invalid JSON in AI response:", err);
    }
  }, [aiResponse]);

  const radius = 72;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (score / 100) * circumference;

  return (
    <div className="w-36 h-36 relative">
      <svg
        viewBox="0 0 144 144"
        width="100%"
        height="100%"
        className="transform -rotate-90"
      >
        <circle
          stroke="currentColor"
          className="text-gray-300 dark:text-gray-700"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="currentColor"
          className="text-blue-500 dark:text-blue-300"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-semibold text-gray-900 dark:text-white">
          {score}%
        </span>
      </div>
    </div>
  );
};

export default MatchScoreCircle;
