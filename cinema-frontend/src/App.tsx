import { Route, Routes } from "react-router-dom";

import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { AboutPage } from "@/pages/AboutPage/AboutPage";
import { AfishaPage } from "@/pages/AfishaPage/AfishaPage";
import { MovieCreatePage } from "@/pages/MovieCreatePage/MovieCreatePage";
import { MovieEditPage } from "@/pages/MovieEditPage/MovieEditPage";
import { MoviePage } from "@/pages/MoviePage/MoviePage";
import { NotFoundPage } from "@/pages/NotFoundPage/NotFoundPage";

export const App = () => (
    <>
        <Header />
        <main className="content">
            <Routes>
                <Route path="/" element={<AfishaPage />} />
                <Route path="/movies/new" element={<MovieCreatePage />} />
                <Route path="/movies/:id" element={<MoviePage />} />
                <Route path="/movies/:id/edit" element={<MovieEditPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="*"element={<NotFoundPage />} />
            </Routes>
        </main>
        <Footer />
    </>
);
