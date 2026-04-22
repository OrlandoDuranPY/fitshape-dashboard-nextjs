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
   = Coach Clients =
========================================= */
export interface CoachClient {
  id: number;
  coach_uuid: string;
  coach_name: string | null;
  coach_email: string | null;
  user_uuid: string;
  user_name: string | null;
  user_email: string | null;
  status: "active" | "inactive" | "pending";
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

export interface PaginatedCoachClients {
  coach_clients: CoachClient[];
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
  training_plans: TrainingPlan[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}
