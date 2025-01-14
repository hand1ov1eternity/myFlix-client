import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { ProfileView } from "../profile-view/profile-view";
import { NavigationBar } from "../navigation-bar/navigation-bar";

export const MainView = () => {
  const [movies, setMovies] = useState([]);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(""); // State to store selected genre

  useEffect(() => {
    // Check localStorage for token to persist login state on page reload
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser)); // assuming storedUser is a stringified object
    }
  }, []);

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

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Filter movies based on selected genre
  const filteredMovies = selectedGenre
    ? movies.filter((movie) => movie.genre === selectedGenre)
    : movies;

  return (
    <BrowserRouter>
      <NavigationBar
        user={user}
        onLoggedOut={handleLogout} // Use the handleLogout function here
        setSelectedGenre={setSelectedGenre} // Pass the setSelectedGenre function
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
                          localStorage.setItem("token", token); // Store token in localStorage
                          localStorage.setItem("user", JSON.stringify(user)); // Store user in localStorage
                        }}
                      />
                    </div>
                  </Col>
                }
              />
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
              <Route path="*" element={<Navigate to="/Login" />} />
            </>
          ) : (
            <>
              {/* Route for the main movie list */}
              <Route
                path="/movies"
                element={
                  filteredMovies.length === 0 ? (
                    <div>The list is empty!</div>
                  ) : (
                    filteredMovies.map((movie) => (
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
                element={<MovieView movies={movies} user={user} token={token} onUserUpdated={setUser} />}
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
                    onUserDeleted={handleLogout} // Use the handleLogout function here
                  />
                }
              />

              {/* Default route */}
              <Route path="*" element={<Navigate to="/movies" />} />
            </>
          )}
        </Routes>
      </Row>
    </BrowserRouter>
  );
};
