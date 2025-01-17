import Database from 'better-sqlite3';
import { Service, ServiceType } from '../src/types';

const db = new Database('services.db');

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL CHECK(type IN ('AMBULANCE', 'DOCTOR')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    imageUrl TEXT,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  )
`);

// Seed some initial data if table is empty
const count = db.prepare('SELECT COUNT(*) as count FROM services').get() as {
  count: number;
};

if (count.count === 0) {
  const seedData: Omit<Service, 'id'>[] = [
    {
      type: 'AMBULANCE',
      title: 'City Emergency Response',
      description: 'Available 24/7 for emergency medical transport',
      location: 'Downtown Medical Center',
      imageUrl:
        'https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=800',
      latitude: 40.7128,
      longitude: -74.006,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      type: 'DOCTOR',
      title: 'Dr. Sarah Johnson',
      description: 'Emergency Medicine Specialist',
      location: 'Central Hospital',
      imageUrl:
        'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=800',
      latitude: 40.7142,
      longitude: -74.0064,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const insert = db.prepare(`
    INSERT INTO services (type, title, description, location, imageUrl, latitude, longitude, createdAt, updatedAt)
    VALUES (@type, @title, @description, @location, @imageUrl, @latitude, @longitude, @createdAt, @updatedAt)
  `);

  seedData.forEach((service) => insert.run(service));
}

export { db };
