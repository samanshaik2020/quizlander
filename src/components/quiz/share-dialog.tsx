"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Copy, Link, Code } from "lucide-react";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slug: string;
  title: string;
}

export function ShareDialog({
  open,
  onOpenChange,
  slug,
  title,
}: ShareDialogProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const playUrl = `${baseUrl}/play/${slug}`;
  const embedCode = `<iframe src="${playUrl}" width="100%" height="600" frameborder="0" title="${title}"></iframe>`;

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Quiz</DialogTitle>
          <DialogDescription>
            Share your quiz with others using a link or embed it on your
            website.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="link" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link">
              <Link className="h-4 w-4 mr-2" />
              Link
            </TabsTrigger>
            <TabsTrigger value="embed">
              <Code className="h-4 w-4 mr-2" />
              Embed
            </TabsTrigger>
          </TabsList>
          <TabsContent value="link" className="space-y-4">
            <div className="space-y-2">
              <Label>Quiz URL</Label>
              <div className="flex gap-2">
                <Input value={playUrl} readOnly className="flex-1" />
                <Button
                  type="button"
                  size="icon"
                  onClick={() => copyToClipboard(playUrl, "link")}
                >
                  {copied === "link" ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="embed" className="space-y-4">
            <div className="space-y-2">
              <Label>Embed Code</Label>
              <Textarea value={embedCode} readOnly className="font-mono text-sm" />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => copyToClipboard(embedCode, "embed")}
              >
                {copied === "embed" ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Embed Code
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
