'use client';

import DOMPurify from 'dompurify';

interface KudoRichContentProps {
  html: string;
  className?: string;
}

export function KudoRichContent({ html, className }: KudoRichContentProps): React.ReactElement {
  const clean =
    typeof window !== 'undefined'
      ? DOMPurify.sanitize(html, {
          ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 's', 'ol', 'li', 'a', 'blockquote', 'span'],
          ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'data-type', 'data-id', 'data-label'],
        })
      : html;

  return (
    <div
      className={className}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
