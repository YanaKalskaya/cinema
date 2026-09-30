package ru.kalskaia.cinema.dto;

import java.time.LocalDateTime;

public record MovieCardDto(
    Long id,
    String title,
    String genre,
    String ageRating,
    Integer durationMin,
    String posterUrl,
    LocalDateTime nearestShowAt,
    int sessionsCount
) {
}
