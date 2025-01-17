import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Service } from '../types';
const API_URL = import.meta.env.VITE_API_URL;


export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) =>
      axios.post(`${API_URL}/api/services`, service),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}