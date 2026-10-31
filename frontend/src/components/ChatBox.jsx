import React, { useState, useEffect, useRef } from "react";

const chatStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

  .cb-root {
    font-family: 'DM Sans', sans-serif;
    display: flex;
    flex-direction: column;
    background: #090a0e;
    color: #cdd2dc;
  }

  .cb-root * { box-sizing: border-box; }

  /* HEADER */
  .cb-header {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 13px 16px;
    background: rgba(11, 12, 17, 0.96);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(130, 100, 210, 0.1);
  }

  .cb-back-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 7px;
    border: 1px solid rgba(130, 100, 210, 0.18);
    background: rgba(157, 133, 232, 0.07);
    color: #a89fd6;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.15s ease, color 0.15s ease;
    flex-shrink: 0;
  }

  .cb-back-btn:hover {
    background: rgba(157, 133, 232, 0.15);
    color: #c4bcef;
  }

  .cb-header-title {
    font-size: 14px;
    font-weight: 600;
    color: #ddd6f5;
    letter-spacing: 0.1px;
  }

  .cb-header-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #6ee7b7;
    box-shadow: 0 0 6px rgba(110, 231, 183, 0.6);
    margin-right: 2px;
  }

  /* MESSAGE AREA */
  .cb-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px 14px;
    background: #09090e;
    scroll-behavior: smooth;
  }

  .cb-messages::-webkit-scrollbar {
    width: 4px;
  }
  .cb-messages::-webkit-scrollbar-track {
    background: transparent;
  }
  .cb-messages::-webkit-scrollbar-thumb {
    background: rgba(130, 100, 210, 0.2);
    border-radius: 4px;
  }
  .cb-messages::-webkit-scrollbar-thumb:hover {
    background: rgba(130, 100, 210, 0.35);
  }

  /* STUDENT LIST */
  .cb-student-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 11px 14px;
    border-radius: 9px;
    cursor: pointer;
    margin-bottom: 4px;
    border: 1px solid transparent;
    transition: background 0.15s ease, border-color 0.15s ease;
  }

  .cb-student-row:hover {
    background: rgba(157, 133, 232, 0.07);
    border-color: rgba(130, 100, 210, 0.15);
  }

  .cb-student-name {
    font-size: 13.5px;
    color: #b8bfcc;
    font-weight: 500;
  }

  .cb-unread-badge {
    background: #6d5fc5;
    color: #e8e2ff;
    border-radius: 100px;
    padding: 2px 8px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.2px;
    box-shadow: 0 0 10px rgba(110, 80, 210, 0.3);
  }

  /* MESSAGE ROWS */
  .cb-msg-row {
    display: flex;
    margin-bottom: 6px;
    animation: cb-msg-in 0.22s ease both;
  }

  @keyframes cb-msg-in {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .cb-msg-row.outgoing { justify-content: flex-end; }
  .cb-msg-row.incoming { justify-content: flex-start; }

  .cb-bubble {
    display: inline-block;
    max-width: 75%;
    padding: 9px 13px 7px;
    border-radius: 14px;
    line-height: 1.45;
    word-break: break-word;
    overflow-wrap: anywhere;
    white-space: pre-wrap;
    font-size: 13.5px;
    transition: opacity 0.15s ease;
  }

  .cb-bubble.outgoing {
    background: linear-gradient(135deg, #5b4fcf, #4f46e5);
    color: #eeeaff;
    border-bottom-right-radius: 4px;
    box-shadow: 0 2px 12px rgba(79, 70, 229, 0.3);
  }

  .cb-bubble.incoming {
    background: #14161e;
    color: #c8cedb;
    border: 1px solid rgba(130, 100, 210, 0.1);
    border-bottom-left-radius: 4px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  }

  .cb-bubble:hover { opacity: 0.92; }

  .cb-time {
    font-size: 10px;
    opacity: 0.55;
    margin-top: 4px;
    text-align: right;
    letter-spacing: 0.2px;
  }

  /* INPUT AREA */
  .cb-input-area {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-top: 1px solid rgba(130, 100, 210, 0.1);
    background: rgba(11, 12, 17, 0.97);
  }

  .cb-input {
    flex: 1;
    padding: 10px 14px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(130, 100, 210, 0.14);
    border-radius: 10px;
    color: #d0d5df;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px;
    outline: none;
    transition: border-color 0.18s ease, box-shadow 0.18s ease;
    caret-color: #9d85e8;
  }

  .cb-input::placeholder { color: #3e4558; }

  .cb-input:focus {
    border-color: rgba(157, 133, 232, 0.35);
    box-shadow: 0 0 0 3px rgba(110, 80, 200, 0.08);
  }

  .cb-send-btn {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    border: none;
    background: linear-gradient(135deg, #5b4fcf, #4f46e5);
    color: #eeeaff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    flex-shrink: 0;
    transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
    box-shadow: 0 2px 10px rgba(79, 70, 229, 0.35);
  }

  .cb-send-btn:hover {
    transform: scale(1.06);
    box-shadow: 0 4px 16px rgba(79, 70, 229, 0.45);
  }

  .cb-send-btn:active {
    transform: scale(0.96);
    box-shadow: none;
  }

  .cb-send-btn:disabled {
    opacity: 0.35;
    cursor: default;
    transform: none;
    box-shadow: none;
  }

  .cb-empty {
    text-align: center;
    color: #2e3347;
    font-size: 12.5px;
    margin-top: 24px;
    letter-spacing: 0.2px;
  }
`;

export default function ChatBox({ role = "student", openStudent = null }) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const bottomRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (openStudent) {
      setSelectedStudent(openStudent);
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.dataset.justOpened = "true";
        }
      }, 0);
    }
  }, [openStudent]);

  const [lastSeen, setLastSeen] = useState(
    JSON.parse(localStorage.getItem("chatLastSeen")) || {}
  );

  const loadChat = () => {
    const stored = localStorage.getItem("odysseyChat") || "[]";
    if (stored) setChat(JSON.parse(stored));
  };

  useEffect(() => {
    loadChat();
    const handleStorageChange = () => loadChat();
    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(loadChat, 800);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const isNearBottom = () => {
    const container = chatContainerRef.current;
    if (!container) return true;
    const threshold = 60;
    return (
      container.scrollHeight - container.scrollTop - container.clientHeight < threshold
    );
  };

  useEffect(() => {
    if (!selectedStudent) return;
    const container = chatContainerRef.current;
    if (container?.dataset.justOpened === "true") {
      container.scrollTo({ top: container.scrollHeight, behavior: "auto" });
      container.dataset.justOpened = "false";
      return;
    }
    if (isNearBottom()) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
    const latestMsg = chat
      .filter(msg => msg.name === selectedStudent)
      .slice(-1)[0];
    if (latestMsg) {
      setLastSeen(prev => {
        const updated = { ...prev, [selectedStudent]: latestMsg.timestamp };
        localStorage.setItem("chatLastSeen", JSON.stringify(updated));
        return updated;
      });
    }
  }, [chat, selectedStudent]);

  const studentList = [
  ...new Set(
    chat
      .filter(msg => msg.sender !== "Admin")
      .map(msg => msg.name)
      .filter(
        name =>
          name &&
          name.trim() !== "" &&
          name.toLowerCase() !== "admin" &&
          name.toLowerCase() !== "student" // removes old dummy account
      )
  )
];

  const getUnreadCount = (student) => {
    const last = lastSeen[student] || 0;
    return chat.filter(
      msg =>
        msg.name === student &&
        msg.sender !== sessionStorage.getItem("user") &&
        msg.timestamp > last
    ).length;
  };

  const openChat = (name) => {
    setSelectedStudent(name);
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.dataset.justOpened = "true";
      }
    }, 0);
    const latest = chat.filter(msg => msg.name === name).slice(-1)[0];
    const updated = {
      ...lastSeen,
      [name]: latest ? latest.timestamp : Date.now()
    };
    setLastSeen(updated);
    localStorage.setItem("chatLastSeen", JSON.stringify(updated));
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    const newMsg = {
      sender: sessionStorage.getItem("user") || "Admin",
      name:
        role === "admin"
          ? selectedStudent
          : sessionStorage.getItem("user"),
      text: message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      }),
      timestamp: Date.now()
    };
    const stored = JSON.parse(localStorage.getItem("odysseyChat")) || [];
    const updated = [...stored, newMsg];
    localStorage.setItem("odysseyChat", JSON.stringify(updated));
    setChat(updated);
    setMessage("");
  };

  const isOutgoing = (msg) =>
    msg.sender === sessionStorage.getItem("user") ||
    (role === "admin" && msg.sender === "Admin");

  const bubbleClass = (msg) =>
    `cb-bubble ${isOutgoing(msg) ? "outgoing" : "incoming"}`;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <style>{chatStyles}</style>
      <div
        className="cb-root"
        style={{
          height: role === "admin" ? "100%" : "380px",
          maxWidth: role === "admin" ? "100%" : "420px",
          border: role === "admin" ? "none" : "1px solid rgba(130, 100, 210, 0.12)",
          borderRadius: role === "admin" ? 0 : 12,
          overflow: "hidden",
        }}
      >
        {/* HEADER */}
        <div className="cb-header">
          {role === "admin" && selectedStudent && (
            <button
              className="cb-back-btn"
              onClick={() => setSelectedStudent(null)}
              aria-label="Back"
            >
              ←
            </button>
          )}
          {role === "admin" && selectedStudent && (
            <div className="cb-header-dot" />
          )}
          <span className="cb-header-title">
            {role === "admin"
              ? selectedStudent
                ? selectedStudent
                : "Student Chats"
              : "Support Chat"}
          </span>
        </div>

        {/* MESSAGE AREA */}
        <div ref={chatContainerRef} className="cb-messages">
          {/* Admin student list */}
          {role === "admin" && !selectedStudent && (
            studentList.length === 0
              ? <p className="cb-empty">No conversations yet</p>
              : studentList.map((name, i) => (
                <div
                  key={i}
                  className="cb-student-row"
                  onClick={() => openChat(name)}
                >
                  <span className="cb-student-name">{name}</span>
                  {getUnreadCount(name) > 0 && (
                    <span className="cb-unread-badge">{getUnreadCount(name)}</span>
                  )}
                </div>
              ))
          )}

          {/* Admin: messages for selected student */}
          {role === "admin" && selectedStudent &&
            chat
              .filter(msg => msg.name === selectedStudent)
              .map((msg, i) => (
                <div key={i} className={`cb-msg-row ${isOutgoing(msg) ? "outgoing" : "incoming"}`}>
                  <span className={bubbleClass(msg)}>
                    {msg.text}
                    <div className="cb-time">{msg.time}</div>
                  </span>
                </div>
              ))}

          {/* Student: all messages */}
          {role !== "admin" &&
            (chat.length === 0
              ? <p className="cb-empty">No messages yet — say hello 👋</p>
              : chat.map((msg, i) => (
                <div key={i} className={`cb-msg-row ${isOutgoing(msg) ? "outgoing" : "incoming"}`}>
                  <span className={bubbleClass(msg)}>
                    {msg.text}
                    <div className="cb-time">{msg.time}</div>
                  </span>
                </div>
              )))}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        {(role !== "admin" || selectedStudent) && (
          <div className="cb-input-area">
            <input
              className="cb-input"
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message…"
            />
            <button
              className="cb-send-btn"
              onClick={sendMessage}
              disabled={!message.trim()}
              aria-label="Send"
            >
              ↑
            </button>
          </div>
        )}
      </div>
    </>
  );
}