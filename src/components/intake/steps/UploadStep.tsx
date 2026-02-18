"use client";

import { useCallback, useRef } from "react";
import type { FileWithMeta } from "@/lib/types";

interface Props {
  files: FileWithMeta[];
  onFilesChange: (files: FileWithMeta[]) => void;
}

const FILE_TYPES: { v: FileWithMeta["file_type"]; l: string }[] = [
  { v: "payslip", l: "תלוש שכר" },
  { v: "contract", l: "חוזה עבודה" },
  { v: "attendance", l: "דוח נוכחות" },
  { v: "other", l: "אחר" },
];

const ACCEPTED = ".pdf,.jpg,.jpeg,.png";
const MAX_FILES = 12;

export default function UploadStep({ files, onFilesChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    (fileList: FileList) => {
      const newFiles: FileWithMeta[] = [];
      for (let i = 0; i < fileList.length && files.length + newFiles.length < MAX_FILES; i++) {
        const file = fileList[i];
        newFiles.push({
          id: crypto.randomUUID(),
          file,
          file_type: "payslip",
        });
      }
      onFilesChange([...files, ...newFiles]);
    },
    [files, onFilesChange]
  );

  const removeFile = (id: string) => {
    onFilesChange(files.filter((f) => f.id !== id));
  };

  const changeType = (id: string, type: FileWithMeta["file_type"]) => {
    onFilesChange(
      files.map((f) => (f.id === id ? { ...f, file_type: type } : f))
    );
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">העלאת מסמכים</h2>
      <p className="text-sm text-gray-500">
        ניתן להעלות עד {MAX_FILES} קבצים (PDF, JPG, PNG)
      </p>

      {/* Drop zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 py-10 transition hover:border-blue-400 hover:bg-blue-50/50"
      >
        <svg
          className="mb-2 h-8 w-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <span className="text-sm text-gray-500">
          גרור קבצים לכאן או לחץ לבחירה
        </span>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          multiple
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((f) => (
            <li
              key={f.id}
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3"
            >
              <span className="flex-1 truncate text-sm">{f.file.name}</span>
              <select
                value={f.file_type}
                onChange={(e) =>
                  changeType(f.id, e.target.value as FileWithMeta["file_type"])
                }
                className="rounded border border-gray-300 px-2 py-1 text-xs"
              >
                {FILE_TYPES.map((ft) => (
                  <option key={ft.v} value={ft.v}>
                    {ft.l}
                  </option>
                ))}
              </select>
              <span className="text-xs text-gray-400">
                {(f.file.size / 1024).toFixed(0)} KB
              </span>
              <button
                type="button"
                onClick={() => removeFile(f.id)}
                className="text-red-500 hover:text-red-700"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
