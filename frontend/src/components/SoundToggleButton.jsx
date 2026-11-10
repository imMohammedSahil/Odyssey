import React from "react";
import { useAudioState } from "../utils/audioManager";
import MusicWaveIcon from "./MusicWaveIcon";

export default function SoundToggleButton({ className = "", style = {} }) {
  const { isSoundOn, toggleSound } = useAudioState();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSound();
  };

  return (
    <button
      type="button"
      className={`od-sound-toggle-btn ${isSoundOn ? "is-sound-on" : "is-sound-off"} ${className}`}
      onClick={handleClick}
      aria-label={isSoundOn ? "Mute ambient music" : "Enable ambient music"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        cursor: "pointer",
        userSelect: "none",
        ...style,
      }}
    >
      <MusicWaveIcon isPlaying={isSoundOn} size={13} />
      <span>{isSoundOn ? "SOUND ON" : "SOUND OFF"}</span>
    </button>
  );
}
