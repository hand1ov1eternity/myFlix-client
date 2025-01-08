import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import "./movie-view.scss";

export const MovieView = ({ movies, user, token, onUserUpdated }) => {
  const { movieId } = useParams();

  const movie = movies.find((m) => m.id === movieId);
  if (!movie) {
    return <div>Movie not found!</div>;
  }

  // State to track whether the movie is a favorite
  const [isFavorite, setIsFavorite] = useState(
    (user.FavoriteMovies || []).includes(movie.id)
  );

  const handleFavorite = () => {
    if (!user) {
      console.log("User is:", user);
      alert("User not logged in");
      return;
    }
  
    const updatedFavorites = isFavorite
     ? (user.FavoriteMovies || []).filter((id) => id !== movie.id)
     : [...(user.FavoriteMovies || []), movie.id];
  
    fetch(`https://movie-api-bqfe.onrender.com/users/${user.username}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ FavoriteMovies: updatedFavorites }),
    })
      .then((response) => {
        if (response.ok) {
          onUserUpdated({ ...user, FavoriteMovies: updatedFavorites });
          setIsFavorite(!isFavorite);
        } else {
          throw new Error("Failed to update favorites");
        }
      })
      .catch((error) => alert(error.message));
  };
  

  return (
    <div className="movie-view">
      <div>
        <img src={movie.imageURL} alt={movie.title} className="movie-image" />
      </div>

      {/* Favorite button */}
      <div>
        <button
          onClick={handleFavorite}
          className={`btn heart-btn ${isFavorite ? "favorite" : ""}`}
        >
          <i className="fas fa-heart"></i>
        </button>
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
        <span>{movie.director.name}</span>
      </div>

      {/* Back button */}
      <Link to="/movies" className="back-button">
        Back
      </Link>
    </div>
  );
};



