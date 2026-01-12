# 🎬 Recommeded Movie Database — Movie Discovery & Recommendation Platform

RMDB is a modern movie discovery web application built with **React** that allows users to explore movies, manage a personalized watchlist, track watch history, and share reviews.  
It uses **TMDB API** for movie data and **Firebase** for authentication and real-time database features.

---

## 🚀 Live Demo

👉 _Add your deployed link here (Vercel / Netlify / Firebase Hosting)_

---

## 🛠️ Tech Stack

### Frontend

- **React.js**
- **React Router**
- **Protected Routing**
- **Context API**
- **Axios**
- **Tailwind CSS**
- **Framer Motion** (Animations)
- **Font Awesome Icons / icon8**

### Backend / Services

- **Firebase Authentication**
- **Firebase Firestore**
- **TMDB API**

---

## ✨ Features

### 🔐 Authentication

- User sign up & login using Firebase Authentication
- Secure access to user-specific data

### 🎥 Movie Discovery

- Latest Movie
- Latest TV Shows
- Trending movies
- Trending TV Shows
- Upcoming movies
- Movie details page
- TV Shows details page
- Movie Trailers
- Search functionality (TMDB)

### ❤️ Wishlist (Watch Later)

- Add movies to wishlist
- Remove single movie from wishlist

### 🕒 Watch History

- Automatically track watched movies
- Clear all history option
- Remove individual history items

### 💬 Reviews & Comments

- Logged-in users can add comments
- Public read access
- Secure write access using Firestore rules

### 🎨 UI & UX

- Responsive design
- Smooth animations
- Clean, modern UI
- Dark / Light theme support

---

## 🔒 Firestore Security Rules

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /comments/{commentId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
        request.auth.uid == resource.data.userId;
    }
  }
}
```
