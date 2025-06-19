export interface User {
  // Rename this to match backend's userId property
  userId?: number;  // Changed from 'id' to 'userId'
  username: string;
  email: string;
  password: string;
  role: string;
}
