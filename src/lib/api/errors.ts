export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, message: string, code = "API_ERROR") {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export function getUserFacingMessage(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400:
        return "Please check your request and try again.";
      case 401:
        return "You need to sign in to continue.";
      case 404:
        return "We could not find what you were looking for.";
      case 500:
        return "Something went wrong on our side. Please try again.";
      default:
        return "Unable to complete this request right now.";
    }
  }

  if (error instanceof TypeError) {
    return "Network problem. Check your connection and try again.";
  }

  return "Something went wrong. Please try again.";
}

export function toErrorResponse(error: unknown): {
  status: number;
  body: { error: string; code: string };
} {
  if (error instanceof ApiError) {
    return {
      status: error.status,
      body: {
        error: getUserFacingMessage(error),
        code: error.code,
      },
    };
  }

  return {
    status: 500,
    body: {
      error: "Something went wrong on our side. Please try again.",
      code: "INTERNAL_ERROR",
    },
  };
}
