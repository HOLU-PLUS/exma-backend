export class CustomSuccessful {
  constructor(public readonly statusCode: number, public readonly message: string, public readonly result: Object) {}

  static response({ statusCode = 0, message = '', result = {} }: { statusCode?: number; message?: string; result?: Object }) {
    return { statusCode, message, ...result };
  }
}
