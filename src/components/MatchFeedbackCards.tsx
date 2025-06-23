import React from "react";

interface MatchFeedbackProps {
  aiResponse: string;
}

const MatchFeedbackCards: React.FC<MatchFeedbackProps> = ({ aiResponse }) => {
  if (!aiResponse || aiResponse.trim() === "") {
    return <p className="text-gray-500 dark:text-gray-400">Awaiting AI feedback...</p>;
  }

  let parsed;
  try {
    const cleaned = aiResponse.replace(/```json|```/g, "").trim();

    if (!cleaned.startsWith("{") || !cleaned.endsWith("}")) {
      throw new Error("Response does not look like valid JSON.");
    }

    parsed = JSON.parse(cleaned);
  } catch (e) {
    console.error("Invalid JSON:", e);
    return <p className="text-red-500 dark:text-red-400">Failed to load AI feedback.</p>;
  }

  const { strengths = [], gaps = [], suggestions = [], summary = "" } = parsed;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <FeedbackCard title="✅ Strengths" items={strengths} color="green" />
      <FeedbackCard title="⚠️ Gaps or Weaknesses" items={gaps} color="red" />
      <FeedbackCard title="💡 Suggestions" items={suggestions} color="blue" />
      <SummaryCard summary={summary} />
    </div>
  );
};

const FeedbackCard = ({
  title,
  items,
  color
}: {
  title: string;
  items: string[];
  color: "green" | "red" | "blue";
}) => {
  const borderColors = {
    green: "border-green-400",
    red: "border-red-400",
    blue: "border-blue-400"
  };

  const textColors = {
    green: "text-green-700 dark:text-green-300",
    red: "text-red-700 dark:text-red-300",
    blue: "text-blue-700 dark:text-blue-300"
  };

  return (
    <div
      className={`p-4 border-l-4 ${borderColors[color]} bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg`}
    >
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
      <ul className={`list-disc list-inside space-y-1 ${textColors[color]}`}>
        {items.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
    </div>
  );
};

const SummaryCard = ({ summary }: { summary: string }) => (
  <div className="p-4 border-l-4 border-purple-400 bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg">
    <h3 className="text-lg font-semibold mb-2 text-purple-700 dark:text-purple-300">📝 Summary</h3>
    <p className="text-gray-700 dark:text-gray-300">{summary}</p>
  </div>
);

export default MatchFeedbackCards;
