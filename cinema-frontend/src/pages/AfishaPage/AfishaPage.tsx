import { useEffect, useState } from "react";

import { getMovies, toApiError } from "@/api/moviesApi";
import { MovieCard } from "@/components/MovieCard/MovieCard";
import { StatusBlock } from "@/components/StatusBlock/StatusBlock";
import type { MovieCard as MovieCardData } from "@/types/movie";

import "./AfishaPage.less";

export const AfishaPage = () => {
    const [movies, setMovies] = useState<MovieCardData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getMovies()
            .then(setMovies)
            .catch((cause) => setError(toApiError(cause).message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <StatusBlock title="Загружаем афишу…" />;
    }

    if (error) {
        return <StatusBlock title="Не удалось загрузить афишу" text={error} />;
    }

    if (movies.length === 0) {
        return (
            <StatusBlock
                title="Афиша пуста"
                text="Ни одного фильма ещё не добавлено."
            />
        );
    }

    return (
        <>
            <h1 className="afishaTitle">Афиша</h1>
            <div className="afishaGrid">
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </>
    );
};
