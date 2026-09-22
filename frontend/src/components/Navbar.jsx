import React from "react";
import { useAuth } from "../context/AuthContext";
import {
  Search,
  PlusCircle,
  ShoppingBag,
  ShieldCheck,
  LogOut,
  LogIn,
  UserPlus,
  Key,
} from "lucide-react";

export const Navbar = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  searchQuery,
  setSearchQuery,
  apiCallCount,
}) => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  return (
    <header
      style={{
        background: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        {/* Brand & Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            onClick={() => setActiveTab("home")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "800",
                fontSize: "18px",
              }}
            >
              <Key size={20} />
            </div>
            <div>
              <h1
                style={{
                  fontSize: "18px",
                  fontWeight: "800",
                  color: "#0f172a",
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                Easy Buy
              </h1>
              <span
                style={{
                  fontSize: "11px",
                  color: "#6366f1",
                  fontWeight: "700",
                  letterSpacing: "0.4px",
                }}
              ></span>
            </div>
          </div>
        </div>

        {/* Search Input (Only visible in Products view) */}
        {activeTab === "home" && (
          <div style={{ flex: 1, maxWidth: "360px", position: "relative" }}>
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
              }}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px 8px 38px",
                borderRadius: "20px",
                border: "1px solid #cbd5e1",
                fontSize: "14px",
                outline: "none",
                background: "#f8fafc",
                boxSizing: "border-box",
              }}
            />
          </div>
        )}

        {/* Navigation & Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Main Navigation Tabs */}
          <button
            onClick={() => setActiveTab("home")}
            style={{
              padding: "8px 14px",
              borderRadius: "8px",
              border: "none",
              background: activeTab === "home" ? "#eef2ff" : "transparent",
              color: activeTab === "home" ? "#4f46e5" : "#475569",
              fontWeight: activeTab === "home" ? "700" : "500",
              fontSize: "14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <ShoppingBag size={16} /> Products
          </button>

          {isAuthenticated && (
            <button
              onClick={() => setActiveTab("my_orders")}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "none",
                background:
                  activeTab === "my_orders" ? "#eef2ff" : "transparent",
                color: activeTab === "my_orders" ? "#4f46e5" : "#475569",
                fontWeight: activeTab === "my_orders" ? "700" : "500",
                fontSize: "14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              My Orders
            </button>
          )}

          {isAdmin && (
            <>
              <button
                onClick={() => setActiveTab("admin")}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "none",
                  background: activeTab === "admin" ? "#eef2ff" : "transparent",
                  color: activeTab === "admin" ? "#4f46e5" : "#475569",
                  fontWeight: activeTab === "admin" ? "700" : "500",
                  fontSize: "14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <ShieldCheck size={16} /> Admin Orders
              </button>

              <button
                onClick={onOpenAddModal}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#4f46e5",
                  color: "#ffffff",
                  fontWeight: "600",
                  fontSize: "14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 2px 6px rgba(79, 70, 229, 0.2)",
                }}
              >
                <PlusCircle size={16} /> Add Product
              </button>
            </>
          )}

          {/* User Auth Controls */}
          {isAuthenticated ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginLeft: "8px",
              }}
            >
              <div
                style={{
                  background: user?.role === "admin" ? "#e0e7ff" : "#f1f5f9",
                  color: user?.role === "admin" ? "#3730a3" : "#334155",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  border: "1px solid #cbd5e1",
                }}
              >
                <span>{user?.name}</span>
                <span
                  style={{
                    fontSize: "10px",
                    textTransform: "uppercase",
                    padding: "2px 6px",
                    borderRadius: "10px",
                    background: user?.role === "admin" ? "#4f46e5" : "#64748b",
                    color: "#ffffff",
                    fontWeight: "700",
                  }}
                >
                  {user?.role}
                </span>
              </div>

              <button
                onClick={() => {
                  logout();
                  setActiveTab("login");
                }}
                title="Logout"
                style={{
                  padding: "8px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  color: "#ef4444",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginLeft: "8px",
              }}
            >
              <button
                onClick={() => setActiveTab("login")}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  background: activeTab === "login" ? "#f1f5f9" : "#ffffff",
                  color: "#334155",
                  fontWeight: "600",
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <LogIn size={15} /> Login
              </button>

              <button
                onClick={() => setActiveTab("register")}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "none",
                  background: activeTab === "register" ? "#15803d" : "#16a34a",
                  color: "#ffffff",
                  fontWeight: "600",
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <UserPlus size={15} /> Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
