import React from 'react';
import { useCreateService } from '../hooks/useCreateService';
import { useUpdateService } from '../hooks/useUpdateService';
import { Service, ServiceType } from '../types';
import { MdClose } from 'react-icons/md';
import { FaAmbulance, FaUserMd, FaMapMarkerAlt, FaImage, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface ServiceFormProps {
  service?: Service | null;
  onClose: () => void;
}

export default function ServiceForm({ service, onClose }: ServiceFormProps) {
  const createService = useCreateService();
  const updateService = useUpdateService();

  const [formData, setFormData] = React.useState({
    type: service?.type || 'AMBULANCE' as ServiceType,
    title: service?.title || '',
    description: service?.description || '',
    location: service?.location || '',
    imageUrl: service?.imageUrl || '',
    latitude: service?.latitude || 0,
    longitude: service?.longitude || 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation for all required fields
    const { type, title, description, location, latitude, longitude } = formData;
    if (!type || !title || !description || !location || !latitude || !longitude) {
      toast.error('Please fill in all fields.');
      return;
    }

    try {
      if (service) {
        await updateService.mutateAsync({ id: service.id, ...formData });
        toast.success(`Service "${formData.title}" updated successfully!`);
      } else {
        await createService.mutateAsync(formData);
        toast.success(`New ${formData.type === 'AMBULANCE' ? 'Ambulance' : 'Doctor'} service created successfully!`);
      }
      onClose();
    } catch (error) {
      toast.error('An error occurred while saving the service. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <MdClose className="h-6 w-6" />
        </button>

        <h2 className="text-xl font-semibold mb-4">
          {service ? 'Edit Service' : 'Add New Service'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <div className="relative">
              <select
                value={formData.type}
                onChange={e => setFormData(d => ({ ...d, type: e.target.value as ServiceType }))}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-100 transition duration-150 ease-in-out hover:bg-gray-200 focus:bg-white pl-10 pr-3"
                required
              >
                <option value="AMBULANCE">Ambulance</option>
                <option value="DOCTOR">Doctor</option>
              </select>
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <FaAmbulance className="text-lg" />
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <div className="relative">
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData(d => ({ ...d, title: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-100 transition duration-150 ease-in-out hover:bg-gray-200 focus:bg-white pl-10"
                required
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <FaUserMd className="text-lg" />
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <div className="relative">
              <textarea
                value={formData.description}
                onChange={e => setFormData(d => ({ ...d, description: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-100 transition duration-150 ease-in-out hover:bg-gray-200 focus:bg-white pl-10"
                rows={3}
                required
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <FaInfoCircle className="text-lg" />
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <div className="relative">
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData(d => ({ ...d, location: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-100 transition duration-150 ease-in-out hover:bg-gray-200 focus:bg-white pl-10"
                required
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <FaMapMarkerAlt className="text-lg" />
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <div className="relative">
              <input
                type="url"
                value={formData.imageUrl}
                onChange={e => setFormData(d => ({ ...d, imageUrl: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-100 transition duration-150 ease-in-out hover:bg-gray-200 focus:bg-white pl-10"
                required
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <FaImage className="text-lg" />
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Latitude</label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={e => setFormData(d => ({ ...d, latitude: parseFloat(e.target.value) }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-100 transition duration-150 ease-in-out hover:bg-gray-200 focus:bg-white pl-10"
                  required
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <FaMapMarkerAlt className="text-lg" />
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Longitude</label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={e => setFormData(d => ({ ...d, longitude: parseFloat(e.target.value) }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-100 transition duration-150 ease-in-out hover:bg-gray-200 focus:bg-white pl-10"
                  required
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <FaMapMarkerAlt className="text-lg" />
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={createService.isPending || updateService.isPending}
            >
              {createService.isPending || updateService.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
