import { useParams, Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import "./movie-view.scss";

export const MovieView = ({ movie, user, onFavoriteToggle }) => {
  const { movieId } = useParams();

  const movie = movies.find((m) => m.id === movieId);
  
  if (!movie) {
    return <div>Movie not found!</div>;
  }

  // Check if the movie is in the user's favorite list
  const isFavorite = user && user.FavoriteMovies.includes(movie.id);

  return (
    <div>
      <div>
        <img src={movie.imageURL} alt={movie.title} />
      </div>
      <div>
        <span>Title: </span>
        <span>{movie.title}</span>
      </div>
      <div>
        <span>Genre: </span>
        <span>{movie.genre.name}</span>
      </div>
      <div>
        <span>Description: </span>
        <span>{movie.description}</span>
      </div>
      <div>
        <span>Director: </span>
        <span>{movie.director}</span>
      </div>

      {/* Favorite button */}
      {user && (
        <Button
          variant={isFavorite ? "danger" : "primary"} // Change button color based on favorite status
          onClick={() => onFavoriteToggle(movie.id)}
        >
          {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        </Button>
      )}

      {/* Link to go back*/}
      <Link to="/movies" className="back-button" style={{ cursor: "pointer" }}>
        Back
      </Link>
    </div>
  );
};
