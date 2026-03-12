export type EnergyLevel = 'low' | 'medium' | 'high';

export interface UserProfile {
  age: number;
  weight: number;
  height: number;
  cycleDay?: number;
  energyLevel: EnergyLevel;
  availableTime: number;
}

export interface Exercise {
  name: string;
  description: string;
  repsOrDuration: string;
  caloriesEstimate: number;
}

export interface WorkoutSection {
  title: string;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  totalCalories: number;
  duration: number;
  sections: WorkoutSection[];
  advice: string;
}
