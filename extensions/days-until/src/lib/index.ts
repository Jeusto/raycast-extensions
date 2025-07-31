import { LocalStorage } from "@raycast/api";

const parseEventDate = (dateInput: string): Date => {
  try {
    const trimmedInput = dateInput.trim();

    // Check if it contains time (has colon)
    const hasTime = trimmedInput.includes(":");

    if (hasTime) {
      // Handle DD/MM/YYYY HH:MM format
      const [datePart, timePart] = trimmedInput.split(" ");
      const [day, month, year] = datePart.split("/").map(Number);
      const [hours, minutes] = timePart.split(":").map(Number);
      return new Date(year, month - 1, day, hours, minutes);
    } else {
      // Handle DD/MM/YYYY format (default to start of day)
      const [day, month, year] = trimmedInput.split("/").map(Number);
      return new Date(year, month - 1, day, 0, 0, 0);
    }
  } catch {
    // Return Christmas of current year as fallback
    const currentYear = new Date().getFullYear();
    return new Date(currentYear, 11, 25, 12, 0, 0);
  }
};

const formatTitle = (eventTitle: string, days: number, hours: number): string => {
  if (days === 0 && hours > 0) {
    // Show only hours when no days remaining
    return `${eventTitle} — ${format(hours, "hour")}`;
  } else if (days > 0) {
    // Show days and hours (if any) when days remaining
    const daysPart = format(days, "day");
    return hours > 0 ? `${eventTitle} — ${daysPart}, ${format(hours, "hour")}` : `${eventTitle} — ${daysPart}`;
  } else {
    // Fallback for edge cases (0 days, 0 hours)
    return `${eventTitle} — Today`;
  }
};

export const getTitle = async (): Promise<string> => {
  const now = new Date();

  // Get values from LocalStorage or use defaults
  const storedTitle = await LocalStorage.getItem<string>("eventTitle");
  const storedDate = await LocalStorage.getItem<string>("eventDate");

  const eventTitle = storedTitle || "Christmas";
  const eventDate = storedDate || `25/12/${now.getFullYear()} 12:00`;

  const targetDate = parseEventDate(eventDate);

  // Validate parsed date
  if (isNaN(targetDate.getTime())) {
    const fallbackDate = new Date(now.getFullYear(), 11, 25, 12, 0, 0);
    const s = calculate({ currDate: now, neededDate: fallbackDate });
    return formatTitle(eventTitle, s.days, s.hours);
  }

  const result = calculate({
    currDate: now,
    neededDate: targetDate,
  });

  return formatTitle(eventTitle, result.days, result.hours);
};

export const calculate = ({
  currDate,
  neededDate,
}: {
  currDate: Date;
  neededDate: Date;
}): { days: number; hours: number; isToday: boolean } => {
  const timeInADay = 24 * 60 * 60;
  const diff = (neededDate.getTime() - currDate.getTime()) / 1000;

  const days = Math.floor(diff / timeInADay);
  const hours = Math.floor((diff / timeInADay - days) * 24);

  if (days === -1) {
    return {
      days: 0,
      hours: 0,
      isToday: true,
    };
  } else if (days < 0) {
    const newNeededDate = new Date(neededDate);

    newNeededDate.setFullYear(neededDate.getFullYear() + 1);

    return calculate({
      currDate,
      neededDate: newNeededDate,
    });
  }

  return {
    days,
    hours,
    isToday: false,
  };
};

export const format = (input: number, word: string) => {
  if (input > 1) {
    return `${input} ${word}s`;
  }

  return `${input} ${word}`;
};
