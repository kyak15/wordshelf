export interface SavedWordRow {
    saved_word_id: string;
    user_id: string;
    library_book_id: string;
    word_id: string;
    chosen_sense_id: string | null;
    page_number: number | null;
    chapter: string | null;
    context_snippet: string | null;
    saved_at: Date;
    is_archived: boolean;
    mastery_level: number;
    last_reviewed_at: Date | null;
    next_review_at: Date | null;
    interval_days: number;
    ease_factor: number;
    saved_definition: string | null;
    saved_part_of_speech: string | null;
    saved_example: string | null;
    saved_audio_url: string | null;
    // joined from words table
    text: string;
    lemma: string | null;
    language_code: string;
  }