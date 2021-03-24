import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentEntity } from '@entities/comment.entity';
import { CommentsGateway } from '@gateways/comments.gateway';

@Module({
    imports: [TypeOrmModule.forFeature([CommentEntity])],
    providers: [CommentsGateway],
})
export class CommentsModule {
}
