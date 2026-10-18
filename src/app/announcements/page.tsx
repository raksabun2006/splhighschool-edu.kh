import { CalendarDays, Megaphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PublicPageShell } from "@/components/public/public-page-shell";

const announcements = [
  ["ការបើកទទួលពាក្យចុះឈ្មោះចូលរៀន ឆ្នាំសិក្សា ២០២៥ - ២០២៦", "១០ កញ្ញា ២០២៥", "វិទ្យាល័យសំរោងពន្លៃបើកទទួលពាក្យសុំចុះឈ្មោះចូលរៀនតាមប្រព័ន្ធឌីជីថល។"],
  ["កាលវិភាគប្រឡងឆមាសលើកទី ១", "០៥ កញ្ញា ២០២៥", "សិស្សានុសិស្សទាំងអស់ត្រូវត្រៀមខ្លួន និងពិនិត្យកាលវិភាគប្រឡងជាមុន។"],
  ["កម្មវិធីប្រកួតប្រជែងសិស្សពូកែ", "២៨ សីហា ២០២៥", "ការជ្រើសរើសបេក្ខជនឆ្នើមផ្នែកគណិតវិទ្យា រូបវិទ្យា និងអក្សរសាស្ត្រខ្មែរ។"],
];

export default function AnnouncementsPage() {
  return (
    <PublicPageShell title="សេចក្តីជូនដំណឹង" description="ព័ត៌មានថ្មីៗ និងសេចក្តីជូនដំណឹងសម្រាប់សិស្ស មាតាបិតា និងសហគមន៍សាលា។">
      <div className="space-y-5">{announcements.map(([title, date, text]) => <Card key={title}><CardHeader className="flex-row items-start gap-4 space-y-0"><div className="rounded-lg bg-emerald-500/10 p-3"><Megaphone className="h-6 w-6 text-emerald-600" /></div><div><CardTitle>{title}</CardTitle><p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><CalendarDays className="h-3.5 w-3.5" />{date}</p></div></CardHeader><CardContent className="pl-[4.5rem] leading-7 text-muted-foreground">{text}</CardContent></Card>)}</div>
    </PublicPageShell>
  );
}
