import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import "./movie-view.scss";

export const MovieView = ({ movies, user, token, onUserUpdated }) => {
  const { movieId } = useParams();
  const movie = movies.find((m) => m.id === movieId);

  const [isFavorite, setIsFavorite] = useState(
    (Array.isArray(user?.FavoriteMovies) ? user.FavoriteMovies : []).includes(movie?.id)
  );

  if (!movie) return <div>Movie not found!</div>;

  const handleFavorite = () => {
  if (!user) return alert("User not logged in");

  // ✅ Normalize favorites to an array
  const currentFavs = Array.isArray(user?.FavoriteMovies) ? user.FavoriteMovies : [];

  // ✅ Compute new list (avoid duplicates)
  const updatedFavorites = isFavorite
    ? currentFavs.filter((id) => id !== movie.id)
    : [...new Set([...currentFavs, movie.id])];

  fetch(`https://movie-api-bqfe.onrender.com/users/${user.username}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ FavoriteMovies: updatedFavorites }),
  })
    .then((r) => {
      if (!r.ok) throw new Error("Failed to update favorites");
      onUserUpdated({ ...user, FavoriteMovies: updatedFavorites });
      setIsFavorite((prev) => !prev); // ✅ safe toggle
    })
    .catch((e) => alert(e.message));
};

  return (
    <div className="movie-detail-hero">
      <div className="movie-detail-card">
        {/* Poster section */}
        <div className="poster-side">
          <div className="poster-wrapper">
            <img src={movie.imageURL} alt={movie.title} />
            <button
              onClick={handleFavorite}
              className={`btn heart-btn ${isFavorite ? "favorite" : ""}`}
            >
              <i className="fas fa-heart"></i>
            </button>
          </div>
        </div>

        {/* Info section */}
        <div className="info-side">
          <h2 className="title">{movie.title}</h2>
          <span className="genre-chip">{movie.genre.name}</span>
          <p className="description">{movie.description}</p>
          <p className="director"><strong>Director:</strong> {movie.director.name}</p>

          <Link to="/movies" className="back-button">
            ⬅ Back to Movies
          </Link>
        </div>
      </div>
    </div>
  );
};
