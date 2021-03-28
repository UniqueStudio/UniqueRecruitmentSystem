import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

/**
 * This pipe convert a string value to a date value.
 * like this:
 *     DefaultValuePipe -> ParseIntPipe -> ParseDatePipe
 */
@Injectable()
export class UpdatedAtPipe implements PipeTransform<string, Date> {
    transform(value: string, metadata: ArgumentMetadata) {
        // defaults to 1970/01/01
        value = value || '0';

        if (!/^\d+$/.test(value)) {
            throw new BadRequestException(`The ${metadata.type} updatedAt should be timestamp`);
        }

        return new Date(+value);
    }
}
