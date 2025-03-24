export default class ApiRaceService {
  private static instance: ApiRaceService;

  private readonly baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_FETCH_URL;
  }

  public static getInstance(): ApiRaceService {
    if (!ApiRaceService.instance) {
      ApiRaceService.instance = new ApiRaceService();
    }

    return ApiRaceService.instance;
  }

  async engineManager(id: number, status: 'started' | 'stopped' | 'drive') {
    try {
      const response = await fetch(`${this.baseURL}/engine/?id=${id}&status=${status}`, {
        method: 'PATCH',
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
