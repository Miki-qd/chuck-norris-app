# Chuck Norris Joke App 🤠

A full-stack web application built as a recruitment task. It allows users to fetch random Chuck Norris jokes, impersonate characters, save their favorite jokes to a database, and add custom ones. 

## 🚀 Tech Stack

*   **Frontend:** React (Vite), TypeScript, CSS (Dark Mode supported), Framer Motion
*   **Backend:** NestJS, TypeScript, TypeORM
*   **Database:** SQLite

## ✨ Features

*   User authentication (Login & Register) simulation.
*   Fetching random jokes from the official Chuck Norris API.
*   Filtering jokes by category and impersonating names.
*   Saving jokes to a local SQLite database.
*   Adding custom jokes via a dedicated tab.
*   Deleting saved jokes from the collection.
*   Fully responsive design with a Dark/Light mode toggle.

## 🛠️ How to run the project locally

Since this project consists of both a frontend and a backend, you will need to run them in **two separate terminal windows**.

### 1. Start the Backend (NestJS API)
Open your first terminal, navigate to the `backend` directory, install the dependencies, and start the server:

```bash
cd backend
npm install
npm run start:dev
```
### 2. Start the Frontend (React / Vite)
Open a second, completely new terminal window. Navigate to the frontend directory, install the dependencies, and launch the user interface:

```bash
cd frontend
npm install
npm run dev
```