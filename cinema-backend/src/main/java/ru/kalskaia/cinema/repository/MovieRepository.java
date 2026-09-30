package ru.kalskaia.cinema.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import ru.kalskaia.cinema.entity.Movie;

import java.util.List;
import java.util.Optional;

public interface MovieRepository extends JpaRepository<Movie, Long> {

    @Override
    @EntityGraph(attributePaths = "sessions")
    List<Movie> findAll();

    @Override
    @EntityGraph(attributePaths = "sessions")
    Optional<Movie> findById(Long id);
}
