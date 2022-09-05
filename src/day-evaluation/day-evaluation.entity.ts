import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class DayEvaluation {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: "date" })
    dateString: string;

    @Column()
    numberOfUncompletedTasks: number;

    @Column()
    shouldActivateBlocking: boolean;

    @Column()
    blockTime: number;
}