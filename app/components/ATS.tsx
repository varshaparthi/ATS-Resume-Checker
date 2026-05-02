import React from "react";

interface ATSProps {
  score: number;
  suggestions: { type: "good" | "improve"; tip: string }[];
}

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
  // Determine colors and icon based on score
  const isStrong = score > 70;
  const isGood = score > 49;

  const gradientClass = isStrong
    ? "from-green-100"
    : isGood
    ? "from-yellow-100"
    : "from-red-100";

  const iconSrc = isStrong
    ? "/icons/ats-good.svg"
    : isGood
    ? "/icons/ats-warning.svg"
    : "/icons/ats-bad.svg";

  return (
    <div className={`bg-gradient-to-br ${gradientClass} to-white rounded-lg shadow-md p-6`}>
      {/* Top Section */}
      <div className="flex items-center gap-4 mb-6">
        <img src={iconSrc} alt="ATS Score Icon" className="w-12 h-12" />
        <div>
          <h3 className="text-2xl font-bold">ATS Score - {score}/100</h3>
        </div>
      </div>

      {/* Description Section */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-2">ATS Compatibility</h4>
        <p className="text-gray-600 mb-4">
          Your resume's ATS (Applicant Tracking System) compatibility score indicates how well your resume will be
          parsed and ranked by automated systems used by recruiters and HR departments.
        </p>
      </div>

      {/* Suggestions List */}
      <div className="mb-6">
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start gap-3">
              <img
                src={suggestion.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                alt={suggestion.type === "good" ? "Good" : "Improve"}
                className="w-5 h-5 mt-0.5"
              />
              <p className="text-sm">{suggestion.tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Closing Line */}
      <div className="pt-4 border-t border-gray-300">
        <p className="text-sm text-gray-700">
          Keep improving your ATS score to increase your chances of landing interviews!
        </p>
      </div>
    </div>
  );
};

export default ATS;