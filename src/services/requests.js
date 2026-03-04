const requests = {
  trending: "/trending/movie/week",
  topRated: "/movie/top_rated",
  action: "/discover/movie?with_genres=28",
  comedy: "/discover/movie?with_genres=35",
  horror: "/discover/movie?with_genres=27",
  romance: "/discover/movie?with_genres=10749",
  documentaries: "/discover/movie?with_genres=99",
  search: (q) =>
    `/search/movie?query=${encodeURIComponent(q)}&include_adult=false`,
};

export default requests;
