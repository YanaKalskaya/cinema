package ru.kalskaia.cinema.dto;

import java.time.LocalDateTime;
import java.util.List;

public record MovieDto(
    Long id,
    String title,
    String description,
    String genre,
    String ageRating,
    Integer durationMin,
    String posterUrl,
    LocalDateTime createdAt,
    List<SessionDto> sessions
) {
}
