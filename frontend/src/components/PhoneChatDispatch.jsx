import React, { useState, useEffect, useRef } from "react";

const phoneStyles = `
  .neo-phone-footer-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    margin-top: -20px;
    margin-bottom: 0px !important;
    padding: 0 16px 0px 16px !important;
    position: relative;
    overflow: hidden;
  }

  /* Comic speech bubble popping above the phone */
  .neo-phone-comic-callout {
    background: #F7B919;
    color: #0D0D0D;
    font-family: 'Archivo Black', 'Titan One', cursive, sans-serif;
    font-size: 11px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    padding: 6px 14px;
    border: 2.5px solid #0D0D0D;
    border-radius: 12px 12px 12px 0px;
    box-shadow: 3px 3px 0px #0D0D0D;
    margin-bottom: -18px;
    z-index: 10;
    position: relative;
    transform: rotate(-1.5deg);
    display: inline-flex;
    align-items: center;
    gap: 6px;
    pointer-events: none;
  }

  .neo-phone-pulse-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #10B981;
    border: 1.5px solid #0D0D0D;
    box-shadow: 0 0 6px #10B981;
    display: inline-block;
    animation: neoPulseDot 1.4s infinite ease-in-out;
  }

  @keyframes neoPulseDot {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.3); opacity: 0.7; }
  }

  /* Hand Holding Phone Mockup */
  .neo-phone-container {
    position: relative;
    width: 100%;
    max-width: 440px;
    aspect-ratio: 1014 / 1292;
    filter: drop-shadow(0px -4px 16px rgba(0,0,0,0.6));
    user-select: none;
    margin-bottom: 0px !important;
    line-height: 0;
  }

  @media (max-width: 480px) {
    .neo-phone-container {
      max-width: 330px;
    }
  }

  /* Real-time Dynamic Chat Screen seated in the phone */
  .neo-phone-screen {
    position: absolute;
    left: 34.615%;
    top: 9.985%;
    width: 47.436%;
    height: 68.189%;
    z-index: 2;
    background: #0B0C10;
    border-radius: 7px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    line-height: normal;
  }

  /* The transparent phone & hand overlay */
  .neo-phone-frame-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
    display: block;
    vertical-align: bottom;
  }

  /* Phone Screen: OS Status Bar */
  .neo-ps-statusbar {
    background: #14161E;
    padding: 3px 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 8px;
    font-weight: 800;
    color: #8E9AA0;
    border-bottom: 1.5px solid #0D0D0D;
    letter-spacing: 0.04em;
    flex-shrink: 0;
    font-family: 'JetBrains Mono', monospace;
  }

  .neo-ps-battery-wrap {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .neo-ps-battery-gauge {
    position: relative;
    width: 14px;
    height: 7px;
    border: 1px solid #8E9AA0;
    border-radius: 2px;
    padding: 1px;
    display: flex;
    align-items: center;
    background: rgba(0, 0, 0, 0.45);
    box-sizing: border-box;
  }

  .neo-ps-battery-gauge::after {
    content: '';
    position: absolute;
    right: -2.5px;
    top: 1.5px;
    width: 1.5px;
    height: 3px;
    background: #8E9AA0;
    border-radius: 0 1px 1px 0;
  }

  .neo-ps-battery-fill {
    height: 100%;
    border-radius: 1px;
    transition: width 0.3s ease, background-color 0.3s ease;
  }

  .neo-ps-bolt-icon {
    width: 7px;
    height: 7px;
    color: #FACC15;
    display: inline-block;
  }

  /* Phone Screen: Chat Header */
  .neo-ps-header {
    background: #171922;
    padding: 7px 10px;
    border-bottom: 2px solid #0D0D0D;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    box-shadow: 0 2px 0px rgba(0,0,0,0.4);
  }

  .neo-ps-header-left {
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .neo-ps-avatar {
    width: 25px;
    height: 25px;
    border: 2px solid #0D0D0D;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 1.5px 1.5px 0px #0D0D0D;
    flex-shrink: 0;
    overflow: hidden;
    background: #191B22;
  }

  .neo-ps-avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .neo-ps-admin-info {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .neo-ps-admin-name {
    font-size: 10.5px;
    font-weight: 900;
    color: #FFFFFF;
    line-height: 1.1;
    letter-spacing: 0.04em;
    text-shadow: 1px 1px 0px #0D0D0D;
    text-transform: uppercase;
  }

  .neo-ps-admin-status {
    font-size: 7.5px;
    font-weight: 700;
    color: #A8B3B8;
    letter-spacing: 0.04em;
  }

  .neo-ps-header-badge {
    background: #9DE869;
    color: #0D0D0D;
    font-size: 7.5px;
    font-weight: 900;
    padding: 2px 6px;
    border: 1.5px solid #0D0D0D;
    border-radius: 5px;
    text-transform: uppercase;
    box-shadow: 1px 1px 0px #0D0D0D;
    letter-spacing: 0.04em;
  }

  /* Phone Screen: Scrollable Messages */
  .neo-ps-messages {
    flex: 1;
    overflow-y: auto;
    padding: 9px 7px;
    display: flex;
    flex-direction: column;
    gap: 7px;
    background: linear-gradient(rgba(9, 10, 14, 0.08), rgba(9, 10, 14, 0.16)), url('/admin-phone-wallpaper.jpg') center/cover no-repeat;
    scroll-behavior: smooth;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .neo-ps-messages::-webkit-scrollbar {
    width: 0px;
    height: 0px;
    display: none;
  }

  .neo-ps-empty {
    text-align: center;
    margin: auto 0;
    padding: 10px 4px;
    color: #64748B;
  }

  .neo-ps-empty-icon {
    font-size: 18px;
    margin-bottom: 4px;
    display: block;
    animation: neoPsWobble 2s infinite ease-in-out;
  }

  @keyframes neoPsWobble {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-8deg); }
    75% { transform: rotate(8deg); }
  }

  .neo-ps-empty-text {
    font-size: 9px;
    font-weight: 700;
    color: #94A3B8;
    line-height: 1.35;
  }

  /* Bubble Styling */
  .neo-ps-bubble-row {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .neo-ps-bubble-row.outgoing {
    align-items: flex-end;
  }

  .neo-ps-bubble-row.incoming {
    align-items: flex-start;
  }

  .neo-ps-bubble {
    max-width: 86%;
    padding: 5px 8px;
    border: 2px solid #0D0D0D;
    border-radius: 7px;
    font-size: 9.5px;
    font-weight: 600;
    line-height: 1.3;
    position: relative;
    word-break: break-word;
  }

  .neo-ps-bubble.outgoing {
    background: #FF70A6;
    color: #0D0D0D;
    box-shadow: 2px 2px 0px #0D0D0D;
    border-bottom-right-radius: 2px;
  }

  .neo-ps-bubble.incoming {
    background: #F9F9F3;
    color: #0D0D0D;
    box-shadow: 2px 2px 0px #0D0D0D;
    border-bottom-left-radius: 2px;
  }

  .neo-ps-bubble-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 6px;
    font-size: 7px;
    font-weight: 800;
    margin-top: 3px;
    opacity: 0.75;
  }

  .neo-ps-bubble-sender {
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  /* Phone Screen: Input Area */
  .neo-ps-input-area {
    background: #14161E;
    padding: 6px 8px 8px 10px;
    border-top: 2px solid #0D0D0D;
    display: flex;
    gap: 5px;
    align-items: center;
    flex-shrink: 0;
  }

  .neo-ps-input {
    flex: 1;
    background: #FFFFFF;
    border: 2px solid #0D0D0D;
    border-radius: 5px;
    padding: 5px 8px;
    font-size: 10px;
    font-weight: 600;
    color: #0D0D0D;
    outline: none;
    box-shadow: 1px 1px 0px #0D0D0D;
  }

  .neo-ps-input:focus {
    border-color: #0D0D0D;
    background: #FFFDF0;
  }

  .neo-ps-send-btn {
    width: 26px;
    height: 26px;
    background: #FF70A6;
    border: 2px solid #0D0D0D;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 900;
    color: #0D0D0D;
    cursor: pointer;
    box-shadow: 1.5px 1.5px 0px #0D0D0D;
    transition: all 0.1s ease;
    flex-shrink: 0;
  }

  .neo-ps-send-btn:hover:not(:disabled) {
    background: #F7B919;
    transform: translate(-1px, -1px);
    box-shadow: 2px 2px 0px #0D0D0D;
  }

  .neo-ps-send-btn:active:not(:disabled) {
    transform: translate(1px, 1px);
    box-shadow: 0.5px 0.5px 0px #0D0D0D;
  }

  .neo-ps-send-btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    background: #475569;
  }
`;

export default function PhoneChatDispatch() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [clockTime, setClockTime] = useState("");
  const bottomRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  const currentUser = sessionStorage.getItem("user") || "Student";

  // Clock in status bar
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setClockTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  // Hardware Battery Status Sync via Web Battery API
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isCharging, setIsCharging] = useState(false);

  useEffect(() => {
    let batteryInstance = null;
    let handleLevel = null;
    let handleCharging = null;

    if (typeof navigator !== "undefined" && "getBattery" in navigator) {
      navigator
        .getBattery()
        .then((battery) => {
          batteryInstance = battery;
          const updateBattery = () => {
            setBatteryLevel(Math.round(battery.level * 100));
            setIsCharging(Boolean(battery.charging));
          };
          updateBattery();

          handleLevel = () => updateBattery();
          handleCharging = () => updateBattery();
          battery.addEventListener("levelchange", handleLevel);
          battery.addEventListener("chargingchange", handleCharging);
        })
        .catch(() => {
          setBatteryLevel(98);
        });
    }

    return () => {
      if (batteryInstance) {
        if (handleLevel) batteryInstance.removeEventListener("levelchange", handleLevel);
        if (handleCharging) batteryInstance.removeEventListener("chargingchange", handleCharging);
      }
    };
  }, []);

  // Sync chat in real-time from localStorage & storage events
  const loadChat = () => {
    try {
      const stored = localStorage.getItem("odysseyChat");
      if (stored) {
        setChat(JSON.parse(stored));
      } else {
        setChat([]);
      }
    } catch (err) {
      console.error("Error reading odysseyChat", err);
    }
  };

  useEffect(() => {
    loadChat();
    const handleStorage = (e) => {
      if (e.key === "odysseyChat") loadChat();
    };
    window.addEventListener("storage", handleStorage);
    const interval = setInterval(loadChat, 600);
    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  // Filter messages relevant to this user
  const relevantMessages = chat.filter((msg) => {
    const userLower = (currentUser || "Student").toLowerCase();
    const msgName = (msg.name || "Student").toLowerCase();
    const senderLower = (msg.sender || "").toLowerCase();

    // If student user is logged in
    if (userLower !== "student" && userLower !== "admin") {
      return msgName === userLower || senderLower === userLower;
    }
    // Guest or generic student
    return msgName === "student" || senderLower === "student" || !msg.name;
  });

  // Auto scroll to latest message
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [relevantMessages.length]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMsg = {
      sender: currentUser,
      name: currentUser,
      text: message.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      timestamp: Date.now(),
    };

    const stored = JSON.parse(localStorage.getItem("odysseyChat") || "[]");
    const updated = [...stored, newMsg];
    localStorage.setItem("odysseyChat", JSON.stringify(updated));
    setChat(updated);
    setMessage("");

    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 50);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isOutgoing = (msg) => {
    return (
      msg.sender === currentUser ||
      (msg.sender !== "Admin" && currentUser.toLowerCase() === "student")
    );
  };

  return (
    <>
      <style>{phoneStyles}</style>

      <footer className="neo-phone-footer-wrapper">
        <div className="neo-phone-container">
          {/* Dynamic Interactive React Chat Screen (Seated right inside the phone's transparent screen) */}
          <div className="neo-phone-screen">
            {/* Status Bar */}
            <div className="neo-ps-statusbar">
              <span>{clockTime || "12:00"}</span>
              <div className="neo-ps-battery-wrap">
                {isCharging && (
                  <svg className="neo-ps-bolt-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M13 2L4 14h7l-2 8 11-12h-7l2-8z" />
                  </svg>
                )}
                <span>{batteryLevel}%</span>
                <div className="neo-ps-battery-gauge">
                  <div
                    className="neo-ps-battery-fill"
                    style={{
                      width: `${Math.max(10, Math.min(100, batteryLevel))}%`,
                      backgroundColor: batteryLevel <= 20 ? "#EF4444" : isCharging ? "#10B981" : "#8E9AA0",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Chat Top Bar */}
            <div className="neo-ps-header">
              <div className="neo-ps-header-left">
                <div className="neo-ps-avatar">
                  <img
                    src="/chief-librarian-dp.png"
                    alt="Chief Librarian"
                    className="neo-ps-avatar-img"
                  />
                </div>
                <div className="neo-ps-admin-info">
                  <span className="neo-ps-admin-name">CHIEF LIBRARIAN</span>
                  <span className="neo-ps-admin-status">ONLINE</span>
                </div>
              </div>
            </div>

            {/* Scrollable Chat Area */}
            <div ref={messagesContainerRef} className="neo-ps-messages">
              {/* Permanent Chief Librarian Initial Message */}
              <div className="neo-ps-bubble-row incoming">
                <div className="neo-ps-bubble incoming">
                  <div>
                    Got any queries about your prints or supply orders? Report them below.
                  </div>
                  <div className="neo-ps-bubble-meta">
                    <span className="neo-ps-bubble-sender">CHIEF LIBRARIAN</span>
                    <span>READY</span>
                  </div>
                </div>
              </div>

              {relevantMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`neo-ps-bubble-row ${
                    isOutgoing(msg) ? "outgoing" : "incoming"
                  }`}
                >
                  <div
                    className={`neo-ps-bubble ${
                      isOutgoing(msg) ? "outgoing" : "incoming"
                    }`}
                  >
                    <div>{msg.text}</div>
                    <div className="neo-ps-bubble-meta">
                      <span className="neo-ps-bubble-sender">
                        {isOutgoing(msg) ? "YOU" : "CHIEF LIBRARIAN"}
                      </span>
                      <span>{msg.time}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Bottom Input Area */}
            <div className="neo-ps-input-area">
              <input
                ref={inputRef}
                className="neo-ps-input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Send your transmission…"
                maxLength={300}
              />
              <button
                type="button"
                className="neo-ps-send-btn"
                onClick={sendMessage}
                disabled={!message.trim()}
                aria-label="Send Message"
              >
                ➤
              </button>
            </div>
          </div>

          {/* The Hand Holding Smartphone Frame Image (Transparent screen lets dynamic UI glow through) */}
          <img
            src="/hand-phone-clean.png"
            alt="Hand holding phone"
            className="neo-phone-frame-img"
          />
        </div>
      </footer>
    </>
  );
}
