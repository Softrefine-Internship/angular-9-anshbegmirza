export class User {
  constructor(
    public firstName: string,
    public lastName: string,
    public email: string,
    public password: string,
    public _token: string,
    public _tokenExpirationDate: string
  ) {}

  get token() {
    if (
      !this._tokenExpirationDate ||
      new Date() > new Date(this._tokenExpirationDate)
    ) {
      return null;
    }
    return this._token;
  }
}
