import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { Row, Col } from "react-bootstrap";
import { NavigationBar } from "../navigation-bar/navigation-bar";

export const MainView = () => {
  const [movies, setMovies] = useState([]);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const handleFavoriteToggle = (movieId) => {
    if (!user) return;

    const updatedFavorites = user.FavoriteMovies.includes(movieId)
      ? user.FavoriteMovies.filter((id) => id !== movieId)
      : [...user.FavoriteMovies, movieId];

    const updatedUser = { ...user, FavoriteMovies: updatedFavorites };

    // Update user on the backend
    fetch(`https://movie-api-bqfe.onrender.com/users/${user.Username}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    })
      .then((response) => response.json())
      .then((updatedUser) => {
        setUser(updatedUser); // Update the user in state
      })
      .catch((error) => alert("Failed to update favorites"));
  };

  useEffect(() => {
    if (!token) return;

    fetch("https://movie-api-bqfe.onrender.com/movies", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setMovies(data);
      })
      .catch((error) => alert("Failed to fetch movies"));
  }, [token]);

  return (
    <Router>
      <NavigationBar
        user={user}
        onLoggedOut={() => {
          setUser(null);
          setToken(null);
        }}
      />
      <Row>
        <Routes>
          {/* Login and Signup routes */}
          <Route
            path="/login"
            element={<LoginView onLoggedIn={(user, token) => { setUser(user); setToken(token); }} />}
          />
          <Route
            path="/signup"
            element={<SignupView />}
          />

          {/* Movie list route */}
          <Route
            path="/movies"
            element={
              <div>
                {movies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    user={user}
                    onFavoriteToggle={handleFavoriteToggle}
                  />
                ))}
              </div>
            }
          />

          {/* Movie details route */}
          <Route
            path="/movies/:movieId"
            element={
              <MovieView
                movie={movies.find((movie) => movie.id === movieId)}
                user={user}
                onFavoriteToggle={handleFavoriteToggle}
              />
            }
          />

          {/* Default route */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Row>
    </Router>
  );
};

