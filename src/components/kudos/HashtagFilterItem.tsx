interface HashtagFilterItemProps {
  name: string;
  isSelected: boolean;
  onClick: () => void;
}

export function HashtagFilterItem({
  name,
  isSelected,
  onClick,
}: HashtagFilterItemProps): React.ReactElement {
  return (
    <li
      role="option"
      aria-selected={isSelected}
      onClick={onClick}
      className={[
        ' cursor-pointer flex h-14 cursor-pointer items-center rounded px-4 py-1',
        'font-montserrat text-base font-bold tracking-[0.5px] text-white',
        'transition-[background-color] duration-100 ease-in-out',
        isSelected
          ? 'bg-[var(--color-hashtag-item-selected-bg)] [text-shadow:var(--text-shadow-hashtag-glow)]'
          : 'hover:bg-[var(--color-hashtag-item-selected-bg)]',
      ].join(' ')}
    >
      #{name}
    </li>
  );
}
