import { RoomType } from '../entities/room.entity';
export declare class CreateRoomDto {
    roomNumber: string;
    type: RoomType;
    pricePerNight: number;
    beds: number;
    services?: string[];
    description?: string;
    images?: string[];
}
