import { UserRole } from '../entities/user.entity';

export type UserData = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  documentNumber: string;
  phone: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UserResponse = {
  status: number;
  message: string;
  data?: UserData | UserData[];
};

export type UserCreatedResponse = {
  status: 201;
  message: string;
  data: UserData;
};
