import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Service, ServiceResponse } from '../types';
import { FaAmbulance, FaStethoscope, FaEdit, FaTrashAlt } from 'react-icons/fa'; // Import icons from react-icons
import { useDeleteService } from '../hooks/useDeleteService';
const API_URL = import.meta.env.VITE_API_URL;

interface ServiceListProps {
  onEdit: (service: Service) => void;
}

export default function ServiceList({ onEdit }: ServiceListProps) {
  const [page, setPage] = React.useState(1);
  const deleteService = useDeleteService();

  const { data, isLoading, isError } = useQuery<ServiceResponse>({
    queryKey: ['services', page],
    queryFn: () =>
      axios.get(`${API_URL}/api/services?page=${page}`)
        .then(res => res.data)
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-xl">Error loading services</div>
        <p className="text-gray-600 mt-2">Please try again later</p>
      </div>
    );
  }

  if (!data?.data.length) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600 text-xl">No services found</div>
        <p className="text-gray-500 mt-2">Add some services to get started</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Services List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.data.map((service) => (
          <div key={service.id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl">
            {service.imageUrl && (
              <img
                src={service.imageUrl}
                alt={service.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-3">
                {service.type === 'AMBULANCE' ? (
                  <FaAmbulance className="h-5 w-5 text-red-600" />
                ) : (
                  <FaStethoscope className="h-5 w-5 text-blue-600" />
                )}
                <span className="text-sm font-medium text-gray-500">
                  {service.type}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <div className="text-sm text-gray-500 mb-4">
                📍 {service.location}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => onEdit(service)}
                  className="p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  <FaEdit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => deleteService.mutate(service.id)}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
                >
                  <FaTrashAlt className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center space-x-2">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 border rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-gray-700">
          Page {page} of {data.totalPages}
        </span>
        <button
          onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
          disabled={page === data.totalPages}
          className="px-4 py-2 border rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
