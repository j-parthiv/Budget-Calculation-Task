import { useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const useDeleteExpense = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<number|null> (null);
  const [error, setError] = useState<null | string>(null);

  const deleteExpense = async (id: number) => {
    setLoading(id);
    setError(null);
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/Expenses/${id}`);
      toast({
        title: "✅ Success",
        description: "Expense deleted successfully!",
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
      setLoading(null);
    }
  };

  return { deleteExpense, loading, error };
};

export default useDeleteExpense;
