import { useState } from "react";
import { Nav, Navbar, Form, FormControl, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./navigation-bar.scss";
import jasonFavicon from "../../public/fridaythe13th_favicon.png";

export const NavigationBar = ({ user, onLoggedOut, setSelectedGenre, onSearch }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleGenreChange = (event) => {
    const val = event.target.value;
    setSelectedOption(val);
    setSelectedGenre?.(val);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <Navbar expand="lg" className="nav-fun px-3 py-2" variant="dark">
      <Container fluid className="gap-2">
        {/* Brand */}
        <Navbar.Brand as={Link} to={user ? "/movies" : "/login"} className="brand-fun d-flex align-items-center gap-2">
        {/* favicon as brand mark */}
        <img
          src={jasonFavicon}
          alt="myFlix"
          className="brand-mark"
          width="22"
          height="22"
        />

      <span>myFlix</span>
     </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />

        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto align-items-center gap-2">

            {user ? (
              <>
                {/* Primary links */}
                <Nav.Link as={Link} to="/movies" className="link-underline">Home</Nav.Link>
                <Nav.Link as={Link} to="/profile" className="link-underline">Profile</Nav.Link>
                <Nav.Link onClick={onLoggedOut} className="link-underline">Logout</Nav.Link>

                {/* Genre select */}
                <Form className="d-flex align-items-center">
                  <select
                    id="genre-select"
                    value={selectedOption}
                    onChange={handleGenreChange}
                    className="form-select form-select-sm fun-pill me-2"
                    aria-label="Filter by genre"
                  >
                    <option value="">All Genres</option>
                    <option value="Action">Action</option>
                    <option value="Crime">Crime</option>
                    <option value="Comedy">Comedy</option>
                    <option value="Historical Drama">Historical Drama</option>
                    <option value="Horror">Horror</option>
                    <option value="Sci-Fi">Sci-fi</option>
                  </select>
                </Form>

                {/* Search */}
                <Form onSubmit={handleSearchSubmit} className="d-flex">
                  <FormControl
                    type="search"
                    placeholder="Search movies"
                    className="me-2 fun-pill"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search movies"
                  />
                  <Button type="submit" variant="light" className="fun-pill px-3">
                    Search
                  </Button>
                </Form>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="link-underline">Sign In</Nav.Link>
                <Nav.Link as={Link} to="/signup" className="link-underline">Sign Up</Nav.Link>
              </>
            )}

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
