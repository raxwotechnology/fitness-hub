import React from "react";
import { Card, Badge, Btn } from "../../../../components/shared";

export function DashboardStatus({ error }) {
  return (
    <div style={{ padding: 32, color: error ? "#dc2626" : "var(--muted)" }}>
      {error || "Loading dashboard..."}
    </div>
  );
}

export function NotificationCard({ item, isRead = false, onMarkRead }) {
  return (
    <Card style={{ opacity: isRead ? 0.72 : 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>{item.title}</div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6 }}>{item.body}</div>
          {item.date && <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 10 }}>{item.date}</div>}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
          <Badge label={isRead ? "read" : String(item.type || "info").replace("-", " ")} type={isRead ? "default" : (item.severity || "info")} />
          {!isRead && onMarkRead ? <Btn small variant="ghost" onClick={onMarkRead}>Mark Read</Btn> : null}
        </div>
      </div>
    </Card>
  );
}

export function NotificationBell({ count = 0, onClick, active = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={count > 0 ? `Open notifications (${count} unread)` : "Open notifications"}
      style={{
        position: "relative",
        width: 38,
        height: 38,
        padding: 0,
        border: "none",
        background: "transparent",
        color: active ? "#2563eb" : "#475569",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer"
      }}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3.5c-.9 0-1.6.7-1.6 1.6v.6A5.7 5.7 0 0 0 7.2 11v3.1c0 1.2-.5 2.4-1.4 3.2l-.5.5c-.2.2-.3.5-.2.8.1.3.4.4.7.4h12.4c.3 0 .6-.1.7-.4.1-.3 0-.6-.2-.8l-.5-.5a4.4 4.4 0 0 1-1.4-3.2V11a5.7 5.7 0 0 0-3.2-5.2v-.6c0-.9-.7-1.6-1.6-1.6Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M9.8 19.1a2.7 2.7 0 0 0 4.4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {count > 0 ? (
        <span
          style={{
            position: "absolute",
            top: -4,
            right: -4,
            minWidth: 20,
            height: 20,
            padding: "0 6px",
            borderRadius: 999,
            background: "#dc2626",
            color: "#ffffff",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 800,
            lineHeight: 1,
            boxShadow: "0 0 0 2px #ffffff"
          }}
        >
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </button>
  );
}

export function DashboardShell({ accent, title, subtitle, navItems, page, setPage, sidebar, topRight, children, isMobile = false }) {
  const visibleNavItems = navItems.filter((item) => !item.hiddenInNav);
  const groupedNavItems = visibleNavItems.reduce((groups, item) => {
    const key = item.section || "Workspace";
    const existing = groups.find((group) => group.label === key);
    if (existing) { existing.items.push(item); return groups; }
    groups.push({ label: key, items: [item] });
    return groups;
  }, []);
  const useNavGroups = groupedNavItems.length > 1 || groupedNavItems.some((group) => group.label !== "Workspace");

  const navBg        = "linear-gradient(180deg, #ffffff, #f8fafc)";
  const navText      = "#64748b";
  const navActiveText= accent;
  const navActiveBg  = `linear-gradient(135deg, ${accent}22, ${accent}12)`;
  const navHoverBg   = "#f1f5f9";
  const navGroupLabel= "#94a3b8";
  const sidebarBorder= "1px solid rgba(148,163,184,0.18)";
  const sidebarShadow= "10px 0 30px rgba(15,23,42,0.04)";

  function renderNavButton(item) {
    const isActive = page === item.id;
    return (
      <button
        key={item.id}
        onClick={() => setPage(item.id)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: isMobile ? "center" : "flex-start",
          gap: 10,
          padding: isMobile ? "10px 12px" : "10px 12px",
          borderRadius: 10,
          border: "none",
          whiteSpace: "nowrap",
          flexShrink: 0,
          cursor: "pointer",
          textAlign: "left",
          fontSize: 13,
          fontWeight: isActive ? 700 : 500,
          fontFamily: "var(--font)",
          width: isMobile ? "auto" : "100%",
          position: "relative",
          background: isActive ? navActiveBg : "transparent",
          color: isActive ? navActiveText : navText,
          transition: "background 0.15s, color 0.15s",
          boxShadow: isActive ? `inset 0 0 0 1px ${accent}22` : "none"
        }}
        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = navHoverBg; }}
        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
      >
        {!isMobile && (
          <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: 999, flexShrink: 0, background: isActive ? accent : "#cbd5e1", boxShadow: isActive ? `0 0 0 5px ${accent}14` : "none", transition: "all 0.2s ease" }} />
        )}
        <span style={{ flex: isMobile ? undefined : 1 }}>{item.label}</span>
        {item.count > 0 ? (
          <span style={{
            minWidth: 20, height: 20, padding: "0 6px", borderRadius: 999,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            background: isActive ? accent : "#e2e8f0",
            color: isActive ? "#ffffff" : "#475569",
            fontSize: 10, fontWeight: 800, lineHeight: 1
          }}>
            {item.count > 99 ? "99+" : item.count}
          </span>
        ) : null}
      </button>
    );
  }

  const currentNavItem = navItems.find((item) => item.id === page);

  return (
    <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", height: "100vh", overflow: "hidden", background: "var(--bg)", fontFamily: "var(--font)" }}>

      {/* ── Sidebar ── */}
      <div style={{ width: isMobile ? "100%" : 248, background: navBg, borderRight: sidebarBorder, borderBottom: isMobile ? "1px solid var(--border)" : "none", display: "flex", flexDirection: "column", flexShrink: 0, minHeight: 0, overflowY: isMobile ? "visible" : "auto", boxShadow: isMobile ? "0 4px 16px rgba(15,23,42,0.06)" : sidebarShadow }}>

        {/* Brand block */}
        <div style={{ padding: isMobile ? "16px 16px 14px" : "26px 18px 18px", borderBottom: isMobile ? "1px solid var(--border)" : "none", flexShrink: 0 }}>
          <div style={{ padding: isMobile ? 0 : 18, borderRadius: isMobile ? 0 : 24, background: isMobile ? "transparent" : `linear-gradient(135deg, ${accent}14, rgba(255,255,255,0.95))`, border: isMobile ? "none" : `1px solid ${accent}18` }}>
            <div style={{ fontSize: isMobile ? 18 : 24, fontWeight: 900, letterSpacing: "-0.04em", color: accent }}>{title}</div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.12em" }}>{subtitle}</div>
          </div>
          {sidebar}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: isMobile ? "10px 10px 12px" : "10px 10px 16px", display: "flex", flexDirection: isMobile ? "row" : "column", gap: isMobile ? 4 : 2, overflowX: isMobile ? "auto" : "visible", overflowY: isMobile ? "visible" : "auto", scrollbarWidth: "none" }}>
          {isMobile ? visibleNavItems.map(renderNavButton) : (
            (useNavGroups ? groupedNavItems : [{ label: "", items: visibleNavItems }]).map((group) => (
              <div key={group.label} style={{ display: "flex", flexDirection: "column", gap: 1, marginBottom: group.label ? 8 : 0 }}>
                {group.label ? (
                  <div style={{ padding: "10px 12px 4px", fontSize: 10, fontWeight: 800, color: navGroupLabel, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    {group.label}
                  </div>
                ) : null}
                {group.items.map(renderNavButton)}
              </div>
            ))
          )}
        </nav>


      </div>

      {/* ── Main content ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

        {/* Topbar */}
        <div style={{ height: isMobile ? "auto" : 58, padding: isMobile ? "12px 16px" : "0 28px", borderBottom: "1px solid var(--border)", background: "#ffffff", display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "stretch" : "center", justifyContent: "space-between", gap: 10, flexShrink: 0, boxShadow: "0 1px 0 rgba(15,23,42,0.06)" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.01em" }}>
              {currentNavItem?.label}
            </div>
            {currentNavItem?.description && !isMobile && (
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 1 }}>{currentNavItem.description}</div>
            )}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>{topRight}</div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, overflow: "auto", padding: isMobile ? 12 : 28, background: "var(--bg)" }}>{children}</div>
      </div>
    </div>
  );
}
