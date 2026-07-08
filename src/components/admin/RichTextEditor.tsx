import { useEffect, useRef, useState } from "react";
import type { AdminAuth } from "~/server/functions";
import { ImagePickerModal } from "./ImagePicker";

/**
 * Summernote-style rich text editor: a contentEditable surface with a toolbar
 * for bold/italic/underline, headings, lists, alignment, links, and image
 * insertion via the site image library (with drag & drop upload).
 */

type Tool = {
  label: string;
  title: string;
  command?: string;
  arg?: string;
  action?: "link" | "image" | "clear";
  separatorBefore?: boolean;
};

const tools: Tool[] = [
  { label: "B", title: "Bold", command: "bold" },
  { label: "I", title: "Italic", command: "italic" },
  { label: "U", title: "Underline", command: "underline" },
  { label: "S", title: "Strikethrough", command: "strikeThrough" },
  { label: "H2", title: "Heading", command: "formatBlock", arg: "h2", separatorBefore: true },
  { label: "H3", title: "Subheading", command: "formatBlock", arg: "h3" },
  { label: "¶", title: "Paragraph", command: "formatBlock", arg: "p" },
  { label: "❝", title: "Quote", command: "formatBlock", arg: "blockquote" },
  { label: "•", title: "Bullet list", command: "insertUnorderedList", separatorBefore: true },
  { label: "1.", title: "Numbered list", command: "insertOrderedList" },
  { label: "⇤", title: "Align left", command: "justifyLeft", separatorBefore: true },
  { label: "↔", title: "Align center", command: "justifyCenter" },
  { label: "⇥", title: "Align right", command: "justifyRight" },
  { label: "🔗", title: "Insert link", action: "link", separatorBefore: true },
  { label: "🖼", title: "Insert image", action: "image" },
  { label: "⌫", title: "Clear formatting", action: "clear", separatorBefore: true },
];

export function RichTextEditor({
  value,
  onChange,
  auth,
}: {
  value: string;
  onChange: (html: string) => void;
  auth: AdminAuth;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  // Remember where the caret was before the image modal steals focus.
  const savedRange = useRef<Range | null>(null);

  // Only push external value into the DOM when it actually differs, so typing
  // isn't disrupted by our own onChange round-trips.
  useEffect(() => {
    const el = editorRef.current;
    if (el && el.innerHTML !== value) el.innerHTML = value;
  }, [value]);

  const emit = () => {
    const el = editorRef.current;
    if (el) onChange(el.innerHTML);
  };

  const exec = (command: string, arg?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    emit();
  };

  const handleTool = (tool: Tool) => {
    if (tool.command) {
      exec(tool.command, tool.arg);
      return;
    }
    if (tool.action === "link") {
      const url = window.prompt("Link URL (https://…):");
      if (url) exec("createLink", url);
      return;
    }
    if (tool.action === "clear") {
      exec("removeFormat");
      return;
    }
    if (tool.action === "image") {
      const sel = window.getSelection();
      savedRange.current = sel && sel.rangeCount > 0 ? sel.getRangeAt(0).cloneRange() : null;
      setPickerOpen(true);
    }
  };

  const insertImage = (path: string) => {
    setPickerOpen(false);
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    if (savedRange.current) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(savedRange.current);
    }
    document.execCommand("insertImage", false, path);
    emit();
  };

  return (
    <div className="rounded-xl border border-gray-300 dark:border-gray-700 overflow-hidden bg-white dark:bg-dark-bg">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40">
        {tools.map((tool) => (
          <span key={tool.title} className="flex items-center">
            {tool.separatorBefore && <span className="mx-1 h-5 w-px bg-gray-300 dark:bg-gray-700" />}
            <button
              type="button"
              title={tool.title}
              onMouseDown={(e) => e.preventDefault() /* keep the editor selection */}
              onClick={() => handleTool(tool)}
              className="min-w-[30px] h-8 px-1.5 text-sm font-semibold rounded-md text-gray-700 dark:text-gray-200 hover:bg-primary/10 hover:text-primary dark:hover:text-primary-light transition-colors"
            >
              {tool.label}
            </button>
          </span>
        ))}
      </div>

      {/* Editable surface */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onBlur={emit}
        className="rich-content min-h-[220px] max-h-[480px] overflow-y-auto px-4 py-3 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
      />

      {pickerOpen && <ImagePickerModal auth={auth} onSelect={insertImage} onClose={() => setPickerOpen(false)} />}
    </div>
  );
}

/** Convert legacy plain-text content (paragraph array or single string) to editor HTML. */
export const paragraphsToHtml = (value: unknown): string => {
  if (Array.isArray(value)) return value.map((p) => `<p>${String(p)}</p>`).join("");
  if (typeof value === "string" && value.trim()) return `<p>${value}</p>`;
  return "";
};
