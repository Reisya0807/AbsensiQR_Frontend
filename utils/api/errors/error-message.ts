const STATUS_MESSAGES: Record<number, string> = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  500: "Internal Server Error",
};

function getStatusMessage(status: number, messages: Record<number,string>={}): string {
  return messages[status] ??STATUS_MESSAGES[status] ?? "Unknown Error";
}
export {getStatusMessage}