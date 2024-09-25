import { useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

interface Expense {
  name: string;
  price: number;
  percentageMarkup: number;
}

const usePostExpense = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean> (false);
  const [error, setError] = useState<null | string>(null);

  const postExpense = async (newExpense: Expense) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/Expenses`,
        newExpense
      );
      toast({
        title: "✅ Success",
        description: "Expense created successfully!",
      });
      return response.data;
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

  return { postExpense, loading, error };
};

export default usePostExpense;
