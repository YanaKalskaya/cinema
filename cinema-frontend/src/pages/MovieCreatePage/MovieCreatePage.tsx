import { createMovie } from "@/api/moviesApi";
import { MovieForm } from "@/components/MovieForm/MovieForm";
import { EMPTY_SESSION } from "@/components/SessionFields/SessionFields";
import type { MovieCreateRequest } from "@/types/movie";

const EMPTY_FORM: MovieCreateRequest = {
    title: "",
    description: "",
    genre: "",
    durationMin: null,
    ageRating: "",
    posterUrl: "",
    sessions: [EMPTY_SESSION],
};

export const MovieCreatePage = () => (
    <MovieForm
        title="Добавить фильм"
        initialForm={EMPTY_FORM}
        submitLabel="Опубликовать"
        sendingLabel="Публикуем…"
        onSubmit={createMovie}
    />
);
