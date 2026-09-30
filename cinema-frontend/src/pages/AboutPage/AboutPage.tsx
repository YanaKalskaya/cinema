import { Link } from "react-router-dom";

import "./AboutPage.less";

const FEATURES = [
    "Афиша — карточки фильмов, отсортированные по ближайшему сеансу",
    "Страница фильма — постер, описание и расписание сеансов",
    "Добавление фильма — форма с проверкой полей и списком сеансов",
    "Понятные сообщения об ошибках сети, сервера и валидации",
];

const STACK = [
    { part: "Фронтенд", tech: "React, TypeScript, Vite, React Router, axios, LESS" },
    { part: "Бэкенд", tech: "Java 17, Spring Boot, Spring Data JPA" },
    { part: "База данных", tech: "PostgreSQL" },
    { part: "Запуск", tech: "Docker Compose" },
];

export const AboutPage = () => (
    <article className="about">
        <h1 className="aboutTitle">О проекте</h1>
        <p className="aboutLead">
            Учебный проект по дисциплине «Web-технологии»: сайт кинотеатра, который
            получает и сохраняет данные через REST API.
        </p>

        <section className="aboutSection">
            <h2 className="aboutSectionTitle">Возможности</h2>
            <ul className="aboutList">
                {FEATURES.map((feature) => (
                    <li key={feature}>{feature}</li>
                ))}
            </ul>
        </section>

        <section className="aboutSection">
            <h2 className="aboutSectionTitle">Стек</h2>
            <dl className="aboutStack">
                {STACK.map(({ part, tech }) => (
                    <div key={part} className="aboutStackRow">
                        <dt className="aboutStackPart">{part}</dt>
                        <dd>{tech}</dd>
                    </div>
                ))}
            </dl>
        </section>

        <Link to="/" className="aboutLink">
            Перейти к афише
        </Link>
    </article>
);
