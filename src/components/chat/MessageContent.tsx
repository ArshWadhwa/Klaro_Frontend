'use client';

import React from 'react';
import { Copy, Check, Link2 } from 'lucide-react';
import { useState } from 'react';

interface MessageContentProps {
  content: string;
}

export const MessageContent: React.FC<MessageContentProps> = ({ content }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Parse markdown content into blocks
  const parseContent = (text: string) => {
    const lines = text.split('\n');
    const blocks: any[] = [];
    let currentBlock = '';
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Check for heading
      if (line.match(/^#{1,6}\s/)) {
        if (currentBlock) {
          blocks.push({ type: 'text', content: currentBlock });
          currentBlock = '';
        }

        const headingMatch = line.match(/^(#{1,6})\s(.+)$/);
        if (headingMatch) {
          const level = headingMatch[1].length;
          const text = headingMatch[2];
          blocks.push({ type: 'heading', level, content: text });
        }
        i++;
        continue;
      }

      // Check for blockquote
      if (line.trim().startsWith('> ')) {
        if (currentBlock) {
          blocks.push({ type: 'text', content: currentBlock });
          currentBlock = '';
        }

        let quoteContent = '';
        while (i < lines.length && lines[i].trim().startsWith('> ')) {
          quoteContent += lines[i].replace(/^>\s?/, '') + '\n';
          i++;
        }

        blocks.push({
          type: 'blockquote',
          content: quoteContent.trimEnd(),
        });
        continue;
      }

      // Check for horizontal rule
      if (line.match(/^(---|===|\*\*\*|___)\s*$/) && line.length >= 3) {
        if (currentBlock) {
          blocks.push({ type: 'text', content: currentBlock });
          currentBlock = '';
        }

        blocks.push({ type: 'hr' });
        i++;
        continue;
      }

      // Check for code block
      if (line.trim().startsWith('```')) {
        if (currentBlock) {
          blocks.push({ type: 'text', content: currentBlock });
          currentBlock = '';
        }

        const language = line.trim().slice(3).trim() || 'text';
        let codeContent = '';
        i++;

        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeContent += lines[i] + '\n';
          i++;
        }

        blocks.push({
          type: 'code',
          language,
          content: codeContent.trimEnd(),
        });
        i++; // Skip closing ```
        continue;
      }

      // Check for markdown table
      if (line.includes('|') && (i + 1 < lines.length && lines[i + 1].includes('|'))) {
        if (currentBlock) {
          blocks.push({ type: 'text', content: currentBlock });
          currentBlock = '';
        }

        const tableLines: string[] = [];
        while (
          i < lines.length &&
          lines[i].trim() &&
          lines[i].includes('|')
        ) {
          tableLines.push(lines[i]);
          i++;
        }

        if (tableLines.length > 0) {
          blocks.push({ type: 'table', content: tableLines });
        }
        continue;
      }

      currentBlock += line + '\n';
      i++;
    }

    if (currentBlock) {
      blocks.push({ type: 'text', content: currentBlock });
    }

    return blocks;
  };

  // Parse markdown table
  const parseTable = (lines: string[]) => {
    if (lines.length < 2) return null;

    const headerLine = lines[0];
    const separatorLine = lines[1];

    // Parse headers
    const headers = headerLine
      .split('|')
      .slice(1, -1)
      .map((h) => h.trim());

    // Parse alignment from separator
    const alignments = separatorLine
      .split('|')
      .slice(1, -1)
      .map((sep) => {
        const trimmed = sep.trim();
        if (trimmed.startsWith(':') && trimmed.endsWith(':')) return 'center';
        if (trimmed.endsWith(':')) return 'right';
        if (trimmed.startsWith(':')) return 'left';
        return 'left';
      });

    // Parse rows
    const rows = lines
      .slice(2)
      .filter((line) => line.trim() && line.includes('|'))
      .map((line) =>
        line
          .split('|')
          .slice(1, -1)
          .map((cell) => cell.trim())
      );

    return { headers, alignments, rows };
  };

  // Render inline code
  const renderInlineCode = (text: string) => {
    return text.split(/(`[^`]+`)/g).map((part, idx) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={idx}
            className="bg-[#1a1a1f] px-2 py-1 rounded text-cyan-400 font-mono text-sm border border-[#2a2a2f]"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  // Render links
  const renderLinks = (text: string) => {
    return text.split(/(\[([^\]]+)\]\(([^)]+)\))/g).map((part, idx) => {
      const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (match) {
        return (
          <a
            key={idx}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline inline-flex items-center gap-1 transition-colors"
          >
            {match[1]}
            <Link2 className="h-3 w-3 inline flex-shrink-0" />
          </a>
        );
      }
      return part;
    });
  };

  // Render text with markdown formatting
  const renderText = (text: string) => {
    return text.split('\n').map((line, idx) => {
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      let content: any = line;

      // Bold
      content = renderTextWithPattern(content, /\*\*([^*]+)\*\*/g, 'strong');
      // Italic
      content = renderTextWithPattern(content, /\*([^*]+)\*/g, 'em');
      // Strikethrough
      content = renderTextWithPattern(content, /~~([^~]+)~~/g, 'del');
      
      // Inline code
      if (typeof content === 'string') {
        content = renderInlineCode(content);
      }

      // Links
      if (typeof content === 'string') {
        content = renderLinks(content);
      }

      return (
        <div key={idx} className="text-white">
          {content}
        </div>
      );
    });
  };

  const renderTextWithPattern = (
    content: any,
    pattern: RegExp,
    tag: 'strong' | 'em' | 'del'
  ) => {
    if (typeof content !== 'string') return content;

    const parts = content.split(pattern);
    return parts.map((part, idx) => {
      if (idx % 2 === 0) return part;
      return React.createElement(tag, { key: idx, className: tag === 'del' ? 'line-through' : '' }, part);
    });
  };

  const blocks = parseContent(content);

  return (
    <div className="space-y-3">
      {blocks.map((block, idx) => {
        if (block.type === 'text') {
          return (
            <div key={idx} className="text-sm leading-relaxed text-gray-100">
              {renderText(block.content)}
            </div>
          );
        }

        if (block.type === 'heading') {
          const headingSizes = {
            1: 'text-lg font-bold',
            2: 'text-base font-bold',
            3: 'text-sm font-bold',
            4: 'text-sm font-semibold',
            5: 'text-xs font-semibold',
            6: 'text-xs font-semibold',
          };
          
          return (
            <div
              key={idx}
              className={`${headingSizes[block.level as keyof typeof headingSizes]} text-white mt-3 mb-2 border-l-2 border-blue-500 pl-3`}
            >
              {block.content}
            </div>
          );
        }

        if (block.type === 'blockquote') {
          return (
            <div
              key={idx}
              className="border-l-4 border-blue-500 bg-[#0f0f12] pl-4 py-2 text-gray-300 italic rounded-r"
            >
              {renderText(block.content)}
            </div>
          );
        }

        if (block.type === 'hr') {
          return <div key={idx} className="border-t border-[#2a2a2f] my-3" />;
        }

        if (block.type === 'code') {
          const codeId = `code-${idx}`;
          return (
            <div key={idx} className="bg-[#0f0f12] rounded-lg border border-[#2a2a2f] overflow-hidden my-2">
              <div className="flex items-center justify-between px-4 py-2 bg-[#131316] border-b border-[#2a2a2f]">
                <span className="text-md font-mono text-gray-400">
                  {block.language}
                </span>
                <button
                  onClick={() => copyToClipboard(block.content, codeId)}
                  className="p-1.5 hover:bg-[#2a2a2f] rounded transition-colors"
                  title="Copy code"
                >
                  {copiedId === codeId ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-400 hover:text-white" />
                  )}
                </button>
              </div>
              <pre className="px-4 py-3 overflow-x-auto">
                <code className={`text-sm font-mono text-gray-300 language-${block.language}`}>
                  {block.content}
                </code>
              </pre>
            </div>
          );
        }

        if (block.type === 'table') {
          const tableData = parseTable(block.content);
          if (!tableData) return null;

          const { headers, alignments, rows } = tableData;
          const tableId = `table-${idx}`;

          return (
            <div
              key={idx}
              className="overflow-x-auto border border-[#2a2a2f] rounded-lg bg-[#0f0f12] my-2"
            >
              <div className="flex items-center justify-between px-4 py-2 bg-[#131316] border-b border-[#2a2a2f]">
                <span className="text-xs text-gray-400 font-medium">Table</span>
                <button
                  onClick={() => {
                    const csvContent = [
                      headers.join(','),
                      ...rows.map((row) =>
                        row
                          .map((cell) =>
                            cell.includes(',')
                              ? `"${cell}"`
                              : cell
                          )
                          .join(',')
                      ),
                    ].join('\n');
                    copyToClipboard(csvContent, tableId);
                  }}
                  className="p-1.5 hover:bg-[#2a2a2f] rounded transition-colors"
                  title="Copy table"
                >
                  {copiedId === tableId ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-400 hover:text-white" />
                  )}
                </button>
              </div>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[#2a2a2f] bg-[#1a1a1f]">
                    {headers.map((header, i) => (
                      <th
                        key={i}
                        className="px-4 py-3 text-left font-semibold text-white hover:bg-[#2a2a2f] transition-colors"
                        style={{ textAlign: alignments[i] as any }}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, rowIdx) => (
                    <tr
                      key={rowIdx}
                      className={`border-b border-[#2a2a2f] hover:bg-[#1a1a1f] transition-colors ${
                        rowIdx % 2 === 0 ? 'bg-[#0f0f12]' : 'bg-[#131316]'
                      }`}
                    >
                      {row.map((cell, cellIdx) => (
                        <td
                          key={cellIdx}
                          className="px-4 py-3 text-gray-300 text-sm overflow-hidden text-ellipsis"
                          style={{
                            textAlign: alignments[cellIdx] as any,
                          }}
                        >
                          {renderInlineCode(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};
