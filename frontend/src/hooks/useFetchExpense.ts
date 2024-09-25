import { useState, useEffect } from 'react';
import axios from 'axios';
import { Expense } from '@/types/types';

const useFetchExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get<Expense[]>(`${import.meta.env.VITE_API_BASE_URL}/Expenses`);
        setExpenses(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  return { expenses, loading, error };
};

export default useFetchExpenses;
