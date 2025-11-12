"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AppointmentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AppointmentsService = AppointmentsService_1 = class AppointmentsService {
    prisma;
    logger = new common_1.Logger(AppointmentsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createAppointmentDto) {
        this.logger.log(`Creating appointment: ${createAppointmentDto.title}`);
        try {
            const appointment = await this.prisma.appointment.create({
                data: {
                    title: createAppointmentDto.title,
                    description: createAppointmentDto.description,
                    datetime: new Date(createAppointmentDto.datetime),
                },
            });
            this.logger.log(`Appointment created successfully with ID: ${appointment.id}`);
            return appointment;
        }
        catch (error) {
            this.logger.error(`Failed to create appointment: ${error.message}`, error.stack);
            throw error;
        }
    }
    async findAll() {
        this.logger.log('Fetching all active appointments');
        try {
            const appointments = await this.prisma.appointment.findMany({
                where: {
                    active: true,
                },
                orderBy: {
                    datetime: 'asc',
                },
            });
            this.logger.log(`Found ${appointments.length} active appointments`);
            return appointments;
        }
        catch (error) {
            this.logger.error(`Failed to fetch appointments: ${error.message}`, error.stack);
            throw error;
        }
    }
    async findOne(id) {
        this.logger.log(`Fetching appointment with ID: ${id}`);
        const appointment = await this.prisma.appointment.findFirst({
            where: {
                id,
                active: true,
            },
        });
        if (!appointment) {
            this.logger.warn(`Appointment with ID ${id} not found or inactive`);
            throw new common_1.NotFoundException(`Compromisso com ID ${id} não encontrado`);
        }
        this.logger.log(`Appointment found: ${appointment.title}`);
        return appointment;
    }
    async update(id, updateAppointmentDto) {
        this.logger.log(`Updating appointment ID: ${id}`);
        await this.findOne(id);
        try {
            const updated = await this.prisma.appointment.update({
                where: { id },
                data: {
                    ...(updateAppointmentDto.title && { title: updateAppointmentDto.title }),
                    ...(updateAppointmentDto.description !== undefined && {
                        description: updateAppointmentDto.description,
                    }),
                    ...(updateAppointmentDto.datetime && {
                        datetime: new Date(updateAppointmentDto.datetime),
                    }),
                },
            });
            this.logger.log(`Appointment ${id} updated successfully`);
            return updated;
        }
        catch (error) {
            this.logger.error(`Failed to update appointment ${id}: ${error.message}`, error.stack);
            throw error;
        }
    }
    async remove(id) {
        this.logger.log(`Soft deleting appointment ID: ${id}`);
        await this.findOne(id);
        try {
            const deleted = await this.prisma.appointment.update({
                where: { id },
                data: {
                    active: false,
                },
            });
            this.logger.log(`Appointment ${id} soft deleted successfully`);
            return deleted;
        }
        catch (error) {
            this.logger.error(`Failed to delete appointment ${id}: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = AppointmentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map