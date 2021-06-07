import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentEntity } from '@entities/comment.entity';
import { CommentsGateway } from '@gateways/comments.gateway';
import { ApplicationsModule } from '@modules/applications.module';
import { AuthModule } from '@modules/auth.module';
import { CommentsService } from '@services/comments.service';

@Module({
    imports: [TypeOrmModule.forFeature([CommentEntity]), AuthModule, ApplicationsModule],
    providers: [CommentsService, CommentsGateway],
    exports: [CommentsService, CommentsGateway],
})
export class CommentsModule {}
