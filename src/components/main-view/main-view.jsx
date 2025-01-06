import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
  const [filter, setFilter] = useState("");

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
        }));
        setMovies(movies);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }, [token]);

  const filteredMovies = movies.filter(
    (movie) =>
      movie.title.toLowerCase().includes(filter.toLowerCase()) ||
      movie.genre.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Router>
       <NavigationBar
        user={user}
        onLoggedOut={() => {
          setUser(null);
          setToken(null); // Clear the user and token on logout
        }}
      />
      <Row>
        <Routes>
          {/* Redirect to login if user is not logged in */}
          {!user ? (
            <>
              <Route
                path="/Login"
                element={
                  <Col md={5}>
                    <div className="form-container">
                    <LoginView
                      onLoggedIn={(user, token) => {
                        setUser(user);
                        setToken(token);
                      }}
                    />  
                    </div>               
                  </Col>
                }
              />
              <Route path="*" element={<Navigate to="/Login" />} />

              <Route
                path="/Signup"
                element={
                  <Col md={5}>
                    <div className="form-container">
                     <SignupView />
                    </div>
                  </Col>
                }
              />
              <Route path="*" element={<Navigate to="/Signup" />} />

            </>
          ) : (
            <>

              {/* Filter Input */}
              <div className="filter-container">
                <input
                  type="text"
                  placeholder="Filter by title or genre"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
              </div>

              {/* Route for the main movie list */}
              <Route
                path="/movies"
                element={
                  filteredMovies.length === 0 ? (
                    <div>The list is empty!</div>
                  ) : (
                    filderedMovies.map((movie) => (
                      <Col className="mb-5" key={movie.id} md={3}>
                        <MovieCard movie={movie} />
                      </Col>
                    ))
                  )
                }
              />

              {/* Route for the selected movie view */}
              <Route
                path="/movies/:movieId"
                element={<MovieView movies={movies} />}
              />

              {/* Route for the profile view */}
              <Route
                path="/profile"
                element={
                  <ProfileView
                    user={user}
                    token={token}
                    movies={movies}
                    onUserUpdated={(updatedUser) => setUser(updatedUser)}
                    onUserDeleted={() => {
                      setUser(null);
                      setToken(null);
                    }}
                  />
                }
              />

              {/* Default route */}
              <Route path="*" element={<Navigate to="/movies" />} />
            </>
          )}
        </Routes>
      </Row>
    </Router>
  );
};




