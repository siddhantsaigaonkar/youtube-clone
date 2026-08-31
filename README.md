# YouTube Clone — MERN Stack

A full-stack YouTube Clone built using the MERN stack. This project allows users to create channels, upload videos, search videos, watch videos, like videos, comment, subscribe to channels, and manage their uploaded content.

The project uses React for the frontend and Node.js, Express.js, and MongoDB for the backend.

---

## Features

### Authentication

* User registration and login
* JWT-based authentication
* Protected routes
* Authentication status checking
* Logout functionality
* User profile information

### Channel Management

* Create a channel
* View channel information
* View videos uploaded by a channel
* Manage channel content

### Video Management

* Upload videos
* Upload video thumbnails
* Store videos and thumbnails using Cloudinary
* Edit video information
* Replace video and thumbnail
* Delete videos
* View uploaded videos
* Track video views
* Publish and unpublish videos

### Search

Users can search videos by:

* Video title
* Video category
* Channel name

Search is handled by the backend using MongoDB queries.

### Likes and Comments

* Like videos
* Remove likes
* Add comments
* Display comments

### Subscriptions

* Subscribe to channels
* Unsubscribe from channels
* Check subscription status
* View subscribed channels

### User Interface

* YouTube-style responsive interface
* Light and dark theme
* Responsive sidebar
* Search page
* Watch page
* Channel page
* Upload video page
* Edit video page
* User profile menu
* Responsive video grid

---

## Tech Stack

### Frontend

* React.js
* Vite
* React Router
* Tailwind CSS
* Axios
* Lucide React
* Context API

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Cookie Parser
* Multer
* Cloudinary
* CORS

### Development Tools

* Git
* GitHub
* VS Code
* Postman
* MongoDB Compass

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/siddhantsaigaonkar/youtube-clone.git
```

### Navigate to the Project

```bash
cd youtube-clone
```

---

## Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Do not add your actual credentials to GitHub.

Start the backend:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

---

## Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd frontend/vite-project
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

---

## API Architecture

The frontend communicates with the backend using REST APIs and Axios.

```text
React
  |
  | Axios
  ↓
Express.js
  |
  ↓
Controllers
  |
  ↓
Mongoose
  |
  ↓
MongoDB
```

### Video Upload Flow

```text
React
  |
  ↓
Express.js
  |
  ↓
Multer
  |
  ↓
Cloudinary
  |
  ↓
Video URL
  |
  ↓
MongoDB
```

---

## Search

Search functionality is handled by the backend.

For example, when a user searches for `React`:

```text
User searches "React"
        ↓
SearchPage
        ↓
Axios request
        ↓
/api/videos/search?search=React
        ↓
Express Route
        ↓
Search Controller
        ↓
MongoDB
        ↓
Matching Videos
        ↓
Frontend
        ↓
Display Results
```

The backend searches videos by:

* Video title
* Video category
* Channel name

MongoDB operators such as `$or`, `$regex`, and `$in` are used for the search functionality.

---

## Main API Endpoints

### Authentication

| Method | Endpoint             | Description        |
| ------ | -------------------- | ------------------ |
| POST   | `/api/auth/register` | Register user      |
| POST   | `/api/auth/login`    | Login user         |
| POST   | `/api/auth/logout`   | Logout user        |
| GET    | `/api/auth/me`       | Get logged-in user |

### Videos

| Method | Endpoint                         | Description               |
| ------ | -------------------------------- | ------------------------- |
| GET    | `/api/videos`                    | Get all videos            |
| GET    | `/api/videos/search`             | Search videos             |
| GET    | `/api/videos/category/:category` | Filter videos by category |
| GET    | `/api/videos/:id`                | Get video by ID           |
| GET    | `/api/videos/my-videos`          | Get user's videos         |
| POST   | `/api/videos/upload`             | Upload video              |
| PUT    | `/api/videos/:id`                | Update video              |
| DELETE | `/api/videos/:id`                | Delete video              |
| POST   | `/api/videos/:id/view`           | Increase video views      |

---

## Security

The application uses:

* JWT authentication
* Protected routes
* Password hashing using bcrypt
* Authentication middleware
* CORS
* Environment variables for sensitive credentials
* Ownership checks for video updates and deletion

Only the owner of a video can update or delete their video.

---

## Cloudinary

Cloudinary is used to store:

* Video files
* Video thumbnails

The Cloudinary URLs and public IDs are stored in MongoDB.

This prevents large video files from being stored directly in MongoDB.

---

## Learning Objectives

This project demonstrates practical knowledge of:

* React.js
* React Hooks
* Context API
* React Router
* REST APIs
* Axios
* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT authentication
* Middleware
* File uploads
* Cloudinary
* CRUD operations
* MongoDB search
* Git and GitHub
* Responsive UI development

---


##  Project Demo Video

The complete project demonstration video is available on Google Drive.

**[▶️ Watch YouTube Clone Demo Video](https://drive.google.com/file/d/1Ks5Cxsc-cyJ10SOV2-c0biyea3-79KH7/view?usp=sharing)**

The video demonstrates the major features of the application, including authentication, video browsing, search, video watching, likes, comments, subscriptions, channel management, video upload, video editing, and video deletion.





---

## Future Improvements

* Video pagination
* Search suggestions
* Video recommendations
* Watch history
* Playlist functionality
* Notifications
* Video streaming optimization
* Advanced video analytics
* Improved recommendation system

---

## Author

**Siddhant Saigaonkar**

Frontend Developer | React.js | MERN Stack

---

## GitHub Repository

https://github.com/siddhantsaigaonkar/youtube-clone
