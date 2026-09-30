package ru.kalskaia.cinema.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.List;

public record MovieCreateRequest(

    @NotBlank(message = "Укажите название фильма")
    @Size(max = 255, message = "Название не длиннее 255 символов")
    String title,

    @Size(max = 2000, message = "Описание не длиннее 2000 символов")
    String description,

    @NotBlank(message = "Укажите жанр")
    @Size(max = 100, message = "Жанр не длиннее 100 символов")
    String genre,

    @NotNull(message = "Длительность от 1 до 600 минут")
    @Min(value = 1, message = "Длительность от 1 до 600 минут")
    @Max(value = 600, message = "Длительность от 1 до 600 минут")
    Integer durationMin,

    @NotBlank(message = "Выберите возрастное ограничение")
    @Pattern(regexp = "0\\+|6\\+|12\\+|16\\+|18\\+", message = "Выберите возрастное ограничение")
    String ageRating,

    @Size(max = 1000, message = "Ссылка не длиннее 1000 символов")
    @Pattern(regexp = "|https?://.+", message = "Ссылка должна начинаться с http:// или https://")
    String posterUrl,

    @NotEmpty(message = "Добавьте хотя бы один сеанс")
    @Valid
    List<SessionCreateRequest> sessions
) {
}
