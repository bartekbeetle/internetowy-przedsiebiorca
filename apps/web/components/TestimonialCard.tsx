interface TestimonialCardProps {
  name: string;
  quote: string;
  result?: string;
}

export function TestimonialCard({ name, quote, result }: TestimonialCardProps) {
  return (
    <div className="p-6 rounded-lg bg-white border border-slate-200">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
          <span className="text-orange-600 font-bold text-sm">
            {name.charAt(0)}
          </span>
        </div>
        <span className="font-semibold text-slate-900">{name}</span>
      </div>
      <blockquote className="mt-4 text-slate-600 italic">
        &ldquo;{quote}&rdquo;
      </blockquote>
      {result && (
        <p className="mt-3 text-sm font-medium text-orange-600">{result}</p>
      )}
    </div>
  );
}
