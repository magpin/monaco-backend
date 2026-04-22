import { RoomStatus, RoomType } from '../entities/room.entity';

export type RoomData = {
  id: string;
  roomNumber: string;
  type: RoomType;
  pricePerNight: number;
  beds: number;
  services: string[];
  description: string | null;
  images: string[];
  status: RoomStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type RoomResponse = {
  status: number;
  message: string;
  data?: RoomData | RoomData[];
};

export type RoomListResponse = {
  status: number;
  message: string;
  data: {
    items: RoomData[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
