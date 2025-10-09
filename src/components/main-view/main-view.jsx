import { useState, useEffect, useRef } from "react";
import { Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import { Row, Col, Spinner, Alert, Button } from "react-bootstrap";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { ProfileView } from "../profile-view/profile-view";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { searchMovies } from "../../api/search";
import { API_BASE } from "../../api/config";

export const MainView = () => {
  const [movies, setMovies] = useState([]);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState("");

  // search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null); // null = not in search mode
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [usedFallback, setUsedFallback] = useState(false);

  const [params, setParams] = useSearchParams();

// Hydrate user from localStorage on first render
useEffect(() => {
  try {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  } catch (_) {}
}, []);


  const abortRef = useRef(null);
  const debounceRef = useRef(null);

  // Load movies after login
  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/movies`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Network response was not ok");
        return r.json();
      })
      .then((data) => {
        const mapped = data.map((doc) => ({
          id: doc._id,
          title: doc.title,
          description: doc.description,
          genre: doc.genre,
          director: doc.director,
          imageURL: doc.imageURL,
        }));
        setMovies(mapped);
      })
      .catch((e) => console.error("Fetch error:", e));
  }, [token]);

  // Hydrate query from ?q= on first render
  useEffect(() => {
    const qFromUrl = params.get("q") || "";
    if (qFromUrl) setSearchQuery(qFromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // === Derived flags/lists (define in this order!) ===
  const showingSearch = searchResults !== null; // true once a semantic search has been performed

  // local catalog filter (only used when NOT in search mode)
  const filteredMovies = movies.filter((m) => {
    const matchesGenre = selectedGenre ? m.genre?.name === selectedGenre : true;
    if (showingSearch) return matchesGenre; // don't also apply title filter during search mode
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  // the list we actually render
  const gridMovies = showingSearch ? (searchResults || []) : filteredMovies;

  // Debounced semantic search effect
  useEffect(() => {
    const q = (searchQuery || "").trim();

    // sync URL
    if (q) {
      params.set("q", q);
      setParams(params, { replace: true });
    } else {
      params.delete("q");
      setParams(params, { replace: true });
    }

    // when query too short, exit search mode and show catalog
    if (q.length < 3) {
      setIsSearching(false);
      setSearchResults(null);  // ← exit search mode
      setSearchError("");
      setUsedFallback(false);
      if (abortRef.current) abortRef.current.abort();
      return;
    }

    setIsSearching(true);
    setSearchError("");

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        const data = await searchMovies({
          q,
          limit: 24,
          threshold: 0.35,
          includeScores: true,
          signal: controller.signal,
        });
        // console.log('SEARCH RAW DATA', data);

        // Support both shapes: array OR { results: [...] }
        const raw = Array.isArray(data) ? data : (data?.results || []);

        const normalized = raw.map((m) => ({
          id: m.id || m._id,
          title: m.title,
          description: m.description,
          genre: { name: m?.genre?.name || m?.genres?.[0] || "Unknown" },
          director: { name: m?.director?.name || m?.director || "Unknown" },
          imageURL: m.imageURL || m.posterUrl || m.poster || "",
          score: m.score ?? null,
        }));

        const maxScore = Math.max(...normalized.map(r => r.score ?? 0), 0);
        // Keep anything within 0.10 of the best score, and also above a floor
        const filtered = normalized.filter(r =>
          (r.score ?? 0) >= Math.max(0.35, maxScore - 0.10)
        );
        setSearchResults(filtered);
        setUsedFallback(Boolean(data?.usedFallback === true));
        setIsSearching(false);
      } catch (err) {
        if (err.name === "AbortError") return;
        setIsSearching(false);
        setSearchError(err.message || "Search failed");
      }
    }, 350);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, params, setParams]);

  const handleSearch = (q) => setSearchQuery(q);
  const clearSearch = () => setSearchQuery("");

  return (
    <>
      <NavigationBar
        user={user}
        onLoggedOut={() => { setUser(null); setToken(null); }}
        setSelectedGenre={setSelectedGenre}
        onSearch={handleSearch}
        searchValue={searchQuery} // controlled input in Navbar
      />

      <Routes>
        {!user ? (
  <>
    <Route index element={<Navigate to="/login" replace />} />   {/* 👈 NEW */}
    <Route
      path="/login"
      element={
        <LoginView onLoggedIn={(u, t) => { setUser(u); setToken(t); }} />
      }
    />
    <Route path="/signup" element={<SignupView />} />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </>
) : (

          <>
            <Route
              path="/movies"
              element={
                <>
                  {showingSearch && (
                    <div className="px-3 mt-3">
                      <Alert variant="secondary" className="d-flex align-items-center justify-content-between">
                        <div className="me-3">
                          Showing results for <strong>“{searchQuery.trim()}”</strong>
                          {usedFallback && <span className="ms-2 badge bg-warning text-dark"></span>}
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          {isSearching && <Spinner animation="border" size="sm" role="status" aria-hidden="true" />}
                          <Button size="sm" variant="outline-dark" onClick={clearSearch}>Clear</Button>
                        </div>
                      </Alert>
                    </div>
                  )}

                  {isSearching ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" role="status" />
                      <div className="mt-2">Searching…</div>
                    </div>
                  ) : searchError ? (
                    <div className="text-center py-5">
                      <Alert variant="danger">{searchError}</Alert>
                    </div>
                  ) : gridMovies.length === 0 ? (
                    <div className="text-center py-5">
                      No movies found{showingSearch ? " for this query" : ""}!
                    </div>
                  ) : (
                    <Row className="g-4 px-3 py-4">
                      {gridMovies.map((movie) => (
                        <Col key={movie.id} xs={12} sm={6} md={4} lg={3}>
                          <MovieCard movie={movie} />
                        </Col>
                      ))}
                    </Row>
                  )}
                </>
              }
            />
            <Route
              path="/movies/:movieId"
              element={<MovieView movies={movies} user={user} token={token} onUserUpdated={setUser} />}
            />
            <Route
              path="/profile"
              element={
                <ProfileView
                  user={user}
                  token={token}
                  movies={movies}
                  onUserUpdated={(u) => setUser(u)}
                  onUserDeleted={() => { setUser(null); setToken(null); }}
                />
              }
            />
            <Route index element={<Navigate to="/movies" replace />} />
            <Route path="*" element={<Navigate to="/movies" replace />} />

          </>
        )}
      </Routes>
    </>
  );
};
