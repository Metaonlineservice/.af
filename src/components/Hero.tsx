import React, { useState, useEffect } from 'react';
import { FileText, Shield, Users, Globe2, ChevronLeft, ChevronRight } from 'lucide-react';

const TRAVEL_SLIDES = [
  { url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1600', caption: 'آلمان · فرانکفورت' },
  { url: 'https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg?auto=compress&cs=tinysrgb&w=1600', caption: 'استرالیا · سیدنی' },
  { url: 'https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg?auto=compress&cs=tinysrgb&w=1600', caption: 'ایتالیا · رم' },
  { url: 'https://images.pexels.com/photos/2363/france-landmark-lights-night.jpg?auto=compress&cs=tinysrgb&w=1600', caption: 'فرانسه · پاریس' },
  { url: 'https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg?auto=compress&cs=tinysrgb&w=1600', caption: 'سوئیس · آلپ' },
  { url: 'https://images.pexels.com/photos/208745/pexels-photo-208745.jpeg?auto=compress&cs=tinysrgb&w=1600', caption: 'کانادا · ونکوور' },
];

interface HeroProps {
  onFormClick: () => void;
}

export function Hero({ onFormClick }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      slide(1);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  const slide = (dir: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrentSlide(c => (c + dir + TRAVEL_SLIDES.length) % TRAVEL_SLIDES.length);
      setAnimating(false);
    }, 300);
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      {/* Image Slider Background */}
      {TRAVEL_SLIDES.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${i === currentSlide ? 'opacity-100' : 'opacity-0'}`}
        >
          <img
            src={s.url}
            alt={s.caption}
            className="w-full h-full object-cover"
            loading={i === 0 ? 'eager' : 'lazy'}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/80" />
        </div>
      ))}

      {/* Slider Controls */}
      <button
        onClick={() => slide(-1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white transition-all"
        aria-label="Next slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => slide(1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white transition-all"
        aria-label="Previous slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {TRAVEL_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === currentSlide ? 'w-6 bg-white' : 'bg-white/40'}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Location Caption */}
      <div className="absolute bottom-16 right-6 z-20">
        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs">
          {TRAVEL_SLIDES[currentSlide].caption}
        </span>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24">
        {/* Trust Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full mb-8 animate-fade-in">
          <Shield className="w-4 h-4 text-gold-400" />
          <span className="text-white text-sm font-medium">مشاوره حقوقی معتبر و متخصص</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in">
          خدمات حقوقی و مهاجرتی
          <span className="block text-gold-400 mt-1">خدمات آنلاین میتا</span>
        </h1>

        {/* Description */}
        <p className="text-lg text-slate-200 max-w-3xl mx-auto mb-10 leading-relaxed animate-fade-in">
          مشاوره تخصصی برای پرونده‌های پناهندگی، ویزای بشردوستی، پیوند فامیلی و مهاجرت به کشورهای اروپایی و استرالیا
        </p>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-10 mb-12 animate-fade-in">
          {[
            { value: '۱۵۰۰+', label: 'پرونده موفق' },
            { value: '۱۵+', label: 'کشور مقصد' },
            { value: '۹۸٪', label: 'رضایت موکلین' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-gold-400">{stat.value}</div>
              <div className="text-sm text-slate-300 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={onFormClick}
          className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-500 text-slate-900 px-8 py-4 rounded-xl text-lg font-bold shadow-xl hover:shadow-gold-400/30 transition-all duration-300 hover:scale-105 animate-float"
        >
          <FileText className="w-6 h-6" />
          ثبت درخواست وقت ملاقات
        </button>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 animate-fade-in">
          {[
            { icon: <Globe2 className="w-6 h-6 text-gold-400" />, title: 'پوشش جهانی', sub: 'سفارت‌های بین‌المللی' },
            { icon: <Users className="w-6 h-6 text-gold-400" />, title: 'تیم متخصص', sub: 'وکلای باتجربه' },
            { icon: <Shield className="w-6 h-6 text-gold-400" />, title: 'اطمینان کامل', sub: 'محرمانگی اطلاعات' },
          ].map(card => (
            <div
              key={card.title}
              className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/15 transition-all"
            >
              {card.icon}
              <div className="text-right">
                <p className="font-semibold text-white text-sm">{card.title}</p>
                <p className="text-xs text-slate-300">{card.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
