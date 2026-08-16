'use client';

import {useState, useRef} from 'react';
import {sanitizeHtml} from '@/lib/sanitize';

export function LightweightContentEditor({
  value,
  onChange
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  function wrapSelection(startTag: string, endTag: string, defaultText = '') {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const currentText = el.value;
    const selected = currentText.substring(start, end) || defaultText;
    const replacement = `${startTag}${selected}${endTag}`;
    const nextVal = currentText.substring(0, start) + replacement + currentText.substring(end);
    onChange(nextVal);

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + startTag.length, start + startTag.length + selected.length);
    }, 0);
  }

  function insertBlock(snippet: string) {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const currentText = el.value;
    const nextVal = currentText.substring(0, start) + `\n${snippet}\n` + currentText.substring(end);
    onChange(nextVal);

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + snippet.length + 2, start + snippet.length + 2);
    }, 0);
  }

  function promptLink() {
    const url = window.prompt('Enter link URL (https://…):');
    if (!url) return;
    wrapSelection(`<a href="${url}" target="_blank" rel="noopener noreferrer">`, '</a>', 'link text');
  }

  function promptImage() {
    const url = window.prompt('Enter image URL:');
    if (!url) return;
    const caption = window.prompt('Enter caption (optional):') || '';
    insertBlock(`<figure class="editorial-figure">\n  <img src="${url}" alt="${caption}" />\n  ${caption ? `<figcaption>${caption}</figcaption>` : ''}\n</figure>`);
  }

  return (
    <div style={{ border: '1px solid #333', borderRadius: 6, overflow: 'hidden', background: '#121413' }}>
      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 6,
          padding: '8px 12px',
          background: '#191c1a',
          borderBottom: '1px solid #333'
        }}
      >
        <div style={{ display: 'flex', gap: 4, marginRight: 12 }}>
          <button
            type="button"
            className="btn"
            style={{
              padding: '4px 10px',
              fontSize: 12,
              background: tab === 'write' ? '#d4af37' : '#141715',
              color: tab === 'write' ? '#000' : '#fff',
              fontWeight: tab === 'write' ? 700 : 500
            }}
            onClick={() => setTab('write')}
          >
            Write
          </button>
          <button
            type="button"
            className="btn"
            style={{
              padding: '4px 10px',
              fontSize: 12,
              background: tab === 'preview' ? '#d4af37' : '#141715',
              color: tab === 'preview' ? '#000' : '#fff',
              fontWeight: tab === 'preview' ? 700 : 500
            }}
            onClick={() => setTab('preview')}
          >
            Preview
          </button>
        </div>

        {tab === 'write' && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            <button
              type="button"
              className="btn"
              style={{ padding: '3px 8px', fontSize: 11 }}
              onClick={() => wrapSelection('<h2>', '</h2>', 'Section Heading')}
            >
              H2
            </button>
            <button
              type="button"
              className="btn"
              style={{ padding: '3px 8px', fontSize: 11 }}
              onClick={() => wrapSelection('<h3>', '</h3>', 'Subheading')}
            >
              H3
            </button>
            <button
              type="button"
              className="btn"
              style={{ padding: '3px 8px', fontSize: 11 }}
              onClick={() => wrapSelection('<p>', '</p>', 'Paragraph content')}
            >
              P
            </button>
            <button
              type="button"
              className="btn"
              style={{ padding: '3px 8px', fontSize: 11, fontWeight: 700 }}
              onClick={() => wrapSelection('<strong>', '</strong>', 'bold text')}
            >
              B
            </button>
            <button
              type="button"
              className="btn"
              style={{ padding: '3px 8px', fontSize: 11, fontStyle: 'italic' }}
              onClick={() => wrapSelection('<em>', '</em>', 'italic text')}
            >
              I
            </button>
            <button
              type="button"
              className="btn"
              style={{ padding: '3px 8px', fontSize: 11 }}
              onClick={promptLink}
            >
              Link
            </button>
            <button
              type="button"
              className="btn"
              style={{ padding: '3px 8px', fontSize: 11 }}
              onClick={() => insertBlock('<ul>\n  <li>First item</li>\n  <li>Second item</li>\n</ul>')}
            >
              • List
            </button>
            <button
              type="button"
              className="btn"
              style={{ padding: '3px 8px', fontSize: 11 }}
              onClick={() => insertBlock('<ol>\n  <li>Step 1</li>\n  <li>Step 2</li>\n</ol>')}
            >
              1. List
            </button>
            <button
              type="button"
              className="btn"
              style={{ padding: '3px 8px', fontSize: 11 }}
              onClick={() => wrapSelection('<blockquote>\n  <p>', '</p>\n</blockquote>', 'Quote text here')}
            >
              “ Quote
            </button>
            <button
              type="button"
              className="btn"
              style={{ padding: '3px 8px', fontSize: 11 }}
              onClick={promptImage}
            >
              + Image & Caption
            </button>
          </div>
        )}
      </div>

      {/* Editor Content Area */}
      {tab === 'write' ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={14}
          style={{
            width: '100%',
            fontFamily: 'monospace',
            fontSize: 13,
            lineHeight: 1.6,
            background: '#0d0f0e',
            color: '#e5e5e5',
            padding: 16,
            border: 'none',
            outline: 'none',
            resize: 'vertical'
          }}
          placeholder="Write your editorial story in clean semantic HTML (<p>, <h2>, <h3>, <blockquote>, <ul>, <figure>)..."
        />
      ) : (
        <div
          className="editorial-preview"
          style={{
            padding: 24,
            minHeight: 320,
            background: '#0d0f0e',
            color: '#e5e5e5',
            lineHeight: 1.8,
            fontSize: 15
          }}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(value || '<p style="color: #666">No content yet.</p>') }}
        />
      )}
    </div>
  );
}
