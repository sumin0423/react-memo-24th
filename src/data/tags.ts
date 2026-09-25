import type { Tag } from "../types/memo";
export const tags: Record<Tag, { label: string; cardClass: string; textClass: string }> = {
  daily: { label: "Daily", cardClass: "bg-daily", textClass: "text-daily-text" },
  work: { label: "Work", cardClass: "bg-work", textClass: "text-work-text" },
  others: {
    label: "Others",
    cardClass: "bg-others",
    textClass: "text-others-text",
  },
};
