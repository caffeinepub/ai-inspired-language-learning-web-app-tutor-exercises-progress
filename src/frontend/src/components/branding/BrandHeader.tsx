interface BrandHeaderProps {
  size?: 'small' | 'large';
}

export default function BrandHeader({ size = 'small' }: BrandHeaderProps) {
  const dimensions = size === 'large' ? 'h-16 w-16' : 'h-10 w-10';

  return (
    <div className="flex items-center gap-3">
      <img
        src="/assets/generated/language-logo.dim_512x512.png"
        alt="Language Learning Logo"
        className={`${dimensions} object-contain`}
      />
      {size === 'large' && (
        <span className="text-2xl font-bold text-foreground">LinguaLearn</span>
      )}
    </div>
  );
}
