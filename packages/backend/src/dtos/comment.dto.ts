import { IsString, IsUUID, ValidateNested } from 'class-validator';

import { CommentEntity } from '@entities/comment.entity';

export class AddCommentBody {
    @IsUUID()
    cid!: string;

    @ValidateNested()
    comment!: CommentEntity;

    @IsString()
    token!: string;
}

export class RemoveCommentBody {
    @IsUUID()
    id!: string;

    @IsString()
    token!: string;
}
