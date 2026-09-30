package ru.kalskaia.cinema.exception;

public class MovieNotFoundException extends RuntimeException {

    public MovieNotFoundException(Long id) {
        super("Фильм с id " + id + " не найден");
    }
}
