import { useEffect, useState } from "react";
import { Row, Col, Form, Button, Card } from "react-bootstrap"; // ✅ add Card
import { MovieCard } from "../movie-card/movie-card";
import "./profile-view.scss";

export const ProfileView = ({ user, token, movies, onUserUpdated, onUserDeleted }) => {
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [birthday, setBirthday] = useState(user?.birthday || "");
  const [password, setPassword] = useState("");
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  useEffect(() => {
    if (!user?.FavoriteMovies || !Array.isArray(user?.FavoriteMovies)) return;
    const filteredFavorites = movies.filter((m) => user.FavoriteMovies.includes(m.id));
    setFavoriteMovies(filteredFavorites);
  }, [movies, user?.FavoriteMovies]);

  const handleUpdate = (e) => {
    e.preventDefault();
    const data = { username, password, email, birthday };

    fetch(`https://movie-api-bqfe.onrender.com/users/${user?.username}`, {
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
        }
        throw new Error("Failed to update profile");
      })
      .then((updatedUser) => onUserUpdated(updatedUser))
      .catch((error) => alert(error.message));
  };

  const handleDeregister = () => {
    const confirmDeregister = window.confirm("Are you sure you want to delete your account?");
    if (!confirmDeregister) return;

    fetch(`https://movie-api-bqfe.onrender.com/users/${user?.username}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (response.ok) {
          alert("Account deleted successfully");
          onUserDeleted();
          return;
        }
        throw new Error("Failed to delete account");
      })
      .catch((error) => alert(error.message));
  };

  return (
    <div className="profile-hero">
      <div className="profile-shell container-fluid px-3 px-md-4 py-4">
        <Row className="g-4">
          {/* Left: Profile info + form */}
          <Col md={5} lg={4}>
            <Card className="profile-card sticker">
              <Card.Body>
                <h2 className="auth-title h4 mb-3">Profile</h2>

                <div className="mb-3 small text-muted">
                  <div><strong>Username:</strong> {user?.username || "N/A"}</div>
                  <div><strong>Email:</strong> {user?.email || "N/A"}</div>
                  <div><strong>Birthday:</strong> {user?.birthday || "N/A"}</div>
                </div>

                <h3 className="auth-title h5 mb-3">Update Profile</h3>
                <Form onSubmit={handleUpdate}>
                  <Form.Group controlId="formUsername" className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      minLength="3"
                    />
                  </Form.Group>

                  <Form.Group controlId="formPassword" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formBirthday" className="mb-3">
                    <Form.Label>Birthday</Form.Label>
                    <Form.Control
                      type="date"
                      value={birthday}
                      onChange={(e) => setBirthday(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <div className="d-grid gap-2">
                    <Button variant="primary" type="submit">Update Profile</Button>
                    <Button variant="danger" onClick={handleDeregister}>Delete Account</Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Right: Favorites grid */}
          <Col md={7} lg={8}>
            <Card className="favorites-card">
              <Card.Body>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h2 className="auth-title h4 m-0">Favorite Movies</h2>
                  <span className="small text-muted">{favoriteMovies.length} total</span>
                </div>

                {favoriteMovies.length === 0 ? (
                  <p className="text-muted">You have no favorite movies.</p>
                ) : (
                  <Row className="g-4">
                    {favoriteMovies.map((movie) => (
                      <Col key={movie.id} xs={12} sm={6} lg={4}>
                        <MovieCard movie={movie} />
                      </Col>
                    ))}
                  </Row>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};
