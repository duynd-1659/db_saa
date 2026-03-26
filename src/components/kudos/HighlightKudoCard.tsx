import type { KudoWithDetails } from '@/types/kudos';
import { KudoCard } from './KudoCard';

interface HighlightKudoCardProps {
  kudo: KudoWithDetails;
}

export function HighlightKudoCard({ kudo }: HighlightKudoCardProps): React.ReactElement {
  return (
    <div className="w-[540px] flex-shrink-0">
      <KudoCard kudo={kudo} contentLineClamp={3} />
    </div>
  );
}
