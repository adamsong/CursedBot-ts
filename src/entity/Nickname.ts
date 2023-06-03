/* istanbul ignore file */
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { Campaign } from './Campaign';

@Entity()
@Unique(["user", "campaign"])
export class Nickname {

    @PrimaryGeneratedColumn()
    id!: string

    @Column()
    user!: string

    @Column()
    nickname!: string

    @ManyToOne(type => Campaign, { nullable: true, onDelete: 'CASCADE' })
    campaign!: Campaign | null

}
