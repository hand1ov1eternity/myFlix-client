import { useEffect, useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { MovieCard } from "../movie-card/movie-card";

export const ProfileView = ({ user, token, movies, onUserUpdated, onUserDeleted }) => {
  const [username, setUsername] = useState(user.Username);
  const [email, setEmail] = useState(user.Email);
  const [birthday, setBirthday] = useState(user.Birthday);
  const [password, setPassword] = useState("");
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  useEffect(() => {

       // Check if user.FavoriteMovies exists and is an array before filtering
       if (!user.FavoriteMovies || !Array.isArray(user.FavoriteMovies)) {
        return; // If FavoriteMovies is not defined or not an array, return early
      }
    const filteredFavorites = movies.filter((m) => user.FavoriteMovies.includes(m.id));
    setFavoriteMovies(filteredFavorites);
  }, [movies, user.FavoriteMovies]);

  const handleUpdate = (e) => {
    e.preventDefault();

    const data = {
      Username: username,
      Password: password,
      Email: email,
      Birthday: birthday,
    };

    fetch(`https://movie-api-bqfe.onrender.com/users/${user.Username}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          alert("Profile updated successfully");
          return response.json();
        } else {
          throw new Error("Failed to update profile");
        }
      })
      .then((updatedUser) => {
        onUserUpdated(updatedUser);
      })
      .catch((error) => alert(error.message));
  };

  const handleDeregister = () => {
    const confirmDeregister = window.confirm("Are you sure you want to delete your account?");

    if (confirmDeregister) {
      fetch(`https://movie-api-bqfe.onrender.com/users/${user.Username}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          if (response.ok) {
            alert("Account deleted successfully");
            onUserDeleted();
          } else {
            throw new Error("Failed to delete account");
          }
        })
        .catch((error) => alert(error.message));
    }
  };

  return (
    <Row className="mt-5">
      <Col md={6}>
        <h3>Profile Information</h3>
        <Form onSubmit={handleUpdate}>
          <Form.Group controlId="formUsername" className="mb-3">
            <Form.Label>Username:</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength="3"
            />
          </Form.Group>

          <Form.Group controlId="formPassword" className="mb-3">
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formBirthday" className="mb-3">
            <Form.Label>Birthday:</Form.Label>
            <Form.Control
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Update Profile
          </Button>
        </Form>

        <Button
          variant="danger"
          className="mt-3"
          onClick={handleDeregister}
        >
          Delete Account
        </Button>
      </Col>

      <Col md={6}>
        <h3>Favorite Movies</h3>
        {favoriteMovies.length === 0 ? (
          <p>You have no favorite movies.</p>
        ) : (
          <Row>
            {favoriteMovies.map((movie) => (
              <Col key={movie.id} className="mb-4" md={6}>
                <MovieCard movie={movie} />
              </Col>
            ))}
          </Row>
        )}
      </Col>
    </Row>
  );
};
