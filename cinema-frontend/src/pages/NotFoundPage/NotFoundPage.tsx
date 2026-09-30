import { Link } from "react-router-dom";

import "./NotFoundPage.less";

export const NotFoundPage = () => (
    <div className="notFound">
        <h1 className="notFoundTitle">Страница не найдена</h1>
        <p>Такой страницы нет. Возможно, ссылка устарела.</p>
        <Link to="/" className="notFoundLink">
            Вернуться к афише
        </Link>
    </div>
);
