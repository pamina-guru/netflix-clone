import { createContext, useContext, useEffect, useMemo, useState } from "react";

/**
 * Netflix-like avatar tile (original SVG, not Netflix copyrighted images)
 * Clean, professional, “Quinn style” tile.
 */
function avatarDataUri(theme = "teal") {
  const themes = {
    pamina: { a: "#ff3b30", b: "#c81d25" }, // red
    shajithan: { a: "#3b82f6", b: "#1d4ed8" }, // blue
    anne: { a: "#22c55e", b: "#15803d" }, // green
    maria: { a: "#a855f7", b: "#6d28d9" }, // purple
    ray: { a: "#f59e0b", b: "#b45309" }, // amber
    teal: { a: "#22c1c3", b: "#0ea5e9" },
  };

  const t = themes[theme] || themes.teal;

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${t.a}"/>
        <stop offset="1" stop-color="${t.b}"/>
      </linearGradient>
      <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000" flood-opacity="0.35"/>
      </filter>
    </defs>

    <rect x="10" y="10" width="220" height="220" rx="18" fill="url(#g)" filter="url(#soft)"/>
    <circle cx="85" cy="104" r="10" fill="rgba(255,255,255,0.92)"/>
    <circle cx="155" cy="104" r="10" fill="rgba(255,255,255,0.92)"/>
    <path d="M78 142c12 18 28 26 42 26s30-8 42-26"
      fill="none" stroke="rgba(255,255,255,0.92)" stroke-width="12" stroke-linecap="round"/>
  </svg>`.trim();

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * 5 profiles you wanted
 * (These objects already contain avatar image)
 */
export const PROFILES = [
  { id: "pamina", name: "Pamina", avatar: avatarDataUri("pamina") },
  { id: "shajithan", name: "Shajithan", avatar: avatarDataUri("shajithan") },
  { id: "anne", name: "Anne", avatar: avatarDataUri("anne") },
  { id: "maria", name: "Maria", avatar: avatarDataUri("maria") },
  { id: "ray", name: "Ray", avatar: avatarDataUri("ray") },
];

const ProfileCtx = createContext(null);

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    try {
      const raw = localStorage.getItem("netflix_profile");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (profile)
      localStorage.setItem("netflix_profile", JSON.stringify(profile));
    else localStorage.removeItem("netflix_profile");
  }, [profile]);

  function clearProfile() {
    setProfile(null);
  }

  const value = useMemo(
    () => ({ profile, setProfile, clearProfile }),
    [profile],
  );

  return <ProfileCtx.Provider value={value}>{children}</ProfileCtx.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileCtx);
  if (!ctx) throw new Error("useProfile must be used inside <ProfileProvider>");
  return ctx;
}
