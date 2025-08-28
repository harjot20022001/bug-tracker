import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

export const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  role: z.enum(['admin', 'employee'], { message: 'Role must be either admin or employee' }),
});

export const projectSchema = z.object({
  name: z.string().min(2, { message: 'Project name must be at least 2 characters long' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters long' }),
});

export const ticketSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters long' }),
  priority: z.enum(['Low', 'Medium', 'High'], { message: 'Priority must be Low, Medium, or High' }),
  status: z.enum(['Open', 'In Progress', 'Closed'], { message: 'Status must be Open, In Progress, or Closed' }).optional(),
});
