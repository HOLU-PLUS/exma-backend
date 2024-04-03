import { UserDto } from "./user.dto";

export class GuestDto extends UserDto {
  public readonly codeQr: string;

  constructor(
    codeQr: string,
    userDto: UserDto
  ) {
    super(userDto.name, userDto.lastName, userDto.email);
    this.codeQr = codeQr;
  }

  static body(object: { [key: string]: any }): [string?, GuestDto?] {
    const { codeQr, ...userData } = object;

    if (!codeQr) return ['El código de estudiante es obligatorio'];

    const [error, userDto] = UserDto.body(userData);
    if (error) return [error];

    return [undefined, new GuestDto(codeQr, userDto!)];
  }
}
