import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { popConfetti } from "../../utils/confetti";
import bgVideoUrl from "url:../../assets/popcorn_vid.mp4";
import { API_BASE } from "../../api/config";

export const LoginView = ({ onLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const fetchUserProfile = (username, token) => {
    return fetch(`${API_BASE}/users/${encodeURIComponent(username)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch user profile");
        return r.json();
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = { username, password };

    fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((r) => r.json())
      .then(async (data) => {
        if (data?.user && data?.token) {
          popConfetti();

          // Ensure FavoriteMovies exists so the app doesn't crash
          const user = { ...data.user, FavoriteMovies: data.user.FavoriteMovies || [] };
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("token", data.token);

          // Refresh full profile (keeps behavior consistent with before)
          try {
            const profile = await fetchUserProfile(data.user.username, data.token);
            onLoggedIn(profile, data.token);
          } catch {
            alert("Failed to fetch user profile.");
          }
        } else {
          alert(data?.message || "No such user or incorrect password");
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Something went wrong");
      });
  };

  return (
    <div className="auth-hero">
      <video autoPlay muted loop playsInline className="auth-bg-video">
        <source src={bgVideoUrl} type="video/mp4" />
      </video>

      {/* Decorative blobs (optional) */}
      <span className="blob b1"></span>
      <span className="blob b2"></span>
      <span className="blob b3"></span>

      {/* Centered login card */}
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
