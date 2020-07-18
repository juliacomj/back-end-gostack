import Appointment from '../models/Appointment';
import { getCustomRepository } from 'typeorm';
import { startOfHour } from 'date-fns';
import AppointmentRepository from '../repository/AppointmentRepository';

interface Request {
    provider_id: string,
    date: Date,
}
/**
 * Dependency Inversion (SOLID)
 */

class CreateAppointmentService {

    public async execute({ provider_id, date }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentRepository);
    const appointmentDate = startOfHour(date);
    const findAppointmentInTheSameDate = await appointmentsRepository.findByDate(appointmentDate);
    if(findAppointmentInTheSameDate){
        throw Error('this appointment is already booked');
    }
    const appointment = appointmentsRepository.create(
        {
            provider_id,
            date: appointmentDate,
        }
        );
    await appointmentsRepository.save(appointment)
    return appointment;
    }

}

export default CreateAppointmentService;
