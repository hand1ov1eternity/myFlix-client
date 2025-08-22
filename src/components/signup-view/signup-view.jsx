import { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { popConfetti } from "../../utils/confetti";

export const SignupView = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = { username, password, email, birthday };

    fetch("https://movie-api-bqfe.onrender.com/users", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      if (response.ok) {
        popConfetti();
        alert("Signup successful");
      } else {
        alert("Signup failed");
      }
    });
  };

  return (
  <div className="auth-hero">
    <span className="blob b1"></span>
    <span className="blob b2"></span>
    <span className="blob b3"></span>

    <div className="w-100" style={{ maxWidth: 480 }}>
      <div className="card sticker form-container">
        <div className="card-body">
          <h1 className="auth-title h3 mb-4 text-center">Sign Up</h1>

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

            <Form.Group controlId="formBirthday" className="mb-4">
              <Form.Label>Birthday</Form.Label>
              <Form.Control
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
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
