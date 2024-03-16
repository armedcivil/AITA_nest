import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraintInterface,
  ValidatorConstraint,
} from 'class-validator';
import { EntitySchema, Equal, Not, ObjectType } from 'typeorm';

export function UniqueIgnore<E>(
  entity: ObjectType<E> | EntitySchema<E>,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'UniqueIgnore',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [entity],
      options: validationOptions,
      validator: UniqueIgnoreConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'UniqueIgnore' })
export class UniqueIgnoreConstraint implements ValidatorConstraintInterface {
  constructor() {}

  async validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const [entity] = validationArguments.constraints;
    const ignoreId = (validationArguments.object as any)['id'];
    const count = await entity.getRepository(entity).count({
      where: {
        [validationArguments.property]: value,
        id: Not(Equal(ignoreId)),
      },
    });
    return count <= 0;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return `${validationArguments.property} has already been taken`;
  }
}
