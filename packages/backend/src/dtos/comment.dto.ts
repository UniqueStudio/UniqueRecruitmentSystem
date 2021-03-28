import { IsString, IsUUID, ValidateNested } from 'class-validator';

import { CommentEntity } from '@entities/comment.entity';

export class AddCommentBody {
    @IsUUID(4)
    cid!: string;

    @ValidateNested()
    comment!: CommentEntity;

    @IsString()
    token!: string;
}

export class RemoveCommentBody {
    @IsUUID(4)
    id!: string;

    @IsString()
    token!: string;
}
