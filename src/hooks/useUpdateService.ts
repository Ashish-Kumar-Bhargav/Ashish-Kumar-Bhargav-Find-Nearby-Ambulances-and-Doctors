import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Service } from '../types';
const API_URL = import.meta.env.VITE_API_URL;

export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (service: Omit<Service, 'createdAt' | 'updatedAt'>) =>
      axios.put(`${API_URL}/api/services/${service.id}`, service),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}