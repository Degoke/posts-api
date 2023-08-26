# POSTS API

## Node.js RESTful API with PostgreSQL

This project is a RESTful API built using Node.js, Express, TypeScript, and PostgreSQL. It provides endpoints for managing users, posts, comments, and includes a performance challenge to fetch top users with most posts along with their latest comments.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Endpoints](#endpoints)
  - [Create User](#create-user)
  - [Get All Users](#get-all-users)
  - [Create Post](#create-post)
  - [Get All Posts of a User](#get-all-posts-of-a-user)
  - [Add Comment](#add-comment)
  - [Get Top Users with Latest Comments](#get-top-users-with-latest-comments)
- [Query Optimization](#query-optimization)
- [Middleware & Error Handling](#middleware--error-handling)
- [Testing](#testing)
- [Deployment](#deployment)

## Getting Started

### Prerequisites

- Node.js and npm installed.
- PostgreSQL database server running.
- Docker (for containerization).

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/degoke/posts-api.git
   cd posts-api
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Start the dependencies postgres and redis in docker compose:

   ```sh
   docker-compose up -d
   ```

4. Set the enviromental variables

5. Start the application:

   ```sh
   npm start
   ```

### Environment Variables

Create a `.env` file in the root directory and define the following environment variables:

```env
APP_PORT=3000

APP_SERVER_SECRET=shuush
APP_DATABASE_HOST=localhost
APP_DATABASE_PORT=5432
APP_DATABASE_DBNAME=test
APP_DATABASE_USERNAME=user
APP_DATABASE_PASSWORD=password
APP_REDIS_HOST=localhost
APP_REDIS_PORT=6379
APP_REDIS_PASSWORD=password
```

Replace the variable with the appropriate values.

## Endpoints

### Create User

Create a new user.

- **Endpoint:** POST `/api/auth/newuser`
- **Request Body:**

  ```json
  {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "password": "password123"
  }
  ```

- **Response:** User object.

### Get All Users

Get a list of all users.

- **Endpoint:** GET `/api/users`
- **Response:** Array of user objects.

### Create Post

Create a new post for a user.

- **Endpoint:** POST `/api/users/:id/posts`
- **Request Body:**

  ```json
  {
    "title": "My Post Title",
    "content": "Lorem ipsum dolor sit amet..."
  }
  ```

- **Response:** Post object.

### Get All Posts of a User

Get all posts of a user.

- **Endpoint:** GET `/api/users/:id/posts`
- **Response:** Array of post objects.

### Add Comment

Add a comment to a post.

- **Endpoint:** POST `/api/posts/:postId/comments`
- **Request Body:**

  ```json
  {
    "content": "Great post!"
  }
  ```

- **Response:** Comment object.

### Get Top Users with Latest Comments

Fetch the top 3 users with the most posts and their latest comments.

- **Endpoint:** GET `/api/users/top-users`
- **Response:** Array of user objects with latest comment details.

### Seed db with users posts and comments

Handles a request to seed users, posts, and comments. f yoou need to test the getAllUsers and getTopUsers Endpoints. it seeds the database with 100 users with random number of posts annd comments

- **Endpoint:** GET `/api/posts/seed`details.

## Query Optimization

The provided SQL query has been optimized for performance.

## Middleware & Error Handling

Token-based authentication middleware is implemented for secure routes. Basic validation and error handling are in place.

## Testing

Unit and Integration tests are available Run tests using:

```sh
npm test
```

## Deployment

This application can be containerized using Docker for easy deployment. Create a Dockerfile and use the following command to build and run the container:

```sh
docker build -t nodejs-api .
docker run -p 3000:3000 -d nodejs-api
```

## Live URL

live url is at [API URL](https://posts-api-8fdd.onrender.com)

## Postman Documentation

poostman documentation can be found at [POSTMAN DOCUMENTATION](https://documenter.getpostman.com/view/13384271/2s9Y5YR2YS)
