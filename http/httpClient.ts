import axios, { AxiosError, AxiosResponse } from "axios";

interface LoginProps {
    phone: string;
    password: string;
}

interface RegisterProps {
    full_name: string;
    phone: string;
    password: string;
    birth_date: string;
}

interface AccessToken {
    access_token: string;
}

export interface UserProps {
    id: number;
    full_name: string;
    phone: string;
    subscription?: string;
    sub_level?: number;
    birth_date: Date;
    is_admin: boolean;
}

export class HttpClient {
    token: string | null = null;
    baseURL: string = "http://127.0.0.1:8000";

    async register(data: RegisterProps): Promise<AccessToken> {
        try {
            const response = await axios.post(
                `${this.baseURL}/user/signup`,
                JSON.stringify(data),
                {
                    headers: { "Content-Type": "application/json" },
                }
            )
            return response.data
        } catch (error) {
            throw error;
        }
    }

    async login(data: LoginProps): Promise<AccessToken> {
        try {
            const response = await axios.post(
                `${this.baseURL}/user/login`,
                JSON.stringify(data),
                {
                    headers: { "Content-Type": "application/json" },
                }
            )
            return response.data
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser(): Promise<UserProps> {
        try {
            const response = await axios.get(
                `${this.baseURL}/user/me`,
                {
                    headers: {
                        Authorization: this.token != null && `Bearer ${this.token}`,
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
      }
}