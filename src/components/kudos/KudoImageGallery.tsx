import Image from 'next/image';
import type { KudoImage } from '@/types/kudos';

interface KudoImageGalleryProps {
  images: KudoImage[];
}

export function KudoImageGallery({ images }: KudoImageGalleryProps): React.ReactElement | null {
  if (images.length === 0) return null;

  const displayed = images.slice(0, 5);

  return (
    <div className="flex flex-row gap-4">
      {displayed.map((img) => (
        <a
          key={img.order_index}
          href={img.url}
          target="_blank"
          rel="noopener noreferrer"
          className="relative h-[88px] w-[88px] flex-shrink-0 overflow-hidden rounded-[18px] border border-[#998C5F]"
        >
          <Image src={img.url} alt="" fill className="object-cover" sizes="500px" />
        </a>
      ))}
    </div>
  );
}
