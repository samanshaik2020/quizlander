"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  RotateCcw,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import type { FinalPage, FinalPageStyles } from "@/types";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface FinalPageEditorProps {
  finalPage: FinalPage;
  onUpdate: (finalPage: FinalPage) => void;
}

const defaultStyles: FinalPageStyles = {
  backgroundColor: "#f8fafc",
  backgroundImage: "",
  backgroundOverlay: "rgba(0,0,0,0)",
  cardBackgroundColor: "#ffffff",
  cardBorderRadius: "12",
  cardShadow: "lg",
  titleFontSize: "24",
  titleColor: "#1f2937",
  titleFontWeight: "700",
  bodyFontSize: "14",
  bodyColor: "#6b7280",
  scoreFontSize: "48",
  scoreColor: "#3b82f6",
  iconColor: "#3b82f6",
  iconBackgroundColor: "#eff6ff",
  showIcon: true,
  buttonBackgroundColor: "#1f2937",
  buttonTextColor: "#ffffff",
  buttonBorderRadius: "8",
  buttonFontSize: "14",
};

const fontSizeOptions = [
  { value: "12", label: "12px" },
  { value: "14", label: "14px" },
  { value: "16", label: "16px" },
  { value: "18", label: "18px" },
  { value: "20", label: "20px" },
  { value: "24", label: "24px" },
  { value: "28", label: "28px" },
  { value: "32", label: "32px" },
  { value: "36", label: "36px" },
  { value: "40", label: "40px" },
  { value: "48", label: "48px" },
  { value: "56", label: "56px" },
  { value: "64", label: "64px" },
];

const fontWeightOptions = [
  { value: "400", label: "Normal" },
  { value: "500", label: "Medium" },
  { value: "600", label: "Semibold" },
  { value: "700", label: "Bold" },
  { value: "800", label: "Extra Bold" },
];

const shadowOptions = [
  { value: "none", label: "None" },
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
  { value: "xl", label: "Extra Large" },
  { value: "2xl", label: "2XL" },
];

const shadowClasses: Record<string, string> = {
  none: "",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
  "2xl": "shadow-2xl",
};

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</Label>
      <div className="relative">
        <Input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="pl-10 border-slate-300 dark:border-slate-700"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span
            className="w-4 h-4 rounded-sm border border-slate-300 dark:border-slate-600"
            style={{ backgroundColor: value || "#ffffff" }}
          />
        </div>
        <input
          type="color"
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-y-0 left-0 w-10 opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
}

function Section({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
          <h3 className="font-medium text-slate-800 dark:text-slate-200">{title}</h3>
          <ChevronDown
            className={cn(
              "h-5 w-5 text-slate-500 dark:text-slate-400 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
            {children}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export function FinalPageEditor({ finalPage, onUpdate }: FinalPageEditorProps) {
  const styles = { ...defaultStyles, ...finalPage.styles };

  const updateStyles = (newStyles: Partial<FinalPageStyles>) => {
    onUpdate({
      ...finalPage,
      styles: { ...styles, ...newStyles },
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]">
      {/* Editor Section - Left Side */}
      <div className="flex flex-col min-h-0">
        {/* Content/Design Toggle */}
        <Tabs defaultValue="design" className="w-full flex flex-col min-h-0">
          <TabsList className="w-full h-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <TabsTrigger
              value="content"
              className="flex-1 py-2 text-sm font-medium rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm"
            >
              Content
            </TabsTrigger>
            <TabsTrigger
              value="design"
              className="flex-1 py-2 text-sm font-medium rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm"
            >
              Design
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="mt-6 space-y-4 flex-1 overflow-y-auto min-h-0">
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Title</Label>
                <Input
                  value={finalPage.title}
                  onChange={(e) => onUpdate({ ...finalPage, title: e.target.value })}
                  placeholder="Congratulations!"
                  className="border-slate-300 dark:border-slate-700"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Message</Label>
                <Textarea
                  value={finalPage.body}
                  onChange={(e) => onUpdate({ ...finalPage, body: e.target.value })}
                  placeholder="You have completed the quiz."
                  className="min-h-[80px] border-slate-300 dark:border-slate-700"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Button Text</Label>
                <Input
                  value={finalPage.buttonText}
                  onChange={(e) => onUpdate({ ...finalPage, buttonText: e.target.value })}
                  placeholder="Retake Quiz"
                  className="border-slate-300 dark:border-slate-700"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Button Action</Label>
                <Select
                  value={finalPage.buttonAction}
                  onValueChange={(value: "retake" | "url") => onUpdate({ ...finalPage, buttonAction: value })}
                >
                  <SelectTrigger className="border-slate-300 dark:border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retake">Retake Quiz</SelectItem>
                    <SelectItem value="url">Go to URL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {finalPage.buttonAction === "url" && (
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Button URL</Label>
                  <Input
                    value={finalPage.buttonUrl || ""}
                    onChange={(e) => onUpdate({ ...finalPage, buttonUrl: e.target.value })}
                    placeholder="https://example.com"
                    type="url"
                    className="border-slate-300 dark:border-slate-700"
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="design" className="mt-6 space-y-4 flex-1 overflow-y-auto min-h-0">
            {/* Background Section */}
            <Section title="Background" defaultOpen>
              <ColorInput
                label="Background Color"
                value={styles.backgroundColor || ""}
                onChange={(value) => updateStyles({ backgroundColor: value })}
              />
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Background Image URL</Label>
                <Input
                  value={styles.backgroundImage || ""}
                  onChange={(e) => updateStyles({ backgroundImage: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="border-slate-300 dark:border-slate-700"
                />
              </div>
            </Section>

            {/* Card Section */}
            <Section title="Card" defaultOpen>
              <ColorInput
                label="Card Background"
                value={styles.cardBackgroundColor || ""}
                onChange={(value) => updateStyles({ cardBackgroundColor: value })}
              />
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Border Radius: {styles.cardBorderRadius}px
                </Label>
                <Slider
                  value={[parseInt(styles.cardBorderRadius || "12")]}
                  onValueChange={([value]) => updateStyles({ cardBorderRadius: value.toString() })}
                  max={40}
                  min={0}
                  step={1}
                  className="py-2"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Shadow</Label>
                <Select
                  value={styles.cardShadow || "lg"}
                  onValueChange={(value) => updateStyles({ cardShadow: value })}
                >
                  <SelectTrigger className="border-slate-300 dark:border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {shadowOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </Section>

            {/* Typography Section */}
            <Section title="Typography" defaultOpen>
              {/* Title */}
              <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Title</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Font Size</Label>
                  <Select
                    value={styles.titleFontSize || "24"}
                    onValueChange={(value) => updateStyles({ titleFontSize: value })}
                  >
                    <SelectTrigger className="border-slate-300 dark:border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontSizeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Font Weight</Label>
                  <Select
                    value={styles.titleFontWeight || "700"}
                    onValueChange={(value) => updateStyles({ titleFontWeight: value })}
                  >
                    <SelectTrigger className="border-slate-300 dark:border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontWeightOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <ColorInput
                label="Title Color"
                value={styles.titleColor || ""}
                onChange={(value) => updateStyles({ titleColor: value })}
              />

              {/* Message */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
                <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Message</p>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Font Size</Label>
                  <Select
                    value={styles.bodyFontSize || "14"}
                    onValueChange={(value) => updateStyles({ bodyFontSize: value })}
                  >
                    <SelectTrigger className="border-slate-300 dark:border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontSizeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <ColorInput
                  label="Message Color"
                  value={styles.bodyColor || ""}
                  onChange={(value) => updateStyles({ bodyColor: value })}
                />
              </div>

              {/* Score */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
                <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Score</p>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Font Size</Label>
                  <Select
                    value={styles.scoreFontSize || "48"}
                    onValueChange={(value) => updateStyles({ scoreFontSize: value })}
                  >
                    <SelectTrigger className="border-slate-300 dark:border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontSizeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <ColorInput
                  label="Score Color"
                  value={styles.scoreColor || ""}
                  onChange={(value) => updateStyles({ scoreColor: value })}
                />
              </div>
            </Section>

            {/* Button Section */}
            <Section title="Button">
              <ColorInput
                label="Button Background"
                value={styles.buttonBackgroundColor || ""}
                onChange={(value) => updateStyles({ buttonBackgroundColor: value })}
              />
              <ColorInput
                label="Button Text Color"
                value={styles.buttonTextColor || ""}
                onChange={(value) => updateStyles({ buttonTextColor: value })}
              />
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Border Radius: {styles.buttonBorderRadius}px
                </Label>
                <Slider
                  value={[parseInt(styles.buttonBorderRadius || "8")]}
                  onValueChange={([value]) => updateStyles({ buttonBorderRadius: value.toString() })}
                  max={24}
                  min={0}
                  step={1}
                  className="py-2"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Font Size</Label>
                <Select
                  value={styles.buttonFontSize || "14"}
                  onValueChange={(value) => updateStyles({ buttonFontSize: value })}
                >
                  <SelectTrigger className="border-slate-300 dark:border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontSizeOptions.slice(0, 7).map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </Section>
          </TabsContent>
        </Tabs>
      </div>

      {/* Preview Section - Right Side */}
      <div className="sticky top-8">
        <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg">
          <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-4">Live Preview</h3>
          <div
            className="p-8 rounded-lg flex items-center justify-center min-h-[400px]"
            style={{
              backgroundColor: styles.backgroundColor,
              backgroundImage: styles.backgroundImage
                ? `url(${styles.backgroundImage})`
                : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Card */}
            <div
              className={`w-full max-w-sm p-8 text-center flex flex-col items-center space-y-4 ${
                shadowClasses[styles.cardShadow || "lg"]
              }`}
              style={{
                backgroundColor: styles.cardBackgroundColor,
                borderRadius: `${styles.cardBorderRadius}px`,
              }}
            >
              {/* Icon */}
              {styles.showIcon !== false && (
                <div
                  className="p-4 rounded-full"
                  style={{ backgroundColor: styles.iconBackgroundColor }}
                >
                  <Trophy
                    className="h-8 w-8"
                    style={{ color: styles.iconColor }}
                  />
                </div>
              )}

              {/* Title */}
              <h2
                style={{
                  fontSize: `${styles.titleFontSize}px`,
                  fontWeight: styles.titleFontWeight,
                  color: styles.titleColor,
                }}
              >
                {finalPage.title || "Congratulations!"}
              </h2>

              {/* Score */}
              <p
                className="font-bold"
                style={{
                  fontSize: `${styles.scoreFontSize}px`,
                  color: styles.scoreColor,
                }}
              >
                85%
              </p>

              {/* Message */}
              <div
                style={{
                  fontSize: `${styles.bodyFontSize}px`,
                  color: styles.bodyColor,
                }}
              >
                <p>You scored 17 out of 20</p>
                <p>{finalPage.body || "You have completed the quiz."}</p>
              </div>

              {/* Button */}
              <button
                className="w-full py-3 flex items-center justify-center gap-2 font-medium transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: styles.buttonBackgroundColor,
                  color: styles.buttonTextColor,
                  borderRadius: `${styles.buttonBorderRadius}px`,
                  fontSize: `${styles.buttonFontSize}px`,
                }}
              >
                {finalPage.buttonAction === "retake" ? (
                  <RotateCcw className="h-4 w-4" />
                ) : (
                  <ExternalLink className="h-4 w-4" />
                )}
                {finalPage.buttonText || "Retake Quiz"}
              </button>
            </div>
          </div>
          <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-4">
            Sample preview with example score
          </p>
        </div>
      </div>
    </div>
  );
}
