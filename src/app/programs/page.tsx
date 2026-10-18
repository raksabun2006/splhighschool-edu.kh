import { BookOpen, Compass, FlaskConical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PublicPageShell } from "@/components/public/public-page-shell";

const programs = [
  [BookOpen, "កម្រិតអនុវិទ្យាល័យ", "ថ្នាក់ទី ៧ ដល់ ទី ៩", "មុខវិជ្ជាមូលដ្ឋាន ភាសាខ្មែរ គណិតវិទ្យា វិទ្យាសាស្ត្រ និងភាសាបរទេស។"],
  [FlaskConical, "ផ្នែកវិទ្យាសាស្ត្រពិត", "ថ្នាក់ទី ១០ ដល់ ទី ១២", "គណិតវិទ្យា រូបវិទ្យា គីមីវិទ្យា និងជីវវិទ្យា ត្រៀមសម្រាប់ការសិក្សាថ្នាក់ឧត្តម។"],
  [Compass, "ផ្នែកវិទ្យាសាស្ត្រសង្គម", "ថ្នាក់ទី ១០ ដល់ ទី ១២", "ប្រវត្តិវិទ្យា ភូមិវិទ្យា សីលធម៌-ពលរដ្ឋ និងសេដ្ឋកិច្ចវិទ្យា។"],
] as const;

export default function ProgramsPage() {
  return (
    <PublicPageShell title="កម្មវិធីសិក្សា" description="កម្មវិធីសិក្សាចម្រុះ ស្របតាមតម្រូវការរបស់សិស្ស និងគោលការណ៍អប់រំជាតិ។">
      <div className="grid gap-5 lg:grid-cols-3">
        {programs.map(([Icon, title, grade, text]) => (
          <Card key={title} className="flex flex-col"><CardHeader><Icon className="mb-3 h-9 w-9 text-[#1b365d] dark:text-blue-400" /><CardTitle>{title}</CardTitle><p className="text-sm font-medium text-emerald-600">{grade}</p></CardHeader><CardContent className="flex-1 leading-7 text-muted-foreground">{text}</CardContent></Card>
        ))}
      </div>
    </PublicPageShell>
  );
}
