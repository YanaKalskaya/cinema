package ru.kalskaia.cinema.mapper;

import org.springframework.stereotype.Component;

import ru.kalskaia.cinema.dto.MovieCardDto;
import ru.kalskaia.cinema.dto.MovieCreateRequest;
import ru.kalskaia.cinema.dto.MovieDto;
import ru.kalskaia.cinema.dto.SessionCreateRequest;
import ru.kalskaia.cinema.dto.SessionDto;
import ru.kalskaia.cinema.entity.Movie;
import ru.kalskaia.cinema.entity.MovieSession;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Component
public class MovieMapper {

    public MovieCardDto toCard(Movie movie) {
        return new MovieCardDto(
            movie.getId(),
            movie.getTitle(),
            movie.getGenre(),
            movie.getAgeRating(),
            movie.getDurationMin(),
            movie.getPosterUrl(),
            nearestShowAt(movie),
            movie.getSessions().size()
        );
    }

    public MovieDto toDto(Movie movie) {
        List<SessionDto> sessions = movie.getSessions().stream()
            .sorted(Comparator.comparing(MovieSession::getShowAt))
            .map(this::toSessionDto)
            .toList();

        return new MovieDto(
            movie.getId(),
            movie.getTitle(),
            movie.getDescription(),
            movie.getGenre(),
            movie.getAgeRating(),
            movie.getDurationMin(),
            movie.getPosterUrl(),
            movie.getCreatedAt(),
            sessions
        );
    }

    public Movie toEntity(MovieCreateRequest request) {
        Movie movie = new Movie();
        copyFields(request, movie);
        request.sessions().forEach(session -> movie.addSession(toSession(session)));
        return movie;
    }

    public void copyFields(MovieCreateRequest request, Movie movie) {
        movie.setTitle(request.title());
        movie.setDescription(request.description());
        movie.setGenre(request.genre());
        movie.setDurationMin(request.durationMin());
        movie.setAgeRating(request.ageRating());
        movie.setPosterUrl(request.posterUrl());
    }

    public MovieSession toSession(SessionCreateRequest request) {
        MovieSession session = new MovieSession();
        session.setShowAt(request.showAt());
        session.setHall(request.hall());
        session.setPrice(request.price());
        return session;
    }

    private SessionDto toSessionDto(MovieSession session) {
        return new SessionDto(
            session.getId(),
            session.getShowAt(),
            session.getHall(),
            session.getPrice()
        );
    }

    private LocalDateTime nearestShowAt(Movie movie) {
        LocalDateTime now = LocalDateTime.now();
        return movie.getSessions().stream()
            .map(MovieSession::getShowAt)
            .filter(showAt -> showAt.isAfter(now))
            .min(Comparator.naturalOrder())
            .orElse(null);
    }
}
