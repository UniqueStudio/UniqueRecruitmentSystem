import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentEntity } from '@entities/comment.entity';
import { CommentsGateway } from '@gateways/comments.gateway';
import { AuthModule } from '@modules/auth.module';
import { CandidatesModule } from '@modules/candidates.module';
import { CommentsService } from '@services/comments.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([CommentEntity]),
        AuthModule,
        CandidatesModule,
    ],
    providers: [CommentsService, CommentsGateway],
    exports: [CommentsService, CommentsGateway],
})
export class CommentsModule {
}
