package ru.kalskaia.cinema.exception;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import ru.kalskaia.cinema.dto.ErrorResponse;

import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException exception,
                                                          HttpServletRequest request) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        exception.getBindingResult().getFieldErrors()
            .forEach(error -> fieldErrors.putIfAbsent(error.getField(), error.getDefaultMessage()));

        return ResponseEntity
            .badRequest()
            .body(ErrorResponse.validation(request.getRequestURI(), fieldErrors));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleUnreadableBody(HttpServletRequest request) {
        return ResponseEntity
            .badRequest()
            .body(ErrorResponse.of(HttpStatus.BAD_REQUEST.value(),
                "Не удалось разобрать данные запроса: проверьте формат полей", request.getRequestURI()));
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleTypeMismatch(MethodArgumentTypeMismatchException exception,
                                                            HttpServletRequest request) {
        return ResponseEntity
            .badRequest()
            .body(ErrorResponse.of(HttpStatus.BAD_REQUEST.value(),
                "Параметр «" + exception.getName() + "» имеет неверный формат", request.getRequestURI()));
    }

    @ExceptionHandler(MovieNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(MovieNotFoundException exception,
                                                        HttpServletRequest request) {
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(ErrorResponse.of(HttpStatus.NOT_FOUND.value(), exception.getMessage(), request.getRequestURI()));
    }

    @ExceptionHandler(SessionConflictException.class)
    public ResponseEntity<ErrorResponse> handleSessionConflict(SessionConflictException exception,
                                                               HttpServletRequest request) {
        return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(ErrorResponse.conflict(exception.getMessage(), request.getRequestURI(),
                exception.getFieldErrors()));
    }

    // Страховка на случай гонки: два запроса одновременно заняли один и тот же зал
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleConflict(DataIntegrityViolationException exception,
                                                        HttpServletRequest request) {
        return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(ErrorResponse.of(HttpStatus.CONFLICT.value(),
                "В этом зале уже есть сеанс на это время", request.getRequestURI()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleOther(Exception exception, HttpServletRequest request) {
        // Стандартные ошибки Spring MVC (404 на неизвестный путь, 405, 415) сохраняют свой статус
        if (exception instanceof org.springframework.web.ErrorResponse springError) {
            int status = springError.getStatusCode().value();
            return ResponseEntity
                .status(status)
                .body(ErrorResponse.of(status, messageFor(status), request.getRequestURI()));
        }

        log.error("Необработанная ошибка на {}", request.getRequestURI(), exception);
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ErrorResponse.of(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Внутренняя ошибка сервера. Попробуйте позже", request.getRequestURI()));
    }

    private static String messageFor(int status) {
        return switch (status) {
            case 404 -> "Ресурс не найден";
            case 405 -> "Метод не поддерживается";
            case 415 -> "Неподдерживаемый формат данных";
            default -> "Некорректный запрос";
        };
    }
}
