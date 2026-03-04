import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      nav("/browse");
    } catch {
      setErr("Could not create account. Try a stronger password (6+ chars).");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative bg-black text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />

      <div className="relative z-10 px-6 py-6">
        <div className="text-red-600 font-extrabold text-3xl tracking-tight">
          NETFLIX
        </div>
      </div>

      <div className="relative z-10 flex justify-center px-6 pb-16">
        <div className="w-full max-w-md bg-black/70 rounded-md p-8 border border-white/10">
          <h1 className="text-3xl font-bold mb-6">Sign Up</h1>
          {err && <p className="mb-4 text-sm text-red-300">{err}</p>}

          <form onSubmit={onSubmit} className="space-y-4">
            <input
              className="w-full rounded bg-[#333] px-4 py-3 outline-none focus:ring-2 focus:ring-red-600"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              className="w-full rounded bg-[#333] px-4 py-3 outline-none focus:ring-2 focus:ring-red-600"
              type="password"
              placeholder="Password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />

            <button
              disabled={loading}
              className="w-full rounded bg-red-600 hover:bg-red-700 transition px-4 py-3 font-semibold disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-sm text-white/70">
            Already have an account?{" "}
            <Link className="text-white hover:underline" to="/login">
              Sign in.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
