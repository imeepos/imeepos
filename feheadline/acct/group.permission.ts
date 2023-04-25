import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({
    name: 'acct_group_permission',
})
export class AcctGroupPermission { 

    @Column()
    group_id!: number;

    @Column()
    permission!: string;
}
