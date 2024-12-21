import React from "react";
import PropTypes from "prop-types";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

export const MovieCard = ({ movie }) => {
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
        {/* Link replaces the button */}
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
    imageURL: PropTypes.string.isRequired,
    director: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};