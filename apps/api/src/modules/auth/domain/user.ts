class User {
  constructor(
    public readonly id: string,
    public email: string,
    public passwordHash: string | null,
    public googleId: string | null,
  ) {}

  assingGoogleId(id: string) {
    this.googleId = id;
  }
}

export { User };
