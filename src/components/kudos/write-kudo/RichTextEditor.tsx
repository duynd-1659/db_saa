'use client';

import { useState, useCallback, useRef } from 'react';
import { useEditor, EditorContent, ReactRenderer } from '@tiptap/react';
import { mergeAttributes } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Mention from '@tiptap/extension-mention';
import type { SuggestionProps } from '@tiptap/suggestion';
import tippy, { type Instance as TippyInstance } from 'tippy.js';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { AddLinkModal } from './AddLinkModal';
import type { RecipientProfile } from '@/types/kudo-write';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  error?: string;
}

interface ToolbarButton {
  icon: string;
  label: string;
  action: () => void;
  isActive: boolean;
  borderRadius?: string;
}

/* ── Mention suggestion list (rendered inside tippy popup) ── */

interface MentionListProps {
  items: RecipientProfile[];
  command: (item: { id: string; label: string }) => void;
}

function MentionList({ items, command }: MentionListProps): React.ReactElement {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const selectItem = useCallback(
    (index: number) => {
      const item = items[index];
      if (item) {
        command({ id: item.id, label: item.full_name });
        setSelectedIndex(index);
      }
    },
    [items, command],
  );

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-[var(--color-border)] bg-white p-3 shadow-lg">
        <p className="font-montserrat text-sm text-[var(--color-hint-text)]">
          Không tìm thấy đồng nghiệp
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-60 overflow-y-auto rounded-lg border border-[var(--color-border)] bg-white shadow-lg">
      {items.map((item, index) => (
        <button
          key={item.id}
          type="button"
          onClick={() => selectItem(index)}
          className={`cursor-pointer flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-[var(--color-btn-secondary-bg)] ${
            index === selectedIndex ? 'bg-[var(--color-btn-secondary-bg)]' : ''
          }`}
        >
          {item.avatar_url ? (
            <Image
              src={item.avatar_url}
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
              unoptimized
            />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-gold)] font-montserrat text-sm font-bold text-[var(--color-page-bg)]">
              {item.full_name.charAt(0)}
            </span>
          )}
          <div className="flex flex-col">
            <span className="font-montserrat text-sm font-semibold text-[var(--color-page-bg)]">
              {item.full_name}
            </span>
            {item.department_name && (
              <span className="font-montserrat text-xs text-[var(--color-hint-text)]">
                {item.department_name}
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

/* ── Main component ── */

import React from 'react';

export function RichTextEditor({
  content,
  onChange,
  error,
}: RichTextEditorProps): React.ReactElement {
  const t = useTranslations('writeKudo');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [, forceUpdate] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        codeBlock: false,
        code: false,
        horizontalRule: false,
        hardBreak: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-blue-600 underline' },
      }),
      Placeholder.configure({
        placeholder: t('contentPlaceholder'),
      }),
      Mention.extend({
        renderHTML({ node, HTMLAttributes }) {
          return [
            'a',
            mergeAttributes(HTMLAttributes, {
              href: `/profile/${node.attrs.id}`,
              class: 'mention text-blue-600 font-semibold hover:underline',
            }),
            `@${node.attrs.label}`,
          ];
        },
      }).configure({
        HTMLAttributes: {},
        suggestion: {
          char: '@',
          allowSpaces: true,
          items: async ({ query }: { query: string }) => {
            if (query.length < 2) return [];
            return new Promise<RecipientProfile[]>((resolve) => {
              if (debounceRef.current) clearTimeout(debounceRef.current);
              debounceRef.current = setTimeout(async () => {
                try {
                  const res = await fetch(`/api/profiles/search?q=${encodeURIComponent(query)}`);
                  if (!res.ok) {
                    resolve([]);
                    return;
                  }
                  const data = await res.json();
                  resolve(data as RecipientProfile[]);
                } catch {
                  resolve([]);
                }
              }, 300);
            });
          },
          render: () => {
            let component: ReactRenderer | null = null;
            let popup: TippyInstance[] | null = null;

            return {
              onStart: (props: SuggestionProps) => {
                component = new ReactRenderer(MentionList, {
                  props,
                  editor: props.editor,
                });

                if (!props.clientRect) return;

                popup = tippy('body', {
                  getReferenceClientRect: props.clientRect as () => DOMRect,
                  appendTo: () => document.body,
                  content: component.element,
                  showOnCreate: true,
                  interactive: true,
                  trigger: 'manual',
                  placement: 'bottom-start',
                });
              },
              onUpdate: (props: SuggestionProps) => {
                component?.updateProps(props);
                if (props.clientRect && popup?.[0]) {
                  popup[0].setProps({
                    getReferenceClientRect: props.clientRect as () => DOMRect,
                  });
                }
              },
              onKeyDown: (props: { event: KeyboardEvent }) => {
                if (props.event.key === 'Escape') {
                  popup?.[0]?.hide();
                  return true;
                }
                return false;
              },
              onExit: () => {
                popup?.[0]?.destroy();
                component?.destroy();
              },
            };
          },
        },
      }),
    ],
    content,
    onTransaction: () => forceUpdate((n) => n + 1),
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'min-h-[120px] w-full bg-[var(--color-input-bg)] rounded-b-lg p-4 font-montserrat text-base text-[var(--color-page-bg)] focus:outline-none prose prose-sm prose-p:my-0 prose-blockquote:my-0 prose-ol:my-0 prose-li:my-0 max-w-none',
      },
    },
  });

  if (!editor) return <div className="h-[180px] animate-pulse rounded-lg bg-gray-100" />;

  const toolbarButtons: ToolbarButton[] = [
    {
      icon: '/assets/kudos/icons/toolbar-bold.svg',
      label: t('aria.boldButton'),
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
      borderRadius: 'rounded-tl-lg',
    },
    {
      icon: '/assets/kudos/icons/toolbar-italic.svg',
      label: t('aria.italicButton'),
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
    },
    {
      icon: '/assets/kudos/icons/toolbar-strikethrough.svg',
      label: t('aria.strikeButton'),
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive('strike'),
    },
    {
      icon: '/assets/kudos/icons/toolbar-ordered-list.svg',
      label: t('aria.listButton'),
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
    },
    {
      icon: '/assets/kudos/icons/toolbar-link.svg',
      label: t('aria.linkButton'),
      action: () => setShowLinkModal(true),
      isActive: editor.isActive('link'),
    },
    {
      icon: '/assets/kudos/icons/toolbar-quote.svg',
      label: t('aria.quoteButton'),
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive('blockquote'),
    },
  ];

  return (
    <div className="flex flex-col">
      <label className="font-montserrat text-[22px] font-bold leading-[28px] text-[var(--color-page-bg)] mb-4">
        {t('contentLabel')} <span className="text-red-500">*</span>
      </label>
      <div
        className={`mb-1 overflow-hidden rounded-lg border ${
          error ? 'border-red-500' : 'border-[var(--color-border)]'
        }`}
      >
        {/* Toolbar — connected border bar layout */}
        <div className="flex flex-row items-center">
          {toolbarButtons.map((btn) => (
            <button
              key={btn.label}
              type="button"
              onClick={btn.action}
              aria-label={btn.label}
              className={`cursor-pointer flex h-10 items-center justify-center border border-[var(--color-border)] px-4 py-[10px] ${btn.borderRadius ?? ''} ${
                btn.isActive ? 'bg-[#e0d8bd]' : 'bg-transparent'
              }`}
            >
              <Image src={btn.icon} alt="" width={24} height={24} aria-hidden="true" />
            </button>
          ))}
          {/* Tiêu chuẩn cộng đồng */}
          <button
            type="button"
            className="ml-auto flex h-10 w-[336px] items-center justify-end border border-[var(--color-border)] bg-transparent px-4 py-[10px] font-montserrat text-base font-bold text-[#E46060] rounded-tr-lg"
          >
            {t('communityStandards')}
          </button>
        </div>

        {/* Editor content */}
        <EditorContent editor={editor} />
      </div>

      <p className="font-montserrat font-bold tracking-[0.5px] text-center">{t('contentHint')}</p>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Addlink Box modal */}
      {showLinkModal && (
        <AddLinkModal
          onSave={(text, url) => {
            if (editor) {
              editor.chain().focus().insertContent(`<a href="${url}">${text}</a>`).run();
            }
            setShowLinkModal(false);
          }}
          onCancel={() => setShowLinkModal(false)}
        />
      )}
    </div>
  );
}
