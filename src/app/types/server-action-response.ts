/**
 * A generic response type for server actions.
 * @template T The type of the data returned on a successful action.
 */
export interface ServerActionResponse<T> {
  // A boolean indicating whether the action was successful.
  success: boolean;

  // A human-readable message to provide feedback to the user.
  message: string;

  // The data payload, available only on success.
  data?: T;

  // An optional object for handling specific validation or server errors.
  errors?: {
    [key: string]: string | string[];
  };
}
