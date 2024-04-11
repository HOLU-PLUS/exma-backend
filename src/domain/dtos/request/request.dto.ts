export class RequestDto {
  private constructor(public readonly availabilityId: number) {}

  static body(object: { [key: string]: any }): [string?, RequestDto?] {
    const { availabilityId } = object;

    if (!availabilityId) return ['El id de disponibilidad es necesario'];

    return [undefined, new RequestDto(availabilityId)];
  }
}
