import type { ContentfulStatusCode } from "hono/utils/http-status";

export class HTTPError extends Error {
  status: ContentfulStatusCode;

  constructor(message: string, status: ContentfulStatusCode) {
    super(message);
    this.status = status;
  }
}

export class BadRequestError extends HTTPError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class NotFoundError extends HTTPError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class UnauthorizedError extends HTTPError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export class InternalServerError extends HTTPError {
  constructor(message = "Internal Server Error") {
    super(message, 500);
  }
}
