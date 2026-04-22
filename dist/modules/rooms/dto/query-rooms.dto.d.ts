import { RoomStatus, RoomType } from '../entities/room.entity';
export declare class QueryRoomsDto {
    type?: RoomType;
    status?: RoomStatus;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
}
