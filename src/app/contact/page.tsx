import { Mail, MapPin, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PublicPageShell } from "@/components/public/public-page-shell";

const contacts = [[MapPin, "អាសយដ្ឋាន", "ស្រុកអង្គរបុរី ខេត្តតាកែវ (Angkor Borei, Takeo)"], [Phone, "ទូរស័ព្ទ", "០១២ ៣៤៥ ៦៧៨"], [Mail, "អ៊ីមែល", "info@samrongponley.edu.kh"]] as const;

export default function ContactPage() {
  return (
    <PublicPageShell title="ទំនាក់ទំនង" description="សូមទាក់ទងមកកាន់សាលា ប្រសិនបើលោកអ្នកត្រូវការព័ត៌មានអំពីការសិក្សា ឬការចុះឈ្មោះចូលរៀន។">
      <div className="grid gap-5 md:grid-cols-3">{contacts.map(([Icon, label, value]) => <Card key={label}><CardHeader><Icon className="mb-3 h-8 w-8 text-emerald-600" /><CardTitle>{label}</CardTitle></CardHeader><CardContent className="text-muted-foreground">{value}</CardContent></Card>)}</div>
      <Card className="mt-6"><CardHeader><CardTitle>ម៉ោងធ្វើការ</CardTitle></CardHeader><CardContent className="leading-8 text-muted-foreground">ច័ន្ទ - សុក្រ៖ ៧:០០ ព្រឹក - ៥:០០ ល្ងាច<br />សៅរ៍៖ ៧:០០ ព្រឹក - ១១:០០ ព្រឹក</CardContent></Card>
    </PublicPageShell>
  );
}
