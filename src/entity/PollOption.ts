/* istanbul ignore file */
import {Column, Entity, ManyToOne, OneToMany, PrimaryColumn} from "typeorm";
import {SchedulePoll} from "./SchedulePoll";
import {PollResponse} from "./PollResponse";

@Entity()
export class PollOption {

    @PrimaryColumn()
    responseId!: string;

    @Column()
    displayName!: string;

    @ManyToOne(type => SchedulePoll, poll => poll.options)
    schedulePoll!: SchedulePoll;

    @OneToMany(type => PollResponse, response => response.pollOption, {
        eager: true,
        cascade: true
    })
    responses!: PollResponse[];
}