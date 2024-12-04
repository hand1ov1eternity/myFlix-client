import { useState } from "react";

export const MainView = () => {
  const [movies, setMovies] = useState([
    { id: 1, title: "Eloquent JavaScript" },
    { id: 2, title: "Mastering JavaScript Functional Programming" },
    { id: 3, title: "JavaScript: The Good Parts" },
    { id: 4, title: "JavaScript: The Definitive Guide" },
    { id: 5, title: "The Road to React" }
  ]);

  if (movies.length === 0) {
    return <div>The list is empty!</div>;
  }

  return (
    <div>
      {movies.map((movie) => {
        return <div key={movie.id}>movie.title</div>;
      })}
    </div>
  );
};