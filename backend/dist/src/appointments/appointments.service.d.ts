import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
export declare class AppointmentsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(createAppointmentDto: CreateAppointmentDto): Promise<{
        title: string;
        description: string | null;
        datetime: Date;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    findAll(): Promise<{
        title: string;
        description: string | null;
        datetime: Date;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }[]>;
    findOne(id: number): Promise<{
        title: string;
        description: string | null;
        datetime: Date;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    update(id: number, updateAppointmentDto: UpdateAppointmentDto): Promise<{
        title: string;
        description: string | null;
        datetime: Date;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    remove(id: number): Promise<{
        title: string;
        description: string | null;
        datetime: Date;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
}
