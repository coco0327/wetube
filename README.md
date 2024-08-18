# YouTube Clone Project

## Project Overview

This project is a full-stack web application that replicates core functionalities of YouTube. It allows users to upload, view, and manage videos, as well as handle user authentication and account management.

## Technologies Used

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: MongoDB
- Template Engine: Pug
- Authentication: Passport
- Build Tools: Webpack
- Styling: SCSS
- Video Processing: FFmpeg
- File Upload: Multer
- Others: ES6, AJAX, Mongoose

## Features

- Home page with video listings
- User authentication (local and GitHub OAuth)
- User registration
- Video upload, edit, and delete functionality
- Custom video player UI
- Real-time video recording and upload using Multer and FFmpeg
- Responsive design
- Session and cookie management

## Setup and Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up MongoDB database
4. Configure environment variables
5. Run the server: `npm start`

## Project Structure

```
wetube/
│
├── .github/
├── .vscode/
├── assets/
├── build/
├── node_modules/
├── src/
│   ├── client/
│   ├── controllers/
│   ├── middlewares/
│   │   ├── localsMiddleware.js
│   │   ├── protectMiddleware.js
│   │   ├── sessionMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   ├── routers/
│   ├── views/
│   ├── db.js
│   ├── init.js
│   └── server.js
├── uploads/
├── .dockerignore
├── .env
├── .gitignore
├── babel.config.json
├── Dockerfile
├── fly.toml
├── nodemon.json
└── package.json
```

## Key Components

- Express server for handling HTTP requests
- Pug templates for server-side rendering
- MongoDB with Mongoose for data persistence
- Passport for authentication strategies
- Multer for handling file uploads
- FFmpeg for video processing
- SCSS for advanced styling
- Webpack for asset bundling

## Future Enhancements

- Implement video comments and likes
- Add user profiles
- Integrate video recommendations
- Improve search functionality

## Contributors

coco0327
