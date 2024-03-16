import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraintInterface,
  ValidatorConstraint,
} from 'class-validator';
import { EntitySchema, ObjectType } from 'typeorm';

export function Unique<E>(
  entity: ObjectType<E> | EntitySchema<E>,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'Unique',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [entity],
      options: validationOptions,
      validator: UniqueConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'Unique' })
export class UniqueConstraint implements ValidatorConstraintInterface {
  async validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const [entity] = validationArguments.constraints;
    const count = await entity
      .getRepository(entity)
      .count({ where: { [validationArguments.property]: value } });
    return count <= 0;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return `${validationArguments.property} has already been taken`;
  }
}
