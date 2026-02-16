import Link from "next/link";

interface ProductCardProps {
  badge?: string;
  title: string;
  features: string[];
  price: string;
  originalPrice?: string;
  ctaText: string;
  ctaHref: string;
  highlighted?: boolean;
}

export function ProductCard({
  badge,
  title,
  features,
  price,
  originalPrice,
  ctaText,
  ctaHref,
  highlighted = false,
}: ProductCardProps) {
  return (
    <div
      className={`relative rounded-lg p-8 flex flex-col ${
        highlighted
          ? "bg-gradient-to-b from-orange-500/10 to-brand-secondary border-2 border-orange-500"
          : "bg-brand-secondary border border-slate-700"
      }`}
    >
      {badge && (
        <div className="absolute -top-3 left-6">
          <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-bold uppercase bg-orange-500 text-white">
            {badge}
          </span>
        </div>
      )}

      <h3 className="text-xl font-bold text-white">{title}</h3>

      <ul className="mt-6 space-y-3 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-slate-300">
            <span className="text-orange-500 mt-0.5">&#10003;</span>
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-8">
        {originalPrice && (
          <p className="text-sm text-slate-500 line-through">{originalPrice}</p>
        )}
        <p className="text-2xl font-bold text-white">{price}</p>
      </div>

      <Link
        href={ctaHref}
        className={`mt-4 inline-flex items-center justify-center h-12 px-6 font-semibold rounded-lg transition-colors text-center ${
          highlighted
            ? "bg-orange-500 text-white hover:bg-orange-600"
            : "bg-slate-700 text-white hover:bg-slate-600"
        }`}
      >
        {ctaText}
      </Link>
    </div>
  );
}
