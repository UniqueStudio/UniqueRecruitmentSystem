import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, Index } from 'typeorm';

import { ICommonEntity } from '@uniqs/config';

export abstract class CommonEntity extends BaseEntity implements ICommonEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn({ type: 'timestamptz', select: true, update: false })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamptz', select: true })
    @Index()
    updatedAt!: Date;
}
