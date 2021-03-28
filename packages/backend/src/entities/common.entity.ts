import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, Index } from 'typeorm';

export abstract class CommonEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn({ type: 'timestamptz', select: true, update: false })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamptz', select: true })
    @Index()
    updatedAt!: Date;
}
