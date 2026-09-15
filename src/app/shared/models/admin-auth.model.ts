export interface AdminSignInCredentials {
  readonly email: string;
  readonly password: string;
}

export interface AdminSession {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly email: string;
  readonly expiresAt: string;
}
