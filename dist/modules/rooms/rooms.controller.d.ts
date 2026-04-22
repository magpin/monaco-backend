import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { QueryRoomsDto } from './dto/query-rooms.dto';
import { UpdateRoomStatusDto } from './dto/update-room-status.dto';
import { UserRole } from '../users/entities/user.entity';
interface AuthenticatedRequest {
    user: {
        id: string;
        email: string;
        role: UserRole;
    };
}
export declare class RoomsController {
    private readonly roomsService;
    constructor(roomsService: RoomsService);
    create(createRoomDto: CreateRoomDto): Promise<import("./types/room-response.type").RoomResponse>;
    findAll(query: QueryRoomsDto): Promise<import("./types/room-response.type").RoomListResponse>;
    findOne(id: string): Promise<import("./types/room-response.type").RoomResponse>;
    update(id: string, updateRoomDto: UpdateRoomDto): Promise<import("./types/room-response.type").RoomResponse>;
    remove(id: string): Promise<import("./types/room-response.type").RoomResponse>;
    updateStatus(id: string, updateStatusDto: UpdateRoomStatusDto, req: AuthenticatedRequest): Promise<import("./types/room-response.type").RoomResponse>;
}
export {};
