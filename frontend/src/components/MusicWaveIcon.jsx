import React from "react";

/**
 * 🎵 MusicWaveIcon
 * A modern, audio-synced music wave icon with dynamic amplitude, crests, and troughs.
 * When playing: smoothly undulates with organic wave crests.
 * When paused/muted: freezes at the exact current amplitude, crests, and troughs.
 * When resumed: continues forward seamlessly from the exact frozen state.
 */
export default function MusicWaveIcon({
  isPlaying = true,
  className = "",
  style = {},
  size = 14,
}) {
  return (
    <span
      className={`od-music-wave ${isPlaying ? "is-playing" : "is-paused"} ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "2.2px",
        height: `${size}px`,
        width: `${Math.round(size * 1.25)}px`,
        flexShrink: 0,
        verticalAlign: "middle",
        pointerEvents: "none",
        ...style,
      }}
      aria-hidden="true"
    >
      <span className="od-music-wave-bar od-music-wave-bar-1" />
      <span className="od-music-wave-bar od-music-wave-bar-2" />
      <span className="od-music-wave-bar od-music-wave-bar-3" />
      <span className="od-music-wave-bar od-music-wave-bar-4" />
      <span className="od-music-wave-bar od-music-wave-bar-5" />
    </span>
  );
}

