"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, ChevronUp } from "lucide-react";
import { OptionEditor } from "./option-editor";
import { nanoid } from "nanoid";

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
  order: number;
}

interface Question {
  id: string;
  text: string;
  order: number;
  options: Option[];
}

interface QuestionEditorProps {
  question: Question;
  questionNumber: number;
  onUpdate: (question: Question) => void;
  onDelete: () => void;
  canDelete: boolean;
}

export function QuestionEditor({
  question,
  questionNumber,
  onUpdate,
  onDelete,
  canDelete,
}: QuestionEditorProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const addOption = () => {
    const newOption: Option = {
      id: nanoid(),
      text: "",
      isCorrect: false,
      order: question.options.length,
    };
    onUpdate({
      ...question,
      options: [...question.options, newOption],
    });
  };

  const updateOption = (index: number, updatedOption: Option) => {
    const newOptions = [...question.options];
    newOptions[index] = updatedOption;
    onUpdate({ ...question, options: newOptions });
  };

  const deleteOption = (index: number) => {
    const newOptions = question.options
      .filter((_, i) => i !== index)
      .map((opt, i) => ({ ...opt, order: i }));
    onUpdate({ ...question, options: newOptions });
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Question {questionNumber}
        </h2>
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <ChevronUp className={`h-5 w-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={!canDelete}
            className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          {/* Question Text */}
          <Textarea
            value={question.text}
            onChange={(e) => onUpdate({ ...question, text: e.target.value })}
            placeholder="Type your question here..."
            rows={3}
            className="w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md focus:ring-gray-500 focus:border-gray-500 placeholder-gray-500 dark:placeholder-gray-400"
          />

          {/* Options Section */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Options <span className="text-gray-400 dark:text-gray-500 font-normal">(check the correct answer)</span>
            </h3>
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <OptionEditor
                  key={option.id}
                  option={option}
                  onUpdate={(opt) => updateOption(index, opt)}
                  onDelete={() => deleteOption(index)}
                  canDelete={question.options.length > 2}
                />
              ))}
            </div>
          </div>

          {/* Add Option Button */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={addOption}
              className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <Plus className="h-5 w-5" />
              <span>Add Option</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
