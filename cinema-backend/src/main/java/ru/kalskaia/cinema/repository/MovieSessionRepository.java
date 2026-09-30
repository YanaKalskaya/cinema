package ru.kalskaia.cinema.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import ru.kalskaia.cinema.entity.MovieSession;

import java.time.LocalDateTime;

public interface MovieSessionRepository extends JpaRepository<MovieSession, Long> {

    boolean existsByHallAndShowAt(String hall, LocalDateTime showAt);

    boolean existsByHallAndShowAtAndMovieIdNot(String hall, LocalDateTime showAt, Long movieId);
}
