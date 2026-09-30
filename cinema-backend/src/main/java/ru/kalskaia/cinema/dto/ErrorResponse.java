package ru.kalskaia.cinema.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorResponse(
    LocalDateTime timestamp,
    int status,
    String message,
    String path,
    Map<String, String> fieldErrors
) {

    public static ErrorResponse of(int status, String message, String path) {
        return new ErrorResponse(LocalDateTime.now(), status, message, path, null);
    }

    public static ErrorResponse validation(String path, Map<String, String> fieldErrors) {
        return new ErrorResponse(LocalDateTime.now(), 400, "Ошибка валидации", path, fieldErrors);
    }

    public static ErrorResponse conflict(String message, String path, Map<String, String> fieldErrors) {
        return new ErrorResponse(LocalDateTime.now(), 409, message, path, fieldErrors);
    }
}
