export class GetUserQuery {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}
