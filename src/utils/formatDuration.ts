const LEADING_ZERO_FORMATTER = new Intl.NumberFormat(undefined, {
  minimumIntegerDigits: 2,
});

export function formatDuation(duration: number) {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration - hours * 3600) / 60);
  const seconds = duration % 60;

  if (hours > 0) {
    return `${LEADING_ZERO_FORMATTER.format(
      hours
    )}:${LEADING_ZERO_FORMATTER.format(
      minutes
    )}:${LEADING_ZERO_FORMATTER.format(seconds)}`;
  }

  return `${LEADING_ZERO_FORMATTER.format(
    minutes
  )}:${LEADING_ZERO_FORMATTER.format(seconds)}`;
}
