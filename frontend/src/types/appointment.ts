export interface Appointment {
  id: number;
  title: string;
  description?: string;
  datetime: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentData {
  title: string;
  description?: string;
  datetime: string;
}

export interface UpdateAppointmentData {
  title?: string;
  description?: string;
  datetime?: string;
}

