import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ServiceList from '../components/ServiceList';

const queryClient = new QueryClient();

describe('ServiceList', () => {
  it('shows loading state', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ServiceList onEdit={() => {}} />
      </QueryClientProvider>
    );
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows empty state when no services', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ServiceList onEdit={() => {}} />
      </QueryClientProvider>
    );
    
    const emptyMessage = await screen.findByText('No services found');
    expect(emptyMessage).toBeInTheDocument();
  });
});