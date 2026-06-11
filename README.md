# 🎬 myFlix Movie App

🔗 **[Live Version »](https://myflixappclient.netlify.app/Login)**

Hosting Note

The backend API is hosted on Render’s free tier. Free Render web services spin down after a period of inactivity, so the first request after the app has been idle may take up to a minute while the backend starts again. If the movie data or login request does not load immediately, please wait briefly and refresh the page.

This is a hosting limitation of the free deployment tier, not an application error.

---

## 🎯 Features

- 🔐 **User Authentication**
  - Sign up and log in securely using a username, password, and email.
  - Session persistence with user and token storage in localStorage.

- 🎞️ **Movie Discovery**
  - Browse movies with rich details including title, genre, description, and director.
  - AI-driven semantic search for more accurate, context-aware results.
  - Debounced, real-time search with clear filters and smooth UX feedback.

- ⭐ **Favorite Movies**
  - Add or remove movies from your favorites list.
  - Enhanced hover animations and VHS glitch effects for visual feedback

- 👤 **Profile Management**
  - Update your username, password, email, and birthday.
  - Consistent design across Login, Signup, and Profile screens.

- 🎨 **Retro VHS-Themed Interface**
  - Animated glassmorphism cards, neon-glow buttons, and popcorn video background.
  - Unified color scheme and glowing navbar for a nostalgic cinematic vibe.

- 🧭 **Seamless Navigation**
  - Improved routing logic — users automatically directed to the correct page based on authentication state.

---

## 🛠️ Technologies Used

Frontend: React, React Router, React Bootstrap

Styling: SCSS, Bootstrap

Backend: Node.js, Express.js

API: Fetch API

A.I. Search: @xenova/transformers for semantic embeddings

Authentication: JSON Web Token (JWT)


---

## ⚙️ Getting Started

### ✅ Prerequisites

- Node.js (v16 or higher)
- npm (Node Package Manager)

---

### 📦 Installation

Clone the repository:

```bash
git clone https://github.com/hand1ov1eternity/myFlix-client.git
```
Navigate into the project directory:

```bash
cd myFlix-client
```
Install dependencies:

```bash
npm install
```
```bash
npx parcel src/index.html
```
Open your browser at:

```bash
http://localhost:1234
```

### 📖 API Documentation

The app communicates with a REST API hosted at:

```bash
https://movie-api-bqfe.onrender.com
```
**The API supports operations like:**

User login & registration

Fetching movie data

Managing favorites

Updating profiles

Semantic search for movies

Check embedding data status

### 🤝 Contributing

**Contributions are welcome!**

To contribute:

Fork the repository

Create a new branch for your feature/fix

Make and test your changes

Submit a pull request

> Built with React, Bootstrap, and a love for movies 🎬🍿- now with a touch of 80s nostalgia and AI smarts. — always a work in progress 🚧

