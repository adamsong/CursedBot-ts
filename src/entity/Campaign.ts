/* istanbul ignore file */
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm'

@Entity()
export class Campaign {

    @PrimaryGeneratedColumn()
    id!: string

    @Column({unique: true})
    name!: string

    @Column()
    active!: boolean

}
