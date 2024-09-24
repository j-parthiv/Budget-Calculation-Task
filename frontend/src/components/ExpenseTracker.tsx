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

interface Expense {
  id: number;
  name: string;
  price: number;
  percentageMarkup: number;
  totalPrice: number;
  isNew?: boolean;
}

const ExpenseTracker: React.FC = () => {
  // Custom hook usage
  const {
    expenses: fetchedExpenses,
    loading: expensesLoading,
    error: expensesError,
  } = useFetchExpenses();
  const {
    total,
    loading: totalLoading,
    error: totalError,
    refetchTotal,
  } = useFetchTotal();
  const { postExpense, loading: adding } = usePostExpense();
  const { putExpense, loading: editing } = usePutExpense();
  const { deleteExpense, loading: deleting } = useDeleteExpense();

  const [expenses, setExpenses] = useState<Expense[]>(fetchedExpenses);
  const newExpenseRef = useRef<HTMLInputElement>(null);

  // Sync fetched expenses with state
  useEffect(() => {
    setExpenses(fetchedExpenses);
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
      isNew: true, // Mark as new until saved to server
    };
    setExpenses((prevExpenses) => [...prevExpenses, newExpense]);

    setTimeout(() => {
      if (newExpenseRef.current) {
        newExpenseRef.current.focus();
      }
    }, 0);
  };

  // Delete expense (local and server)
  const onDelete = async (id: number) => {
    const expenseToDelete = expenses.find((expense) => expense.id === id);

    if (expenseToDelete?.isNew) {
      // Just remove locally if it's new and unsaved
      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense.id !== id)
      );
      return;
    }

    // Use the hook for deleting from server
    await deleteExpense(id);
    setExpenses((prevExpenses) =>
      prevExpenses.filter((expense) => expense.id !== id)
    );
  };

  // Update or create expense (local and server)
  const onUpdate = async (updatedExpense: Expense) => {
    console.log("updatedExpense",updatedExpense);
    if (updatedExpense.isNew) {
      const createdExpense = await postExpense({
        name: updatedExpense.name,
        price: updatedExpense.price,
        percentageMarkup: updatedExpense.percentageMarkup,
      });
      setExpenses((prevExpenses) =>
        prevExpenses.map((expense) =>
          expense.id === updatedExpense.id ? createdExpense : expense
        )
      );
    } else {
      await putExpense(updatedExpense);
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
            onDelete={onDelete}
            onUpdate={onUpdate}
            newExpenseRef={newExpenseRef}
          />
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 p-6">
          <Button
            className="w-full sm:w-auto flex items-center justify-center gap-2 secondary-bg-color"
            onClick={onAdd}
            disabled={adding}
          >
            {adding ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {adding ? "Adding..." : "Add Expense"}
          </Button>
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
                {total?.toFixed(2) || "0.00"}
              </span>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ExpenseTracker;
