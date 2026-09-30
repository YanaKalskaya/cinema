const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
});

export const formatShowAt = (showAt: string): string =>
    dateFormatter.format(new Date(showAt));

export const formatDuration = (durationMin: number): string => {
    const hours = Math.floor(durationMin / 60);
    const minutes = durationMin % 60;

    if (hours === 0) {
        return `${minutes} мин`;
    }
    if (minutes === 0) {
        return `${hours} ч`;
    }
    return `${hours} ч ${minutes} мин`;
};

export const formatPrice = (price: number): string => `${price} ₽`;
