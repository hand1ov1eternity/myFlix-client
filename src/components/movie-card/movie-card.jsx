import React from "react";
import PropTypes from "prop-types";
import { Card,Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export const MovieCard = ({ movie }) => {
  // Check if the movie is already in the user's favorite list
  const isFavorite = user && user.FavoriteMovies.includes(movie.id);
  
  return (
    <Card className="h-100">
      <Card.Img variant="top" src={movie.imageURL} />
      <Card.Body>
        <Card.Title>{movie.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{movie.genre.name}</Card.Subtitle>
        <Card.Text>{movie.description}</Card.Text>
        <Card.Footer>
          <small className="text-muted">{movie.director}</small>
        </Card.Footer>
        
        {/* Link to the movie details */}
        <Link to={`/movies/${movie.id}`} className="btn btn-link">
          Open
        
        </Link>
        
{/* Favorite button */}
{user && (
          <Button
            variant={isFavorite ? "danger" : "primary"} // Change button color based on favorite status
            className="mt-2"
            onClick={() => onFavoriteToggle(movie.id)}
          >
            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </Button>
        )}

      </Card.Body>
    </Card>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    genre: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    description: PropTypes.string.isRequired,
    imageURL: PropTypes.string.isRequired,
    director: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
