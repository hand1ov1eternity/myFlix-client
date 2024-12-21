import { useParams, Link } from "react-router-dom";
import "./movie-view.scss";

export const MovieView = ({ movies }) => {
  const { movieId } = useParams();

  const movie = movies.find((m) => m.id === movieId);
  if (!movie) {
    return <div>Movie not found!</div>;
  }

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

      {/* Replace onBackClick with Link */}
      <Link to="/movies" className="back-button" style={{ cursor: "pointer" }}>
        Back
      </Link>
    </div>
  );
};

