import { useState } from "react";
import { Link } from "react-router-dom";

import { formatDuration, formatShowAt } from "@/helpers/format";
import type { MovieCard as MovieCardData } from "@/types/movie";

import "./MovieCard.less";

// nearestShowAt — ближайший будущий сеанс, sessionsCount — все сеансы, включая прошедшие
const showAtText = (movie: MovieCardData): string => {
    if (movie.nearestShowAt) {
        return `Ближайший сеанс: ${formatShowAt(movie.nearestShowAt)}`;
    }
    return movie.sessionsCount > 0 ? "Все сеансы прошли" : "Сеансов пока нет";
};

interface MovieCardProps {
    movie: MovieCardData;
}

export const MovieCard = ({ movie }: MovieCardProps) => {
    const [posterFailed, setPosterFailed] = useState(false);

    return (
        <Link to={`/movies/${movie.id}`} className="movieCard">
            <div className="movieCardPoster">
                {movie.posterUrl && !posterFailed ? (
                    <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        onError={() => setPosterFailed(true)}
                    />
                ) : (
                    <span className="movieCardStub">Нет постера</span>
                )}
                <span className="movieCardAge">{movie.ageRating}</span>
            </div>
            <div className="movieCardBody">
                <h2 className="movieCardTitle">{movie.title}</h2>
                <p className="movieCardMeta">
                    {movie.genre} · {formatDuration(movie.durationMin)}
                </p>
                <p className="movieCardShowAt">{showAtText(movie)}</p>
            </div>
        </Link>
    );
};
