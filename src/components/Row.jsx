import { useEffect, useState } from "react";
import api, { imgUrl } from "../services/tmdb";

export default function Row({ title, fetchUrl, isLargeRow = false, onPick }) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    let alive = true;

    async function load() {
      const res = await api.get(fetchUrl);
      if (!alive) return;
      setMovies(res.data.results || []);
    }

    load();
    return () => (alive = false);
  }, [fetchUrl]);

  return (
    <section className="px-6">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>

      <div className="flex gap-3 overflow-x-auto pb-5 scrollbar-hide">
        {movies.map((m) => {
          const imgPath = isLargeRow
            ? m.poster_path
            : m.backdrop_path || m.poster_path;

          return (
            <button
              key={m.id}
              onClick={() => onPick?.(m)}
              className="shrink-0 text-left"
              title={m.title || m.name}
            >
              <img
                className={`rounded-md object-cover transition hover:scale-105 ${
                  isLargeRow ? "h-[240px] w-[160px]" : "h-[140px] w-[250px]"
                }`}
                src={imgUrl(imgPath, isLargeRow ? "w500" : "w780")}
                alt={m.title || m.name}
                loading="lazy"
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
