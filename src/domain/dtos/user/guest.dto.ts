import { UserDto } from './user.dto';

export class GuestDto extends UserDto {
  constructor(userDto: UserDto) {
    super(userDto.name, userDto.lastName, userDto.email);
  }

  static body(object: { [key: string]: any }): [string?, GuestDto?] {
    const { codeQr, ...userData } = object;

    const [error, userDto] = UserDto.body(userData);
    if (error) return [error];

    return [undefined, new GuestDto(userDto!)];
  }
}
