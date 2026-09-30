import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getMovie, toApiError, updateMovie } from "@/api/moviesApi";
import { MovieForm } from "@/components/MovieForm/MovieForm";
import { EMPTY_SESSION } from "@/components/SessionFields/SessionFields";
import { StatusBlock } from "@/components/StatusBlock/StatusBlock";
import type { ApiError, Movie, MovieCreateRequest } from "@/types/movie";

import "./MovieEditPage.less";

// Прошедшие сеансы сервер хранит как историю — в форму попадают только предстоящие
const toForm = (movie: Movie): MovieCreateRequest => {
    const now = new Date();
    const upcoming = movie.sessions
        .filter((session) => new Date(session.showAt) > now)
        .map((session) => ({
            // "2026-10-01T15:00:00" → "2026-10-01T15:00" для input datetime-local
            showAt: session.showAt.slice(0, 16),
            hall: session.hall,
            price: session.price,
        }));

    return {
        ...movie,
        description: movie.description ?? "",
        posterUrl: movie.posterUrl ?? "",
        sessions: upcoming.length > 0 ? upcoming : [EMPTY_SESSION],
    };
};

export const MovieEditPage = () => {
    const { id } = useParams();
    const movieId = Number(id);
    const [form, setForm] = useState<MovieCreateRequest | null>(null);
    const [error, setError] = useState<ApiError | null>(null);

    useEffect(() => {
        setForm(null);
        setError(null);

        getMovie(movieId)
            .then((movie) => setForm(toForm(movie)))
            .catch((cause) => setError(toApiError(cause)));
    }, [movieId]);

    if (error) {
        return (
            <>
                <StatusBlock title="Не удалось открыть фильм" text={error.message} />
                <p className="movieEditBack">
                    <Link to="/">Назад к афише</Link>
                </p>
            </>
        );
    }

    if (!form) {
        return <StatusBlock title="Загружаем фильм…" />;
    }

    return (
        <>
            <p className="movieEditBack">
                <Link to={`/movies/${movieId}`}>Назад к фильму</Link>
            </p>
            <MovieForm
                title="Редактировать фильм"
                initialForm={form}
                submitLabel="Сохранить"
                sendingLabel="Сохраняем…"
                onSubmit={(request) => updateMovie(movieId, request)}
            />
        </>
    );
};
