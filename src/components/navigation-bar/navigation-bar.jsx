import { useState } from "react";
import { Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

export const NavigationBar = ({ user, onLoggedOut, setSelectedGenre }) => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleGenreChange = (event) => {
    const genre = event.target.value; // Get the selected genre value
    setSelectedOption(genre); // Update selectedOption
    setSelectedGenre(genre); // Pass the selected genre to MainView
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
      </Nav>
    </Navbar>
  );
};



