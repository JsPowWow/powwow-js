import { hasSome, sleep } from '@powwow-js/core';

class JsonError extends Error {
  public static rethrowFrom = (error: unknown): JsonError => {
    const result = new JsonError('Failed to parse JSON response.');
    result.cause = error;
    throw result;
  };
}

class ResponseError extends Error {
  public static assertIsOk(response: Response): asserts response is Omit<Response, 'ok'> & { ok: true } {
    if (!response.ok) {
      const result = new ResponseError(`HTTP error! Status: ${response.status} (${response.statusText})`);

      result.cause = response;
      throw result;
    }
  }
}

class ParseDataError extends Error {
  public static throw = (errorMessage?: string): ParseDataError => {
    throw new ParseDataError(`Parse response data error. \n${errorMessage ?? ''}`);
  };
}

export function validateData<T>(predicat: (data: unknown) => data is T) {
  return function (data: unknown) {
    if (predicat(data)) {
      return data;
    } else {
      throw ParseDataError.throw();
    }
  };
}

const toJSON = async (r: Response): Promise<unknown> => r.json().catch(JsonError.rethrowFrom);

const processResponse = (r: Response) => {
  ResponseError.assertIsOk(r);
  return r;
};

export const baseUrl = 'http://127.0.0.1:3000'; // TODO AR to .env

export function fetchAndValidateData<T>(validator: (data: unknown) => data is T) {
  return (endpoint: string, options?: RequestInit) => {
    return fetch(`${baseUrl}${endpoint}`, options).then(processResponse).then(toJSON).then(validateData(validator));
  };
}

//

export type GarageDataType = {
  name: string;
  color: string;
  id: number;
};

export function isGarageData(data: unknown): data is GarageDataType[] {
  return (
    Array.isArray(data) &&
    data.every(
      (item) =>
        hasSome<object>(item) &&
        'name' in item &&
        'color' in item &&
        typeof item.name === 'string' &&
        typeof item.color === 'string'
    )
  );
}

export function isSingleGarageData(data: unknown): data is GarageDataType {
  return (
    hasSome<object>(data) &&
    'name' in data &&
    'color' in data &&
    typeof data.name === 'string' &&
    typeof data.color === 'string'
  );
}

export const path = {
  garage: '/garage',
  winners: '/winners',
  engine: '/engine',
};

export const getCars = () => sleep(330).then(() => fetchAndValidateData(isGarageData)(path.garage, { method: 'GET' }));
