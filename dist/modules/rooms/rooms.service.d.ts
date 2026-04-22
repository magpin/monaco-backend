import { Repository } from 'typeorm';
import { Room, RoomStatus } from './entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { QueryRoomsDto } from './dto/query-rooms.dto';
import { UpdateRoomStatusDto } from './dto/update-room-status.dto';
import { RoomData, RoomListResponse, RoomResponse } from './types/room-response.type';
import { UserRole } from '../users/entities/user.entity';
export declare class RoomsService {
    private readonly roomRepository;
    constructor(roomRepository: Repository<Room>);
    create(createRoomDto: CreateRoomDto): Promise<RoomResponse>;
    findAll(query: QueryRoomsDto): Promise<RoomListResponse>;
    findOne(id: string): Promise<RoomResponse>;
    update(id: string, updateRoomDto: UpdateRoomDto): Promise<RoomResponse>;
    remove(id: string): Promise<RoomResponse>;
    updateStatus(id: string, updateStatusDto: UpdateRoomStatusDto, userRole: UserRole): Promise<RoomResponse>;
    findById(id: string): Promise<Room | null>;
    updateRoomStatus(id: string, status: RoomStatus): Promise<void>;
    mapToData(room: Room): RoomData;
}
