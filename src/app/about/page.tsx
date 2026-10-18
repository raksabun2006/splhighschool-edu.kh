import { BookOpen, HeartHandshake, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PublicPageShell } from "@/components/public/public-page-shell";

const values = [
  [BookOpen, "ការសិក្សាមានគុណភាព", "បង្កើតមូលដ្ឋានចំណេះដឹងរឹងមាំ និងជំនាញសម្រាប់អនាគត។"],
  [HeartHandshake, "សហគមន៍រួបរួម", "សហការជាមួយមាតាបិតា សិស្ស និងសហគមន៍ ដើម្បីជោគជ័យរបស់សិស្ស។"],
  [ShieldCheck, "សុវត្ថិភាព និងសីលធម៌", "លើកកម្ពស់ការគោរព ការទទួលខុសត្រូវ និងបរិយាកាសសិក្សាប្រកបដោយសុវត្ថិភាព។"],
] as const;

export default function AboutPage() {
  return (
    <PublicPageShell title="អំពីសាលា" description="ស្វែងយល់អំពីបេសកកម្ម គោលតម្លៃ និងបរិយាកាសសិក្សារបស់វិទ្យាល័យសំរោងពន្លៃ។">
      <div className="grid gap-5 md:grid-cols-3">
        {values.map(([Icon, title, text]) => (
          <Card key={title}><CardHeader><Icon className="mb-3 h-8 w-8 text-emerald-500" /><CardTitle>{title}</CardTitle></CardHeader><CardContent className="text-sm leading-7 text-muted-foreground">{text}</CardContent></Card>
        ))}
      </div>
      <Card className="mt-6"><CardHeader><CardTitle>បេសកកម្មរបស់យើង</CardTitle></CardHeader><CardContent className="max-w-4xl leading-8 text-muted-foreground">យើងប្តេជ្ញាផ្តល់ការអប់រំប្រកបដោយគុណភាព សមធម៌ និងការយកចិត្តទុកដាក់ ដើម្បីឱ្យសិស្សគ្រប់រូបអភិវឌ្ឍចំណេះដឹង សមត្ថភាព និងចរិតលក្ខណៈល្អ។</CardContent></Card>
    </PublicPageShell>
  );
}
