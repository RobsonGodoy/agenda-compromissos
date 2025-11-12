import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let prisma: PrismaService;

  const mockAppointment = {
    id: 1,
    title: 'Reunião de equipe',
    description: 'Discutir projeto',
    datetime: new Date('2025-11-15T10:00:00'),
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    appointment: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new appointment', async () => {
      const createDto: CreateAppointmentDto = {
        title: 'Reunião de equipe',
        description: 'Discutir projeto',
        datetime: '2025-11-15T10:00:00',
      };

      mockPrismaService.appointment.create.mockResolvedValue(mockAppointment);

      const result = await service.create(createDto);

      expect(result).toEqual(mockAppointment);
      expect(prisma.appointment.create).toHaveBeenCalledWith({
        data: {
          title: createDto.title,
          description: createDto.description,
          datetime: new Date(createDto.datetime),
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return only active appointments', async () => {
      const appointments = [mockAppointment];
      mockPrismaService.appointment.findMany.mockResolvedValue(appointments);

      const result = await service.findAll();

      expect(result).toEqual(appointments);
      expect(prisma.appointment.findMany).toHaveBeenCalledWith({
        where: { active: true },
        orderBy: { datetime: 'asc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return an appointment by id', async () => {
      mockPrismaService.appointment.findFirst.mockResolvedValue(mockAppointment);

      const result = await service.findOne(1);

      expect(result).toEqual(mockAppointment);
      expect(prisma.appointment.findFirst).toHaveBeenCalledWith({
        where: { id: 1, active: true },
      });
    });

    it('should throw NotFoundException when appointment not found', async () => {
      mockPrismaService.appointment.findFirst.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an appointment', async () => {
      const updateDto: UpdateAppointmentDto = {
        title: 'Reunião atualizada',
      };

      const updatedAppointment = { ...mockAppointment, ...updateDto };

      mockPrismaService.appointment.findFirst.mockResolvedValue(mockAppointment);
      mockPrismaService.appointment.update.mockResolvedValue(updatedAppointment);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(updatedAppointment);
      expect(prisma.appointment.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { title: updateDto.title },
      });
    });

    it('should throw NotFoundException when updating non-existent appointment', async () => {
      mockPrismaService.appointment.findFirst.mockResolvedValue(null);

      await expect(service.update(999, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft delete an appointment', async () => {
      const deletedAppointment = { ...mockAppointment, active: false };

      mockPrismaService.appointment.findFirst.mockResolvedValue(mockAppointment);
      mockPrismaService.appointment.update.mockResolvedValue(deletedAppointment);

      const result = await service.remove(1);

      expect(result).toEqual(deletedAppointment);
      expect(prisma.appointment.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { active: false },
      });
    });

    it('should throw NotFoundException when deleting non-existent appointment', async () => {
      mockPrismaService.appointment.findFirst.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});

