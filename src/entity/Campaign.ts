/* istanbul ignore file */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Campaign {

    @PrimaryGeneratedColumn()
    id!: string

    @Column({unique: true})
    name!: string

    @Column()
    active!: boolean

}
