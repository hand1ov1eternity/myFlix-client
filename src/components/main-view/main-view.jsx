import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { ProfileView } from "../profile-view/profile-view";
import { Row, Col } from "react-bootstrap";
import { NavigationBar } from "../navigation-bar/navigation-bar";

export const MainView = () => {
  const [movies, setMovies] = useState([]);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!token) return;

    fetch("https://movie-api-bqfe.onrender.com/movies", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
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
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }, [token]);

  const handleSearch = (query) => {
    setSearchQuery(query.toLowerCase()); // Store the search query in lowercase for case-insensitive matching
  };

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery)
  );

  return (
    <BrowserRouter>
      <NavigationBar
        user={user}
        onLoggedOut={() => {
          setUser(null);
          setToken(null);
        }}
        onSearch={handleSearch} // Pass the search function to the NavigationBar
      />
      <Row>
        <Routes>
          {!user ? (
            <>
              <Route
                path="/login"
                element={
                  <Col md={5}>
                    <LoginView
                      onLoggedIn={(user, token) => {
                        setUser(user);
                        setToken(token);
                      }}
                    />
                  </Col>
                }
              />
              <Route
                path="/signup"
                element={
                  <Col md={5}>
                    <SignupView />
                  </Col>
                }
              />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          ) : (
            <>
              <Route
                path="/movies"
                element={
                  filteredMovies.length === 0 ? (
                    <div>No movies found!</div>
                  ) : (
                    filteredMovies.map((movie) => (
                      <Col className="mb-4" key={movie.id} md={3}>
                        <MovieCard movie={movie} />
                      </Col>
                    ))
                  )
                }
              />
              <Route
                path="/movies/:movieId"
                element={<MovieView movies={movies} user={user} />}
              />
              <Route
                path="/profile"
                element={
                  <ProfileView
                    user={user}
                    token={token}
                    movies={movies}
                    onUserUpdated={(updatedUser) => setUser(updatedUser)}
                  />
                }
              />
              <Route path="*" element={<Navigate to="/movies" />} />
            </>
          )}
        </Routes>
      </Row>
    </BrowserRouter>
  );
};

