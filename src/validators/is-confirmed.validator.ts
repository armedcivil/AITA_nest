import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function IsConfirmed(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsConfirmed',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: IsConfirmedConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsConfirmed' })
export class IsConfirmedConstraint implements ValidatorConstraintInterface {
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): boolean | Promise<boolean> {
    const [relatedPropertyName] = validationArguments.constraints;
    const relatedValue = (validationArguments.object as any)[
      relatedPropertyName
    ];
    return value === relatedValue;
  }

  defaultMessage?(validationArguments?: ValidationArguments): string {
    const [relatedPropertyName] = validationArguments.constraints;
    return `${relatedPropertyName} and ${validationArguments.property} does not match.`;
  }
}
