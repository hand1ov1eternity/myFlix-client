import { useState } from "react";
import { Nav, Navbar, Form, FormControl, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export const NavigationBar = ({ user, onLoggedOut, setSelectedGenre, onSearch }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleGenreChange = (event) => {
    setSelectedOption(event.target.value);
    setSelectedGenre(event.target.value); // Pass the selected genre to the parent (MainView)
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSearch(searchQuery); // Pass the search query to the parent (MainView)
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
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

            {/* Genre Dropdown */}
            <div className="genre-dropdown" style={{ marginRight: "15px" }}>
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

            {/* Search Field */}
            <Form inline onSubmit={handleSearchSubmit}>
              <FormControl
                type="text"
                placeholder="Search Movies"
                className="mr-sm-2"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <Button type="submit" variant="outline-success">Search</Button>
            </Form>
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





