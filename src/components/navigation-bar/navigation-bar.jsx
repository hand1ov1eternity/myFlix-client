import { useState } from "react";
import { Nav, Navbar, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

export const NavigationBar = ({ user, onLoggedOut, setSelectedGenre }) => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleGenreSelect = (genre) => {
    setSelectedOption(genre);
    setSelectedGenre(genre); // Pass the selected genre to the parent (MainView)
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

        {/* Genre Dropdown */}
        <Dropdown>
          <Dropdown.Toggle variant="success" id="genre-dropdown">
            Filter by Genre
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleGenreSelect("Action")}>
              Action
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleGenreSelect("Comedy")}>
              Comedy
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleGenreSelect("Drama")}>
              Drama
            </Dropdown.Item>
            {/* Add more genres as needed */}
          </Dropdown.Menu>
        </Dropdown>
      </Nav>
    </Navbar>
  );
};
