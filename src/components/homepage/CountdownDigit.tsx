type CountdownUnit = 'DAYS' | 'HOURS' | 'MINUTES';

interface CountdownDigitProps {
  value: string;
  unit: CountdownUnit;
  unitLabel: string;
}

export function CountdownDigit({
  value,
  unit,
  unitLabel,
}: CountdownDigitProps): React.ReactElement {
  return (
    <div className="flex flex-col items-center gap-2" aria-label={`${value} ${unit}`}>
      <div
        className={[
          'flex items-center justify-center',
          'w-20 h-20 md:w-24 md:h-24',
          'rounded-xl backdrop-blur-[25px]',
          'border border-[rgba(255,234,158,0.75)]',
          'bg-white/10',
        ].join(' ')}
      >
        <span
          className="font-montserrat-alt font-black text-white text-3xl md:text-4xl leading-none tabular-nums"
          aria-hidden="true"
        >
          {value}
        </span>
      </div>
      <span className="font-montserrat font-bold text-xs text-white/70 tracking-widest">
        {unitLabel}
      </span>
    </div>
  );
}
