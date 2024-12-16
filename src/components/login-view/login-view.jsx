import { useState } from "react";

export const LoginView = ({ onLoggedIn }) => {
  // Step 1: Create state variables for username and password
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState(""); 

  const handleSubmit = (event) => {
    // Step 2: Prevent the default form submission behavior
    event.preventDefault();

    // Step 3: Create a data object with the current username and password
    const data = {
      username: username,
      password: password,
    };

    // Step 4: Send the data to the server
    fetch("https://movie-api-bqfe.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data), // Convert the data object to JSON
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Login response: ", data);
        if (data.user) {
           // Save user and token in localStorage
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("token", data.token);
          // Call onLoggedIn with the user and token
          onLoggedIn(data.user, data.token);
        } else {
          alert("No such user");
        }
      })
      .catch((e) => {
        alert("Something went wrong");
      });
    };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        username:
        <input
          type="text"
          value={username} // Step 5: Bind input value to username state
          onChange={(e) => setUsername(e.target.value)} // Update username state
          required
        />
      </label>
      <br />
      <label>
        password:
        <input
          type="password"
          value={password} // Bind input value to password state
          onChange={(e) => setPassword(e.target.value)} // Update password state
          required
        />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
};