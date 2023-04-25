import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'acct_group'
})
export class AcctGroup { 
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;
}