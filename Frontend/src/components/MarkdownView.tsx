import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface MarkdownViewProps {
  content: string;
}

/**
 * Clean, lightweight renderer for AI responses supporting:
 * - Code blocks with copy button & language header
 * - Headers (H1, H2, H3, H4)
 * - Lists (bulleted & numbered)
 * - Blockquotes
 * - Bold / Italics / Inline code
 */
export const MarkdownView: React.FC<MarkdownViewProps> = ({ content }) => {
  const parseMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeContent = '';
    let codeLanguage = '';
    let inList: 'ul' | 'ol' | null = null;
    let listItems: React.ReactNode[] = [];

    const flushList = () => {
      if (inList && listItems.length > 0) {
        if (inList === 'ul') {
          elements.push(
            <ul key={`ul-${elements.length}`} className="my-3 ml-4 space-y-1 list-disc text-slate-300">
              {listItems}
            </ul>
          );
        } else {
          elements.push(
            <ol key={`ol-${elements.length}`} className="my-3 ml-4 space-y-1 list-decimal text-slate-300">
              {listItems}
            </ol>
          );
        }
        inList = null;
        listItems = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code block delimiters
      if (line.trim().startsWith('```')) {
        flushList();
        if (inCodeBlock) {
          elements.push(
            <CodeSnippet key={`code-${elements.length}`} code={codeContent.trim()} language={codeLanguage} />
          );
          inCodeBlock = false;
          codeContent = '';
          codeLanguage = '';
        } else {
          inCodeBlock = true;
          codeLanguage = line.trim().slice(3).trim();
        }
        continue;
      }

      if (inCodeBlock) {
        codeContent += line + '\n';
        continue;
      }

      // Empty line
      if (!line.trim()) {
        flushList();
        continue;
      }

      // Headers
      if (line.startsWith('#### ')) {
        flushList();
        elements.push(
          <h4 key={`h4-${elements.length}`} className="text-base font-semibold text-cyan-300 mt-4 mb-2">
            {formatInline(line.slice(5))}
          </h4>
        );
        continue;
      }
      if (line.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={`h3-${elements.length}`} className="text-lg font-semibold text-slate-100 mt-4 mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            {formatInline(line.slice(4))}
          </h3>
        );
        continue;
      }
      if (line.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={`h2-${elements.length}`} className="text-xl font-bold text-slate-100 mt-5 mb-3 border-b border-slate-800/80 pb-1">
            {formatInline(line.slice(3))}
          </h2>
        );
        continue;
      }
      if (line.startsWith('# ')) {
        flushList();
        elements.push(
          <h1 key={`h1-${elements.length}`} className="text-2xl font-extrabold text-white mt-6 mb-3">
            {formatInline(line.slice(2))}
          </h1>
        );
        continue;
      }

      // Blockquotes
      if (line.startsWith('> ')) {
        flushList();
        elements.push(
          <blockquote key={`quote-${elements.length}`} className="border-l-2 border-cyan-500/80 pl-3 py-1 my-3 text-slate-400 italic bg-cyan-950/20 rounded-r">
            {formatInline(line.slice(2))}
          </blockquote>
        );
        continue;
      }

      // Unordered list
      const ulMatch = line.match(/^(\*|-)\s+(.*)/);
      if (ulMatch) {
        if (inList !== 'ul') {
          flushList();
          inList = 'ul';
        }
        listItems.push(
          <li key={`li-${listItems.length}`} className="leading-relaxed">
            {formatInline(ulMatch[2])}
          </li>
        );
        continue;
      }

      // Ordered list
      const olMatch = line.match(/^(\d+)\.\s+(.*)/);
      if (olMatch) {
        if (inList !== 'ol') {
          flushList();
          inList = 'ol';
        }
        listItems.push(
          <li key={`li-${listItems.length}`} className="leading-relaxed">
            {formatInline(olMatch[2])}
          </li>
        );
        continue;
      }

      // Regular Paragraph
      flushList();
      elements.push(
        <p key={`p-${elements.length}`} className="mb-3 leading-relaxed text-slate-300">
          {formatInline(line)}
        </p>
      );
    }

    // Flush remaining list
    flushList();

    // If unclosed codeblock
    if (inCodeBlock && codeContent) {
      elements.push(
        <CodeSnippet key={`code-${elements.length}`} code={codeContent.trim()} language={codeLanguage} />
      );
    }

    return elements;
  };

  return <div className="markdown-body space-y-1">{parseMarkdown(content)}</div>;
};

/**
 * Formats inline bold (**text**), italics (*text*), inline code (`code`)
 */
function formatInline(text: string): React.ReactNode {
  // Regex to split inline patterns
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyIndex = 0;

  while (remaining.length > 0) {
    // Inline code: `code`
    const codeMatch = remaining.match(/`([^`]+)`/);
    // Bold: **text** or __text__
    const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);

    let earliestIndex = remaining.length;
    let matchType: 'code' | 'bold' | null = null;
    let matchedText = '';
    let capturedText = '';

    if (codeMatch && codeMatch.index !== undefined && codeMatch.index < earliestIndex) {
      earliestIndex = codeMatch.index;
      matchType = 'code';
      matchedText = codeMatch[0];
      capturedText = codeMatch[1];
    }

    if (boldMatch && boldMatch.index !== undefined && boldMatch.index < earliestIndex) {
      earliestIndex = boldMatch.index;
      matchType = 'bold';
      matchedText = boldMatch[0];
      capturedText = boldMatch[1];
    }

    if (!matchType) {
      parts.push(remaining);
      break;
    }

    // Push text before the match
    if (earliestIndex > 0) {
      parts.push(remaining.substring(0, earliestIndex));
    }

    // Push formatted element
    if (matchType === 'code') {
      parts.push(
        <code
          key={`inline-code-${keyIndex++}`}
          className="px-1.5 py-0.5 text-xs font-mono text-cyan-300 bg-slate-800/80 border border-slate-700/60 rounded"
        >
          {capturedText}
        </code>
      );
    } else if (matchType === 'bold') {
      parts.push(
        <strong key={`inline-bold-${keyIndex++}`} className="font-semibold text-slate-100">
          {capturedText}
        </strong>
      );
    }

    remaining = remaining.substring(earliestIndex + matchedText.length);
  }

  return parts;
}

const CodeSnippet: React.FC<{ code: string; language?: string }> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-lg border border-slate-800 bg-[#090d16] overflow-hidden shadow-lg">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 text-xs font-mono text-slate-400">
        <span className="text-cyan-400 uppercase tracking-wider">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto text-xs sm:text-sm font-mono text-slate-200 leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
};
