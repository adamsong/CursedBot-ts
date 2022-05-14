import {Entity, Column, PrimaryColumn} from "typeorm"

@Entity()
export class SchedulePoll {

    @PrimaryColumn()
    messageId!: string

    @Column()
    eventName!: string

}
