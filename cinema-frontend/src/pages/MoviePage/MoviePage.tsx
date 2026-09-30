import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { deleteMovie, getMovie, toApiError } from "@/api/moviesApi";
import { StatusBlock } from "@/components/StatusBlock/StatusBlock";
import { formatDuration, formatPrice, formatShowAt } from "@/helpers/format";
import type { ApiError, Movie, MovieSession } from "@/types/movie";

import "./MoviePage.less";

// 400 — id не число, 404 — фильма нет; остальное — сбой сети или сервера
const errorTitle = (error: ApiError | null) =>
    error?.status === 400 || error?.status === 404
        ? "Фильм не найден"
        : "Не удалось загрузить фильм";

const SessionList = ({ sessions }: { sessions: MovieSession[] }) => (
    <ul className="movieSessionsList">
        {sessions.map((session) => (
            <li key={session.id} className="movieSession">
                <span className="movieSessionTime">{formatShowAt(session.showAt)}</span>
                <span className="movieMeta">{session.hall}</span>
                <span className="movieSessionPrice">{formatPrice(session.price)}</span>
            </li>
        ))}
    </ul>
);

export const MoviePage = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<ApiError | null>(null);
    const [posterFailed, setPosterFailed] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        setError(null);

        getMovie(Number(id))
            .then(setMovie)
            .catch((cause) => setError(toApiError(cause)))
            .finally(() => setLoading(false));
    }, [id]);

    const handleDelete = async () => {
        if (!movie || !window.confirm(`Удалить фильм «${movie.title}» вместе с сеансами?`)) {
            return;
        }

        setDeleting(true);
        setDeleteError(null);
        try {
            await deleteMovie(movie.id);
            navigate("/");
        } catch (cause) {
            setDeleteError(toApiError(cause).message);
            setDeleting(false);
        }
    };

    if (loading) {
        return <StatusBlock title="Загружаем фильм…" />;
    }

    if (error || !movie) {
        return (
            <>
                <StatusBlock title={errorTitle(error)} text={error?.message} />
                <p className="movieBack">
                    <Link to="/">Назад к афише</Link>
                </p>
            </>
        );
    }

    const now = new Date();
    const upcomingSessions = movie.sessions.filter((session) => new Date(session.showAt) > now);
    const pastSessions = movie.sessions.filter((session) => new Date(session.showAt) <= now);

    return (
        <article className="movie">
            <p className="movieBack">
                <Link to="/">Назад к афише</Link>
            </p>

            <div className="movieMain">
                <div className="moviePoster">
                    {movie.posterUrl && !posterFailed ? (
                        <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            onError={() => setPosterFailed(true)}
                        />
                    ) : (
                        <span className="moviePosterStub">Нет постера</span>
                    )}
                </div>

                <div className="movieInfo">
                    <h1 className="movieTitle">{movie.title}</h1>
                    <p className="movieMeta">
                        {movie.genre} · {formatDuration(movie.durationMin)} ·{" "}
                        {movie.ageRating}
                    </p>
                    {movie.description && (
                        <p className="movieDescription">{movie.description}</p>
                    )}

                    <div className="movieActions">
                        <Link to={`/movies/${movie.id}/edit`} className="movieAction">
                            Редактировать
                        </Link>
                        <button
                            type="button"
                            className="movieAction movieActionDanger"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting ? "Удаляем…" : "Удалить"}
                        </button>
                    </div>
                    {deleteError && <p className="movieError">{deleteError}</p>}
                </div>
            </div>

            <section className="movieSessions">
                <h2 className="movieSessionsTitle">Расписание</h2>
                {upcomingSessions.length === 0 ? (
                    <p className="movieMeta">Предстоящих сеансов нет.</p>
                ) : (
                    <SessionList sessions={upcomingSessions} />
                )}
            </section>

            {pastSessions.length > 0 && (
                <section className="movieSessions movieSessionsPast">
                    <h2 className="movieSessionsTitle">Прошедшие сеансы</h2>
                    <SessionList sessions={pastSessions} />
                </section>
            )}
        </article>
    );
};
