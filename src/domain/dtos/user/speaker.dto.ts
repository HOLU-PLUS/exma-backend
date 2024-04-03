import { UserDto } from "./user.dto";

export class SpeakerDto extends UserDto {
  public readonly ci: string;

  constructor(
    ci: string,
    userDto: UserDto
  ) {
    super(userDto.name, userDto.lastName, userDto.email);
    this.ci = ci;
  }

  static body(object: { [key: string]: any }): [string?, SpeakerDto?] {
    const { ci, ...userData } = object;

    if (!ci) return ['La cédula de identidad es obligatorio'];

    const [error, userDto] = UserDto.body(userData);
    if (error) return [error];

    return [undefined, new SpeakerDto(ci, userDto!)];
  }
}
