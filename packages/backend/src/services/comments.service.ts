import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CommentEntity } from '@entities/comment.entity';
import { BasicCRUDService } from '@services/basicCRUD.service';

@Injectable()
export class CommentsService extends BasicCRUDService<CommentEntity> {
    constructor(
        @InjectRepository(CommentEntity) repository: Repository<CommentEntity>,
    ) {
        super(repository);
    }
}
