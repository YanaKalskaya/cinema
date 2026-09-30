import axios from "axios";

import type {
    ApiError,
    Movie,
    MovieCard,
    MovieCreateRequest,
} from "@/types/movie";

const client = axios.create({ baseURL: "/api" });

export const toApiError = (error: unknown): ApiError => {
    if (axios.isAxiosError(error) && error.response) {
        const data = error.response.data as Partial<ApiError> | undefined;
        return {
            status: error.response.status,
            message: data?.message ?? "Сервер вернул ошибку",
            fieldErrors: data?.fieldErrors ?? {},
        };
    }
    return {
        message: "Не удалось связаться с сервером",
        fieldErrors: {},
    };
};

export const getMovies = async (): Promise<MovieCard[]> => {
    const response = await client.get<MovieCard[]>("/movies");
    return response.data;
};

export const getMovie = async (id: number): Promise<Movie> => {
    const response = await client.get<Movie>(`/movies/${id}`);
    return response.data;
};

export const createMovie = async (request: MovieCreateRequest): Promise<Movie> => {
    const response = await client.post<Movie>("/movies", request);
    return response.data;
};

export const updateMovie = async (id: number, request: MovieCreateRequest): Promise<Movie> => {
    const response = await client.put<Movie>(`/movies/${id}`, request);
    return response.data;
};

export const deleteMovie = async (id: number): Promise<void> => {
    await client.delete(`/movies/${id}`);
};
