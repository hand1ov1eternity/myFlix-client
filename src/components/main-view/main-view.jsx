import { useState } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";

export const MainView = ({movies, onBackClick}) => {
  const [movie, setMovies] = (0,_react.useState)([]);

  useEffect(() => {
    fetch("mongodb+srv://revolutionarygr:Tax1diaaxNAI@myflixdb.piv4e.mongodb.net/")
      .then((response) => response.json())
      .then((data) => {
        const moviesFromApi = data.docs.map((doc) => {
          return {
            id: doc.key,
            title: doc.title,
            description: doc.description,
            genre: doc.genre,
            director: doc.director_name?.[0]
          };
        });

        setMovies(moviesFromApi);
      });
  }, []);

  const [selectedMovie, setSelectedMovie] = useState(null);

  if (selectedMovie) {
    return (
    <MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)} />
    );
  }

  if (movies.length === 0) {
    return <div>The list is empty!</div>;
  }

  return (
    <div>
      <button
        onClick={() => {
          alert("Nice!");
        }}
      >
        Click me!
      </button>
      {movies.map((movie) => (
        <MovieCard 
        key={movie.id}
        movie={movie}
        onMovieClick={(newSelectedMovie) => {
            setSelectedMovie(newSelectedMovie);
          }} />
      ))}
    </div>
  );

  <button onClick={onBackClick}>Back</button>
}