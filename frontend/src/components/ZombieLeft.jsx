import React from "react";

export default function ZombieLeft({ width = 140, height = 140, className = "", style = {} }) {
  return (
    <img
      src="/zombie-left.png"
      alt="Zombie Left"
      width={width}
      height={height}
      className={className}
      style={{
        display: "inline-block",
        objectFit: "contain",
        userSelect: "none",
        ...style,
      }}
    />
  );
}
