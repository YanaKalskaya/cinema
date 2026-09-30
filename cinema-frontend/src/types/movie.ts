export const AGE_RATINGS = ["0+", "6+", "12+", "16+", "18+"] as const;

export const HALLS = ["Зал 1", "Зал 2", "Зал 3"] as const;

export type AgeRating = (typeof AGE_RATINGS)[number];

export interface MovieSession {
    id: number;
    showAt: string;
    hall: string;
    price: number;
}

export interface MovieCard {
    id: number;
    title: string;
    genre: string;
    ageRating: AgeRating;
    durationMin: number;
    posterUrl: string | null;
    nearestShowAt: string | null;
    sessionsCount: number;
}

export interface Movie {
    id: number;
    title: string;
    description: string | null;
    genre: string;
    ageRating: AgeRating;
    durationMin: number;
    posterUrl: string | null;
    createdAt: string;
    sessions: MovieSession[];
}

export interface SessionCreateRequest {
    showAt: string;
    hall: string;
    price: number | null;
}

export interface MovieCreateRequest {
    title: string;
    description: string;
    genre: string;
    durationMin: number | null;
    ageRating: string;
    posterUrl: string;
    sessions: SessionCreateRequest[];
}

export interface ApiError {
    status?: number;
    message: string;
    fieldErrors: Record<string, string>;
}
