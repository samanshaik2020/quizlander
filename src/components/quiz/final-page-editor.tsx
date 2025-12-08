"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FinalPage {
  title: string;
  body: string;
  buttonText: string;
  buttonAction: "retake" | "url";
  buttonUrl?: string;
}

interface FinalPageEditorProps {
  finalPage: FinalPage;
  onUpdate: (finalPage: FinalPage) => void;
}

export function FinalPageEditor({ finalPage, onUpdate }: FinalPageEditorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Completion Page</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="finalTitle">Title</Label>
          <Input
            id="finalTitle"
            value={finalPage.title}
            onChange={(e) => onUpdate({ ...finalPage, title: e.target.value })}
            placeholder="Congratulations!"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="finalBody">Message</Label>
          <Textarea
            id="finalBody"
            value={finalPage.body}
            onChange={(e) => onUpdate({ ...finalPage, body: e.target.value })}
            placeholder="You have completed the quiz."
            className="min-h-[100px]"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="buttonText">Button Text</Label>
            <Input
              id="buttonText"
              value={finalPage.buttonText}
              onChange={(e) =>
                onUpdate({ ...finalPage, buttonText: e.target.value })
              }
              placeholder="Retake Quiz"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="buttonAction">Button Action</Label>
            <Select
              value={finalPage.buttonAction}
              onValueChange={(value: "retake" | "url") =>
                onUpdate({ ...finalPage, buttonAction: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="retake">Retake Quiz</SelectItem>
                <SelectItem value="url">Go to URL</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {finalPage.buttonAction === "url" && (
          <div className="space-y-2">
            <Label htmlFor="buttonUrl">Button URL</Label>
            <Input
              id="buttonUrl"
              value={finalPage.buttonUrl || ""}
              onChange={(e) =>
                onUpdate({ ...finalPage, buttonUrl: e.target.value })
              }
              placeholder="https://example.com"
              type="url"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
