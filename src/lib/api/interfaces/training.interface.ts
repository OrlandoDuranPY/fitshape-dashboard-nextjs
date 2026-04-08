export interface Exercise {
  name: string;
  slug: string;
  is_bodyweight: boolean;
  category: string;
  notes: string | null;
  instructions: string[];
  category_id: number;
  difficulty: "beginner" | "intermediate" | "expert";
}

export interface PaginatedExercises {
  exercises: Exercise[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}