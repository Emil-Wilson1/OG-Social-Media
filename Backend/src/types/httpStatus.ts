export enum HttpStatusCode {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
    FORBIDDEN = 403,
    CONFLICT = 409,
    NO_CONTENT = 204,
  }


  export enum ErrorCodes {
    FORBIDDEN = 'FORBIDDEN',
    NOT_FOUND = 'NOT_FOUND',
    AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
    TOKEN_EXPIRED = 'TOKEN_EXPIRED',
    INVALID_TOKEN = 'INVALID_TOKEN',
    NO_TOKEN = 'NO_TOKEN',
    NO_REFRESH_TOKEN = 'NO_REFRESH_TOKEN',
  }
  
  export enum ErrorMessages {
    USER_BLOCKED = 'User has been blocked',
    USER_NOT_FOUND = 'User not found',
    USER_NOT_AUTHORIZED = 'User not authorized',
    TOKEN_EXPIRED = 'Token has expired',
    INVALID_TOKEN = 'Invalid token',
    NO_TOKEN_PROVIDED = 'No token provided',
    NO_REFRESH_TOKEN_PROVIDED = 'No refresh token provided',
  }


