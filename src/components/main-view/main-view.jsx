import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { ProfileView } from "../profile-view/profile-view";
import { Row, Col } from "react-bootstrap";
import { NavigationBar } from "../navigation-bar/navigation-bar";

export const MainView = () => {
  const [movies, setMovies] = useState([]);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!token) return;
    fetch("https://movie-api-bqfe.onrender.com/movies", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => { if (!r.ok) throw new Error("Network response was not ok"); return r.json(); })
      .then((data) => {
        const movies = data.map((doc) => ({
          id: doc._id,
          title: doc.title,
          description: doc.description,
          genre: doc.genre,
          director: doc.director,
          imageURL: doc.imageURL,
        }));
        setMovies(movies);
      })
      .catch((e) => console.error("Fetch error:", e));
  }, [token]);

  const handleSearch = (q) => setSearchQuery(q);

  const filteredMovies = movies.filter((m) => {
    const matchesGenre = selectedGenre ? m.genre.name === selectedGenre : true;
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  return (
    <BrowserRouter>
      {/* ✅ Navbar always visible */}
      <NavigationBar
        user={user}
        onLoggedOut={() => { setUser(null); setToken(null); }}
        setSelectedGenre={setSelectedGenre}
        onSearch={handleSearch}
      />

      <Routes>
        {!user ? (
          <>
            <Route
              path="/login"
              element={
                <LoginView
                  onLoggedIn={(u, t) => { setUser(u); setToken(t); }}
                />
              }
            />
            <Route path="/signup" element={<SignupView />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            <Route
              path="/movies"
              element={
                filteredMovies.length === 0 ? (
                  <div className="text-center py-5">No movies found for this genre or search query!</div>
                ) : (
                  <Row className="g-4 px-3 py-4">
                    {filteredMovies.map((movie) => (
                      <Col key={movie.id} xs={12} sm={6} md={4} lg={3}>
                        <MovieCard movie={movie} />
                      </Col>
                    ))}
                  </Row>
                )
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
            <Route path="*" element={<Navigate to="/movies" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};
