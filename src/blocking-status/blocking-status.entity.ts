import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class BlockingStatus {

    @PrimaryColumn()
    id: number;

    @Column()
    blockIsActive: boolean;

    static default(): BlockingStatus {
        return { id: 1, blockIsActive: false };
    }
}