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
        {/* Home link */}
        <Nav.Link as={Link} to="/movies">Home</Nav.Link>

        {/* Profile link - only show if the user is logged in */}
        {user && (
          <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
        )}

        {/* Logout button - only show if the user is logged in */}
        {user && (
          <Nav.Link onClick={onLoggedOut}>Logout</Nav.Link>
        )}

        {/* Genre Dropdown using <select> */}
        <div className="genre-dropdown">
          
          <select
            id="genre-select"
            value={selectedOption}
            onChange={handleGenreChange}
            className="form-select"
          >
            <option value="">All Genres</option>
            <option value="Action">Action</option>
            <option value="Comedy">Comedy</option>
            <option value="Drama">Drama</option>
            {/* Add more genres as needed */}
          </select>
        </div>
      </Nav>
    </Navbar>
  );
};


