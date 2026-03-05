import { useNavigate } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";

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
    <!-- Eyes -->
    <circle cx="85" cy="104" r="10" fill="rgba(255,255,255,0.92)"/>
    <circle cx="155" cy="104" r="10" fill="rgba(255,255,255,0.92)"/>
    <!-- Smile (clean + subtle) -->
    <path d="M78 142c12 18 28 26 42 26s30-8 42-26"
      fill="none" stroke="rgba(255,255,255,0.92)" stroke-width="12" stroke-linecap="round"/>
  </svg>`.trim();

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const PROFILES = [
  { id: "pamina", name: "Pamina", theme: "pamina" },
  { id: "shajithan", name: "Shajithan", theme: "shajithan" },
  { id: "anne", name: "Anne", theme: "anne" },
  { id: "maria", name: "Maria", theme: "maria" },
  { id: "ray", name: "Ray", theme: "ray" },
];

export default function Profiles() {
  const nav = useNavigate();
  const { setProfile } = useProfile();

  function pick(p) {
    setProfile({
      id: p.id,
      name: p.name,
      avatar: avatarDataUri(p.theme),
    });
    nav("/browse");
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-5xl text-center">
        <h1 className="text-3xl sm:text-4xl md:text-[46px] font-semibold tracking-tight">
          Who&apos;s watching?
        </h1>

        <div className="mt-10 flex flex-wrap justify-center gap-10">
          {PROFILES.map((p) => (
            <button
              key={p.id}
              onClick={() => pick(p)}
              className="group flex flex-col items-center gap-3 outline-none"
            >
              <div
                className={[
                  "w-[110px] h-[110px] md:w-[128px] md:h-[128px]",
                  "rounded-[10px] overflow-hidden",
                  "border-2 border-transparent",
                  "group-hover:border-white",
                  "transition duration-150 ease-out group-hover:scale-[1.06]",
                ].join(" ")}
              >
                <img
                  src={avatarDataUri(p.theme)}
                  alt={`${p.name} avatar`}
                  className="w-full h-full object-cover"
                  draggable="false"
                />
              </div>

              <div className="text-sm md:text-[15px] text-white/60 group-hover:text-white transition">
                {p.name}
              </div>
            </button>
          ))}

          {/* Add Profile tile */}
          <button
            onClick={() => alert("Add Profile later")}
            className="group flex flex-col items-center gap-3 outline-none"
          >
            <div className="w-[110px] h-[110px] md:w-[128px] md:h-[128px] rounded-[10px] bg-white/10 grid place-items-center border-2 border-transparent group-hover:border-white transition duration-150 ease-out group-hover:scale-[1.06]">
              <div className="w-12 h-12 rounded-full bg-white/15 grid place-items-center">
                <span className="text-4xl leading-none text-white/80">+</span>
              </div>
            </div>
            <div className="text-sm md:text-[15px] text-white/60 group-hover:text-white transition">
              Add Profile
            </div>
          </button>
        </div>

        <div className="mt-12">
          <button className="px-6 py-2 text-[11px] tracking-[0.28em] uppercase text-white/70 border border-white/30 hover:text-white hover:border-white transition">
            Manage Profiles
          </button>
        </div>
      </div>
    </div>
  );
}
