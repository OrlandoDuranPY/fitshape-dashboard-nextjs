/* ========================================
   = Exercises =
========================================= */
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

/* ========================================
   = Training Plans =
========================================= */
export interface TrainingPlan {
  user_uuid: string;
  user_name: string;
  name: string;
  description: string | null;
  days_count: number;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
}

export interface PaginatedTrainingPlans {
  plans: TrainingPlan[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}
