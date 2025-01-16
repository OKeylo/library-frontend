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

export interface BooksWithParamsProps {
    sort_field?: string;
    sort_order?: string;
    name_contains?: string;
    filter_field?: string;
    filter_value?: string;
    genre?: string;
    age_limit?: number;
    rating_from?: number;
    rating_to?: number;
    price_from?: number;
    price_to?: number;
    sort_by?: number;
}

export interface UserProps {
    id: number;
    full_name: string;
    phone: string;
    subscription: string;
    sub_level: number;
    subscription_value: number;
    birth_date: Date;
    is_admin: boolean;
}

export interface UserUpdateProps {
    full_name?: string;
    phone?: string;
    password?: string;
    subscription?: string;
    sub_level?: number;
    birth_date?: string;
}

export interface UserDiscountUpdateProps {
    subscription: string;
    sub_level: number;
}

export interface BookProps {
    book_id: number;
    book_name: string;
    book_language: string;
    book_page_number: string;
    book_price: number;
    book_rating: number;
    book_age_limit: number;
    author_full_name: string;
    genre_name: string;
    library_id: number;
    library_address: string;
    library_phone: string;
}

export interface TakeBookProps {
    library_id: number;
    user_id: number;
    book_id: number;
}

export interface TakeUserBooksProps {
    id: number;
    library_id: number;
    user_id: number;
    book_id: number;
}

export interface UserTransactionBookProps {
    id: number;
    issue_date: Date;
    return_date: Date;
    book_id: number;
    book_name: string;
    book_language: string;
    book_page_number: number;
    book_price: number;
    book_rating: number;
    book_age_limit: number;
    author_full_name: string;
    genre_name: string;
    library_id: number;
    library_address: string;
    library_phone: string;
}

export interface BookTransactionsDeleteProps {
    id: number;
    library_id: number;
    book_id: number;
}

export interface DiscountProps {
    subscription: string;
    sub_level: number;
    discount_value: number;
}

export interface GenreProps {
    id: number;
    name: string;
    description: string;
}

export interface GenreAddProps {
    name: string;
    description: string;
}

export interface GenreUpdateProps {
    name?: string;
    description?: string;
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

    async updateUser(user_id: number , data: UserUpdateProps): Promise<number> {
        console.log("daat ", data)
        console.log(JSON.stringify(data))
        try {
            const response = await axios.put(
                `${this.baseURL}/users/${user_id}`,
                JSON.stringify(data),
                {
                    headers: {
                        Authorization: this.token != null && `Bearer ${this.token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getBooksWithParams(params: BooksWithParamsProps): Promise<BookProps[]> {
        const response = await axios.get(
            "http://127.0.0.1:8000/books_with_parameters",
            {
                params: params
            }
        );
        
        return response.data;
    }

    async takeBook(data: TakeBookProps): Promise<number> {
        try {
            const response = await axios.post(
                `${this.baseURL}/book_transactions_user`,
                JSON.stringify(data),
                {
                    headers: {
                        Authorization: this.token != null && `Bearer ${this.token}`,
                        "Content-Type": "application/json" 
                    },
                }
            )
            return response.data
        } catch (error) {
            throw error;
        }
    }

    async getUserBooks(user_id: number): Promise<UserTransactionBookProps[]> {
        try {
            const response = await axios.get(`${this.baseURL}/book_transactions_user/${user_id}`)
            return response.data
        } catch (error) {
            throw error;
        }
    }

    async returnBook(data: BookTransactionsDeleteProps): Promise<number> {
        try {
            const response = await axios.delete(
                `${this.baseURL}/book_transactions_user`,
                {   
                    data: JSON.stringify(data),
                    headers: {
                        Authorization: this.token != null && `Bearer ${this.token}`,
                        "Content-Type": "application/json" 
                    },
                }
            )
            return response.data
        } catch (error) {
            throw error;
        }
    }

    async getDiscounts(): Promise<DiscountProps[]> {
        try {
            const response = await axios.get(`${this.baseURL}/discounts`)
            return response.data
        } catch (error) {
            throw error;
        }
    }

    async updateUserDiscount(user_id: number , data: UserDiscountUpdateProps): Promise<number> {
        console.log("daat ", data)
        console.log(JSON.stringify(data))
        try {
            const response = await axios.put(
                `${this.baseURL}/users/${user_id}`,
                JSON.stringify(data),
                {
                    headers: {
                        Authorization: this.token != null && `Bearer ${this.token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getGenres(): Promise<GenreProps[]> {
        try {
            const response = await axios.get(`${this.baseURL}/genres`)
            return response.data
        } catch (error) {
            throw error;
        }
    }

    async addGenre(data: GenreAddProps): Promise<number> {
        try {
            const response = await axios.post(
                `${this.baseURL}/genres`,
                JSON.stringify(data),
                {
                    headers: {
                        Authorization: this.token != null && `Bearer ${this.token}`,
                        "Content-Type": "application/json" 
                    },
                }
            )
            return response.data
        } catch (error) {
            throw error;
        }
    }

    async updateGenre(id: number , data: GenreUpdateProps): Promise<number> {
        console.log("daat ", data)
        console.log(JSON.stringify(data))
        try {
            const response = await axios.put(
                `${this.baseURL}/genres/${id}`,
                JSON.stringify(data),
                {
                    headers: {
                        Authorization: this.token != null && `Bearer ${this.token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async deleteGenre(id: number): Promise<number> {
        try {
            const response = await axios.delete(
                `${this.baseURL}/genres/${id}`,
                {   
                    data: JSON.stringify(id),
                    headers: {
                        Authorization: this.token != null && `Bearer ${this.token}`,
                        "Content-Type": "application/json"
                    },
                }
            )
            return response.data
        } catch (error) {
            throw error;
        }
    }
}