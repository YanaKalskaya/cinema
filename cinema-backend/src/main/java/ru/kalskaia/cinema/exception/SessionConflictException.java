package ru.kalskaia.cinema.exception;

import lombok.Getter;

import java.util.Map;

@Getter
public class SessionConflictException extends RuntimeException {

    private final Map<String, String> fieldErrors;

    public SessionConflictException(Map<String, String> fieldErrors) {
        super("В этом зале уже есть сеанс на это время");
        this.fieldErrors = fieldErrors;
    }
}
