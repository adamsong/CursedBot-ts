import {SchedulePoll} from "./entity/SchedulePoll";
import {AppDataSource} from "./data-source";
import {PollOption} from "./entity/PollOption";

class ScheduleController {
    scheduleRepo = AppDataSource.getRepository(SchedulePoll);

    public addSchedule(messageId: string, eventName: string, options: PollOption[]): void {
        const schedule = new SchedulePoll();
        schedule.messageId = messageId;
        schedule.eventName = eventName;
        schedule.options = options;
        this.scheduleRepo.save(schedule).then();
    }

    public async getSchedule(messageId: string): Promise<SchedulePoll | null> {
        return await this.scheduleRepo.findOne({
            where: {
                messageId: messageId
            }
        });
    }

    public async save (schedule: SchedulePoll): Promise<SchedulePoll> {
        return await this.scheduleRepo.save(schedule);
    }
}
const scheduleController = new ScheduleController();
export default scheduleController;