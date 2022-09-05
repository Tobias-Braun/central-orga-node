import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class BlockingStatus {

    
    @PrimaryColumn()
    id: number;
    
    @Column()
    blockIsActive: boolean;
    
    static ON = { id: 1, blockIsActive: true };
    static OFF = { id: 1, blockIsActive: false };
    static default(): BlockingStatus {
        return { id: 1, blockIsActive: false };
    }
}