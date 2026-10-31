import React from "react";

export default function ZombieRight({ width = 180, height = 150, className = "", style = {} }) {
  return (
    <img
      src="/zombie-right.png"
      alt="Zombie Tombstone Right"
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
