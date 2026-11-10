// Odyssey Audio Manager
// Built to the "Click to Enable Music" Architectural & Technical Specification
// 1. baseAudio: Loopable ambient track for Odyssey base pages
// 2. paymentAudio: Dark gothic ambient track for /payment and /receipt

import { useState, useEffect } from "react";

const BASE_VOLUME = 0.32; // Comfortable low ambient volume (20%-35% rule)
const PAYMENT_VOLUME = 0.45;

function isPageReload() {
  if (typeof window === "undefined") return false;
  try {
    const navEntries = performance.getEntriesByType("navigation");
    if (navEntries && navEntries.length > 0) {
      return navEntries[0].type === "reload";
    }
  } catch (_) {}
  return false;
}

class BaseAudioManager {
  constructor() {
    this.audio = null;
    this.fadeInterval = null;
    this.wasPlayingBeforeHidden = false;
    this.isReload = isPageReload();
    this.hasSession = typeof window !== "undefined" && sessionStorage.getItem("odyssey_session_active") === "true";
    this.hasEnteredFirstTime = false;

    // If page was reloaded, user must explicitly click the sound pill button to enable music
    if (this.isReload) {
      this.active = false;
    } else if (!this.hasSession) {
      // First-time entry
      this.active = true;
      if (typeof window !== "undefined") {
        sessionStorage.setItem("odyssey_session_active", "true");
        this.hasSession = true;
      }
    } else {
      // SPA route navigation within session
      const savedPref = typeof window !== "undefined" ? localStorage.getItem("odyssey_music_enabled") : null;
      this.active = savedPref === null ? true : savedPref === "true";
    }

    if (typeof window !== "undefined") {
      this.initVisibilityListener();
    }
  }

  initVisibilityListener() {
    if (typeof document === "undefined") return;
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (this.audio && !this.audio.paused) {
          this.wasPlayingBeforeHidden = true;
          this.audio.pause();
        }
      } else {
        // Returned to tab: Resume only if music was active & playing before hidden
        if (this.wasPlayingBeforeHidden && this.active && !this.isReload) {
          this.wasPlayingBeforeHidden = false;
          const audio = this.getAudio();
          if (audio) {
            audio.play().then(() => {
              this.fadeVolume(BASE_VOLUME, 1000);
            }).catch(() => {
              // If browser requires user interaction to resume after tab switch:
              const resumeOnInteraction = () => {
                window.removeEventListener("pointerdown", resumeOnInteraction);
                window.removeEventListener("click", resumeOnInteraction);
                window.removeEventListener("keydown", resumeOnInteraction);
                if (this.active && audio.paused) {
                  audio.play().then(() => this.fadeVolume(BASE_VOLUME, 1000)).catch(() => {});
                }
              };
              window.addEventListener("pointerdown", resumeOnInteraction, { once: true, passive: true });
              window.addEventListener("click", resumeOnInteraction, { once: true, passive: true });
              window.addEventListener("keydown", resumeOnInteraction, { once: true, passive: true });
            });
          }
        }
      }
    });
  }

  isFirstTimeEntry() {
    if (this.isReload || this.hasEnteredFirstTime) return false;
    return !this.hasSession;
  }

  getAudio() {
    if (!this.audio && typeof window !== "undefined") {
      this.audio = new Audio("/landing-ambient.mp3");
      this.audio.loop = true;
      this.audio.volume = 0; // Starts at 0 for gentle fade-in
      this.audio.preload = "auto";

      // Restore saved timestamp if refreshing on a base page
      const savedTime = sessionStorage.getItem("odyssey_base_ambient_time");
      if (savedTime) {
        const t = parseFloat(savedTime);
        if (!isNaN(t) && t > 0) {
          try {
            this.audio.currentTime = t;
          } catch (e) {
            const onMeta = () => {
              try {
                this.audio.currentTime = t;
              } catch (_) {}
              this.audio.removeEventListener("loadedmetadata", onMeta);
            };
            this.audio.addEventListener("loadedmetadata", onMeta, { once: true });
          }
        }
      }

      // Continuously persist current playback position for refresh continuity
      this.audio.addEventListener("timeupdate", () => {
        if (this.audio && !this.audio.paused) {
          sessionStorage.setItem("odyssey_base_ambient_time", this.audio.currentTime.toString());
        }
      });

      // Global sync dispatchers for hardware audio events
      const notifySync = () => {
        if (typeof window !== "undefined") {
          const on = this.isSoundOn();
          window.dispatchEvent(
            new CustomEvent("odyssey_audio_sync", {
              detail: {
                isSoundOn: on,
                isPlaying: on && !this.audio.paused,
                muted: !on,
              },
            })
          );
        }
      };

      this.audio.addEventListener("play", notifySync);
      this.audio.addEventListener("playing", notifySync);
      this.audio.addEventListener("pause", notifySync);
      this.audio.addEventListener("volumechange", notifySync);
      this.audio.addEventListener("ended", notifySync);
    }
    return this.audio;
  }

  // Smooth volume ramp helper (50ms steps, prevents clipping & startling)
  fadeVolume(targetVolume, durationMs = 1000, onComplete) {
    const audio = this.audio;
    if (!audio) return;
    if (this.fadeInterval) clearInterval(this.fadeInterval);

    const stepMs = 50;
    const steps = durationMs / stepMs;
    const volumeStep = (targetVolume - audio.volume) / steps;

    this.fadeInterval = setInterval(() => {
      if (!this.audio) {
        clearInterval(this.fadeInterval);
        return;
      }
      let nextVol = this.audio.volume + volumeStep;
      if ((volumeStep > 0 && nextVol >= targetVolume) || (volumeStep < 0 && nextVol <= targetVolume)) {
        this.audio.volume = Math.max(0, Math.min(1, targetVolume));
        clearInterval(this.fadeInterval);
        if (onComplete) onComplete();
      } else {
        this.audio.volume = Math.max(0, Math.min(1, nextVol));
      }
    }, stepMs);
  }

  isSoundOn() {
    if (!this.active) {
      return false;
    }
    if (this.isReload && !this.userExplicitlyToggledOn) {
      return false;
    }
    if (this.audio) {
      return !this.audio.muted && !this.audio.paused;
    }
    return this.active;
  }

  isMuted() {
    return !this.isSoundOn();
  }

  // First-time entry gesture unlock ONLY (Never runs on refresh or random clicks)
  setupFirstTimeUnlock() {
    if (typeof window === "undefined" || this.hasFirstTimeUnlockBound) return;
    this.hasFirstTimeUnlockBound = true;

    const unlock = () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("click", unlock);
      window.removeEventListener("keydown", unlock);

      if (this.active && !this.isReload && this.audio && this.audio.paused) {
        this.play();
      }
    };

    window.addEventListener("pointerdown", unlock, { once: true, passive: true });
    window.addEventListener("click", unlock, { once: true, passive: true });
    window.addEventListener("keydown", unlock, { once: true, passive: true });
  }

  play() {
    // 🛡️ CRITICAL GUARD: Never play base starting track on /payment or /receipt!
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path.startsWith("/payment") || path.startsWith("/receipt")) {
        return;
      }
    }

    // On reload, do not auto-play unless user explicitly clicked the sound toggle pill
    if (this.isReload && !this.userExplicitlyToggledOn) {
      return;
    }

    const audio = this.getAudio();
    if (!audio) return;

    this.active = true;
    audio.muted = false;

    if (audio.paused) {
      const p = audio.play();
      if (p !== undefined) {
        p.then(() => {
          this.fadeVolume(BASE_VOLUME, 1000);
        }).catch(() => {
          // If first time entry requires interaction, bind once
          if (this.isFirstTimeEntry()) {
            this.setupFirstTimeUnlock();
          }
        });
      } else {
        this.fadeVolume(BASE_VOLUME, 1000);
      }
    } else {
      this.fadeVolume(BASE_VOLUME, 800);
    }
  }

  stop() {
    this.active = false;
    if (this.fadeInterval) clearInterval(this.fadeInterval);
    if (this.audio) {
      if (!this.audio.paused) {
        sessionStorage.setItem("odyssey_base_ambient_time", this.audio.currentTime.toString());
      }
      this.fadeVolume(0, 400, () => {
        if (this.audio) this.audio.pause();
      });
    }
  }

  // Explicit pill button toggle
  toggleMute() {
    const audio = this.getAudio();
    if (!audio) return false;

    this.userExplicitlyToggledOn = true;
    this.isReload = false; // Reset reload barrier once user interacts with pill

    const currentlyOn = this.isSoundOn();
    const newOn = !currentlyOn;

    if (newOn) {
      this.active = true;
      audio.muted = false;
      if (typeof window !== "undefined") {
        localStorage.setItem("odyssey_music_enabled", "true");
        sessionStorage.setItem("odyssey_audio_muted", "false");
      }
      audio.play().then(() => {
        this.fadeVolume(BASE_VOLUME, 1000);
      }).catch(() => {});
    } else {
      this.active = false;
      if (typeof window !== "undefined") {
        localStorage.setItem("odyssey_music_enabled", "false");
        sessionStorage.setItem("odyssey_audio_muted", "true");
      }
      this.fadeVolume(0, 600, () => {
        audio.pause();
      });
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("odyssey_audio_sync", {
          detail: {
            isSoundOn: newOn,
            isPlaying: newOn,
            muted: !newOn,
          },
        })
      );
      window.dispatchEvent(
        new CustomEvent("odyssey_audio_mute_change", {
          detail: { muted: !newOn },
        })
      );
    }

    return newOn;
  }
}

class PaymentAudioManager {
  constructor() {
    this.audio = null;
    this.active = false;
    this.fadeInterval = null;
  }

  getAudio() {
    if (!this.audio && typeof window !== "undefined") {
      this.audio = new Audio("/cthulhu-ambient.mp3");
      this.audio.loop = true;
      this.audio.volume = 0;
      this.audio.preload = "auto";
    }
    return this.audio;
  }

  fadeVolume(targetVolume, durationMs = 1000, onComplete) {
    const audio = this.audio;
    if (!audio) return;
    if (this.fadeInterval) clearInterval(this.fadeInterval);

    const stepMs = 50;
    const steps = durationMs / stepMs;
    const volumeStep = (targetVolume - audio.volume) / steps;

    this.fadeInterval = setInterval(() => {
      if (!this.audio) {
        clearInterval(this.fadeInterval);
        return;
      }
      let nextVol = this.audio.volume + volumeStep;
      if ((volumeStep > 0 && nextVol >= targetVolume) || (volumeStep < 0 && nextVol <= targetVolume)) {
        this.audio.volume = Math.max(0, Math.min(1, targetVolume));
        clearInterval(this.fadeInterval);
        if (onComplete) onComplete();
      } else {
        this.audio.volume = Math.max(0, Math.min(1, nextVol));
      }
    }, stepMs);
  }

  startPayment() {
    // ✦ Hard stop base starting ambient track unconditionally
    baseAudio.stop();

    const audio = this.getAudio();
    if (!audio) return;

    this.active = true;
    try {
      audio.currentTime = 8.0;
    } catch (e) {
      const onMeta = () => {
        try {
          audio.currentTime = 8.0;
        } catch (_) {}
        audio.removeEventListener("loadedmetadata", onMeta);
      };
      audio.addEventListener("loadedmetadata", onMeta, { once: true });
    }

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        this.fadeVolume(PAYMENT_VOLUME, 1200);
      }).catch(() => {
        // Unlock on payment click
        const unlockPay = () => {
          window.removeEventListener("click", unlockPay);
          if (this.active) {
            audio.play().then(() => this.fadeVolume(PAYMENT_VOLUME, 1000)).catch(() => {});
          }
        };
        window.addEventListener("click", unlockPay, { once: true });
      });
    }
  }

  continueNormally() {
    const audio = this.getAudio();
    if (!audio) return;

    this.active = true;
    if (audio.paused) {
      audio.play().then(() => {
        this.fadeVolume(PAYMENT_VOLUME, 1000);
      }).catch(() => {});
    }
  }

  stopAndReset() {
    this.active = false;
    if (this.fadeInterval) clearInterval(this.fadeInterval);
    if (this.audio) {
      this.fadeVolume(0, 300, () => {
        if (this.audio) {
          this.audio.pause();
          try {
            this.audio.currentTime = 8.0;
          } catch (e) {}
        }
      });
    }
  }
}

export const baseAudio = new BaseAudioManager();
export const paymentAudio = new PaymentAudioManager();

/**
 * Universal React hook to synchronize all sound pill buttons across Odyssey
 */
export function useAudioState() {
  const [isSoundOn, setIsSoundOn] = useState(() => baseAudio.isSoundOn());

  useEffect(() => {
    // Initial sync on mount
    setIsSoundOn(baseAudio.isSoundOn());

    const handleSync = (e) => {
      if (typeof e.detail?.isSoundOn === "boolean") {
        setIsSoundOn(e.detail.isSoundOn);
      } else if (typeof e.detail?.muted === "boolean") {
        setIsSoundOn(!e.detail.muted);
      } else {
        setIsSoundOn(baseAudio.isSoundOn());
      }
    };

    window.addEventListener("odyssey_audio_sync", handleSync);
    window.addEventListener("odyssey_audio_mute_change", handleSync);
    window.addEventListener("odyssey_audio_playback_change", handleSync);

    const audio = baseAudio.getAudio();
    const handleAudioEvent = () => setIsSoundOn(baseAudio.isSoundOn());

    if (audio) {
      audio.addEventListener("play", handleAudioEvent);
      audio.addEventListener("pause", handleAudioEvent);
      audio.addEventListener("playing", handleAudioEvent);
      audio.addEventListener("volumechange", handleAudioEvent);
    }

    return () => {
      window.removeEventListener("odyssey_audio_sync", handleSync);
      window.removeEventListener("odyssey_audio_mute_change", handleSync);
      window.removeEventListener("odyssey_audio_playback_change", handleSync);
      if (audio) {
        audio.removeEventListener("play", handleAudioEvent);
        audio.removeEventListener("pause", handleAudioEvent);
        audio.removeEventListener("playing", handleAudioEvent);
        audio.removeEventListener("volumechange", handleAudioEvent);
      }
    };
  }, []);

  const toggleSound = () => baseAudio.toggleMute();

  return { isSoundOn, toggleSound };
}
