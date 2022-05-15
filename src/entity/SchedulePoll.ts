/* istanbul ignore file */
import {Entity, Column, PrimaryColumn, OneToMany} from "typeorm"
import {PollOption} from "./PollOption";

@Entity()
export class SchedulePoll {

    @PrimaryColumn()
    messageId!: string

    @Column()
    eventName!: string

    @OneToMany(type => PollOption, option => option.schedulePoll, {
        eager: true,
        cascade: true
    })
    options!: PollOption[]

}
