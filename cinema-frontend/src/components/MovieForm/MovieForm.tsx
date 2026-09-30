import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { toApiError } from "@/api/moviesApi";
import { Field } from "@/components/Field/Field";
import { SessionFields } from "@/components/SessionFields/SessionFields";
import { AGE_RATINGS } from "@/types/movie";
import type { Movie, MovieCreateRequest } from "@/types/movie";

import "./MovieForm.less";

const POSTER_URL_PATTERN = /^https?:\/\/.+/;

interface MovieFormProps {
    title: string;
    initialForm: MovieCreateRequest;
    submitLabel: string;
    sendingLabel: string;
    onSubmit: (form: MovieCreateRequest) => Promise<Movie>;
}

const validate = (form: MovieCreateRequest): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!form.title.trim()) {
        errors.title = "Укажите название фильма";
    } else if (form.title.length > 255) {
        errors.title = "Название не длиннее 255 символов";
    }

    if (form.description.length > 2000) {
        errors.description = "Описание не длиннее 2000 символов";
    }

    if (!form.genre.trim()) {
        errors.genre = "Укажите жанр";
    } else if (form.genre.length > 100) {
        errors.genre = "Жанр не длиннее 100 символов";
    }

    if (form.durationMin === null || form.durationMin < 1 || form.durationMin > 600) {
        errors.durationMin = "Длительность от 1 до 600 минут";
    }

    if (!form.ageRating) {
        errors.ageRating = "Выберите возрастное ограничение";
    }

    if (form.posterUrl && !POSTER_URL_PATTERN.test(form.posterUrl)) {
        errors.posterUrl = "Ссылка должна начинаться с http:// или https://";
    }

    if (form.sessions.length === 0) {
        errors.sessions = "Добавьте хотя бы один сеанс";
    }

    form.sessions.forEach((session, index) => {
        if (!session.showAt) {
            errors[`sessions[${index}].showAt`] = "Укажите дату и время";
        } else if (new Date(session.showAt) <= new Date()) {
            errors[`sessions[${index}].showAt`] = "Сеанс должен быть в будущем";
        }

        if (!session.hall) {
            errors[`sessions[${index}].hall`] = "Выберите зал";
        }

        if (session.price === null || session.price <= 0) {
            errors[`sessions[${index}].price`] = "Цена должна быть больше нуля";
        }
    });

    return errors;
};

export const MovieForm = ({
    title,
    initialForm,
    submitLabel,
    sendingLabel,
    onSubmit,
}: MovieFormProps) => {
    const navigate = useNavigate();
    const [form, setForm] = useState<MovieCreateRequest>(initialForm);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [apiError, setApiError] = useState<string | null>(null);
    const [sending, setSending] = useState(false);

    const update = (patch: Partial<MovieCreateRequest>) => {
        setForm((current) => ({ ...current, ...patch }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const found = validate(form);
        setValidationErrors(found);
        setApiError(null);

        if (Object.keys(found).length > 0) {
            return;
        }

        setSending(true);
        try {
            const saved = await onSubmit(form);
            navigate(`/movies/${saved.id}`);
        } catch (cause) {
            const failure = toApiError(cause);
            setValidationErrors(failure.fieldErrors);
            if (Object.keys(failure.fieldErrors).length === 0) {
                setApiError(failure.message);
            }
        } finally {
            setSending(false);
        }
    };

    return (
        <form className="movieForm" onSubmit={handleSubmit} noValidate>
            <h1 className="movieFormTitle">{title}</h1>

            <Field label="Название" error={validationErrors.title}>
                <input
                    type="text"
                    value={form.title}
                    onChange={(event) => update({ title: event.target.value })}
                />
            </Field>

            <div className="movieFormRow">
                <Field label="Жанр" error={validationErrors.genre}>
                    <input
                        type="text"
                        value={form.genre}
                        onChange={(event) => update({ genre: event.target.value })}
                    />
                </Field>

                <Field label="Длительность, мин" error={validationErrors.durationMin}>
                    <input
                        type="number"
                        min="1"
                        max="600"
                        value={form.durationMin ?? ""}
                        onChange={(event) =>
                            update({
                                durationMin:
                                    event.target.value === ""
                                        ? null
                                        : Number(event.target.value),
                            })
                        }
                    />
                </Field>

                <Field label="Возрастное ограничение" error={validationErrors.ageRating}>
                    <select
                        value={form.ageRating}
                        onChange={(event) => update({ ageRating: event.target.value })}
                    >
                        <option value="">Не выбрано</option>
                        {AGE_RATINGS.map((rating) => (
                            <option key={rating} value={rating}>
                                {rating}
                            </option>
                        ))}
                    </select>
                </Field>
            </div>

            <Field label="Ссылка на постер" error={validationErrors.posterUrl}>
                <input
                    type="url"
                    placeholder="https://"
                    value={form.posterUrl}
                    onChange={(event) => update({ posterUrl: event.target.value })}
                />
            </Field>

            <Field label="Описание" error={validationErrors.description}>
                <textarea
                    value={form.description}
                    onChange={(event) => update({ description: event.target.value })}
                />
            </Field>

            <SessionFields
                sessions={form.sessions}
                errors={validationErrors}
                onChange={(sessions) => update({ sessions })}
            />

            {apiError && <p className="movieFormError">{apiError}</p>}

            <button type="submit" className="movieFormSubmit" disabled={sending}>
                {sending ? sendingLabel : submitLabel}
            </button>
        </form>
    );
};
