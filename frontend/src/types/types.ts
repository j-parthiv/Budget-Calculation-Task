export interface Expense {
    id: number; 
    name: string;
    price: number;
    percentageMarkup: number;
    totalPrice: number;
  }

 export interface UseFetchExpensesResult {
    expenses: Expense[];
    loading: boolean;
    error: Error | null;
  }

  export interface ExpenseRowProps {
    expense: {
      id: number;
      name: string;
      price: number;
      percentageMarkup: number;
      totalPrice: number;
    };
    index: number;
    onDelete: (id: number) => void; // Function to handle delete action
    onUpdate: (updatedExpense: { id: number; name: string; price: number; markup: number }) => void; // Function to handle update action
  }