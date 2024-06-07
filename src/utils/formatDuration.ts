const LEADING_ZERO_FORMATTER = new Intl.NumberFormat(undefined, {
  minimumIntegerDigits: 2,
});

const reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;

export function formatDuration(duration: string) {
  let hours = 0,
    minutes = 0,
    seconds = 0;

  if (reptms.test(duration)) {
    const matches = reptms.exec(duration);
    if (matches?.[1]) hours = Number(matches?.[1]);
    if (matches?.[2]) minutes = Number(matches?.[2]);
    if (matches?.[3]) seconds = Number(matches?.[3]);
  }

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
