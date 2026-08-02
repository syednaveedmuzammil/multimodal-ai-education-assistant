import {
  Upload,
  FileText,
  Brain,
  CalendarDays,
} from "lucide-react";

export const QUICK_ACTIONS = [
  {
    id: 1,
    title: "Upload Notes",
    description: "Upload PDF, DOCX, PPT, images or handwritten notes.",
    icon: Upload,
    route: "/notes",
  },
  {
    id: 2,
    title: "Summarize",
    description: "Generate concise AI-powered summaries.",
    icon: FileText,
    route: "/summary",
  },
  {
    id: 3,
    title: "Generate Quiz",
    description: "Create quizzes from your uploaded notes.",
    icon: Brain,
    route: "/quiz",
  },
  {
    id: 4,
    title: "Study Plan",
    description: "Get a personalized AI study plan.",
    icon: CalendarDays,
    route: "/study-plan",
  },
];