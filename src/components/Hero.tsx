import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Shield, Users, Globe2, ChevronLeft, ChevronRight, Play, Pause, Award, Clock, UserCheck, TrendingUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const TRAVEL_SLIDES = [
  { url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1600', caption: 'آلمان · فرانکفورت' },
  { url: 'https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg?auto=compress&cs=tinysrgb&w=1600', caption: 'استرالیا · سیدنی' },
  { url: 'https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg?auto=compress&cs=tinysrgb&w=1600', caption: 'ایتالیا · رم' },
  { url: 'https://images.pexels.com/photos/2363/france-landmark-lights-night.jpg?auto=compress&cs=tinysrgb&w=1600', caption: 'فرانسه · پاریس' },
  { url: 'https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg?auto=compress&cs=tinysrgb&w=1600', caption: 'سوئیس · آلپ' },
  { url: 'https://images.pexels.com/photos/208745/pexels-photo-208745.jpeg?auto=compress&cs=tinysrgb&w=1600', caption: 'کانادا · ونکوور' },
];

// Free travel video from Pexels
const TRAVEL_VIDEO = 'https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4';

interface HeroProps {
  onFormClick: () => void;
  onAppointmentClick: () => void;
}

export function Hero({ onFormClick, onAppointmentClick }: HeroProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [useVideo, setUseVideo] = useState(true);
  const [videoPlaying, setVideoPlaying] = useState(true);

  useEffect(() => {
    if (useVideo) return;
    const interval = setInterval(() => {
      slide(1);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentSlide, useVideo]);

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
      {/* Video Background */}
      {useVideo && (
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            poster={TRAVEL_SLIDES[0].url}
          >
            <source src={TRAVEL_VIDEO} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/80" />
        </div>
      )}

      {/* Image Slider Background (fallback) */}
      {!useVideo && TRAVEL_SLIDES.map((s, i) => (
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

      {/* Toggle Video/Image Button */}
      <button
        onClick={() => setUseVideo(!useVideo)}
        className="absolute top-20 left-6 z-30 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white transition-all"
        title={useVideo ? 'Switch to images' : 'Switch to video'}
      >
        {useVideo ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </button>

      {/* Slider Controls (only when using images) */}
      {!useVideo && (
        <>
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
        </>
      )}

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

        {/* CTA Buttons - Main Navigation */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mb-12 animate-fade-in max-w-3xl mx-auto">
          <button
            onClick={() => navigate('/multiform')}
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-3 bg-navy-700 hover:bg-navy-800 text-white px-6 py-4 rounded-xl text-base font-bold shadow-xl hover:shadow-navy-700/40 transition-all duration-300 hover:scale-[1.02] border border-navy-600"
          >
            <FileText className="w-5 h-5" />
            فرم درخواست خدمات
          </button>
          <button
            onClick={onAppointmentClick}
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-3 bg-corporate-700 hover:bg-corporate-800 text-white px-6 py-4 rounded-xl text-base font-bold shadow-xl hover:shadow-corporate-700/40 transition-all duration-300 hover:scale-[1.02] border border-corporate-600"
          >
            <FileText className="w-5 h-5" />
            رزرو وقت ملاقات
          </button>
          <button
            onClick={onFormClick}
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-3 bg-white hover:bg-corporate-50 text-navy-800 px-6 py-4 rounded-xl text-base font-bold shadow-xl hover:shadow-white/40 transition-all duration-300 hover:scale-[1.02] border border-corporate-200"
          >
            <FileText className="w-5 h-5" />
            ثبت درخواست ویزا
          </button>
        </div>

        {/* Statistics Dashboard Cards */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-4xl mx-auto mb-12 animate-fade-in">
          {[
            { value: '۳۸+', label: 'پرونده موفق', icon: <Award className="w-6 h-6" />, color: 'emerald' },
            { value: '۳۸', label: 'در دست بررسی', icon: <Clock className="w-6 h-6" />, color: 'amber' },
            { value: '۱۰۰+', label: 'مراجع ثبت شده', icon: <UserCheck className="w-6 h-6" />, color: 'navy' },
          ].map((stat, idx) => (
            <div
              key={stat.label}
              className={`relative bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 ${idx === 0 ? 'text-right' : idx === 2 ? 'text-left' : 'text-center'}`}
            >
              <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl mb-3 ${
                stat.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' :
                stat.color === 'amber' ? 'bg-amber-500/20 text-amber-400' :
                'bg-navy-400/20 text-navy-300'
              }`}>
                {stat.icon}
              </div>
              <div className={`text-2xl sm:text-3xl font-bold text-white mb-1 ${
                stat.color === 'emerald' ? 'text-emerald-400' :
                stat.color === 'amber' ? 'text-amber-400' :
                'text-white'
              }`}>
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-white/70">{stat.label}</div>
              <TrendingUp className={`absolute top-2 ${idx === 2 ? 'left-2' : 'right-2'} w-4 h-4 text-white/20`} />
            </div>
          ))}
        </div>

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
