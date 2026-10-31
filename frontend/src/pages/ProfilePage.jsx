// ProfilePage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .pf-root {
    min-height: 100vh;
    background: #0d0d10;
    font-family: 'Sora', sans-serif;
    color: #ccc9dd;
    padding: 40px 16px 80px;
    position: relative;
  }

  .pf-root::before {
    content: '';
    position: fixed;
    top: -30%;
    left: 50%;
    transform: translateX(-50%);
    width: 700px;
    height: 500px;
    background: radial-gradient(ellipse, rgba(109,86,210,0.07) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .pf-inner {
    position: relative;
    z-index: 1;
    max-width: 520px;
    margin: 0 auto;
  }

  .pf-page-title {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #3d3b52;
    margin-bottom: 24px;
    text-align: center;
  }

  /* Success toast */
  .pf-toast {
    background: rgba(72,199,142,0.1);
    border: 1px solid rgba(72,199,142,0.25);
    color: #48c78e;
    padding: 11px 16px;
    border-radius: 10px;
    text-align: center;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 20px;
    animation: fadeInDown 0.3s ease;
  }

  @keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Profile card */
  .pf-profile-card {
    background: #13131a;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    padding: 32px 24px;
    text-align: center;
    margin-bottom: 20px;
    box-shadow: 0 16px 48px rgba(0,0,0,0.5);
  }

  .pf-avatar-wrap {
    position: relative;
    display: inline-block;
    margin-bottom: 16px;
    cursor: pointer;
  }

  .pf-avatar {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(109,86,210,0.3);
    transition: border-color 0.2s ease, transform 0.2s ease;
    display: block;
  }

  .pf-avatar-wrap:hover .pf-avatar {
    border-color: rgba(109,86,210,0.7);
    transform: scale(1.03);
  }

  .pf-avatar-overlay {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: rgba(109,86,210,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .pf-avatar-wrap:hover .pf-avatar-overlay { opacity: 1; }

  .pf-avatar-overlay svg { width: 20px; height: 20px; color: #fff; }

  .pf-display-name {
    font-size: 20px;
    font-weight: 600;
    color: #e8e6f0;
    letter-spacing: -0.02em;
    margin-bottom: 4px;
  }

  .pf-username {
    font-size: 13px;
    color: #4e4c65;
    font-family: 'JetBrains Mono', monospace;
    margin-bottom: 20px;
  }

  .pf-edit-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 9px 20px;
    background: rgba(109,86,210,0.1);
    border: 1px solid rgba(109,86,210,0.25);
    color: #9b7ff0;
    border-radius: 10px;
    cursor: pointer;
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 500;
    transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  }

  .pf-edit-btn:hover {
    background: rgba(109,86,210,0.18);
    border-color: rgba(109,86,210,0.45);
    color: #b89af5;
  }

  .pf-edit-btn svg { width: 13px; height: 13px; }

  /* Info card */
  .pf-card {
    background: #13131a;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 20px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }

  .pf-card-header {
    padding: 14px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #3d3b52;
  }

  .pf-info-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding: 12px 20px;
    transition: background 0.15s ease;
  }

  .pf-info-row:not(:last-child) {
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }

  .pf-info-row:hover { background: rgba(255,255,255,0.015); }

  .pf-info-key {
    font-size: 12px;
    color: #4e4c65;
    flex-shrink: 0;
    padding-top: 1px;
    min-width: 110px;
  }

  .pf-info-val {
    font-size: 13px;
    color: #a8a5c0;
    text-align: right;
    font-family: 'JetBrains Mono', monospace;
    word-break: break-all;
    line-height: 1.5;
  }

  .pf-info-val.plain {
    font-family: 'Sora', sans-serif;
    font-size: 13.5px;
    color: #ccc9dd;
  }

  /* Orders */
  .pf-orders-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #3d3b52;
    margin-bottom: 12px;
    padding: 0 2px;
  }

  .pf-no-orders {
    text-align: center;
    font-size: 13px;
    color: #3d3b52;
    padding: 24px 0;
  }

  .pf-order-card {
    background: #13131a;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    overflow: hidden;
    margin-bottom: 12px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
  }

  .pf-order-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 13px 18px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    gap: 12px;
  }

  .pf-order-id {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: #5a5870;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .pf-order-date {
    font-size: 11px;
    color: #3d3b52;
    flex-shrink: 0;
  }

  .pf-order-items {
    padding: 4px 0;
  }

  .pf-order-item-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 18px;
    border-bottom: 1px solid rgba(255,255,255,0.03);
  }

  .pf-order-item-row:last-child { border-bottom: none; }

  .pf-order-item-name { font-size: 13px; color: #b8b5cc; }
  .pf-order-item-qty { font-size: 11px; color: #4e4c65; font-family: 'JetBrains Mono', monospace; }
  .pf-order-item-price { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #8880c0; }

  .pf-order-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 18px;
    border-top: 1px solid rgba(255,255,255,0.05);
    background: rgba(255,255,255,0.015);
  }

  .pf-order-total {
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    font-weight: 500;
    color: #f0eeff;
  }

  .pf-status-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .pf-status-badge.pending {
    background: rgba(255,152,0,0.1);
    border: 1px solid rgba(255,152,0,0.22);
    color: #ffa726;
  }

  .pf-status-badge.printing {
    background: rgba(25,118,210,0.1);
    border: 1px solid rgba(25,118,210,0.22);
    color: #42a5f5;
  }

  .pf-status-badge.ready {
    background: rgba(72,199,142,0.1);
    border: 1px solid rgba(72,199,142,0.22);
    color: #48c78e;
  }

  .pf-status-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }

  /* Modal overlay */
  .pf-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.75);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 20px;
    backdrop-filter: blur(4px);
  }

  .pf-modal {
    background: #16161f;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 18px;
    width: 100%;
    max-width: 380px;
    box-shadow: 0 32px 80px rgba(0,0,0,0.7);
    overflow: hidden;
    animation: modalPop 0.25s cubic-bezier(0.22,1,0.36,1);
  }

  @keyframes modalPop {
    from { opacity: 0; transform: scale(0.95) translateY(10px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  .pf-modal-header {
    padding: 20px 22px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .pf-modal-title {
    font-size: 15px;
    font-weight: 600;
    color: #e8e6f0;
    letter-spacing: -0.01em;
  }

  .pf-modal-close {
    background: rgba(255,255,255,0.06);
    border: none;
    border-radius: 6px;
    color: #5a5870;
    cursor: pointer;
    padding: 5px;
    display: flex;
    transition: background 0.15s ease, color 0.15s ease;
  }

  .pf-modal-close:hover { background: rgba(255,255,255,0.1); color: #9490b8; }
  .pf-modal-close svg { width: 14px; height: 14px; }

  .pf-modal-body {
    padding: 20px 22px;
    max-height: 70vh;
    overflow-y: auto;
  }

  /* Form */
  .pf-form-group { margin-bottom: 14px; }

  .pf-label {
    display: block;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #4e4c65;
    margin-bottom: 6px;
  }

  .pf-input, .pf-textarea {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 9px;
    padding: 10px 13px;
    font-family: 'Sora', sans-serif;
    font-size: 13.5px;
    color: #ccc9dd;
    outline: none;
    transition: border-color 0.15s ease, background 0.15s ease;
  }

  .pf-input:focus, .pf-textarea:focus {
    border-color: rgba(109,86,210,0.5);
    background: rgba(109,86,210,0.04);
  }

  .pf-textarea { min-height: 80px; resize: vertical; }

  .pf-modal-actions {
    display: flex;
    gap: 10px;
    padding: 16px 22px 20px;
    border-top: 1px solid rgba(255,255,255,0.05);
  }

  .pf-save-btn {
    flex: 1;
    padding: 11px 18px;
    background: linear-gradient(135deg, #6d56d2, #5a44bb);
    color: #fff;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-family: 'Sora', sans-serif;
    font-size: 13.5px;
    font-weight: 600;
    box-shadow: 0 4px 16px rgba(109,86,210,0.28);
    transition: filter 0.15s ease, transform 0.15s ease;
  }

  .pf-save-btn:hover { filter: brightness(1.08); transform: translateY(-1px); }
  .pf-save-btn:active { transform: translateY(1px); }

  .pf-cancel-btn {
    padding: 11px 18px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    cursor: pointer;
    font-family: 'Sora', sans-serif;
    font-size: 13.5px;
    color: #5a5870;
    transition: background 0.15s ease, color 0.15s ease;
  }

  .pf-cancel-btn:hover { background: rgba(255,255,255,0.08); color: #9490b8; }

  /* Photo modal specific */
  .pf-photo-action-btn {
    width: 100%;
    padding: 12px 16px;
    margin-bottom: 10px;
    background: rgba(109,86,210,0.08);
    border: 1px solid rgba(109,86,210,0.2);
    border-radius: 10px;
    color: #9b7ff0;
    cursor: pointer;
    font-family: 'Sora', sans-serif;
    font-size: 13.5px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 9px;
    transition: background 0.15s ease, border-color 0.15s ease;
  }

  .pf-photo-action-btn:hover {
    background: rgba(109,86,210,0.15);
    border-color: rgba(109,86,210,0.38);
  }

  .pf-photo-action-btn svg { width: 15px; height: 15px; }

  .pf-large-photo {
    width: 180px;
    height: 180px;
    border-radius: 50%;
    object-fit: cover;
    display: block;
    margin: 0 auto 16px;
    border: 2px solid rgba(109,86,210,0.3);
  }

  .pf-file-input-label {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    background: rgba(255,255,255,0.04);
    border: 1px dashed rgba(255,255,255,0.1);
    border-radius: 10px;
    cursor: pointer;
    font-size: 13px;
    color: #5a5870;
    margin-bottom: 12px;
    transition: border-color 0.15s ease, color 0.15s ease;
  }

  .pf-file-input-label:hover { border-color: rgba(109,86,210,0.4); color: #9490b8; }
  .pf-file-input-label input { display: none; }

  .pf-upload-btn {
    width: 100%;
    padding: 11px;
    background: linear-gradient(135deg, #6d56d2, #5a44bb);
    border: none;
    border-radius: 10px;
    color: #fff;
    font-family: 'Sora', sans-serif;
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
    transition: filter 0.15s ease;
    box-shadow: 0 4px 16px rgba(109,86,210,0.28);
  }

  .pf-upload-btn:hover { filter: brightness(1.08); }

  /* Viewer overlay */
  .pf-viewer-overlay {
    cursor: zoom-out;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.93);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    cursor: zoom-out;
  }

  .pf-viewer-image {
    max-width: 90%;
    max-height: 90%;
    border-radius: 12px;
    box-shadow: 0 10px 60px rgba(0,0,0,0.7);
  }

  @media (max-width: 520px) {
    .pf-root { padding: 24px 12px 60px; }
    .pf-profile-card { padding: 24px 16px; }
  }
`;

function getStatusClass(status) {
  if (!status) return "pending";
  const s = status.toUpperCase();
  if (s === "READY") return "ready";
  if (s === "PRINTING") return "printing";
  return "pending";
}

export default function ProfilePage() {
  const [username, setUsername] = useState("");
  const [orders, setOrders] = useState([]);
  const [photo, setPhoto] = useState("");
  const [file, setFile] = useState(null);

  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [phone, setPhone] = useState("");
  const [collegeEmail, setCollegeEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  const [bio, setBio] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showViewer, setShowViewer] = useState(false);
  const navigate = useNavigate();
  const [photoMode, setPhotoMode] = useState("");

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) setUsername(storedUser);

    const storedOrders =
      JSON.parse(localStorage.getItem("odysseyOrders")) || [];
    setOrders(storedOrders.reverse());

    const loadProfile = async () => {
      const studentId = sessionStorage.getItem("user");

      const res = await axios.get(
        `http://localhost:5000/api/profile/${studentId}`
      );

      if (res.data?.profilePhoto) {
        setPhoto("http://localhost:5000" + res.data.profilePhoto);
      }

      if (res.data) {
        setPhone(res.data.phone || "");
        setCollegeEmail(res.data.collegeEmail || "");
        setDepartment(res.data.department || "");
        setYear(res.data.year || "");
        setSection(res.data.section || "");
        setBio(res.data.bio || "");
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    const loadPhoto = async () => {
      const studentId = sessionStorage.getItem("user");

      const res = await fetch(
        `http://localhost:5000/api/profile/${studentId}`
      );

      const data = await res.json();

      if (data.profilePhoto) {
        setPhoto("http://localhost:5000" + data.profilePhoto);
      }
    };

    loadPhoto();
  }, []);

  useEffect(() => {
    const handleBack = () => {
      if (showViewer) {
        setShowViewer(false);
      } else if (showPhotoModal) {
        setShowPhotoModal(false);
      }
    };

    window.addEventListener("popstate", handleBack);

    return () => window.removeEventListener("popstate", handleBack);
  }, [showViewer, showPhotoModal, navigate]);

  const uploadPhoto = async () => {
  if (!file) return;

  try {
    const studentId = sessionStorage.getItem("user");
    const formData = new FormData();
    formData.append("photo", file);
    formData.append("studentId", studentId);

    const res = await axios.post(
      "http://localhost:5000/api/profile/upload",
      formData,
      { timeout: 15000 }   // prevents freeze
    );

    setPhoto(
      "http://localhost:5000" +
        res.data.photoPath +
        "?t=" +
        new Date().getTime()
    );

    setShowPhotoModal(false);
    setPhotoMode("");
    setFile(null);

  } catch (err) {
    console.error(err);
    alert("Upload failed or image too large");
  }
};

  const saveProfile = async () => {
    const studentId = sessionStorage.getItem("user");

    await axios.put("http://localhost:5000/api/profile/update", {
      studentId,
      phone,
      collegeEmail,
      department,
      year,
      section,
      bio
    });

    setSuccessMsg("Profile updated successfully!");
    setTimeout(() => setSuccessMsg(""), 2000);
    setShowEditModal(false);
  };

  const maskPassword = () =>
    username ? username.substring(0, 2) + "******" : "";

  const displayName = "Mohammed Sahil";

  return (
    <>
      <style>{css}</style>
      <div className="pf-root">
        <div className="pf-inner">
          <p className="pf-page-title">My Profile</p>

          {successMsg && (
            <div className="pf-toast">{successMsg}</div>
          )}

          {/* PROFILE CARD */}
          <div className="pf-profile-card">
            <div
              className="pf-avatar-wrap"
              onClick={(e) => {
                e.stopPropagation();
                setShowPhotoModal(true);
                window.history.pushState({ modal: "photo" }, "");
              }}
            >
              <img
                src={photo || "https://via.placeholder.com/150"}
                alt="profile"
                className="pf-avatar"
              />
              <div className="pf-avatar-overlay">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
            </div>

            <p className="pf-display-name">{displayName}</p>
            <p className="pf-username">@{username}</p>

            <button
              className="pf-edit-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowEditModal(true);
                window.history.pushState({ modal: "edit" }, "");
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Edit Profile
            </button>
          </div>

          {/* ACCOUNT INFO */}
          <div className="pf-card">
            <div className="pf-card-header">Account Information</div>

            <div className="pf-info-row">
              <span className="pf-info-key">Full Name</span>
              <span className="pf-info-val plain">{displayName}</span>
            </div>
            <div className="pf-info-row">
              <span className="pf-info-key">Username</span>
              <span className="pf-info-val">@{username}</span>
            </div>
            <div className="pf-info-row">
              <span className="pf-info-key">Password</span>
              <span className="pf-info-val">{maskPassword()}</span>
            </div>
            {phone && (
              <div className="pf-info-row">
                <span className="pf-info-key">Phone</span>
                <span className="pf-info-val plain">{phone}</span>
              </div>
            )}
            {collegeEmail && (
              <div className="pf-info-row">
                <span className="pf-info-key">College Email</span>
                <span className="pf-info-val">{collegeEmail}</span>
              </div>
            )}
            {department && (
              <div className="pf-info-row">
                <span className="pf-info-key">Department</span>
                <span className="pf-info-val plain">{department}</span>
              </div>
            )}
            {year && (
              <div className="pf-info-row">
                <span className="pf-info-key">Year</span>
                <span className="pf-info-val plain">{year}</span>
              </div>
            )}
            {section && (
              <div className="pf-info-row">
                <span className="pf-info-key">Section</span>
                <span className="pf-info-val plain">{section}</span>
              </div>
            )}
            {bio && (
              <div className="pf-info-row">
                <span className="pf-info-key">Bio</span>
                <span className="pf-info-val plain" style={{ fontFamily: "'Sora', sans-serif", textAlign: "right" }}>{bio}</span>
              </div>
            )}
          </div>

          {/* ORDERS */}
          <p className="pf-orders-label">Order History</p>

          {orders.length === 0 ? (
            <p className="pf-no-orders">No orders yet</p>
          ) : (
            orders.map((order, index) => (
              <div key={index} className="pf-order-card">
                <div className="pf-order-header">
                  <span className="pf-order-id">#{order.orderId}</span>
                  <span className="pf-order-date">{order.date}</span>
                </div>

                <div className="pf-order-items">
                  {order.items?.map((item, i) => (
                    <div key={i} className="pf-order-item-row">
                      <div>
                        <span className="pf-order-item-name">{item.name}</span>
                        <span className="pf-order-item-qty" style={{ display: "block", marginTop: 2 }}>× {item.quantity}</span>
                      </div>
                      <span className="pf-order-item-price">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="pf-order-footer">
                  <span className="pf-order-total">₹{order.total}</span>
                  <span
                    style={{
                      fontWeight: "bold",
                      color:
                        order.status === "READY"
                          ? "green"
                          : order.status === "PRINTING"
                          ? "#1976d2"
                          : "#ff9800"
                    }}
                  >
                    <span className={`pf-status-badge ${getStatusClass(order.status)}`}>
                      <span className="pf-status-dot"/>
                      {order.status || "PENDING"}
                    </span>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* EDIT PROFILE MODAL */}
        {showEditModal && (
          <div
            className="pf-modal-overlay"
            onClick={() => setShowEditModal(false)}
          >
            <div
              className="pf-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pf-modal-header">
                <span className="pf-modal-title">Edit Profile</span>
                <button className="pf-modal-close" onClick={() => setShowEditModal(false)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              <div className="pf-modal-body">
                <div className="pf-form-group">
                  <label className="pf-label">Phone</label>
                  <input className="pf-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="pf-form-group">
                  <label className="pf-label">College Email</label>
                  <input className="pf-input" value={collegeEmail} onChange={(e) => setCollegeEmail(e.target.value)} />
                </div>
                <div className="pf-form-group">
                  <label className="pf-label">Department</label>
                  <input className="pf-input" value={department} onChange={(e) => setDepartment(e.target.value)} />
                </div>
                <div className="pf-form-group">
                  <label className="pf-label">Year</label>
                  <input className="pf-input" value={year} onChange={(e) => setYear(e.target.value)} />
                </div>
                <div className="pf-form-group">
                  <label className="pf-label">Section</label>
                  <input className="pf-input" value={section} onChange={(e) => setSection(e.target.value)} />
                </div>
                <div className="pf-form-group">
                  <label className="pf-label">Bio</label>
                  <textarea className="pf-textarea" value={bio} onChange={(e) => setBio(e.target.value)} />
                </div>
              </div>

              <div className="pf-modal-actions">
                <button className="pf-save-btn" onClick={saveProfile}>Save Changes</button>
                <button className="pf-cancel-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

               {/* PHOTO MODAL */}
        {showPhotoModal && (
          <div
            className="pf-modal-overlay"
            onMouseDown={(e) => {
              if (e.target.classList.contains("pf-modal-overlay")) {
                setShowPhotoModal(false);
                setPhotoMode("");
              }
            }}
          >
            <div
              className="pf-modal"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="pf-modal-header">
                <span className="pf-modal-title">Profile Photo</span>
                <button
                  className="pf-modal-close"
                  onClick={() => {
                    setShowPhotoModal(false);
                    setPhotoMode("");
                  }}
                >
                  ✕
                </button>
              </div>

              <div className="pf-modal-body">

                <button
                  className="pf-photo-action-btn"
                  onClick={() => {
  setShowPhotoModal(false);
  setShowViewer(true);
}}
                >
                  View Profile Photo
                </button>

                <button
                  className="pf-photo-action-btn"
                  onClick={() => setPhotoMode("upload")}
                >
                  Upload New Photo
                </button>

                

                {photoMode === "upload" && (
                  <>
                    <label className="pf-file-input-label">
                      {file ? file.name : "Choose a photo…"}
                      <input
                        type="file"
                        onChange={(e) => {
  const selected = e.target.files[0];
  if (!selected) return;

  if (selected.size > 2 * 1024 * 1024) {
    alert("Image must be under 2MB");
    return;
  }

  setFile(selected);
}}
                      />
                    </label>

                    <button
  className="pf-upload-btn"
  onClick={uploadPhoto}
  disabled={!file}
>
  Upload Photo
</button>
                  </>
                )}

              </div>
            </div>
          </div>
        )}
      </div>

      {/* FULLSCREEN IMAGE VIEWER */}
{showViewer && (
  <div
    className="pf-viewer-overlay"
    onClick={() => setShowViewer(false)}
  >
    <img
      src={photo || "https://via.placeholder.com/600"}
      alt="full"
      className="pf-viewer-image"
    />
  </div>
)}

    </>
  );
}