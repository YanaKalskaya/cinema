package ru.kalskaia.cinema.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import ru.kalskaia.cinema.entity.Movie;
import ru.kalskaia.cinema.entity.MovieSession;
import ru.kalskaia.cinema.repository.MovieRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.Month;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    // Демо-сеансы идут подряд, по одному в день, начиная с этой даты
    private static final LocalDate FIRST_SHOW_DATE = LocalDate.of(2026, Month.OCTOBER, 1);
    private static final String[] HALLS = {"Зал 1", "Зал 2", "Зал 3"};
    private static final LocalTime[] SHOW_TIMES = {
        LocalTime.of(12, 0),
        LocalTime.of(15, 30),
        LocalTime.of(19, 0),
        LocalTime.of(21, 30),
    };

    private final MovieRepository movieRepository;

    private int globalSessionIndex = 0;

    @Override
    public void run(String... args) {
        if (movieRepository.count() > 0) {
            return;
        }

        movieRepository.save(movie(
            "Человек-паук: Новый день", "Фантастика", "16+", 150,
            "Питер Паркер сражается с преступностью в городе, который его больше не помнит.",
            "https://image.tmdb.org/t/p/w500/mFD3aitQ9rVM6u01xWDL2vYCKLE.jpg",
            3
        ));
        movieRepository.save(movie(
            "Дюна: Часть вторая", "Фантастика", "12+", 166,
            "Пол Атрейдес объединяется с Чани и фрименами, чтобы отомстить за свою семью.",
            "https://image.tmdb.org/t/p/w500/zYLP7Uiqz6XqoiQLAu4XQ6DRUMz.jpg",
            2
        ));
        movieRepository.save(movie(
            "Лунтик: Обратная сторона Луны", "Мультфильм", "0+", 74,
            "Папа Лунтика пропал на обратной стороне Луны, и вместе с Кузей он отправляется на поиски.",
            "https://www.kinonews.ru/insimgs/2026/poster/poster142135_1.webp",
            4
        ));
        movieRepository.save(movie(
            "Майкл", "Биография", "16+", 127,
            "Путь Майкла Джексона от выступлений с The Jackson 5 до мирового турне Bad.",
            "https://image.tmdb.org/t/p/w500/uEk5QnmWN8t8t0rZ8gvOITg2yuR.jpg",
            3
        ));
        movieRepository.save(movie(
            "Легенда о золоте скифов", "Приключения", "6+", 127,
            "Из краеведческого музея пропадает скифский артефакт, и подростки берутся найти похитителя сами.",
            "https://static.kinoafisha.info/k/movie_posters/1000/upload/movie_posters/5/6/0/8387065/770773134998.jpg",
            2
        ));
        movieRepository.save(movie(
            "Смешарики: Сквозь вселенные", "Мультфильм", "6+", 85,
            "Смешарики отправляются в космическое путешествие по сценарию Сергея Лукьяненко.",
            "https://image.tmdb.org/t/p/w500/ewlHTioaExcrODbgz0IC7eZUuwj.jpg",
            3
        ));
    }

    private Movie movie(String title, String genre, String ageRating, int durationMin,
                         String description, String posterUrl, int sessionsCount) {
        Movie movie = new Movie();
        movie.setTitle(title);
        movie.setGenre(genre);
        movie.setAgeRating(ageRating);
        movie.setDurationMin(durationMin);
        movie.setDescription(description);
        movie.setPosterUrl(posterUrl);

        for (int i = 0; i < sessionsCount; i++) {
            movie.addSession(session());
        }
        return movie;
    }

    private MovieSession session() {
        LocalDate showDate = FIRST_SHOW_DATE.plusDays(globalSessionIndex);
        LocalTime showTime = SHOW_TIMES[globalSessionIndex % SHOW_TIMES.length];
        String hall = HALLS[globalSessionIndex % HALLS.length];
        BigDecimal price = BigDecimal.valueOf(350 + (globalSessionIndex % 4) * 50);
        globalSessionIndex++;

        MovieSession session = new MovieSession();
        session.setShowAt(showDate.atTime(showTime));
        session.setHall(hall);
        session.setPrice(price);
        return session;
    }
}
