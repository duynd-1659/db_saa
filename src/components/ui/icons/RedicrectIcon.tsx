interface IconProps {
  className?: string;
}

export function RedirectIcon({ className }: IconProps): React.ReactElement {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M8.49945 18.3114L5.68945 15.5014L12.0595 9.12141H7.10945V5.69141H18.3095V16.8914H14.8895V11.9414L8.49945 18.3114Z"
        fill="currentColor"
      />
    </svg>
  );
}
