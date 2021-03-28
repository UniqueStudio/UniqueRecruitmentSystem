import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, Index } from 'typeorm';

export abstract class CommonEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn({ type: 'timestamp with time zone', select: true, update: false })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone', select: true })
    @Index()
    updatedAt!: Date;
}
