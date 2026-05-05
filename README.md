# Chuck Norris Joke App 🤠

A full-stack web application built as a recruitment task. It allows users to fetch random Chuck Norris jokes, impersonate characters, save their favorite jokes to a database, and add custom ones. 

## 🚀 Tech Stack

*   **Frontend:** React (Vite), TypeScript, CSS (Dark Mode), Framer Motion
*   **Backend:** NestJS, TypeScript, TypeORM
*   **Database:** SQLite

## ✨ Features

*   **Authentication:** Simulated Login & Register system.
*   **Random Jokes:** Fetching jokes from the official Chuck Norris API.
*   **Customization:** Filter by category and impersonate names in jokes.
*   **Joke Management:** Save favorite jokes to the database and add custom ones.
*   **Responsive UI:** Fully mobile-friendly design with a native Dark/Light mode toggle.
*   **Animations:** Smooth transitions using Framer Motion.

## 🛠️ How to run the project locally

Since this project consists of both a frontend and a backend, you will need to run them in **two separate terminal windows**.

### 1. Start the Backend (NestJS API)
Open your first terminal, navigate to the `backend` directory, install the dependencies, and start the server:
```bash
cd backend
npm install
npm run start:dev
```
*Note: The backend API will run on `http://localhost:3000`. The SQLite database (`database.sqlite`) will be created automatically upon the first run.*

### 2. Start the Frontend (React / Vite)
Open a **second, completely new terminal window**. Navigate to the `frontend` directory, install the dependencies, and launch the user interface:
```bash
cd frontend
npm install
npm run dev
```
*Note: Once the server starts, the terminal will display a local link (typically `http://localhost:5173`). Simply click it to open the app in your browser.*

---

## 💡 Notes for the Reviewer
* The UI was built from scratch using raw CSS to closely match the provided Figma design, without relying on pre-made component libraries like Material-UI or Bootstrap.
* The application features an intuitive tab-based navigation system to manage the user's joke collection without unnecessary page reloads.

---

## 📝 License

This project was built as a high-fidelity demonstration of modern web technologies. 

**Made by Mikołaj Adamczyk - 2026**