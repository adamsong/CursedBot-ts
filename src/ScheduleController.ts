import {SchedulePoll} from "./entity/SchedulePoll";
import {AppDataSource} from "./data-source";

export interface Schedule {
    messageId: string;
    eventName: string;
}

class ScheduleController {
    scheduleRepo = AppDataSource.getRepository(SchedulePoll);
    schedules: { [messageId: string]: Schedule } = {};

    public addSchedule(messageId: string, eventName: string): void {
        const schedule = new SchedulePoll();
        schedule.messageId = messageId;
        schedule.eventName = eventName;
        this.scheduleRepo.save(schedule).then();
        // this.schedules[messageId] = schedule;
    }

    public async getSchedule(messageId: string): Promise<Schedule | null> {
        if(!this.schedules[messageId]) {
            const schedule = await this.scheduleRepo.findOneBy({messageId});
            if(!schedule) {
                return null;
            }
            this.schedules[messageId] = schedule;
        }
        return this.schedules[messageId];
    }
}
const scheduleController = new ScheduleController();
export default scheduleController;