import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import { db } from './db';
import { Service, ServiceType } from '../src/types';

const app = express();
app.use(cors());
app.use(express.json());

const serviceSchema = z.object({
  type: z.enum(['AMBULANCE', 'DOCTOR'] as const),
  title: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  imageUrl: z.string().url().optional(),
  latitude: z.number(),
  longitude: z.number()
});

// Get paginated services
app.get('/api/services', (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  const total = db.prepare('SELECT COUNT(*) as count FROM services').get() as { count: number };
  const services = db.prepare('SELECT * FROM services LIMIT ? OFFSET ?').all(limit, offset) as Service[];

  res.json({
    data: services,
    total: total.count,
    page,
    totalPages: Math.ceil(total.count / limit)
  });
});

// Create service
app.post('/api/services', (req, res) => {
  try {
    const service = serviceSchema.parse(req.body);
    const now = new Date().toISOString();

    const result = db.prepare(`
      INSERT INTO services (type, title, description, location, imageUrl, latitude, longitude, createdAt, updatedAt)
      VALUES (@type, @title, @description, @location, @imageUrl, @latitude, @longitude, @createdAt, @updatedAt)
    `).run({
      ...service,
      createdAt: now,
      updatedAt: now
    });

    res.status(201).json({ id: result.lastInsertRowid });
  } catch (error) {
    res.status(400).json({ error: 'Invalid service data' });
  }
});

// Update service
app.put('/api/services/:id', (req, res) => {
  try {
    const { id } = req.params;
    const service = serviceSchema.parse(req.body);
    const now = new Date().toISOString();

    const result = db.prepare(`
      UPDATE services 
      SET type = @type, title = @title, description = @description, 
          location = @location, imageUrl = @imageUrl, latitude = @latitude, 
          longitude = @longitude, updatedAt = @updatedAt
      WHERE id = @id
    `).run({
      ...service,
      id: parseInt(id),
      updatedAt: now
    });

    if (result.changes === 0) {
      res.status(404).json({ error: 'Service not found' });
    } else {
      res.json({ success: true });
    }
  } catch (error) {
    res.status(400).json({ error: 'Invalid service data' });
  }
});

// Delete service
app.delete('/api/services/:id', (req, res) => {
  const { id } = req.params;
  const result = db.prepare('DELETE FROM services WHERE id = ?').run(id);

  if (result.changes === 0) {
    res.status(404).json({ error: 'Service not found' });
  } else {
    res.json({ success: true });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});