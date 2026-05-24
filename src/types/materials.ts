export type Classroom = "Toddler" | "Pathways" | "Preschool" | "Pre-K";

export type LessonType =
  | "Noggin Joggin"
  | "Wondertime 1"
  | "Wondertime 2"
  | "Wondertime 3";

export type MaterialItem = {
  id: string;
  classroom: Classroom;
  unit: number;
  week: number;
  day: string;
  lessonType: LessonType;
  material: string;
  ignored?: boolean;
};
