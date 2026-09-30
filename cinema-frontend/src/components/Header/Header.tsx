import { NavLink } from "react-router-dom";

import "./Header.less";

const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "headerLink headerLinkActive" : "headerLink";

export const Header = () => (
    <header className="header">
        <div className="headerInner">
            <NavLink to="/" className="headerLogo">
                Киноафиша
            </NavLink>
            <nav className="headerNav">
                <NavLink to="/" end className={linkClass}>
                    Афиша
                </NavLink>
                <NavLink to="/movies/new" className={linkClass}>
                    Добавить фильм
                </NavLink>
                <NavLink to="/about" className={linkClass}>
                    О проекте
                </NavLink>
            </nav>
        </div>
    </header>
);
