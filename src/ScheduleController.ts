import {knexInstance} from "./db/knex";

export interface Schedule {
    messageId: string;
    eventName: string;
}

class ScheduleController {
    schedules: { [messageId: string]: Schedule } = {};

    public addSchedule(messageId: string, eventName: string): void {
        const schedule: Schedule = {
            messageId: messageId,
            eventName: eventName
        };
        // this.schedules[messageId] = schedule;
        knexInstance<Schedule>('schedules').insert(schedule).then();
    }

    public async getSchedule(messageId: string): Promise<Schedule> {
        if(!this.schedules[messageId]) {
            this.schedules[messageId] = await knexInstance<Schedule>('schedules').from('schedules').where({messageId: messageId}).first();
        }
        return this.schedules[messageId];
    }
}
const scheduleController = new ScheduleController();
export default scheduleController;