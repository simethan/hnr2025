import React from "react";

interface CookedMeterProps {
  score: number;
}

export function CookedMeter({ score }: CookedMeterProps) {
  const getDonenessLevel = (score: number) => {
    if (score < 2) return "Raw";
    if (score < 4) return "Rare";
    if (score < 6) return "Medium Rare";
    if (score < 8) return "Medium";
    if (score < 9) return "Medium Well";
    return "Well Done";
  };

  const getColor = (score: number) => {
    if (score < 2) return "bg-red-100";
    if (score < 4) return "bg-red-300";
    if (score < 6) return "bg-red-500";
    if (score < 8) return "bg-red-700";
    if (score < 9) return "bg-red-900";
    return "bg-gray-900";
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-2 text-xl font-semibold">🧑‍🍳 Cooked-ness Meter 👩‍🍳</div>
      <div className="w-full h-4 bg-white rounded-full">
        <div
          className={`h-full rounded-full ${getColor(score)}`}
          style={{ width: `${score * 10}%` }}
        ></div>
      </div>
      <div className="mt-2 text-xl font-semibold">
        {getDonenessLevel(score)} ({score.toFixed(0)}/10)
      </div>
    </div>
  );
}
