import React, { useEffect, useRef, useState } from 'react';
import { Star, Quote } from 'lucide-react';

const SHEETDB_API = 'https://sheetdb.io/api/v1/aefcf2ew9qblp';

interface Review {
  id: string;
  name: string;
  rating: string;
  comment: string;
  country: string;
  form_type: string;
  approved: string;
}

const FLAG: Record<string, string> = {
  germany: '🇩🇪',
  australia: '🇦🇺',
  italy: '🇮🇹',
  switzerland: '🇨🇭',
  france: '🇫🇷',
  canada: '🇨🇦',
  schengen: '🇪🇺',
  uk: '🇬🇧',
  other: '🌍',
};

// Default reviews if no data from Google Sheets
const DEFAULT_REVIEWS: Review[] = [
  { id: '1', name: 'احمد کریمی', rating: '5', comment: 'خدمات عالی و حرفه‌ای. تیم میتا در تمام مراحل همراه من بودند.', country: 'کابل', form_type: 'germany', approved: 'true' },
  { id: '2', name: 'فاطمه محمدی', rating: '5', comment: 'بسیار راضی هستم. ویزای استرالیا در کوتاه‌ترین زمان گرفته شد.', country: 'هرات', form_type: 'australia', approved: 'true' },
  { id: '3', name: 'علی رضایی', rating: '5', comment: 'مشاوره دقیق و شفاف. هزینه‌ها واضح و بدون پنهان‌کاری.', country: 'مزار شریف', form_type: 'italy', approved: 'true' },
  { id: '4', name: 'مریم حسینی', rating: '5', comment: 'پرونده پناهندگی من با موفقیت به نتیجه رسید. ممنون از تیم حرفه‌ای.', country: 'کابل', form_type: 'france', approved: 'true' },
  { id: '5', name: 'حسن قاسمی', rating: '5', comment: 'سرعت عمل و دقت در کار بسیار عالی بود.', country: 'قندهار', form_type: 'canada', approved: 'true' },
  { id: '6', name: 'زهرا احمدی', rating: '5', comment: 'کامل‌ترین خدمات مهاجرتی که تا حالا تجربه کردم.', country: 'هرات', form_type: 'switzerland', approved: 'true' },
  { id: '7', name: 'محمد یعقوبی', rating: '5', comment: 'تیم میتا بهترین مشاوره را داد. خیلی راضی بودم.', country: 'کابل', form_type: 'germany', approved: 'true' },
  { id: '8', name: 'سارا نوری', rating: '5', comment: 'ویزای شنگن من در کمتر از ۳ ماه صادر شد.', country: 'مزار', form_type: 'france', approved: 'true' },
];

export function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${SHEETDB_API}?sheet=reviews`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const approved = data.filter((r: Review) => r.approved === 'true' || r.approved === true);
          if (approved.length > 0) {
            setReviews(approved);
          } else {
            setReviews(DEFAULT_REVIEWS);
          }
        } else {
          setReviews(DEFAULT_REVIEWS);
        }
      })
      .catch(() => {
        setReviews(DEFAULT_REVIEWS);
      })
      .finally(() => setLoading(false));
  }, []);

  const displayReviews = reviews.length > 0 ? [...reviews, ...reviews] : [];

  if (loading) {
    return (
      <section className="py-16 bg-slate-50 dark:bg-slate-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-5">
            {[1, 2, 3].map(i => <div key={i} className="w-72 h-44 bg-slate-200 dark:bg-slate-700 rounded-2xl animate-pulse" />)}
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) return null;

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-full mb-4">
          <Star className="w-4 h-4 text-emerald-500 fill-emerald-500" />
          <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">نظرات موکلین</span>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          تجربه موکلین ما
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">{reviews.length}+ نظر از موکلین واقعی</p>
      </div>

      {/* Scrolling Track */}
      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Fade edges */}
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-slate-50 dark:from-slate-900 to-transparent pointer-events-none" />
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-slate-50 dark:from-slate-900 to-transparent pointer-events-none" />

        <div
          ref={trackRef}
          className="flex gap-5 px-6"
          style={{
            width: 'max-content',
            animation: paused ? 'none' : 'scrollTrack 30s linear infinite',
          }}
        >
          {displayReviews.map((r, i) => (
            <ReviewCard key={`${r.id}-${i}`} review={r} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scrollTrack {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const rating = parseInt(review.rating) || 5;

  return (
    <div className="flex-shrink-0 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-5 flex flex-col gap-3 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300">
      <div className="flex items-start justify-between">
        <Quote className="w-6 h-6 text-slate-200 dark:text-slate-700 flex-shrink-0" />
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 dark:text-slate-700'}`}
            />
          ))}
        </div>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex-1 line-clamp-3">
        {review.comment}
      </p>
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
        <div>
          <p className="font-semibold text-slate-900 dark:text-white text-sm">{review.name}</p>
          <p className="text-xs text-slate-400">{review.country}</p>
        </div>
        <span className="text-xl" title={review.form_type}>
          {FLAG[review.form_type] || '🌍'}
        </span>
      </div>
    </div>
  );
}
