import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Film, Plus, RefreshCw } from "lucide-react";
import ExpenseListTable from "./ExpenseListTable";
import { Button } from "@/components/ui/button";
import useFetchExpenses from "@/hooks/useFetchExpense";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import axios from "axios";

const ExpenseTracker = () => {
  const { toast } = useToast();
  const {
    expenses: fetchedExpenses,
    loading,
    error,
  }: UseFetchExpensesResult = useFetchExpenses();
  const [expenses, setExpenses] = useState(fetchedExpenses);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const [adding, setAdding] = useState<boolean>(false);

  // Update local state when fetchedExpenses changes
  useEffect(() => {
    setExpenses(fetchedExpenses);
  }, [fetchedExpenses]);

  const onAdd = async () => {
    setAdding(true);
    try {
      const newExpense = {
        name: "New Expense",
        price: 0,
        percentageMarkup: 0,
      };
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/Expenses`,
        newExpense
      );
      setExpenses((prevExpenses) => [...prevExpenses, response.data]);
      toast({
        title: "✅ Success",
        description: "New expense added successfully!",
      });
    } catch (error) {
      console.error("Error adding expense:", error);
      toast({
        variant: "destructive",
        title: "❕ Error",
        description: error.message,
      });
    } finally {
      setAdding(false);
    }
  };

  const onDelete = async (id: number) => {
    setDeleting(id);
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/Expenses/${id}`);
      toast({
        title: "✅ Success",
        description: "Expense deleted successfully!",
      });
      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense.id !== id)
      );
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast({
        variant: "destructive",
        title: "❕ Error",
        description: error.message,
      });
    } finally {
      setDeleting(null);
    }
  };

  const onUpdate = async (updatedExpense) => {
    try {
      setEditing(true);
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/Expenses/${updatedExpense.id}`,
        updatedExpense
      );
      setExpenses((prevExpenses) =>
        prevExpenses.map((expense) =>
          expense.id === updatedExpense.id ? updatedExpense : expense
        )
      );
    } catch (error) {
      toast({
        variant: "destructive",
        title: "❕ Error updating expense",
        description: error.message,
      });
      throw error;
    } finally {
      setEditing(false);
    }
  };

  return (
    <div className="container mx-auto p-4 flex items-center justify-center">
      <Card className="w-full max-w-4xl shadow-xl bg-white dark:bg-gray-800 primary-text-color">
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 pb-6">
          <CardTitle className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Film className="h-8 w-8 sm:h-10 sm:w-10 secondary-text-color" />
            <span>Film Production Expense Tracker</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ExpenseListTable
            expenses={expenses}
            loading={loading}
            editing={editing}
            deleting={deleting}
            error={error}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 p-6">
          <Button
            className="w-full sm:w-auto flex items-center gap-2 secondary-bg-color hover:secondary-bg-color-light transition-all duration-300"
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
          <div className="text-xl sm:text-2xl font-bold bg-[#1d4e89]/10 dark:bg-gray-700 dark:text-white p-3 rounded-md">
            Total: €
            {expenses
              .reduce((sum, expense) => sum + expense.totalPrice, 0)
              .toFixed(2)}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ExpenseTracker;
