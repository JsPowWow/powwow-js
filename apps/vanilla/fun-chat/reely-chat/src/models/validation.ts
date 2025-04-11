import { Nullable } from '@powwow-js/core';

export type ValidationResult =
  | {
      success: true;
    }
  | { success: false; errorMessage: string };

export const SUCCESS = Object.freeze({
  success: true,
});

const USERNAME_MIN_LENGTH = 4;
const USERNAME_MAX_LENGTH = 12;

export const validateUserNameFormData = (username: Nullable<FormDataEntryValue>): ValidationResult => {
  if (!username) {
    return { success: false, errorMessage: 'Username is required' };
  }
  if (username.length < USERNAME_MIN_LENGTH) {
    return { success: false, errorMessage: `Username should be at least ${USERNAME_MIN_LENGTH} characters` };
  }
  if (username.length > USERNAME_MAX_LENGTH) {
    return { success: false, errorMessage: `Username should be no more than ${USERNAME_MAX_LENGTH} characters` };
  }
  return SUCCESS;
};

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 12;

export const validateUserPasswordFormData = (password: Nullable<FormDataEntryValue>): ValidationResult => {
  if (!password) {
    return { success: false, errorMessage: 'Password is required' };
  }
  if (password.length < USERNAME_MIN_LENGTH) {
    return { success: false, errorMessage: `Password should be at least ${PASSWORD_MIN_LENGTH} characters` };
  }
  if (password.length > USERNAME_MAX_LENGTH) {
    return { success: false, errorMessage: `Password should be no more than ${PASSWORD_MAX_LENGTH} characters` };
  }
  return SUCCESS;
};
