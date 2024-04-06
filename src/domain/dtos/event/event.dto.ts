export class EventDto {

  private constructor(
    public readonly name: string,
    public readonly price: number,
    public readonly start: Date,
    public readonly end: Date,
    public activities: number[],
  ) {}


  static body( object: { [key: string]: any } ):[string?, EventDto?] {

    const { name, price, start, end,activities } = object;

    if ( !name ) return ['El nombre es obligatorio'];
    if ( !price ) return ['El precio es obligatorio'];
    if ( !start ) return ['La fecha inicio es obligatorio'];
    if ( !end ) return ['La fecha fin es obligatorio'];
    if ( !activities) return ['Los permisos son obligatorios'];
    // if ( activities.length == 0 ) return ['Debe ver almenos un permiso'];

    return [undefined, new EventDto(name,price,start,end,activities)];
  }
}