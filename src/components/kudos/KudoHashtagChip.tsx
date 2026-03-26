interface KudoHashtagChipProps {
  name: string;
}

export function KudoHashtagChip({ name }: KudoHashtagChipProps): React.ReactElement {
  return <span className="whitespace-nowrap font-montserrat text-[13px] font-medium text-[#d4271d]">#{name}</span>;
}
