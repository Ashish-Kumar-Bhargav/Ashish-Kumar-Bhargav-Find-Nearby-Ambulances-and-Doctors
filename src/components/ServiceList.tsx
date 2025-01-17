import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { Service, ServiceResponse } from '../types';
import { FaAmbulance, FaStethoscope, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useDeleteService } from '../hooks/useDeleteService';
import ConfirmationModal from './ConfirmationModal';
import { ToastContainer, toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL;

interface ServiceListProps {
  onEdit: (service: Service) => void;
}

export default function ServiceList({ onEdit }: ServiceListProps) {
  const [page, setPage] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');

  const deleteService = useDeleteService();

  const { data, isLoading, isError } = useQuery<ServiceResponse>({
    queryKey: ['services', page],
    queryFn: () =>
      axios.get(`${API_URL}/api/services?page=${page}`).then((res) => res.data),
  });

  const handleDelete = (id: number) => {
    deleteService.mutate(id, {
      onSuccess: () => {
        toast.success('Service deleted successfully!');
        setIsModalOpen(false);
      },
      onError: () => {
        toast.error('Failed to delete the service.');
      },
    });
  };

  const filteredServices = data?.data.filter((service) => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType ? service.type === filterType : true;
    return matchesSearch && matchesFilter;
  });

  const ambulanceCount = data?.data.filter((service) => service.type === 'AMBULANCE').length || 0;
  const doctorCount = data?.data.filter((service) => service.type === 'DOCTOR').length || 0;

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

  return (
    <div className="p-6 bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen">
      <h2 className="text-3xl font-extrabold mb-6 text-gray-800 text-center">Our Services</h2>

      {/* Search and Filter Section */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p className="text-gray-700">
            Total Ambulance: <span className="font-bold">{ambulanceCount}</span> | Total Doctors:{' '}
            <span className="font-bold">{doctorCount}</span>
          </p>
        </div>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border rounded-md"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border rounded-md"
          >
            <option value="">All Types</option>
            <option value="AMBULANCE">Ambulance</option>
            <option value="DOCTOR">Doctor</option>
          </select>
        </div>
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredServices?.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
          >
            {service.imageUrl && (
              <div className="relative">
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-20"></div>
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-3">
                {service.type === 'AMBULANCE' ? (
                  <FaAmbulance className="h-6 w-6 text-red-600" />
                ) : (
                  <FaStethoscope className="h-6 w-6 text-blue-600" />
                )}
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  {service.type}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{service.description}</p>
              <div className="text-sm text-gray-500 mb-4">
                📍 {service.location}
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => onEdit(service)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                >
                  <FaEdit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedService(service);
                    setIsModalOpen(true);
                  }}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition"
                >
                  <FaTrashAlt className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 border rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-gray-700">
          Page {page} of {data.totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
          disabled={page === data.totalPages}
          className="px-4 py-2 border rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && selectedService && (
        <ConfirmationModal
          title="Delete Service"
          message={`Are you sure you want to delete the service "${selectedService.title}"?`}
          onCancel={() => setIsModalOpen(false)}
          onConfirm={() => handleDelete(selectedService.id)}
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}
