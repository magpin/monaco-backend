export declare enum RoomType {
    INDIVIDUAL = "individual",
    DOUBLE = "double",
    SUITE = "suite",
    FAMILY = "family"
}
export declare enum RoomStatus {
    AVAILABLE = "available",
    RESERVED = "reserved",
    OCCUPIED = "occupied",
    CLEANING = "cleaning",
    OUT_OF_SERVICE = "out_of_service"
}
export declare class Room {
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
    createdAt: Date;
    updatedAt: Date;
}
