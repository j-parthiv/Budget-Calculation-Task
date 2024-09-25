import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Film, Plus, RefreshCw, Cloud } from "lucide-react";
import ExpenseListTable from "./ExpenseListTable";
import { Button } from "@/components/ui/button";
import useFetchExpenses from "@/hooks/useFetchExpense";
import useFetchTotal from "@/hooks/useFetchTotal";
import usePostExpense from "@/hooks/usePostExpense";
import usePutExpense from "@/hooks/usePutExpense";
import useDeleteExpense from "@/hooks/useDeleteExpense";
import { Expense } from "@/types/types";

const ExpenseTracker: React.FC = () => {
  // Custom hook to fetch expenses
  const {
    expenses: fetchedExpenses,
    loading: expensesLoading,
    error: expensesError,
  } = useFetchExpenses();

  // Custom hook to fetch total price
  const {
    total,
    loading: totalLoading,
    error: totalError,
    refetchTotal,
  } = useFetchTotal();

  // Hooks for creating, updating, and deleting expenses
  const { putExpense, loading: editing } = usePutExpense();
  const { deleteExpense, loading: deleting } = useDeleteExpense();
  const { postExpense } = usePostExpense();

  // State to manage the local list of expenses
  const [expenses, setExpenses] = useState<Expense[]>(fetchedExpenses || []);
  const newExpenseRef = useRef<HTMLInputElement>(null);

  // Sync fetched expenses with local state when fetched data changes
  useEffect(() => {
    setExpenses(fetchedExpenses || []);
  }, [fetchedExpenses]);

  // Refetch total whenever expenses change
  useEffect(() => {
    refetchTotal();
  }, [expenses]);

  // Add a new expense locally
  const onAdd = () => {
    const newExpense: Expense = {
      id: Date.now(), // Temporary ID for new expense
      name: "",
      price: 0,
      percentageMarkup: 0,
      totalPrice: 0,
      isNew: true, // Mark as new until saved to the server
    };
    setExpenses((prevExpenses) => [...prevExpenses, newExpense]);

    // Focus on the input for the new expense
    setTimeout(() => {
      if (newExpenseRef.current) {
        newExpenseRef.current.focus();
      }
    }, 0);
  };

  // Delete expense locally or from the server if saved
  const onDelete = async (id: number) => {
    const expenseToDelete = expenses.find((expense) => expense.id === id);

    // If it's a new unsaved expense, just remove it locally
    if (expenseToDelete?.isNew) {
      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense.id !== id)
      );
      return;
    }

    // Otherwise, delete it from the server
    await deleteExpense(id);
    setExpenses((prevExpenses) =>
      prevExpenses.filter((expense) => expense.id !== id)
    );
  };

  // Update or create an expense, either locally or on the server
  const onUpdate = async (updatedExpense: Expense) => {
    if (updatedExpense.isNew) {
      // Post new expense to the server
      const createdExpense = await postExpense({
        name: updatedExpense.name,
        price: updatedExpense.price,
        percentageMarkup: updatedExpense.percentageMarkup,
      });
      // Replace the local placeholder with the created one
      setExpenses((prevExpenses) =>
        prevExpenses.map((expense) =>
          expense.id === updatedExpense.id ? createdExpense : expense
        )
      );
    } else {
      // Update the existing expense on the server
      await putExpense(updatedExpense);
      // Update it in the local state
      setExpenses((prevExpenses) =>
        prevExpenses.map((expense) =>
          expense.id === updatedExpense.id ? updatedExpense : expense
        )
      );
    }
  };

  return (
    <div className="container mx-auto p-4 flex items-center justify-center">
      <Card className="w-full max-w-4xl shadow-xl bg-white dark:bg-gray-800 primary-text-color">
        <CardHeader className="flex flex-col sm:flex-row items-center sm:items-center justify-between space-y-4 sm:space-y-0 pb-6">
          <CardTitle className="text-2xl sm:text-3xl font-bold flex items-center gap-2 text-center sm:text-left">
            <Film className="h-8 w-8 sm:h-10 sm:w-10 secondary-text-color" />
            <span>Film Production Expense Tracker</span>
          </CardTitle>
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              <span className="text-sm">Auto-saving</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <ExpenseListTable
            expenses={expenses}
            loading={expensesLoading}
            editing={editing}
            deleting={deleting}
            error={expensesError}
            onAdd={onAdd}
            onDelete={onDelete}
            onUpdate={onUpdate}
            newExpenseRef={newExpenseRef}
          />
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 p-6">
          <div>
            {expenses.length > 0 && (
              <Button
                className="w-full sm:w-auto flex items-center justify-center gap-2 secondary-bg-color"
                onClick={onAdd}
              >
                <Plus className="w-4 h-4" />
                Add Expense
              </Button>
            )}
          </div>
          <div className="flex items-center justify-center bg-[#1d4e89]/10 dark:bg-gray-700 p-3 rounded-md w-full sm:w-auto mt-4 sm:mt-0">
            <span className="text-xl sm:text-2xl font-bold">Total: €</span>
            {totalLoading ? (
              <RefreshCw className="w-5 h-5 ml-2 animate-spin text-blue-500" />
            ) : totalError ? (
              <span className="text-sm text-red-500 ml-2">
                Error fetching total
              </span>
            ) : (
              <span className="text-xl sm:text-2xl font-bold ml-1">
                {total.toFixed(2)}
              </span>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ExpenseTracker;
