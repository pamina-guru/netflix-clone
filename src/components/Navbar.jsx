import { useEffect, useRef, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { PROFILES, useProfile } from "../context/ProfileContext";
import { useNavigate } from "react-router-dom";

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-4.35-4.35"
      />
      <circle cx="11" cy="11" r="7" />
    </svg>
  );
}

export default function Navbar({ searchValue, onSearchChange, onClearSearch }) {
  const nav = useNavigate();
  const { profile, setProfile, clearProfile } = useProfile();

  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // close dropdown when clicking outside
  useEffect(() => {
    function onDoc(e) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // Ctrl+K focuses the search input (like real apps)
  useEffect(() => {
    function onKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const el = document.getElementById("nav-search");
        el?.focus();
      }
      if (e.key === "Escape") {
        const el = document.getElementById("nav-search");
        if (document.activeElement === el) el?.blur();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function logout() {
    clearProfile();
    await signOut(auth);
    nav("/login");
  }

  const active = profile || PROFILES[0];

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="px-6 py-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-black/0">
        {/* Left */}
        <div className="flex items-center gap-8">
          <div className="text-red-600 font-extrabold text-2xl">NETFLIX</div>

          <div className="hidden md:flex gap-5 text-sm text-white/80">
            <button
              className="hover:text-white"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Home
            </button>

            <button
              className="hover:text-white"
              onClick={() =>
                document
                  .getElementById("row-trending")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Trending
            </button>

            <button
              className="hover:text-white"
              onClick={() =>
                document
                  .getElementById("row-toprated")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Top Rated
            </button>
          </div>
        </div>

        {/* Middle - Search */}
        <div className="hidden md:flex flex-1 justify-center px-6">
          <div className="w-full max-w-xl">
            <div className="flex items-center gap-2 rounded-md border border-white/10 bg-black/30 px-3 py-2 focus-within:ring-2 focus-within:ring-white/15">
              <span className="text-white/70">
                <SearchIcon />
              </span>

              <input
                id="nav-search"
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder="Search movies..."
                className="w-full bg-transparent outline-none text-sm text-white placeholder:text-white/40"
              />

              {searchValue?.trim() ? (
                <button
                  onClick={() => onClearSearch?.()}
                  className="text-white/60 hover:text-white text-sm px-2"
                  title="Clear"
                >
                  ✕
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {/* Right - Profile */}
        <div className="relative flex items-center gap-3" ref={ref}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-white/10 border border-white/10"
          >
            <img
              src={active.avatar}
              alt={active.name}
              className="w-9 h-9 rounded-md object-cover"
              draggable="false"
            />
            <div className="text-sm text-white/90 hidden sm:block">
              {active.name}
            </div>
            <div className="text-white/70 text-xs">▾</div>
          </button>

          {open && (
            <div className="absolute right-0 top-12 w-72 rounded-md bg-[#111] border border-white/10 shadow-xl overflow-hidden">
              <div className="p-3 border-b border-white/10">
                <div className="text-xs text-white/60">Switch Profile</div>

                <div className="mt-2 space-y-1">
                  {PROFILES.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setProfile(p);
                        setOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-2 py-2 rounded hover:bg-white/10 text-left"
                    >
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="w-9 h-9 rounded-md object-cover"
                        draggable="false"
                      />
                      <div className="text-sm">{p.name}</div>

                      {active?.id === p.id && (
                        <div className="ml-auto text-xs text-white/60">
                          Active
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setOpen(false);
                  nav("/profiles");
                }}
                className="w-full px-4 py-3 text-left hover:bg-white/10 text-sm"
              >
                Choose Profile Screen
              </button>

              <button
                onClick={logout}
                className="w-full px-4 py-3 text-left hover:bg-white/10 text-sm text-red-300"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
