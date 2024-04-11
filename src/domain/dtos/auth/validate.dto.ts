export class ValidateUserDto {
  private constructor(public code: string) {}

  static create(object: { [key: string]: any }): [string?, ValidateUserDto?] {
    const { code } = object;

    if (!code) return ['El código es obligatorio'];

    return [undefined, new ValidateUserDto(code)];
  }
}
