# CinemaCalc - Film Production Expense Tracker

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Installation](#installation)
   - [With Docker](#with-docker)
   - [Without Docker](#without-docker)
5. [Project Structure](#project-structure)
   - [Backend](#backend)
   - [Frontend](#frontend)
6. [State Management](#state-management)
7. [Precise Number Calculations](#precise-number-calculations)
8. [Development Approach](#development-approach)
9. [Future Improvements](#future-improvements)

## Project Overview

CinemaCalc is a full-stack application designed to track film production expenses. The app allows users to input various expenses, apply markup percentages, and automatically calculate the total costs. This system helps keep film production costs organized and easily accessible, with features like adding, editing, and deleting expenses, as well as viewing the total cost.

## Features

- Add, Edit, and Delete Expenses: Allows the user to manage a list of expenses for film production.
- Auto-saving: Expenses are automatically synced with the backend.
- Expense Validation: Ensures all expenses are within a valid range (0 to 1 billion for price, 0% to 100% for markup).
- Total Calculation: The system automatically calculates and displays the total cost based on user inputs.
- Responsive Design: The UI is built with responsive elements to provide an optimal experience across devices.

## Technologies Used

- **Frontend**: React (TypeScript), Vite, Tailwind CSS, ShadCN UI library, Lucide React, Axios
- **Backend**: ASP.NET Core (C#), Entity Framework Core
- **Database**: PostgreSQL

## Installation

### With Docker

1. Clone the repository:

   ```bash
   git clone https://github.com/j-parthiv/Budget-Calculation-Task.git

   cd Budget-Calculation-Task
   ```

2. Build and run Docker containers:

   ```bash
   docker compose build

   docker compose up
   ```

3. Access the application at [http://localhost:5173](http://localhost:5173)

### Without Docker

1. Clone the repository:

   ```bash
   git clone https://github.com/j-parthiv/Budget-Calculation-Task.git

   cd Budget-Calculation-Task
   ```

2. Backend Setup:

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

3. Frontend Setup:

- Navigate to the frontend directory:

  ```bash
  cd frontend
  ```

- Create a `.env` file in the root of the frontend directory and add the following line to set the API base URL:

  ```env
  VITE_API_BASE_URL=http://localhost:5045/api
  ```

- Install dependencies:

  ```bash
  npm install
  ```

- Start the frontend:
  ```bash
  npm start
  ```

## Project Structure

### Backend

- Built with ASP.NET Core and Entity Framework Core
- Provides REST API for CRUD operations on expenses
- Key Endpoints:
  - GET `/api/Expenses`: Retrieve all expenses
  - GET `/api/Expenses/{id}`: Retrieve a specific expense
  - POST `/api/Expenses`: Add a new expense
  - PUT `/api/Expenses/{id}`: Update an existing expense
  - DELETE `/api/Expenses/{id}`: Delete an expense
  - GET `/api/Expenses/Total`: Get total price of all expenses

#### Database Design

- A simple table with fields for `id`, `name`, `price`, and `markup`.

### Frontend

- Built with React and TypeScript
- Key Components:
  - `ExpenseTracker`: Main component for displaying and managing expenses
  - `ExpenseListTable`: Displays expenses in a table format
  - `ExpenseRow`: Renders individual expense rows
- Key Custom Hooks:
  - `useFetchExpenses`: Fetches expenses from API
  - `useFetchTotal`: Retrieves total price of expenses
  - `usePostExpense`: Creates new expenses
  - `usePutExpense`: Updates existing expenses
  - `useDeleteExpense`: Deletes expenses

## State Management

- The application uses a simple and efficient state management approach:

- Local Component State: Each component manages its own state using React's built-in hooks (useState, useEffect).
- Real-time Updates: As users make changes, the state is immediately updated in the local component and persisted to the database.
- Expense Calculations: Individual expense totals are calculated on the frontend for real-time user feedback.
- The overall total is calculated on the backend to ensure scalability for larger datasets.

Rationale: Given the relatively simple structure of the application and the absence of complex global state requirements, using local component state provides a clean and efficient solution. This approach minimizes unnecessary re-renders and keeps the codebase simple and maintainable.

## Precise Number Calculations

- To ensure accurate calculations, especially with financial data, the following measures were implemented:

- Input Validation:
  - Frontend: TypeScript and React form validation
  - Backend: API-level validation
- Decimal Precision: Using appropriate decimal types in both frontend and backend
- Limits:

  - Price: Maximum of 1 billion to prevent overflow
  - Markup: Between 0% and 100%

- Rounding: Values are rounded to two decimal places, always away from zero
- Backend Calculation: Total calculations are performed on the backend to ensure consistency across large datasets

This approach ensures that calculations remain precise and consistent, even with a large number of expenses or high-value inputs.

## Development Approach

The development process was broken down into the following tasks:

- Backend Development:

  - Database design: Simple table structure for expenses
  - API development: CRUD operations with proper validation and error handling
  - Decision on calculation storage: Opted not to store total in the database due to the simplicity of calculations

- Frontend Development:

  - UI/UX design: Created a basic mockup focusing on responsiveness and user experience
  - Component structure: Developed reusable components
  - State management: Implemented local state management with real-time updates
  - API integration: Connected frontend components to backend APIs
  - Styling: Implemented responsive design with dark/light mode options

- Refinement:
  - Testing of the application
  - Code cleanup and documentation

## Future Improvements

While the current implementation meets the requirements for managing around 100 expenses, several enhancements could be made for larger datasets or extended functionality:

 - Pagination for handling larger datasets
 - Virtualization for improved performance with long lists
 - Implementation of DTOs for optimized data transfer
 - Query optimization for faster database operations
 - Caching mechanisms to reduce database load
 - Advanced filtering and sorting options