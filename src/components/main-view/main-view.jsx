import { useState } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";

export const MainView = () => {
  const [movies, setMovies] = useState([
    { id: 1, 
      title: "Inception",
      description: "A thrilling adventure through the mind, exploring the boundaries of dreams and reality.",
      genre: "Sci-Fi",
      director: "Christopher Nolan",
      imageURL: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg"
    },
   
      { id: 2, 
        title: "The Dark Knight",
        description: "A gritty portrayal of Batman facing the Joker in Gotham.",
        genre: "Action",
        director: "Christopher Nolan",
        imageURL: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_FMjpg_UX1000_.jpg"
    },
    
      { id: 3, 
        title: "The Shining",
        description: "A writer descends into madness while isolated in a haunted hotel.",
        genre: "Horror",
        director: "Stanley Kubrick",
        imageURL: "https://m.media-amazon.com/images/M/MV5BMTg0MzkzODUwNV5BMl5BanBnXkFtZTgwODM1MjEwNDI@._V1_.jpg"

      }
  ]);

  if (movies.length === 0) {
    return <div>The list is empty!</div>;
  }

  return (
    <div>
      {movies.map((movie) => {
       <MovieCard movie={movie} />,
       <MovieView movie={movie} />
      })}
    </div>
  );
};