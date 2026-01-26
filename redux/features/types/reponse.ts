type ErrorMessage = {
  detail: string;
};

type SuccessMessage = {
  message: string;
};

export interface ErrorResponse {
  data: ErrorMessage;
  status: number;
}

export interface MessageResponse {
  data: SuccessMessage;
}
