package ru.kalskaia.cinema.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record SessionCreateRequest(

    @NotNull(message = "Сеанс должен быть в будущем")
    @Future(message = "Сеанс должен быть в будущем")
    LocalDateTime showAt,

    @NotBlank(message = "Выберите зал")
    String hall,

    @NotNull(message = "Цена должна быть больше нуля")
    @DecimalMin(value = "0.01", message = "Цена должна быть больше нуля")
    BigDecimal price
) {
}
