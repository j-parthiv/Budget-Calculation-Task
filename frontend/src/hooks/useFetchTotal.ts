import { useState, useEffect } from 'react';
import axios from 'axios';

interface TotalResponse {
  total: number;
}

const useFetchTotal = () => {
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTotal = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<TotalResponse>(`${import.meta.env.VITE_API_BASE_URL}/Expenses/Total`);
      setTotal(response.data);
    } catch (err) {
        console.log(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTotal();
  }, []);

  return { total, loading, error, refetchTotal: fetchTotal };
};

export default useFetchTotal;