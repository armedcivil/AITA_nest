import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraintInterface,
  ValidatorConstraint,
} from 'class-validator';

export function Pair(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'Pair',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: PairConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'Pair' })
export class PairConstraint implements ValidatorConstraintInterface {
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): boolean | Promise<boolean> {
    const [relatedPropertyName] = validationArguments.constraints;
    const relatedValue = (validationArguments.object as any)[
      relatedPropertyName
    ];
    return relatedValue !== undefined;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    const [relatedPropertyName] = validationArguments.constraints;
    return `${validationArguments.property} require ${relatedPropertyName}.`;
  }
}
