import axios, { AxiosInstance } from 'axios';

import { USE_REFRESH_TOKEN } from '../../config';
import { validateCookieExpiration } from '../../utils/cookie';
import { BaseRestfulService } from '../baseRestfulService';

export class AuthService extends BaseRestfulService {
  private static _instance: AuthService;
  private _authCookie = USE_REFRESH_TOKEN
    ? `refresh=${String(process.env.REFRESH_TOKEN)}`
    : `access=${String(process.env.STS_JWT)}`;

  constructor(private _client: AxiosInstance) {
    super();
  }

  static async createClientWithAuthCookie(baseUrl: string) {
    const authService = await AuthService.getInstance();
    const authCookie = await authService.getAuthCookie();
    const client = axios.create({
      baseURL: baseUrl,
      headers: {
        Cookie: authCookie,
      },
    });

    if (USE_REFRESH_TOKEN) {
      // Validate cookie before every API request, and then refresh token if the cookie was exprited.
      client.interceptors.request.use(async (config) => {
        if (authService.validateCurrentAuthCookie()) return config;
        await authService.doRefreshToken();
        const newAuthCookie = await authService.getAuthCookie();
        config.headers = {
          Cookie: newAuthCookie,
        };
        return config;
      });
    }

    return client;
  }

  public static async getInstance() {
    if (this._instance) return this._instance;
    this._instance = new AuthService(
      axios.create({
        baseURL: process.env.AUTH_SERVICE_URL,
      })
    );
    if (USE_REFRESH_TOKEN) {
      await this._instance.doRefreshToken();
    }
    return this._instance;
  }

  getAuthCookie(): string {
    return this._authCookie;
  }

  validateCurrentAuthCookie() {
    return this.validateAuthCookie(this._authCookie);
  }

  validateAuthCookie(cookie: string) {
    return cookie.includes(`access`) && validateCookieExpiration(cookie);
  }

  async doRefreshToken() {
    const result = await this._client.get(`/refresh`, {
      headers: {
        Cookie: this._authCookie,
      },
    });
    const newCookie = result.headers['set-cookie']?.join(`; `) || ``;
    if (this.validateAuthCookie(newCookie)) {
      this._authCookie = newCookie;
    }
  }
}
