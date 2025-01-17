export type ServiceType = 'AMBULANCE' | 'DOCTOR';

export interface Service {
  id: number;
  type: ServiceType;
  title: string;
  description: string;
  location: string;
  imageUrl?: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceResponse {
  data: Service[];
  total: number;
  page: number;
  totalPages: number;
}