import { useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

interface Expense {
  id: number;
  name: string;
  price: number;
  percentageMarkup: number;
  totalPrice: number;
}

const usePutExpense = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const putExpense = async (updatedExpense: Expense) => {
    setLoading(true);
    setError(null);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/Expenses/${updatedExpense.id}`,
        updatedExpense
      );
      toast({
        title: "✅ Success",
        description: "Expense updated successfully!",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "❕ Error",
        description: err.message || "An error occurred",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { putExpense, loading, error };
};

export default usePutExpense;
