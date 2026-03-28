interface FlagIconProps {
  countryCode: string;
  className?: string;
}

function NLFlag() {
  return (
    <svg viewBox="0 0 24 16" width="24" height="16" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="5.33" fill="#AE1C28" />
      <rect y="5.33" width="24" height="5.34" fill="#FFF" />
      <rect y="10.67" width="24" height="5.33" fill="#21468B" />
    </svg>
  );
}

function UKFlag() {
  return (
    <svg viewBox="0 0 24 16" width="24" height="16" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="16" fill="#012169" />
      <path d="M0,0 L24,16 M24,0 L0,16" stroke="#FFF" strokeWidth="2.5" />
      <path d="M0,0 L24,16 M24,0 L0,16" stroke="#C8102E" strokeWidth="1.5" />
      <path d="M12,0 V16 M0,8 H24" stroke="#FFF" strokeWidth="4" />
      <path d="M12,0 V16 M0,8 H24" stroke="#C8102E" strokeWidth="2.4" />
    </svg>
  );
}

function DEFlag() {
  return (
    <svg viewBox="0 0 24 16" width="24" height="16" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="5.33" fill="#000" />
      <rect y="5.33" width="24" height="5.34" fill="#DD0000" />
      <rect y="10.67" width="24" height="5.33" fill="#FFCC00" />
    </svg>
  );
}

function BEFlag() {
  return (
    <svg viewBox="0 0 24 16" width="24" height="16" xmlns="http://www.w3.org/2000/svg">
      <rect width="8" height="16" fill="#000" />
      <rect x="8" width="8" height="16" fill="#FAE042" />
      <rect x="16" width="8" height="16" fill="#ED2939" />
    </svg>
  );
}

const FLAG_COMPONENTS: Record<string, () => JSX.Element> = {
  NL: NLFlag,
  UK: UKFlag,
  DE: DEFlag,
  BE: BEFlag,
};

export default function FlagIcon({ countryCode, className }: FlagIconProps) {
  const Flag = FLAG_COMPONENTS[countryCode];
  if (!Flag) return null;
  return (
    <span className={className} style={{ display: "inline-flex", lineHeight: 0 }}>
      <Flag />
    </span>
  );
}
