# Vidtube - A Simple Backend Clone of YouTube

## 📌 Overview

Vidtube is a simple backend clone of YouTube, built to practice and enhance backend development skills. This project focuses on handling video uploads, user authentication, and basic API functionalities similar to YouTube.

## 🚀 Features

- User authentication (signup, login, JWT-based authentication)
- Video upload and storage using **Cloudinary**
- Video retrieval via API
- Like, dislike, and comment functionality
- User profile management
- Playlist creation and management
- Subscription-based features
- Basic dashboard functionality
- Basic search functionality

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Storage**: Cloudinary (for video and image storage)
- **Authentication**: JWT (JSON Web Token),

## 📂 Project Structure

## ⚡ Installation & Setup

### 1. Clone the Repository

### 2. Install Dependencies

### 3. Set Up Environment Variables

Create a `.env` file and add:

### 4. Run the Server

The backend will be running at `http://localhost:5000`

## 📌 API Endpoints

| Method | Endpoint                    | Description                               |
| ------ | --------------------------- | ----------------------------------------- |
| GET    | /api/v1/healthcheck         | Check if the server is running            |
| POST   | /api/v1/user/signup         | Register a new user                       |
| POST   | /api/v1/user/login          | User login                                |
| POST   | /api/v1/videos/upload       | Upload a new video (stored in Cloudinary) |
| GET    | /api/v1/videos/\:id         | Get video details                         |
| POST   | /api/v1/videos/\:id/like    | Like a video                              |
| POST   | /api/v1/videos/\:id/comment | Comment on a video                        |
| POST   | /api/v1/subscriptions       | Subscribe to a user                       |
| GET    | /api/v1/playlist            | Get user playlists                        |
| POST   | /api/v1/playlist            | Create a new playlist                     |
| GET    | /api/v1/dashboard           | Get user dashboard data                   |

## 🔥 Future Enhancements

- Implement real-time chat for comments
- Improve video recommendation system
- Add analytics and reporting features

## 🙌 Why I Built This

I created **Vidtube** to deepen my understanding of backend development, APIs, authentication, and database management. It was a great learning experience to implement real-world functionalities.

---

**🚀 Developed by [Your Name]**

