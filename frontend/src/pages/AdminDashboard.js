import React, { useEffect, useState } from "react";
import axios from "axios";
import ChatBox from "../components/ChatBox";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ad-root {
    min-height: 100vh;
    background: #0d0d10;
    font-family: 'Sora', sans-serif;
    color: #ccc9dd;
    display: flex;
    flex-direction: column;
  }

  /* ── Top bar ── */
  .ad-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 28px;
    height: 58px;
    background: #10101a;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .ad-topbar-brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .ad-topbar-icon {
    width: 32px;
    height: 32px;
    border-radius: 9px;
    background: rgba(109,86,210,0.15);
    border: 1px solid rgba(109,86,210,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ad-topbar-icon svg { width: 15px; height: 15px; color: #9b7ff0; }

  .ad-topbar-title {
    font-size: 14px;
    font-weight: 600;
    color: #e8e6f0;
    letter-spacing: -0.01em;
  }

  .ad-topbar-badge {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #6d56d2;
    background: rgba(109,86,210,0.1);
    border: 1px solid rgba(109,86,210,0.2);
    padding: 2px 8px;
    border-radius: 20px;
  }

  .ad-logout-btn {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 7px 14px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 9px;
    color: #5a5870;
    cursor: pointer;
    font-family: 'Sora', sans-serif;
    font-size: 12.5px;
    font-weight: 500;
    transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
  }

  .ad-logout-btn:hover {
    background: rgba(255,255,255,0.08);
    color: #9490b8;
    border-color: rgba(255,255,255,0.12);
  }

  .ad-logout-btn svg { width: 13px; height: 13px; }

  /* ── Body layout ── */
  .ad-body {
    flex: 1;
    display: flex;
    gap: 0;
    height: calc(100vh - 58px);
    overflow: hidden;
  }

  /* ── Orders column ── */
  .ad-orders-col {
    flex: 2;
    min-width: 0;
    overflow-y: auto;
    padding: 24px 20px 24px 24px;
    border-right: 1px solid rgba(255,255,255,0.05);
  }

  .ad-col-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
  }

  .ad-col-title {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #3d3b52;
  }

  .ad-order-count {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: #3d3b52;
  }

  .ad-empty {
    text-align: center;
    font-size: 13px;
    color: #2e2d3e;
    padding: 48px 0;
  }

  /* ── Order card ── */
  .ad-order-card {
    background: #13131a;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    overflow: hidden;
    margin-bottom: 12px;
    transition: border-color 0.18s ease, box-shadow 0.18s ease;
  }

  .ad-order-card:hover {
    border-color: rgba(109,86,210,0.2);
    box-shadow: 0 4px 20px rgba(0,0,0,0.35);
  }

  .ad-order-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 13px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    gap: 12px;
  }

  .ad-order-id {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11.5px;
    color: #5a5870;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ad-order-id span {
    color: #4e4c65;
    margin-right: 4px;
    font-size: 10px;
  }

  /* Status badge */
  .ad-status-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    flex-shrink: 0;
  }

  .ad-status-badge.pending {
    background: rgba(255,152,0,0.1);
    border: 1px solid rgba(255,152,0,0.22);
    color: #ffa726;
  }

  .ad-status-badge.printing {
    background: rgba(25,118,210,0.1);
    border: 1px solid rgba(25,118,210,0.22);
    color: #42a5f5;
  }

  .ad-status-badge.ready {
    background: rgba(72,199,142,0.1);
    border: 1px solid rgba(72,199,142,0.22);
    color: #48c78e;
  }

  .ad-status-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }

  /* Items in order */
  .ad-order-items {
    padding: 4px 0;
  }

  .ad-order-item-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 7px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.03);
  }

  .ad-order-item-row:last-child { border-bottom: none; }

  .ad-item-name { font-size: 13px; color: #b8b5cc; }
  .ad-item-qty  { font-size: 11px; color: #4e4c65; font-family: 'JetBrains Mono', monospace; margin-left: 6px; }

  /* Order actions */
  .ad-order-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    border-top: 1px solid rgba(255,255,255,0.04);
    background: rgba(255,255,255,0.012);
    flex-wrap: wrap;
  }

  .ad-action-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-family: 'Sora', sans-serif;
    font-size: 12px;
    font-weight: 500;
    transition: filter 0.15s ease, transform 0.12s ease;
  }

  .ad-action-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
  .ad-action-btn:active { transform: translateY(0); }
  .ad-action-btn svg { width: 12px; height: 12px; }

  .ad-action-btn.printing {
    background: rgba(25,118,210,0.12);
    border: 1px solid rgba(25,118,210,0.25);
    color: #42a5f5;
  }

  .ad-action-btn.ready {
    background: rgba(72,199,142,0.1);
    border: 1px solid rgba(72,199,142,0.22);
    color: #48c78e;
  }

  .ad-action-btn.chat {
    background: rgba(109,86,210,0.1);
    border: 1px solid rgba(109,86,210,0.22);
    color: #9b7ff0;
    margin-left: auto;
  }

  /* ── Chat column ── */
  .ad-chat-col {
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 58px);  /* lock exact height */
  overflow: hidden;
}

  .ad-chat-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  margin-bottom: 8px; /* ⭐ adds breathing space */
  border-bottom: 1px solid rgba(255,255,255,0.05);
  background: #10101a;
  flex-shrink: 0;
}

  .ad-chat-header-icon {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    background: rgba(109,86,210,0.1);
    border: 1px solid rgba(109,86,210,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .ad-chat-header-icon svg { width: 13px; height: 13px; color: #9b7ff0; }

  .ad-chat-header-label {
    font-size: 12px;
    font-weight: 500;
    color: #7a78a0;
  }

  .ad-chat-header-user {
    font-size: 13px;
    font-weight: 600;
    color: #e8e6f0;
    font-family: 'JetBrains Mono', monospace;
  }

  .ad-chat-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0; /* VERY IMPORTANT for flex scroll stability */
}

  .ad-chat-inner {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  /* Scrollbar */
  .ad-orders-col::-webkit-scrollbar { width: 4px; }
  .ad-orders-col::-webkit-scrollbar-track { background: transparent; }
  .ad-orders-col::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }

  @media (max-width: 768px) {
    .ad-body { flex-direction: column; height: auto; overflow: visible; }
    .ad-orders-col { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .ad-chat-col { min-width: 0; height: 60vh; }
  }
`;

function getStatusClass(status) {
  if (!status) return "pending";
  const s = status.toLowerCase();
  if (s === "ready") return "ready";
  if (s === "printing") return "printing";
  return "pending";
}

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [openChatUser, setOpenChatUser] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders");
      console.log(res.data);
      setOrders(res.data);
    } catch (err) {
      console.error("Error loading orders", err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/orders/${id}/status`,
        { status }
      );

      fetchOrders();

      // sync local history
      const localOrders =
        JSON.parse(localStorage.getItem("odysseyOrders")) || [];

      const updated = localOrders.map((o) =>
        o.orderId === id || o._id === id
          ? { ...o, status: status.toUpperCase() }
          : o
      );

      localStorage.setItem("odysseyOrders", JSON.stringify(updated));
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <style>{css}</style>
      <div className="ad-root">

        {/* Top bar */}
        <header className="ad-topbar">
          <div className="ad-topbar-brand">
            <div className="ad-topbar-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
            </div>
            <span className="ad-topbar-title">Odyssey</span>
            <span className="ad-topbar-badge">Admin</span>
          </div>

          <button
            className="ad-logout-btn"
            onClick={() => {
              sessionStorage.clear();
              window.location.replace("/");
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </header>

        {/* Body */}
        <div className="ad-body">

          {/* LEFT — Orders */}
          <div className="ad-orders-col">
            <div className="ad-col-header">
              <span className="ad-col-title">Orders</span>
              <span className="ad-order-count">{orders.length} total</span>
            </div>

            {orders.length === 0 && (
              <p className="ad-empty">No orders yet.</p>
            )}

            {orders.map((order) => {
              const studentName =
                order.user ||
                order.username ||
                order.studentName ||
                "sahil";

              const hasPrinting =
                order.documents?.length > 0 ||
                order.stationeryItems?.some(item =>
                  item.name.toLowerCase().includes("print")
                );

              const statusClass = getStatusClass(order.status);

              return (
                <div key={order._id} className="ad-order-card">
                  {/* Head */}
                  <div className="ad-order-head">
                    <span className="ad-order-id">
                      <span>#</span>{order._id}
                    </span>
                    <span
                      style={{
                        fontWeight: "bold",
                        color:
                          order.status === "READY" || order.status === "ready"
                            ? "green"
                            : order.status === "PRINTING" || order.status === "printing"
                            ? "#1976d2"
                            : "#ff9800"
                      }}
                    >
                      <span className={`ad-status-badge ${statusClass}`}>
                        <span className="ad-status-dot"/>
                        {order.status || "PENDING"}
                      </span>
                    </span>
                  </div>

                  {/* Items */}
                  {order.stationeryItems?.length > 0 && (
                    <div className="ad-order-items">
                      {order.stationeryItems.map((item, i) => (
                        <div key={i} className="ad-order-item-row">
                          <span className="ad-item-name">{item.name}</span>
                          <span className="ad-item-qty">× {item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="ad-order-actions">
                    {hasPrinting && (
                      <button
                        className="ad-action-btn printing"
                        onClick={() => updateStatus(order._id, "printing")}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 6 2 18 2 18 9"/>
                          <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
                          <rect x="6" y="14" width="12" height="8"/>
                        </svg>
                        Printing
                      </button>
                    )}

                    <button
                      className="ad-action-btn ready"
                      onClick={() => updateStatus(order._id, "ready")}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      Ready
                    </button>

                    <button
                      className="ad-action-btn chat"
                      onClick={() => {
                        setOpenChatUser(null);
                        setTimeout(() => {
                          setOpenChatUser(studentName);
                        }, 0);
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                      </svg>
                      Chat · {studentName}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT — Chat panel */}
          <div className="ad-chat-col">
            <div className="ad-chat-header">
              <div className="ad-chat-header-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                </svg>
              </div>
              <div>
                <div className="ad-chat-header-label">Student Chat</div>
                {openChatUser && (
                  <div className="ad-chat-header-user">@{openChatUser}</div>
                )}
              </div>
            </div>

            <div className="ad-chat-body">
              <div
  className="ad-chat-inner"
  style={{
    border: "none",
    borderRadius: 0,
    background: "transparent",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    minHeight: 0
  }}
>
                <ChatBox role="admin" openStudent={openChatUser} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default AdminDashboard;