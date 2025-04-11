import { isString, Nullable } from '@powwow-js/core';

export type ValidationResult<T> =
  | {
      success: true;
      value: T;
    }
  | { success: false; errorMessage: string };

const USERNAME_MIN_LENGTH = 4;
const USERNAME_MAX_LENGTH = 12;

export const validateUserNameFormData = (username: Nullable<FormDataEntryValue>): ValidationResult<string> => {
  if (!username) {
    return { success: false, errorMessage: 'Username is required' };
  }
  if (!isString(username)) {
    return { success: false, errorMessage: 'Username should be string' };
  }
  if (username.length < USERNAME_MIN_LENGTH) {
    return { success: false, errorMessage: `Username should be at least ${USERNAME_MIN_LENGTH} characters` };
  }
  if (username.length > USERNAME_MAX_LENGTH) {
    return { success: false, errorMessage: `Username should be no more than ${USERNAME_MAX_LENGTH} characters` };
  }
  return { success: true, value: username };
};

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 12;

export const validateUserPasswordFormData = (password: Nullable<FormDataEntryValue>): ValidationResult<string> => {
  if (!password) {
    return { success: false, errorMessage: 'Password is required' };
  }
  if (!isString(password)) {
    return { success: false, errorMessage: 'Password should be string' };
  }
  if (password.length < USERNAME_MIN_LENGTH) {
    return { success: false, errorMessage: `Password should be at least ${PASSWORD_MIN_LENGTH} characters` };
  }
  if (password.length > USERNAME_MAX_LENGTH) {
    return { success: false, errorMessage: `Password should be no more than ${PASSWORD_MAX_LENGTH} characters` };
  }
  return { success: true, value: password };
};
