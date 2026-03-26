export interface EventConfig {
  /** ISO-8601 datetime string for when the event starts */
  event_start_datetime: string;
  venue: string;
  time_display: string;
}

export interface AwardCategory {
  /** URL-safe slug used as hash anchor: /awards-information#{slug} */
  slug: string;
  name: string;
  /** Short description shown in the homepage card (from Figma) */
  card_description: string;
  description: string;
  description_en?: string;
  /** Background image shared across all award cards */
  image_url: string;
  /** Award name logo overlaid on the background image */
  name_image_url: string;
  name_image_width: number;
  name_image_height: number;
  award_count: number;
  /** e.g. "người" or "giải" */
  unit_type: string;
  unit_type_en?: string;
  /** Display string e.g. "50,000,000 VND" */
  award_value_vnd: string;
  special_note?: string;
}
