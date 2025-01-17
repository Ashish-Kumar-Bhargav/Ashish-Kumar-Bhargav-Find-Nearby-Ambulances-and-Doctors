import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      axios.delete(`${API_URL}/api/services/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}