package ru.kalskaia.cinema.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record SessionDto(
    Long id,
    LocalDateTime showAt,
    String hall,
    BigDecimal price
) {
}
