import { useEffect, useState } from "react";import axios from 'axios';
interface TotalResponse {
  total: number;
}
const useFetchTotal = () => {
  const [total, setTotal] = useState<number>(0); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refetchTotal = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<TotalResponse>(`${import.meta.env.VITE_API_BASE_URL}/Expenses/Total`);
      setTotal(response.data || 0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    refetchTotal();
  }, []);

  return { total, loading, error, refetchTotal };
};

export default useFetchTotal;