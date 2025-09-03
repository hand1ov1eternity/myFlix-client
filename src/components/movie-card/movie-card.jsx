import React from "react";
import PropTypes from "prop-types";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

export const MovieCard = ({ movie }) => {
  return (
    <Card className="h-100 movie-card">
      {/* ✅ wrap the image */}
      <div className="poster-wrap">
        <Card.Img variant="top" src={movie.imageURL} alt={movie.title} />
      </div>

      <Card.Body>
        <Card.Title>{movie.title}</Card.Title>
        <span className="genre-chip">{movie.genre.name}</span>
        <Card.Text className="textClamp-3">{movie.description}</Card.Text>
        <Card.Footer>
          <small className="text-muted">{movie.director.name}</small>
        </Card.Footer>
        <Link to={`/movies/${movie.id}`} className="btn btn-link">
          Open
        </Link>
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
    imageURL: PropTypes.string,
    director: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
