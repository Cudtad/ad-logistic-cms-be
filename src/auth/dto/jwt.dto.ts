export interface JwtDto {
  id: number; // user id

  /**
   * Issued at
   */
  iat: number;
  /**
   * Expiration time
   */
  exp: number;
}
