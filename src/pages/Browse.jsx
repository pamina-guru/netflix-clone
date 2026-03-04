import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import Row from "../components/Row";
import requests from "../services/requests";
import MovieModal from "../components/MovieModal";
import api from "../services/tmdb";
import useDebounce from "../hooks/useDebounce";

export default function Browse() {
  const [selected, setSelected] = useState(null);

  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 450);
  const [searchMovies, setSearchMovies] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    async function run() {
      const q = debounced.trim();
      if (!q) {
        setSearchMovies([]);
        setSearchLoading(false);
        return;
      }

      setSearchLoading(true);
      try {
        const res = await api.get(requests.search(q));
        setSearchMovies(res.data.results || []);
      } catch (e) {
        setSearchMovies([]);
      } finally {
        setSearchLoading(false);
      }
    }

    run();
  }, [debounced]);

  const isSearching = debounced.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#111] text-white">
      <Navbar
        searchValue={search}
        onSearchChange={setSearch}
        onClearSearch={() => setSearch("")}
      />

      {/* Hide banner when searching (feels more Netflix) */}
      {!isSearching && <Banner />}

      <div className="space-y-8 pb-10">
        {/* Search Results row */}
        {isSearching && (
          <div className="pt-24 px-6">
            <div className="text-sm text-white/70 mb-2">
              {searchLoading
                ? `Searching "${debounced}"...`
                : `Search results for "${debounced}"`}
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {searchMovies.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelected(m)}
                  className="min-w-[140px] md:min-w-[180px] rounded overflow-hidden hover:scale-105 transition transform"
                  title={m.title || m.name}
                >
                  <img
                    className="w-full h-[210px] md:h-[260px] object-cover"
                    src={
                      m.poster_path
                        ? `https://image.tmdb.org/t/p/w342${m.poster_path}`
                        : "https://via.placeholder.com/342x513?text=No+Image"
                    }
                    alt={m.title || m.name}
                  />
                </button>
              ))}
            </div>

            {!searchLoading && searchMovies.length === 0 && (
              <div className="text-white/60 text-sm mt-3">
                No results. Try another movie name.
              </div>
            )}
          </div>
        )}

        {/* Normal rows (show only when not searching) */}
        {!isSearching && (
          <>
            <div id="trending">
              <Row
                title="Trending Now"
                fetchUrl={requests.trending}
                isLargeRow
                onPick={setSelected}
              />
            </div>

            <div id="toprated">
              <Row
                title="Top Rated"
                fetchUrl={requests.topRated}
                onPick={setSelected}
              />
            </div>

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
          </>
        )}
      </div>

      <MovieModal movie={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
