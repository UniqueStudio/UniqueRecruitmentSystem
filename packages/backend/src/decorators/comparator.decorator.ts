import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

export const GreaterThan = <T extends Object>(prop: keyof T, options?: ValidationOptions) => {
    return (object: T, propertyName: string) =>
        registerDecorator({
            target: object.constructor,
            propertyName,
            options,
            constraints: [prop],
            validator: GreaterThanConstraint,
        });
};

@ValidatorConstraint({ name: 'GreaterThan' })
class GreaterThanConstraint<T> implements ValidatorConstraintInterface {
    validate(value: T, { constraints, object }: ValidationArguments) {
        return value > object[constraints[0] as string];
    }
}

export const LessThan = <T extends Object>(prop: keyof T, options?: ValidationOptions) => {
    return (object: T, propertyName: string) =>
        registerDecorator({
            target: object.constructor,
            propertyName,
            options,
            constraints: [prop],
            validator: LessThanConstraint,
        });
};

@ValidatorConstraint({ name: 'LessThan' })
class LessThanConstraint<T> implements ValidatorConstraintInterface {
    validate(value: T, { constraints, object }: ValidationArguments) {
        return value < object[constraints[0] as string];
    }
}
