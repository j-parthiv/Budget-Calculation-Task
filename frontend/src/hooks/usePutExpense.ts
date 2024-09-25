import { useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Expense } from "@/types/types";


const usePutExpense = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<number | null>(null);
  const [error, setError] = useState<null | string>(null);

  const putExpense = async (updatedExpense: Expense) => {
    setLoading(updatedExpense.id);
    setError(null);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/Expenses/${updatedExpense.id}`,
        updatedExpense
      );
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "❕ Error",
        description: err.message || "An error occurred",
      });
      throw err;
    } finally {
      setLoading(null);
    }
  };

  return { putExpense, loading, error };
};

export default usePutExpense;
