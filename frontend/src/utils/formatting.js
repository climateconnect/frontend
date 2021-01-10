/**
 * This is thin wrapper on top of the formatter that's passed to
 * reat-timeago. The desired date is a format that's something like
 *
 * "X years and X days"
 *
 * which isn't supported by react-timeago out of the box.
 *
 * We add a little more custom logic to format calculate what
 * the number of days is since the input date, and
 * then append a suffix to pluralize number of days.
 *
 * See more on the formatting options, here:
 * https://github.com/nmn/react-timeago#formatter-optional
 */
const yearAndDayFormatter = (unit, value, suffix, epochMiliseconds) => {
  if (value === "year") {
    // The days calculation comes directly from react-timeago:
    const days = Math.round(Math.abs(epochMiliseconds - Date.now()) / (1000 * 60 * 60 * 24));

    // With the number of days, we can just append the remaining
    // days after taking into account the year overflow
    const dayAfterYears = days % (365 * unit);
    const pluralizeDays = (days) => {
      return days !== 1 ? "days" : "day";
    };

    return `${unit} ${value} and ${dayAfterYears} ${pluralizeDays(dayAfterYears)} ago`;
  }
};

export { yearAndDayFormatter };
