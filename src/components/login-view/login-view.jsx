import { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { popConfetti } from "../../utils/confetti";


export const LoginView = ({ onLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = { username, password };

    fetch("https://movie-api-bqfe.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    .then((r) => r.json())
    .then((data) => {
      if (data.user) {
        popConfetti(); // <= celebration!
        const user = { ...data.user, FavoriteMovies: data.user.FavoriteMovies || [] };
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", data.token);
        fetchUserProfile(data.user.username, data.token);
      } else {
        alert(data.message || "No such user or incorrect password");
      }
    })
    .catch((error) => {
      console.error(error);
      alert("Something went wrong");
    });
};

  const fetchUserProfile = (username, token) => {
    fetch(`https://movie-api-bqfe.onrender.com/users/${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((userProfile) => onLoggedIn(userProfile, token))
      .catch(() => alert("Failed to fetch user profile."));
  };

  return (
  <div className="auth-hero">
    {/* decorative blobs */}
    <span className="blob b1"></span>
    <span className="blob b2"></span>
    <span className="blob b3"></span>

    <div className="w-100" style={{ maxWidth: 420 }}>
      <div className="card sticker form-container">
        <div className="card-body">
          <h1 className="auth-title h3 mb-4 text-center">Login</h1>

          <Form onSubmit={handleSubmit}>
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

            <Form.Group controlId="formPassword" className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <div className="d-grid">
              <Button variant="primary" type="submit">Submit</Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  </div>
 );
};
