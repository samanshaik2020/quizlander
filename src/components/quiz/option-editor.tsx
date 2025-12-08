"use client";

import { Input } from "@/components/ui/input";
import { Check, Trash2 } from "lucide-react";

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
  order: number;
}

interface OptionEditorProps {
  option: Option;
  onUpdate: (option: Option) => void;
  onDelete: () => void;
  canDelete: boolean;
}

export function OptionEditor({
  option,
  onUpdate,
  onDelete,
  canDelete,
}: OptionEditorProps) {
  return (
    <div className="flex items-center space-x-3">
      <button
        type="button"
        onClick={() => onUpdate({ ...option, isCorrect: !option.isCorrect })}
        className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${
          option.isCorrect
            ? "bg-green-500 text-white"
            : "bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 hover:bg-gray-300 dark:hover:bg-gray-500"
        }`}
      >
        {option.isCorrect && <Check className="h-4 w-4" />}
      </button>
      <Input
        value={option.text}
        onChange={(e) => onUpdate({ ...option, text: e.target.value })}
        placeholder="Enter option text..."
        className="flex-grow bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md focus:ring-gray-500 focus:border-gray-500 placeholder-gray-500 dark:placeholder-gray-400"
      />
      <button
        type="button"
        onClick={onDelete}
        disabled={!canDelete}
        className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
}
