export interface User {
  id: number;
  username: string;
  email: string;
  password: string; // Typically not stored; used for registration
  role: 'CUSTOMER' | 'ADMIN';
}
