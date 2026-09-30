import { Field } from "@/components/Field/Field";
import { HALLS } from "@/types/movie";
import type { SessionCreateRequest } from "@/types/movie";

import "./SessionFields.less";

export const EMPTY_SESSION: SessionCreateRequest = { showAt: "", hall: HALLS[0], price: null };

interface SessionFieldsProps {
    sessions: SessionCreateRequest[];
    errors: Record<string, string>;
    onChange: (sessions: SessionCreateRequest[]) => void;
}

export const SessionFields = ({ sessions, errors, onChange }: SessionFieldsProps) => {
    const updateSession = (index: number, patch: Partial<SessionCreateRequest>) => {
        onChange(
            sessions.map((session, i) =>
                i === index ? { ...session, ...patch } : session,
            ),
        );
    };

    const addSession = () => {
        onChange([...sessions, EMPTY_SESSION]);
    };

    const removeSession = (index: number) => {
        onChange(sessions.filter((_, i) => i !== index));
    };

    return (
        <section className="sessionFields">
            <div className="sessionFieldsHead">
                <h2 className="sessionFieldsTitle">Сеансы</h2>
                <button type="button" className="sessionAdd" onClick={addSession}>
                    Добавить сеанс
                </button>
            </div>

            {errors.sessions && (
                <p className="sessionFieldsError">{errors.sessions}</p>
            )}

            {sessions.map((session, index) => (
                <div key={index} className="sessionRow">
                    <Field
                        label="Дата и время"
                        error={errors[`sessions[${index}].showAt`]}
                    >
                        <input
                            type="datetime-local"
                            value={session.showAt}
                            onChange={(event) =>
                                updateSession(index, { showAt: event.target.value })
                            }
                        />
                    </Field>

                    <Field label="Зал" error={errors[`sessions[${index}].hall`]}>
                        <select
                            value={session.hall}
                            onChange={(event) =>
                                updateSession(index, { hall: event.target.value })
                            }
                        >
                            {HALLS.map((hall) => (
                                <option key={hall} value={hall}>
                                    {hall}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <Field
                        label="Цена, ₽"
                        error={errors[`sessions[${index}].price`]}
                    >
                        <input
                            type="number"
                            min="1"
                            value={session.price ?? ""}
                            onChange={(event) =>
                                updateSession(index, {
                                    price:
                                        event.target.value === ""
                                            ? null
                                            : Number(event.target.value),
                                })
                            }
                        />
                    </Field>

                    <button
                        type="button"
                        className="sessionRemove"
                        onClick={() => removeSession(index)}
                        disabled={sessions.length === 1}
                    >
                        Удалить
                    </button>
                </div>
            ))}
        </section>
    );
};
