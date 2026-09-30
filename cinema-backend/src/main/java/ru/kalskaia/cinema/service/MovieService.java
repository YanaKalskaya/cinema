package ru.kalskaia.cinema.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ru.kalskaia.cinema.dto.MovieCardDto;
import ru.kalskaia.cinema.dto.MovieCreateRequest;
import ru.kalskaia.cinema.dto.MovieDto;
import ru.kalskaia.cinema.dto.SessionCreateRequest;
import ru.kalskaia.cinema.entity.Movie;
import ru.kalskaia.cinema.exception.MovieNotFoundException;
import ru.kalskaia.cinema.exception.SessionConflictException;
import ru.kalskaia.cinema.mapper.MovieMapper;
import ru.kalskaia.cinema.repository.MovieRepository;
import ru.kalskaia.cinema.repository.MovieSessionRepository;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class MovieService {

    private final MovieRepository movieRepository;
    private final MovieSessionRepository movieSessionRepository;
    private final MovieMapper movieMapper;

    @Transactional(readOnly = true)
    public List<MovieCardDto> getAll() {
        Comparator<MovieCardDto> byNearestShowAt = Comparator.comparing(
            MovieCardDto::nearestShowAt, Comparator.nullsLast(Comparator.naturalOrder()));

        return movieRepository.findAll().stream()
            .map(movieMapper::toCard)
            .sorted(byNearestShowAt.thenComparing(MovieCardDto::title))
            .toList();
    }

    @Transactional(readOnly = true)
    public MovieDto getById(Long id) {
        Movie movie = movieRepository.findById(id)
            .orElseThrow(() -> new MovieNotFoundException(id));
        return movieMapper.toDto(movie);
    }

    @Transactional
    public MovieDto create(MovieCreateRequest request) {
        checkHallsAreFree(request.sessions(), null);
        Movie movie = movieMapper.toEntity(request);
        return movieMapper.toDto(movieRepository.saveAndFlush(movie));
    }

    /**
     * Заменяет поля фильма и его предстоящие сеансы. Прошедшие сеансы остаются
     * в базе как история и в запросе не передаются.
     */
    @Transactional
    public MovieDto update(Long id, MovieCreateRequest request) {
        Movie movie = movieRepository.findById(id)
            .orElseThrow(() -> new MovieNotFoundException(id));
        checkHallsAreFree(request.sessions(), id);

        movieMapper.copyFields(request, movie);
        LocalDateTime now = LocalDateTime.now();
        movie.getSessions().removeIf(session -> session.getShowAt().isAfter(now));
        // Hibernate выполняет вставки раньше удалений: без flush сохранённый
        // без изменений сеанс упрётся в уникальный индекс (зал + время)
        movieRepository.flush();

        request.sessions().forEach(session -> movie.addSession(movieMapper.toSession(session)));
        return movieMapper.toDto(movieRepository.saveAndFlush(movie));
    }

    @Transactional
    public void delete(Long id) {
        if (!movieRepository.existsById(id)) {
            throw new MovieNotFoundException(id);
        }
        movieRepository.deleteById(id);
    }

    /** movieId — фильм, свои сеансы которого не считаются конфликтом (при изменении). */
    private void checkHallsAreFree(List<SessionCreateRequest> sessions, Long movieId) {
        Map<String, String> conflicts = new LinkedHashMap<>();
        Set<String> seenSlots = new HashSet<>();

        for (int i = 0; i < sessions.size(); i++) {
            SessionCreateRequest session = sessions.get(i);
            String field = "sessions[" + i + "].showAt";

            if (!seenSlots.add(session.hall() + "|" + session.showAt())) {
                conflicts.put(field, "Этот сеанс уже есть в форме выше");
            } else if (isHallTaken(session, movieId)) {
                conflicts.put(field, session.hall() + " уже занят на это время");
            }
        }

        if (!conflicts.isEmpty()) {
            throw new SessionConflictException(conflicts);
        }
    }

    private boolean isHallTaken(SessionCreateRequest session, Long movieId) {
        return movieId == null
            ? movieSessionRepository.existsByHallAndShowAt(session.hall(), session.showAt())
            : movieSessionRepository.existsByHallAndShowAtAndMovieIdNot(session.hall(), session.showAt(), movieId);
    }
}
