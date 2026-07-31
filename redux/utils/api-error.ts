type ApiErrorBody = {
  detail?: unknown;
  message?: unknown;
  [field: string]: unknown;
};

/** Converts both DRF serializer errors (string arrays) and custom CRM errors
 * (plain strings) into a safe message for the UI. */
export function getApiErrorMessage(error: unknown, fallback = "Ocurrió un error.") {
  const body = (error as { data?: ApiErrorBody })?.data;
  if (!body || typeof body !== "object") return fallback;

  const message = body.detail ?? body.message;
  if (typeof message === "string" && message.trim()) return message;
  if (Array.isArray(message) && typeof message[0] === "string") return message[0];

  for (const value of Object.values(body)) {
    if (typeof value === "string" && value.trim()) return value;
    if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  }
  return fallback;
}
