import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class CommonEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn({ select: false, update: false })
    createdAt!: Date;

    @UpdateDateColumn({ select: false })
    updatedAt!: Date;
}
