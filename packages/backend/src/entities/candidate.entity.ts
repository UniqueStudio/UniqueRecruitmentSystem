import { ICandidateEntity } from '@uniqs/config';
import { Entity, OneToMany } from 'typeorm';

import { ApplicationEntity } from '@entities/application.entity';
import { UserEntity } from '@entities/user.entity';

@Entity('candidates')
export class CandidateEntity extends UserEntity implements ICandidateEntity {
    @OneToMany(() => ApplicationEntity, ({ candidate }) => candidate)
    applications!: ApplicationEntity[];
}
