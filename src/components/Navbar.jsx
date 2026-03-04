import { useEffect, useRef, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { Link, useNavigate } from "react-router-dom";

function SearchIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M21 21l-4.3-4.3m1.8-5.2a7 7 0 11-14 0 7 7 0 0114 0z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Navbar({ searchValue, onSearchChange, onClearSearch }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const nav = useNavigate();

  const searchInputRef = useRef(null);

  // scroll -> solid black
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close dropdown when clicking outside
  useEffect(() => {
    function onDocClick(e) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  // ESC closes dropdown
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // ✅ Ctrl+K focuses search
  useEffect(() => {
    function onKeyDown(e) {
      const isMac = navigator.platform.toLowerCase().includes("mac");
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (cmdOrCtrl && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }

      // Optional: ESC clears search if focused + has text
      if (e.key === "Escape") {
        const active = document.activeElement === searchInputRef.current;
        if (active && (searchValue || "").trim()) onClearSearch?.();
        searchInputRef.current?.blur();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [searchValue, onClearSearch]);

  async function handleLogout() {
    setOpen(false);
    await signOut(auth);
    nav("/login");
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-black" : "bg-gradient-to-b from-black/80 to-black/0"
      }`}
    >
      <div className="px-6 py-4 flex items-center justify-between gap-4">
        {/* Left */}
        <div className="flex items-center gap-6 min-w-[180px]">
          <Link to="/browse" className="text-red-600 font-extrabold text-2xl">
            NETFLIX
          </Link>

          <nav className="hidden md:flex items-center gap-4 text-sm text-white/85">
            <Link to="/browse" className="hover:text-white">
              Home
            </Link>
            <a href="#trending" className="hover:text-white">
              Trending
            </a>
            <a href="#toprated" className="hover:text-white">
              Top Rated
            </a>
          </nav>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-xl">
          <div className="flex items-center gap-2 bg-black/60 border border-white/10 rounded px-3 py-2">
            <SearchIcon className="w-4 h-4 text-white/60" />

            <input
              ref={searchInputRef}
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search movies..."
              className="w-full bg-transparent outline-none text-sm text-white placeholder:text-white/40"
            />

            {/* Clear */}
            {searchValue?.trim() ? (
              <button
                onClick={onClearSearch}
                className="text-white/60 hover:text-white text-sm px-2"
                aria-label="Clear search"
              >
                ✕
              </button>
            ) : null}
          </div>
        </div>

        {/* Right: Avatar + dropdown */}
        <div className="flex items-center gap-3 min-w-[160px] justify-end">
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2 rounded px-2 py-1 hover:bg-white/10 transition"
              aria-label="Open profile menu"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
                alt="Netflix Profile"
                className="w-9 h-9 rounded object-cover border border-white/20"
              />
              <span className="hidden sm:inline text-white/85 text-sm">
                Profile
              </span>
              <span className="text-white/60 text-xs">▾</span>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-52 rounded-lg overflow-hidden border border-white/10 bg-[#141414] shadow-xl">
                <div className="px-4 py-3 border-b border-white/10">
                  <div className="text-sm font-semibold text-white">Pamina</div>
                  <div className="text-xs text-white/60">
                    {auth.currentUser?.email || "Signed in"}
                  </div>
                </div>

                <div className="py-2 text-sm">
                  <button
                    onClick={() => {
                      setOpen(false);
                      alert("Account page coming soon!");
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-white/10"
                  >
                    Account
                  </button>

                  <button
                    onClick={() => {
                      setOpen(false);
                      alert("My List coming soon!");
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-white/10"
                  >
                    My List
                  </button>
                </div>

                <div className="border-t border-white/10">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-white/10 text-red-300"
                  >
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
