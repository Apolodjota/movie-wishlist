import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Configura la URL base de la API.
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

function App() {
  const [movies, setMovies] = useState([]);
  const [newMovie, setNewMovie] = useState('');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    const response = await apiClient.get('/movies');
    setMovies(response.data);
  };

  const addMovie = async (e) => {
    e.preventDefault();
    if (!newMovie.trim()) return;
    const response = await apiClient.post('/movies', { title: newMovie });
    setMovies([response.data, ...movies]);
    setNewMovie('');
  };

  const toggleWatched = async (id, watched) => {
    await apiClient.put(`/movies/${id}`, { watched: !watched });
    fetchMovies();
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🎬 Movie Wishlist</h1>
        <p>Tu lista personal de películas por ver</p>
      </header>
      <main>
        <form onSubmit={addMovie} className="movie-form">
          <input
            type="text"
            value={newMovie}
            onChange={(e) => setNewMovie(e.target.value)}
            placeholder="Añade una nueva película..."
          />
          <button type="submit">Agregar</button>
        </form>
        <div className="movie-list">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className={`movie-item ${movie.watched ? 'watched' : ''}`}
              onClick={() => toggleWatched(movie.id, movie.watched)}
            >
              <span>{movie.title}</span>
              <div className="status-indicator"></div>
            </div>
          ))}
        </div>
      </main>
      <footer className="app-footer">
        <p>Creado para tu práctica de DevOps con Azure 🚀</p>
      </footer>
    </div>
  );
}

export default App;