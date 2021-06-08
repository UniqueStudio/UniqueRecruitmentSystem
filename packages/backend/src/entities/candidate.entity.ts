import { Entity, OneToMany } from 'typeorm';

import { ApplicationEntity } from '@entities/application.entity';
import { UserEntity } from '@entities/user.entity';

@Entity('candidates')
export class CandidateEntity extends UserEntity {
    @OneToMany(() => ApplicationEntity, ({ candidate }) => candidate)
    applications!: ApplicationEntity[];
}
