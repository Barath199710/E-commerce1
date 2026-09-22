import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { LogIn, Shield, UserCheck, KeyRound, Mail } from "lucide-react";

export const Login = ({ onSuccessRedirect }) => {
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const loggedUser = await login(email, password);
      showToast(
        `Welcome back, ${loggedUser.name}! (Role: ${loggedUser.role})`,
        "success",
      );
      if (onSuccessRedirect)
        onSuccessRedirect(loggedUser.role === "admin" ? "admin" : "home");
    } catch (err) {
      const msg = err.response?.data?.error || "Invalid email or password.";
      setErrorMsg(msg);
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const fillQuickCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrorMsg("");
  };

  return (
    <div style={{ maxWidth: "440px", margin: "40px auto", padding: "0 16px" }}>
      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          boxShadow:
            "0 10px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.01)",
          border: "1px solid #e2e8f0",
          padding: "32px 28px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "12px",
              background: "#e0e7ff",
              color: "#4f46e5",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "12px",
            }}
          >
            <LogIn size={26} />
          </div>
          <h2
            style={{
              fontSize: "22px",
              fontWeight: "700",
              color: "#1e293b",
              margin: "0 0 6px",
            }}
          >
            Login to your account
          </h2>
          <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}></p>
        </div>

        {errorMsg && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#991b1b",
              padding: "12px 14px",
              borderRadius: "8px",
              fontSize: "14px",
              marginBottom: "20px",
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "#334155",
                marginBottom: "6px",
              }}
            >
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <Mail
                size={18}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "12px",
                  color: "#94a3b8",
                }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. user@example.com"
                required
                style={{
                  width: "100%",
                  padding: "10px 12px 10px 38px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "#334155",
                marginBottom: "6px",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <KeyRound
                size={18}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "12px",
                  color: "#94a3b8",
                }}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: "100%",
                  padding: "10px 12px 10px 38px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              background: "#4f46e5",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: "600",
              cursor: submitting ? "not-allowed" : "pointer",
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.25)",
              transition: "all 0.2s ease",
            }}
          >
            {submitting ? "Authenticating..." : "Sign In with JWT"}
          </button>
        </form>

        {/* Demo Quick Fill Buttons */}
        <div
          style={{
            marginTop: "24px",
            paddingTop: "20px",
            borderTop: "1px solid #f1f5f9",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              color: "#64748b",
              fontWeight: "600",
              marginBottom: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Accounts:
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            <button
              type="button"
              onClick={() =>
                fillQuickCredentials("admin@example.com", "admin123")
              }
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                padding: "8px 10px",
                borderRadius: "8px",
                border: "1px solid #c7d2fe",
                background: "#eef2ff",
                color: "#3730a3",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              <Shield size={14} /> Admin User
            </button>

            <button
              type="button"
              onClick={() =>
                fillQuickCredentials("user@example.com", "user123")
              }
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                padding: "8px 10px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                background: "#f8fafc",
                color: "#334155",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              <UserCheck size={14} /> Customer User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
