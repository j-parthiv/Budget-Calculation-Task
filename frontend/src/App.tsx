import React from "react";
import Header from "./components/Header";
import ExpenseTracker from "./components/ExpenseTracker";

const App: React.FC = () => {
  return (
    <>
      <Header />
      <ExpenseTracker />
    </>
  );
};

export default App;
