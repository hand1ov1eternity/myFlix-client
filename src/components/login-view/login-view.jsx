import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import "./login-view.scss";

export const LoginView = ({ onLoggedIn }) => {
  // Step 1: Create state variables for username and password
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState(""); 

  const handleSubmit = (event) => {
    event.preventDefault();
  
    const data = {
      username: username,
      password: password,
    };
  
    fetch("https://movie-api-bqfe.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Login response: ", data);
        if (data.user) {
          // Ensure FavoriteMovies is always initialized as an array
          const user = {
            ...data.user,
            FavoriteMovies: data.user.FavoriteMovies || [],
          };
  
          // Save user and token in localStorage
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("token", data.token);
  
          // Fetch full user profile with the token
          fetchUserProfile(data.user.username, data.token);
        } else {
          alert(data.message || "No such user or incorrect password");
        }
      })
      .catch((e) => {
        alert("Something went wrong");
      });
  };

  // Fetch full user profile after login
  const fetchUserProfile = (username, token) => {
    fetch(`https://movie-api-bqfe.onrender.com/users/${username}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(userProfile => {
        console.log("Fetched user profile: ", userProfile);
        // Call onLoggedIn with the updated user profile and token
        onLoggedIn(userProfile, token);
      })
      .catch((err) => {
        console.error("Error fetching user profile", err);
        alert("Failed to fetch user profile.");
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formUsername">
        <Form.Label>Username:</Form.Label>
        <Form.Control
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength="3" 
        />
      </Form.Group>
  
      <Form.Group controlId="formPassword">
        <Form.Label>Password:</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};
