import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import Banner from "../components/Banner";
import Row from "../components/Row";
import requests from "../services/requests";
import { useState } from "react";
import MovieModal from "../components/MovieModal";

export default function Browse() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen bg-[#111] text-white">
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-black/0">
          <div className="text-red-600 font-extrabold text-2xl">NETFLIX</div>
          <button
            onClick={() => signOut(auth)}
            className="text-sm px-4 py-2 rounded bg-white/10 hover:bg-white/20 border border-white/10"
          >
            Logout
          </button>
        </div>
      </div>

      <Banner />

      <div className="space-y-8 pb-10">
        <Row
          title="Trending Now"
          fetchUrl={requests.trending}
          isLargeRow
          onPick={setSelected}
        />
        <Row
          title="Top Rated"
          fetchUrl={requests.topRated}
          onPick={setSelected}
        />
        <Row
          title="Action Movies"
          fetchUrl={requests.action}
          onPick={setSelected}
        />
        <Row
          title="Comedy Movies"
          fetchUrl={requests.comedy}
          onPick={setSelected}
        />
        <Row
          title="Horror Movies"
          fetchUrl={requests.horror}
          onPick={setSelected}
        />
        <Row
          title="Romance Movies"
          fetchUrl={requests.romance}
          onPick={setSelected}
        />
        <Row
          title="Documentaries"
          fetchUrl={requests.documentaries}
          onPick={setSelected}
        />
      </div>

      <MovieModal movie={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
