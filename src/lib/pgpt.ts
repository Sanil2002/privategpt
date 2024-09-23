import { PrivategptApiClient } from 'privategpt-sdk-web';
const STATIC_URL = 'https://ai.kutana.net/'

export const checkIsPgptHealthy = async (url: string) => {
  const isHealthy = await PrivategptClient.getInstance(url).health.health();
  return isHealthy.status === 'ok';
};

export class PrivategptClient {
  static instance: PrivategptApiClient;

  static getInstance(url?: string) {
    if (!this.instance) {
      this.instance = new PrivategptApiClient({ environment: STATIC_URL });
    }
    if (url) {
      this.instance = new PrivategptApiClient({ environment: url });
    }
    return this.instance;
  }
}
