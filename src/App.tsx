import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ServiceList from './components/ServiceList';
import ServiceForm from './components/ServiceForm';
import { FaAmbulance, FaUserMd } from 'react-icons/fa';

const queryClient = new QueryClient();

const App: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = React.useState<boolean>(false);
  const [editingService, setEditingService] = React.useState<any | null>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-2">
                  <FaAmbulance className="h-6 w-6 text-red-600" />
                  <FaUserMd className="h-6 w-6 text-blue-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Emergency Services Finder
                </h1>
              </div>
              <button
                onClick={() => {
                  setEditingService(null);
                  setIsFormOpen(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add New Service
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ServiceList
            onEdit={(service: any) => {
              setEditingService(service);
              setIsFormOpen(true);
            }}
          />
        </main>

        {/* Form Modal */}
        {isFormOpen && (
          <ServiceForm
            service={editingService}
            onClose={() => {
              setIsFormOpen(false);
              setEditingService(null);
            }}
          />
        )}
      </div>
    </QueryClientProvider>
  );
};

export default App;
