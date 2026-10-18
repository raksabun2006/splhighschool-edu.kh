import { GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PublicPageShell } from "@/components/public/public-page-shell";

const faculty = [
  ["លោក សុខ ផល្លា", "នាយកវិទ្យាល័យ", "គណៈគ្រប់គ្រងសាលា"],
  ["លោកស្រី ម៉ៅ សុគន្ធា", "នាយករងទទួលបន្ទុកសិក្សា", "ការិយាល័យសិក្សា"],
  ["លោក គង់ វិចិត្រ", "ប្រធានដេប៉ាតឺម៉ង់គណិតវិទ្យា", "ផ្នែកគណិតវិទ្យា"],
  ["អ្នកគ្រូ ចាន់ សុភា", "ប្រធានដេប៉ាតឺម៉ង់រូបវិទ្យា", "ផ្នែកវិទ្យាសាស្ត្រ"],
];

export default function FacultyPage() {
  return (
    <PublicPageShell title="លោកគ្រូ-អ្នកគ្រូ" description="ស្គាល់ក្រុមគណៈគ្រប់គ្រង និងបុគ្គលិកអប់រំដែលយកចិត្តទុកដាក់ចំពោះការរីកចម្រើនរបស់សិស្ស។">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{faculty.map(([name, role, department]) => <Card key={name}><CardHeader><div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#1b365d]/10 text-[#1b365d] dark:text-blue-400"><GraduationCap className="h-6 w-6" /></div><CardTitle className="text-base">{name}</CardTitle></CardHeader><CardContent><p className="font-medium text-emerald-600">{role}</p><p className="mt-2 text-sm text-muted-foreground">{department}</p></CardContent></Card>)}</div>
    </PublicPageShell>
  );
}
