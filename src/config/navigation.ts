import {
  LayoutDashboard,
  CalendarDays,
  School,
  BookOpen,
  Clock,
  GraduationCap,
  FileText,
  UserCheck,
  Users,
  CheckSquare,
  Award,
  HeartHandshake,
  ShieldCheck,
  Settings,
  BarChart3,
  UserCircle,
  Megaphone,
  type LucideIcon,
} from "lucide-react";
import { UserRole, AppPermission } from "@/types/auth";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  badgeVariant?: "default" | "secondary" | "warning" | "destructive" | "outline";
  permission?: AppPermission;
}

export interface NavGroup {
  group: string;
  items: NavItem[];
}

// -------------------------------------------------------------
// Dedicated Navigation Structures per Role (Khmer-First)
// -------------------------------------------------------------

export const ADMIN_NAVIGATION: NavGroup[] = [
  {
    group: "ផ្ទាំងគ្រប់គ្រង",
    items: [
      {
        title: "ផ្ទាំងគ្រប់គ្រងទូទៅ",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    group: "ការគ្រប់គ្រងការសិក្សា",
    items: [
      {
        title: "ឆ្នាំសិក្សា",
        href: "/academic-years",
        icon: CalendarDays,
      },
      {
        title: "ថ្នាក់រៀន",
        href: "/classes",
        icon: School,
      },
      {
        title: "មុខវិជ្ជា",
        href: "/subjects",
        icon: BookOpen,
      },
      {
        title: "កាលវិភាគ",
        href: "/schedules",
        icon: Clock,
      },
    ],
  },
  {
    group: "កិច្ចការសិស្ស",
    items: [
      {
        title: "បញ្ជីឈ្មោះសិស្ស",
        href: "/students",
        icon: GraduationCap,
      },
      {
        title: "ពាក្យសុំចូលរៀន",
        href: "/admissions",
        icon: FileText,
        badge: "ថ្មី",
        badgeVariant: "warning",
      },
      {
        title: "ការចុះឈ្មោះចូលរៀន",
        href: "/enrollments",
        icon: UserCheck,
      },
    ],
  },
  {
    group: "ការបង្រៀន & វត្តមាន",
    items: [
      {
        title: "លោកគ្រូ-អ្នកគ្រូ",
        href: "/teachers",
        icon: Users,
      },
      {
        title: "កត់ត្រាវត្តមាន",
        href: "/attendance",
        icon: CheckSquare,
      },
      {
        title: "ពិន្ទុ & លទ្ធផលសិក្សា",
        href: "/grades",
        icon: Award,
      },
    ],
  },
  {
    group: "សហគមន៍ & គណនី",
    items: [
      {
        title: "អាណាព្យាបាល",
        href: "/parents",
        icon: HeartHandshake,
      },
      {
        title: "គណនីអ្នកប្រើប្រាស់",
        href: "/users",
        icon: ShieldCheck,
      },
    ],
  },
  {
    group: "របាយការណ៍សាលា",
    items: [
      {
        title: "របាយការណ៍ពិន្ទុ",
        href: "/grades",
        icon: BarChart3,
      },
      {
        title: "របាយការណ៍វត្តមាន",
        href: "/attendance",
        icon: BarChart3,
      },
      {
        title: "របាយការណ៍ស្ថិតិសិស្ស",
        href: "/students",
        icon: BarChart3,
      },
    ],
  },
  {
    group: "ប្រព័ន្ធ",
    items: [
      {
        title: "ការកំណត់ប្រព័ន្ធ",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];

export const PRINCIPAL_NAVIGATION: NavGroup[] = [
  {
    group: "ផ្ទាំងគ្រប់គ្រង",
    items: [
      {
        title: "ផ្ទាំងនាយកសាលា",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    group: "ការគ្រប់គ្រងការសិក្សា",
    items: [
      {
        title: "ឆ្នាំសិក្សា",
        href: "/academic-years",
        icon: CalendarDays,
      },
      {
        title: "ថ្នាក់រៀន",
        href: "/classes",
        icon: School,
      },
      {
        title: "មុខវិជ្ជា",
        href: "/subjects",
        icon: BookOpen,
      },
      {
        title: "កាលវិភាគ",
        href: "/schedules",
        icon: Clock,
      },
    ],
  },
  {
    group: "កិច្ចការសិស្ស",
    items: [
      {
        title: "បញ្ជីឈ្មោះសិស្ស",
        href: "/students",
        icon: GraduationCap,
      },
      {
        title: "ពាក្យសុំចូលរៀន",
        href: "/admissions",
        icon: FileText,
      },
      {
        title: "ការចុះឈ្មោះចូលរៀន",
        href: "/enrollments",
        icon: UserCheck,
      },
    ],
  },
  {
    group: "ការបង្រៀន & វត្តមាន",
    items: [
      {
        title: "លោកគ្រូ-អ្នកគ្រូ",
        href: "/teachers",
        icon: Users,
      },
      {
        title: "កត់ត្រាវត្តមាន",
        href: "/attendance",
        icon: CheckSquare,
      },
      {
        title: "ពិន្ទុ & លទ្ធផលសិក្សា",
        href: "/grades",
        icon: Award,
      },
    ],
  },
  {
    group: "របាយការណ៍សាលា",
    items: [
      {
        title: "របាយការណ៍ពិន្ទុ",
        href: "/grades",
        icon: BarChart3,
      },
      {
        title: "របាយការណ៍វត្តមាន",
        href: "/attendance",
        icon: BarChart3,
      },
      {
        title: "របាយការណ៍សិស្ស",
        href: "/students",
        icon: BarChart3,
      },
    ],
  },
];

export const TEACHER_NAVIGATION: NavGroup[] = [
  {
    group: "ផ្ទាំងគ្រប់គ្រង",
    items: [
      {
        title: "ផ្ទាំងគ្រប់គ្រងគ្រូ",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    group: "ថ្នាក់បង្រៀន",
    items: [
      {
        title: "ថ្នាក់រៀនរបស់ខ្ញុំ",
        href: "/classes",
        icon: School,
      },
      {
        title: "សិស្សក្នុងបន្ទុក",
        href: "/students",
        icon: GraduationCap,
      },
      {
        title: "កាលវិភាគបង្រៀន",
        href: "/schedules",
        icon: Clock,
      },
    ],
  },
  {
    group: "កិច្ចការបង្រៀន",
    items: [
      {
        title: "កត់ត្រាវត្តមានសិស្ស",
        href: "/attendance",
        icon: CheckSquare,
      },
      {
        title: "បញ្ចូលពិន្ទុ & និទ្ទេស",
        href: "/grades",
        icon: Award,
      },
    ],
  },
];

export const STUDENT_NAVIGATION: NavGroup[] = [
  {
    group: "ផ្ទាំងគ្រប់គ្រង",
    items: [
      {
        title: "ផ្ទាំងសិក្សារបស់ខ្ញុំ",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    group: "ព័ត៌មានសិក្សា",
    items: [
      {
        title: "ថ្នាក់រៀន",
        href: "/classes",
        icon: School,
      },
      {
        title: "មុខវិជ្ជាសិក្សា",
        href: "/subjects",
        icon: BookOpen,
      },
      {
        title: "កាលវិភាគសិក្សា",
        href: "/schedules",
        icon: Clock,
      },
      {
        title: "វត្តមានរបស់ខ្ញុំ",
        href: "/attendance",
        icon: CheckSquare,
      },
      {
        title: "លទ្ធផលពិន្ទុ & និទ្ទេស",
        href: "/grades",
        icon: Award,
      },
    ],
  },
  {
    group: "គណនី",
    items: [
      {
        title: "ព័ត៌មានរូបខ្ញុំ",
        href: "/settings",
        icon: UserCircle,
      },
    ],
  },
];

export const PARENT_NAVIGATION: NavGroup[] = [
  {
    group: "ផ្ទាំងគ្រប់គ្រង",
    items: [
      {
        title: "ផ្ទាំងអាណាព្យាបាល",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    group: "ការសិក្សារបស់កូន",
    items: [
      {
        title: "ព័ត៌មានកូនៗ",
        href: "/students",
        icon: GraduationCap,
      },
      {
        title: "វត្តមានសិក្សា",
        href: "/attendance",
        icon: CheckSquare,
      },
      {
        title: "ពិន្ទុ & ចំណាត់ថ្នាក់",
        href: "/grades",
        icon: Award,
      },
      {
        title: "កាលវិភាគប្រចាំសប្តាហ៍",
        href: "/schedules",
        icon: Clock,
      },
    ],
  },
  {
    group: "ព័ត៌មានសាលា",
    items: [
      {
        title: "សេចក្តីជូនដំណឹង",
        href: "/dashboard",
        icon: Megaphone,
      },
      {
        title: "បញ្ជីគ្រូបង្រៀន",
        href: "/teachers",
        icon: Users,
      },
    ],
  },
];

export const STAFF_NAVIGATION: NavGroup[] = [
  {
    group: "ផ្ទាំងគ្រប់គ្រង",
    items: [
      {
        title: "ផ្ទាំងការិយាល័យ",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    group: "ចុះឈ្មោះ & សិស្ស",
    items: [
      {
        title: "ពាក្យសុំចូលរៀន",
        href: "/admissions",
        icon: FileText,
        badge: "រង់ចាំ",
        badgeVariant: "warning",
      },
      {
        title: "ការចុះឈ្មោះចូលរៀន",
        href: "/enrollments",
        icon: UserCheck,
      },
      {
        title: "បញ្ជីឈ្មោះសិស្ស",
        href: "/students",
        icon: GraduationCap,
      },
    ],
  },
  {
    group: "ការរៀបចំការសិក្សា",
    items: [
      {
        title: "ឆ្នាំសិក្សា",
        href: "/academic-years",
        icon: CalendarDays,
      },
      {
        title: "ថ្នាក់រៀន",
        href: "/classes",
        icon: School,
      },
      {
        title: "កត់ត្រាវត្តមាន",
        href: "/attendance",
        icon: CheckSquare,
      },
    ],
  },
];

// Helper to retrieve navigation for any given role
export function getNavigationForRole(role?: string): NavGroup[] {
  const normalized = (role?.toUpperCase() || "ADMIN") as UserRole;

  switch (normalized) {
    case "PRINCIPAL":
      return PRINCIPAL_NAVIGATION;
    case "TEACHER":
      return TEACHER_NAVIGATION;
    case "STUDENT":
      return STUDENT_NAVIGATION;
    case "PARENT":
      return PARENT_NAVIGATION;
    case "STAFF":
      return STAFF_NAVIGATION;
    case "ADMIN":
    default:
      return ADMIN_NAVIGATION;
  }
}

export const navigationConfig = ADMIN_NAVIGATION;
