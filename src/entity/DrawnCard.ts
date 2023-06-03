/* istanbul ignore file */
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Campaign } from './Campaign';

@Entity()
export class DrawnCard {

    @PrimaryGeneratedColumn()
    id!: string

    @Column()
    cardId!: string

    @Column()
    holder!: string

    @Column({ type: "datetime", default: null })
    usedAt!: Date

    @CreateDateColumn()
    drawnAt!: Date

    @ManyToOne(type => Campaign, { onDelete: "CASCADE" })
    campaign!: Campaign

}
