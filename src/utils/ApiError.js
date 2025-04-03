class ApiError {
  constructor(statusCode, message = "false") {
    (this.statusCode = statusCode), (this.message = message);
  }
}

export { ApiError };
