import React from "react";

export default function ZombieIcon({
  size = 22,
  className = "",
  style = {},
}) {
  return (
    <svg
      viewBox="0 0 140 140"
      width={size}
      height={size}
      className={className}
      style={{
        overflow: "visible",
        display: "inline-block",
        verticalAlign: "middle",
        flexShrink: 0,
        ...style,
      }}
    >
      <g transform="rotate(-6 70 75)">
        {/* Hard Drop Shadow */}
        <path
          d="M 32,56 C 26,30 40,16 70,14 C 100,16 114,30 108,56 C 108,86 98,108 68,108 C 38,108 32,86 32,56 Z"
          transform="translate(6, 6)"
          fill="#0D0D0D"
        />
        <circle cx="27" cy="74" r="11" fill="#0D0D0D" />
        <circle cx="113" cy="78" r="10" fill="#0D0D0D" />

        {/* Left Ear */}
        <circle cx="21" cy="68" r="11" fill="#9ED095" stroke="#0D0D0D" strokeWidth="4" />

        {/* Right Ear */}
        <circle cx="107" cy="72" r="10" fill="#9ED095" stroke="#0D0D0D" strokeWidth="4" />

        {/* Green Head Base */}
        <path
          d="M 26,52 C 20,26 36,12 66,10 C 96,12 110,26 104,52 C 104,82 94,104 64,104 C 34,104 26,82 26,52 Z"
          fill="#9ED095"
          stroke="#0D0D0D"
          strokeWidth="4"
        />

        {/* Pink Scalp / Brain Dome */}
        <path
          d="M 27,38 
             C 30,12 45,4 65,4 
             C 85,4 100,12 103,38 
             L 98,30 
             L 89,45 
             L 79,26 
             L 69,47 
             L 58,25 
             L 48,44 
             L 38,28 
             Z"
          fill="#F7D3DF"
          stroke="#0D0D0D"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        {/* Big Blank White Comic Eyes */}
        <ellipse cx="46" cy="54" rx="14" ry="16" fill="#FFFFFF" stroke="#0D0D0D" strokeWidth="4" />
        <ellipse cx="79" cy="59" rx="13" ry="15" fill="#FFFFFF" stroke="#0D0D0D" strokeWidth="4" />

        {/* Open Shocked Mouth */}
        <path
          d="M 46,76 Q 58,68 70,76 C 72,88 62,92 57,92 C 48,92 43,87 46,76 Z"
          fill="#0D0D0D"
          stroke="#0D0D0D"
          strokeWidth="4"
        />
        {/* Teeth */}
        <rect x="51" y="73" width="5.5" height="6" rx="1" fill="#FFFFFF" stroke="#0D0D0D" strokeWidth="2" />
        <rect x="58.5" y="74" width="5.5" height="6" rx="1" fill="#FFFFFF" stroke="#0D0D0D" strokeWidth="2" />
        {/* Pink Tongue */}
        <path d="M 50,87 Q 57,81 65,87 Q 57,91 50,87 Z" fill="#E06B85" />
      </g>
    </svg>
  );
}
