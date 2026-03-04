import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
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
      await signInWithEmailAndPassword(auth, email, password);
      nav("/browse");
    } catch {
      setErr("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative bg-black text-white">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1600&q=60')] bg-cover bg-center opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/90" />

      <div className="relative z-10 px-6 py-6">
        <div className="text-red-600 font-extrabold text-3xl tracking-tight">
          NETFLIX
        </div>
      </div>

      <div className="relative z-10 flex justify-center px-6 pb-16">
        <div className="w-full max-w-md bg-black/70 rounded-md p-8 border border-white/10">
          <h1 className="text-3xl font-bold mb-6">Sign In</h1>
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
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              disabled={loading}
              className="w-full rounded bg-red-600 hover:bg-red-700 transition px-4 py-3 font-semibold disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-sm text-white/70">
            New to Netflix?{" "}
            <Link className="text-white hover:underline" to="/signup">
              Sign up now.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
