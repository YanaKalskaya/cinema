package ru.kalskaia.cinema.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ru.kalskaia.cinema.dto.MovieCardDto;
import ru.kalskaia.cinema.dto.MovieCreateRequest;
import ru.kalskaia.cinema.dto.MovieDto;
import ru.kalskaia.cinema.service.MovieService;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
public class MovieController {

    private final MovieService movieService;

    @GetMapping
    public List<MovieCardDto> getAll() {
        return movieService.getAll();
    }

    @GetMapping("/{id}")
    public MovieDto getById(@PathVariable Long id) {
        return movieService.getById(id);
    }

    @PostMapping
    public ResponseEntity<MovieDto> create(@Valid @RequestBody MovieCreateRequest request) {
        MovieDto created = movieService.create(request);
        return ResponseEntity
            .created(URI.create("/api/movies/" + created.id()))
            .body(created);
    }

    @PutMapping("/{id}")
    public MovieDto update(@PathVariable Long id, @Valid @RequestBody MovieCreateRequest request) {
        return movieService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        movieService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
