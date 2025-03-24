import { CarData } from '../interfaces/cars';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface QuerryData {
  method: Method;
  value?: Partial<CarData>;
  page?: number;
  limit?: number;
}
export default class ApiCarService {
  private static instance: ApiCarService;

  private readonly baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_FETCH_URL;
  }

  public static getInstance(): ApiCarService {
    if (!ApiCarService.instance) {
      ApiCarService.instance = new ApiCarService();
    }

    return ApiCarService.instance;
  }

  public async manageCars({ method, value, page, limit }: QuerryData) {
    try {
      const response = await fetch(
        `${this.baseURL}/garage/${value?.id || ''}${limit ? '?_limit=7' : ''}${
          page ? '&_page='.concat(String(page)) : ''
        }`,
        {
          method,
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify(value),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return { response: result, header: response.headers };
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
}
