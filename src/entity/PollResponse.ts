import {Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {PollOption} from "./PollOption";

@Entity()
export class PollResponse {
    @ManyToOne(type => PollOption, pollOption => pollOption.responses)
    pollOption!: PollOption;

    @Column()
    userId!: string;

    @PrimaryGeneratedColumn()
    id!: number;

}