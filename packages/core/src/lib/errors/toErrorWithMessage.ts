import hasStringMessage from '../objects/hasStringMessage';
import isError from '../objects/isError';

export default function toErrorWithMessage(maybeError: unknown): Error {
  if (isError(maybeError)) return maybeError;
  if (hasStringMessage(maybeError)) return new Error(maybeError.message);

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    return new Error(String(maybeError));
  }
}
