import { UserData } from '../../users/types/user-response.type';

export type AuthTokenData = {
  token: string;
  user: UserData;
};

export type AuthResponse = {
  status: number;
  message: string;
  data: AuthTokenData;
};
