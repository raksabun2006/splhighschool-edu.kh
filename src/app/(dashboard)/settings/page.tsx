"use client";

import React, { useState } from "react";
import { Save, School, Shield, Bell, Sliders, Globe } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { APP_CONFIG } from "@/lib/constants";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "academic" | "notifications" | "security">("general");

  return (
    <div className="space-y-6">
      <PageHeader
        title="ការកំណត់ប្រព័ន្ធ"
        description="ការកំណត់ព័ត៌មានទូទៅរបស់សាលា គោលការណ៍ពិន្ទុ ការជូនដំណឹង និងសុវត្ថិភាពនៃវិទ្យាល័យសំរោងពន្លៃ"
      >
        <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Save className="h-4 w-4" />
          <span>រក្សាទុកការកែប្រែ</span>
        </Button>
      </PageHeader>

      {/* Tabs */}
      <div className="flex border-b border-border space-x-2">
        <button
          onClick={() => setActiveTab("general")}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "general"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          ព័ត៌មានទូទៅរបស់សាលា
        </button>
        <button
          onClick={() => setActiveTab("academic")}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "academic"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          គោលការណ៍សិក្សា & ពិន្ទុ
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "notifications"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          ការជូនដំណឹង
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "security"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          សុវត្ថិភាព & សិទ្ធិប្រើប្រាស់
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "general" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ព័ត៌មានទូទៅរបស់វិទ្យាល័យ</CardTitle>
              <CardDescription>ព័ត៌មានផ្លូវការរបស់វិទ្យាល័យសំរោងពន្លៃ សម្រាប់បង្ហាញលើព្រឹត្តិបត្រពិន្ទុ និងលិខិតរដ្ឋបាល</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">ឈ្មោះសាលារៀន</label>
                  <Input defaultValue={APP_CONFIG.schoolName} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">ប្រព័ន្ធគ្រប់គ្រង</label>
                  <Input defaultValue={APP_CONFIG.fullName} readOnly className="bg-muted" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">អាសយដ្ឋានទីតាំង</label>
                  <Input defaultValue={APP_CONFIG.schoolAddress} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">អ៊ីមែលទំនាក់ទំនងផ្លូវការ</label>
                  <Input defaultValue="info@samrongponley.edu.kh" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">ភាសាប្រើប្រាស់ចម្បង</label>
                  <Select defaultValue="km">
                    <option value="km">ភាសាខ្មែរ (Khmer - ចម្បង)</option>
                    <option value="en">English (Technical)</option>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">ល្វែងម៉ោងប្រព័ន្ធ</label>
                  <Input defaultValue="Asia/Phnom_Penh (UTC+07:00)" readOnly className="bg-muted" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "academic" && (
        <Card>
          <CardHeader>
            <CardTitle>គោលការណ៍វាយតម្លៃ & ពិន្ទុ</CardTitle>
            <CardDescription>កំណត់វិធីសាស្ត្រគណនាមធ្យមភាគនិទ្ទេស (GPA) និងកម្រិតអប្បបរមានៃវត្តមាន</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">ពិន្ទុជាប់អប្បបរមា</label>
                <Input defaultValue="៥០%" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">កម្រិតវត្តមានអប្បបរមា</label>
                <Input defaultValue="៨៥%" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">មាត្រដ្ឋាន GPA</label>
                <Select defaultValue="4">
                  <option value="4">មាត្រដ្ឋាន ៤.០ (4.0 Scale)</option>
                  <option value="100">មាត្រដ្ឋាន ១០០ ពិន្ទុ (100-Point Scale)</option>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "notifications" && (
        <Card>
          <CardHeader>
            <CardTitle>ការកំណត់ការជូនដំណឹងក្នុងប្រព័ន្ធ</CardTitle>
            <CardDescription>រៀបចំការផ្ញើសារជូនដំណឹងដោយស្វ័យប្រវត្តិទៅកាន់អាណាព្យាបាល និងលោកគ្រូ-អ្នកគ្រូ</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-border text-primary" />
                <span className="text-sm text-foreground">ផ្ញើសារ SMS ជូនដំណឹងទៅអាណាព្យាបាលនៅពេលសិស្សអវត្តមានឥតច្បាប់</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-border text-primary" />
                <span className="text-sm text-foreground">ផ្ញើអ៊ីមែលទៅកាន់លេខាធិការដ្ឋាននៅពេលមានពាក្យសុំចុះឈ្មោះចូលរៀនថ្មី</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-border text-primary" />
                <span className="text-sm text-foreground">ផ្ញើរបាយការណ៍សង្ខេបប្រចាំសប្តាហ៍ជូនលោកគ្រូ-អ្នកគ្រូបង្រៀន</span>
              </label>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "security" && (
        <Card>
          <CardHeader>
            <CardTitle>គោលការណ៍សុវត្ថិភាព & ការគ្រប់គ្រងសិទ្ធិ</CardTitle>
            <CardDescription>បទប្បញ្ញត្តិសុវត្ថិភាពក្នុងការចូលប្រើប្រព័ន្ធសម្រាប់បុគ្គលិក និងសិស្សានុសិស្ស</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-muted/40 border border-border">
                <h4 className="text-xs font-semibold text-foreground">រយៈពេលកំណត់នៃវគ្គប្រើប្រាស់ (Session Expiration)</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  ប្រព័ន្ធនឹងចាកចេញដោយស្វ័យប្រវត្តិ (Sign out) នៅពេលដែលគ្មានសកម្មភាពរយៈពេល ៦០ នាទី។
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/40 border border-border">
                <h4 className="text-xs font-semibold text-foreground">ការផ្ទៀងផ្ទាត់ពហុកត្តា (Multi-Factor Authentication - MFA)</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  ត្រូវបានអនុវត្តជាកាតព្វកិច្ចសម្រាប់គណនីអ្នកគ្រប់គ្រងប្រព័ន្ធ (Admin) និងគណៈគ្រប់គ្រងសាលា។
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
