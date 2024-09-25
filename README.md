# Budget Calculation Task

This project is a simple budget calculation application developed using **React (TypeScript)** for the frontend and **.NET (C#)** with **PostgreSQL** for the backend. It allows users to input various expenses, calculates the total price with a markup, and performs precise calculations to manage large sums and percentages.

---

## Table of Contents
1. [Installation](#installation)
   - [With Docker](#with-docker)
   - [Without Docker](#without-docker)
2. [About the Project](#about-the-project)
   - [Technologies Used](#technologies-used)
   - [Overall Structure](#overall-structure)
   - [State Management](#state-management)
   - [Precise Number Calculations](#precise-number-calculations)
3. [Task Planning & Approach](#task-planning--approach)

---

## Installation

### With Docker
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/j-parthiv/Budget-Calculation-Task.git
   cd Budget-Calculation-Task
   ```

2. **Build and Run Docker Containers:**
   ```bash
   docker compose build
   docker compose up
   ```

This will start both the frontend and backend containers, as well as the PostgreSQL database. Access the application via [http://localhost:5173](http://localhost:5173).

### Without Docker
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/j-parthiv/Budget-Calculation-Task.git
   cd Budget-Calculation-Task
   ```

2. **Backend Setup (ASP.NET + PostgreSQL):**
   - Navigate to the backend directory:
     ```bash
     cd backend/CinemaCalcBackend
     ```
   - Restore dependencies:
     ```bash
     dotnet restore
     ```
   - Set up the PostgreSQL database (ensure the connection string in `appsettings.json` is correct):
     ```json
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Database=cinemadb;Username=your_username;Password=your_password"
     }
     ```
   - Apply migrations:
     ```bash
     dotnet ef database update
     ```
   - Run the backend:
     ```bash
     dotnet run
     ```

3. **Frontend Setup (React + Vite):**
   - Navigate to the frontend directory:
     ```bash
     cd frontend/cinema-calc-frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the frontend:
     ```bash
     npm start
     ```

---

## About the Project

### Technologies Used
- **Frontend**: React (TypeScript), Vite, Tailwind CSS, ShadCN for the UI library, Lucide React for icons, Axios for API requests
- **Backend**: .NET (C#), Entity Framework Core for ORM
- **Database**: PostgreSQL

### Overall Structure
- **Backend**: 
  - Organized into separate layers for models, services, and controllers.
  - Utilizes Entity Framework for data access and migration management.
  - APIs handle calculations and persist data.
- **Frontend**:
  - Modular React components with custom hooks for fetching and managing data.
  - Tailwind CSS is used for styling and responsiveness.
  - Axios for communicating with the backend.

### State Management
The application uses two main state types:
1. **Expense Data**: Fetched from the backend and stored in local state.
2. **User Inputs and Actions**: Persisted in the backend but also managed locally within components using React’s state.

No complex state management libraries (like Redux) were necessary since the local state was minimal and well-handled by React's built-in hooks. However, a theme toggle for dark and light modes is managed using React Context API.

### Precise Number Calculations
Precise number calculations were handled on both the frontend and backend. Here’s how:
- **Backend**: 
  - The expense model uses `decimal` data types with two decimal places for handling monetary values, ensuring accuracy for large numbers and percentage markups.
  - Total calculations for each expense are done in the backend using the following model:
    ```csharp
    public decimal TotalPrice => Math.Round(Price + (Price * PercentageMarkup / 100), 2, MidpointRounding.AwayFromZero);
    ```
  - Validation on input fields ensures correct and constrained values (e.g., price between 0 and 1 billion, markup between 0 and 100%).

- **Frontend**: 
  - Row-level calculations for individual expenses are performed in real-time to ensure responsiveness.
  - Total calculations are retrieved from the backend to handle potential future scaling (e.g., handling large datasets).

---

## Task Planning & Approach

### Backend
- **Database Design**: A simple table with fields for `id`, `name`, `price`, and `markup`. Since the total price is a calculated field, it doesn’t need to be stored in the database.
- **APIs**: Designed to validate inputs, perform calculations, and handle data persistence. APIs are well-structured with proper error handling and validation messages for the frontend.

### Frontend
- **UI Design**: 
  - Clean and user-friendly, with a responsive layout using Tailwind CSS.
  - Light and dark modes available for better user experience.
  - Scrollable table rows ensure that all important elements are always visible.
  - Inputs are validated with tooltips guiding the user on limits.
  - Auto-saving of data upon blur ensures persistent storage of inputs.

### Component Structure
- **Separation of Concerns**: The codebase is clean, with concerns separated across components and services. Hooks are used to handle API calls, while UI logic is kept separate from the data fetching layer.