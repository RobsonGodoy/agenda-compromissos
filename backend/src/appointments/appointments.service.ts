import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  private readonly logger = new Logger(AppointmentsService.name);

  constructor(private prisma: PrismaService) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
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
    } catch (error) {
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
    } catch (error) {
      this.logger.error(`Failed to fetch appointments: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number) {
    this.logger.log(`Fetching appointment with ID: ${id}`);
    
    const appointment = await this.prisma.appointment.findFirst({
      where: {
        id,
        active: true,
      },
    });

    if (!appointment) {
      this.logger.warn(`Appointment with ID ${id} not found or inactive`);
      throw new NotFoundException(`Compromisso com ID ${id} não encontrado`);
    }

    this.logger.log(`Appointment found: ${appointment.title}`);
    return appointment;
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    this.logger.log(`Updating appointment ID: ${id}`);
    
    await this.findOne(id); // Verifica se existe e está ativo

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
    } catch (error) {
      this.logger.error(`Failed to update appointment ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number) {
    this.logger.log(`Soft deleting appointment ID: ${id}`);
    
    await this.findOne(id); // Verifica se existe e está ativo

    try {
      // Soft delete - apenas marca como inativo
      const deleted = await this.prisma.appointment.update({
        where: { id },
        data: {
          active: false,
        },
      });
      
      this.logger.log(`Appointment ${id} soft deleted successfully`);
      return deleted;
    } catch (error) {
      this.logger.error(`Failed to delete appointment ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}

