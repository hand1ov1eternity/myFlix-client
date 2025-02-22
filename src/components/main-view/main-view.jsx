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
  const [searchQuery, setSearchQuery] = useState("");  // Add searchQuery state

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
    setSearchQuery(query); // Update the search query state
  };

  // Filter movies by genre and search query
  const filteredMovies = movies.filter((movie) => {
    const matchesGenre = selectedGenre ? movie.genre.name === selectedGenre : true;
    const matchesSearchQuery = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesSearchQuery;
  });

  return (
    <BrowserRouter>
      <NavigationBar
        user={user}
        onLoggedOut={() => {
          setUser(null);
          setToken(null);
        }}
        setSelectedGenre={setSelectedGenre}
        onSearch={handleSearch} // Pass the function
      />
      <Row>
        <Routes>
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
              <Route path="/Signup" element={<SignupView />} />
              <Route path="*" element={<Navigate to="/Login" />} />
            </>
          ) : (
            <>
              <Route
                path="/movies"
                element={
                  filteredMovies.length === 0 ? (
                    <div>No movies found for this genre or search query!</div>
                  ) : (
                    filteredMovies.map((movie) => (
                      <Col className="mb-5" key={movie.id} md={3}>
                        <MovieCard movie={movie} />
                      </Col>
                    ))
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
                    onUserUpdated={(updatedUser) => setUser(updatedUser)}
                    onUserDeleted={() => {
                      setUser(null);
                      setToken(null);
                    }}
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
