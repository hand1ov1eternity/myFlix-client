import { useState } from "react";
import { Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

export const NavigationBar = ({ user, onLoggedOut, setSelectedGenre }) => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleGenreChange = (event) => {
    setSelectedOption(event.target.value);
    setSelectedGenre(event.target.value); // Pass the selected genre to the parent (MainView)
  };

  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="/movies">MyFlix</Navbar.Brand>
      <Nav className="ml-auto">
        {/* If user is logged in */}
        {user ? (
          <>
            {/* Home link */}
            <Nav.Link as={Link} to="/movies">Home</Nav.Link>

            {/* Profile link */}
            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>

            {/* Logout button */}
            <Nav.Link onClick={onLoggedOut}>Logout</Nav.Link>

            {/* Genre Dropdown using <select> */}
        <div className="genre-dropdown">
          
          <select
            id="genre-select"
            value={selectedOption} // Set the value to the selected genre
            onChange={handleGenreChange} // Call handleGenreChange on change
            className="form-select"
          >
            <option value="">All Genres</option>
            <option value="Action">Action</option>
            <option value="Crime">Crime</option>
            <option value="Comedy">Comedy</option>
            <option value="Historical Drama">Historical Drama</option>
            <option value="Horror">Horror</option>
            <option value="Sci-Fi">Sci-fi</option>
            {/* Add more genres as needed */}
          </select>
        </div>

          </>
        ) : (
          <>
            {/* Sign In and Sign Up links */}
            <Nav.Link as={Link} to="/login">Sign In</Nav.Link>
            <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
          </>
        )}
      </Nav>
    </Navbar>
  );
};




