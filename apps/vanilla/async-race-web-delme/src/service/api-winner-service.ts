import { WinnersData } from '../interfaces/winners';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';
export default class ApiWinnerService {
  private static instance: ApiWinnerService;

  private readonly baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_FETCH_URL;
  }

  public static getInstance(): ApiWinnerService {
    if (!ApiWinnerService.instance) {
      ApiWinnerService.instance = new ApiWinnerService();
    }

    return ApiWinnerService.instance;
  }

  public async managWinners(method: Method, value?: Partial<WinnersData>) {
    try {
      const response = await fetch(`${this.baseURL}/winners/${(method !== 'POST' && value?.id) || ''}`, {
        method,
        headers: { 'Content-type': 'application/json' },
        body: method === 'GET' ? undefined : JSON.stringify(value),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
}
