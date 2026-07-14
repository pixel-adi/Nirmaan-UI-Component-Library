import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '../../elements/Button';
import { Input } from '../../elements/Input';
import { Dropdown } from '../../elements/Dropdown';
import { Toggle } from '../../elements/Toggle';
import { NirmanProvider, useNirman } from '../../providers/NirmanProvider';
import './EducationTemplate.css';

export interface EducationTemplateProps {
  /** Title override */
  title?: string;
}

// Ashoka Emblem SVG
const AshokaEmblem = () => (
  <svg className="nir-t-edu__emblem" viewBox="0 0 100 150" fill="currentColor" aria-hidden="true">
    <path d="M50 10 C53 10 55 12 55 15 C55 18 53 20 50 20 C47 20 45 18 45 15 C45 12 47 10 50 10 Z" />
    <path d="M40 22 L60 22 L58 35 L42 35 Z" />
    <path d="M38 37 C38 37 42 45 50 45 C58 45 62 37 62 37 L65 75 L35 75 Z" />
    <rect x="42" y="77" width="16" height="50" rx="2" />
    <path d="M30 128 L70 128 L68 135 L32 135 Z" />
    <circle cx="50" cy="102" r="6" stroke="currentColor" strokeWidth="1" fill="none" />
    <line x1="50" y1="96" x2="50" y2="108" stroke="currentColor" strokeWidth="1" />
    <line x1="44" y1="102" x2="56" y2="102" stroke="currentColor" strokeWidth="1" />
  </svg>
);

function EducationPortalInner({ title }: EducationTemplateProps) {
  const { theme, setTheme, density, setDensity } = useNirman();
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'largest'>('normal');
  const [lang, setLang] = useState<string>('en');

  // Interactive Carousel State
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const slides = useMemo(() => [
    {
      id: 0,
      image: '/assets/education/banner-swayam.png',
      title: 'SWAYAM: Free Online Learning Platform',
      tagline: 'Access high-quality education from premium Indian faculties anywhere, anytime. Onboarding and course registrations are open for 2026.',
      cta1: 'Explore Courses',
      cta2: 'Watch Intro Video'
    },
    {
      id: 1,
      image: '/assets/education/banner-nep.png',
      title: 'National Education Policy 2020',
      tagline: 'Transforming the school and higher education ecosystem of India to be equitable, vibrant, and aligned with global standards.',
      cta1: 'Read NEP Policy',
      cta2: 'Implementation Progress'
    }
  ], []);

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Multimedia Gallery tab
  const [galleryTab, setGalleryTab] = useState<'video' | 'photos'>('video');
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [videoProgress, setVideoProgress] = useState<number>(35); // mock percent

  // Circulars & News Board Search
  const [newsQuery, setNewsQuery] = useState<string>('');
  const [newsCategory, setNewsCategory] = useState<'all' | 'school' | 'higher' | 'announcements'>('all');

  const updatesList = useMemo(() => [
    {
      id: '1',
      date: '14 Jul 2026',
      category: 'announcements',
      label: 'Announcement',
      title: 'Applications invited for National Teachers Award 2026. Last date for submission extended.',
      link: '#',
      isNew: true
    },
    {
      id: '2',
      date: '10 Jul 2026',
      category: 'school',
      label: 'School Education',
      title: 'Guidelines on digital literacy integration in PM SHRI Schools for the academic session 2026-27.',
      link: '#',
      isNew: true
    },
    {
      id: '3',
      date: '08 Jul 2026',
      category: 'higher',
      label: 'Higher Education',
      title: 'Implementation scheme for Indian Knowledge Systems (IKS) courses in technical institutions.',
      link: '#'
    },
    {
      id: '4',
      date: '05 Jul 2026',
      category: 'announcements',
      label: 'Announcement',
      title: 'SWAYAM semester-end exam schedule released for July-December courses.',
      link: '#'
    },
    {
      id: '5',
      date: '29 Jun 2026',
      category: 'higher',
      label: 'Higher Education',
      title: 'AISHE (All India Survey on Higher Education) report released for 2024-2025. Key trends inside.',
      link: '#'
    }
  ], []);

  // Filter Updates
  const filteredUpdates = useMemo(() => {
    return updatesList.filter((item) => {
      const matchesCategory = newsCategory === 'all' || item.category === newsCategory;
      const matchesSearch = item.title.toLowerCase().includes(newsQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [updatesList, newsCategory, newsQuery]);

  // Video progress bar interval simulation
  useEffect(() => {
    let playTimer: any;
    if (isVideoPlaying) {
      playTimer = setInterval(() => {
        setVideoProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 500);
    }
    return () => clearInterval(playTimer);
  }, [isVideoPlaying]);

  const textScaleClass = textSize === 'large' ? 'nir-t-edu--text-lg' : textSize === 'largest' ? 'nir-t-edu--text-xl' : '';

  return (
    <div className={`nir-t-edu ${textScaleClass}`} lang={lang}>
      {/* ── 1. Top Government ribbon bar ── */}
      <div className="nir-t-edu__top-bar">
        <div className="nir-t-edu__top-bar-inner">
          <div className="nir-t-edu__gov-identity">
            <span className="nir-t-edu__flag-dot"></span>
            <span>शिक्षा मंत्रालय | MINISTRY OF EDUCATION</span>
          </div>
          <div className="nir-t-edu__top-actions">
            {/* Accessibility Panel */}
            <div className="nir-t-edu__a11y-controls">
              <button 
                className={`nir-t-edu__a11y-btn ${textSize === 'normal' ? 'nir-t-edu__a11y-btn--active' : ''}`}
                onClick={() => setTextSize('normal')}
                title="Normal text size"
                aria-label="Normal text size"
              >
                A
              </button>
              <button 
                className={`nir-t-edu__a11y-btn ${textSize === 'large' ? 'nir-t-edu__a11y-btn--active' : ''}`}
                onClick={() => setTextSize('large')}
                title="Large text size"
                aria-label="Large text size"
              >
                A+
              </button>
              <button 
                className={`nir-t-edu__a11y-btn ${textSize === 'largest' ? 'nir-t-edu__a11y-btn--active' : ''}`}
                onClick={() => setTextSize('largest')}
                title="Extra large text size"
                aria-label="Extra large text size"
              >
                A++
              </button>
              
              {/* Theme Selector */}
              <button 
                className={`nir-t-edu__a11y-btn ${theme === 'light' ? 'nir-t-edu__a11y-btn--active' : ''}`}
                onClick={() => setTheme('light')}
                title="Light Theme"
              >
                Light
              </button>
              <button 
                className={`nir-t-edu__a11y-btn ${theme === 'dark' ? 'nir-t-edu__a11y-btn--active' : ''}`}
                onClick={() => setTheme('dark')}
                title="Dark Theme"
              >
                Dark
              </button>
              <button 
                className={`nir-t-edu__a11y-btn ${theme === 'high-contrast' ? 'nir-t-edu__a11y-btn--active' : ''}`}
                onClick={() => setTheme('high-contrast')}
                title="High Contrast Theme"
              >
                Contrast
              </button>
            </div>

            {/* Language Switcher Dropdown */}
            <div className="nir-t-edu__lang-dropdown">
              <Dropdown 
                label="Language Select"
                placeholder="Select Language"
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'hi', label: 'हिन्दी' }
                ]}
                value={lang}
                onChange={(val) => setLang(val)}
                size="sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Bilingual Header ── */}
      <header className="nir-t-edu__header">
        <div className="nir-t-edu__header-inner">
          <div className="nir-t-edu__logo-block">
            <AshokaEmblem />
            <div className="nir-t-edu__title-group">
              <h1 className="nir-t-edu__org-hi">शिक्षा मंत्रालय</h1>
              <h2 className="nir-t-edu__org-en">Ministry of Education</h2>
              <p className="nir-t-edu__org-tagline">Department of School Education & Literacy • Department of Higher Education</p>
            </div>
          </div>
          <div>
            <span className="nir-t-edu__portal-badge">NEP 2020 ALIGNED</span>
          </div>
        </div>
      </header>

      {/* ── 3. Navigation Bar ── */}
      <nav className="nir-t-edu__nav" aria-label="Primary Portal Navigation">
        <div className="nir-t-edu__nav-inner">
          <ul className="nir-t-edu__nav-list">
            <li className="nir-t-edu__nav-item">
              <a href="#" className="nir-t-edu__nav-link nir-t-edu__nav-link--active">Home</a>
            </li>
            <li className="nir-t-edu__nav-item">
              <a href="#" className="nir-t-edu__nav-link">About MoE</a>
            </li>
            <li className="nir-t-edu__nav-item">
              <a href="#" className="nir-t-edu__nav-link">School Education</a>
            </li>
            <li className="nir-t-edu__nav-item">
              <a href="#" className="nir-t-edu__nav-link">Higher Education</a>
            </li>
            <li className="nir-t-edu__nav-item">
              <a href="#" className="nir-t-edu__nav-link">Policy & Reforms</a>
            </li>
            <li className="nir-t-edu__nav-item">
              <a href="#" className="nir-t-edu__nav-link">Media Center</a>
            </li>
            <li className="nir-t-edu__nav-item">
              <a href="#" className="nir-t-edu__nav-link">Documents</a>
            </li>
          </ul>
          <div className="nir-t-edu__nav-actions">
            {/* Interactive Toggle for Density mode demonstration */}
            <Toggle 
              label="Compact Density" 
              checked={density === 'compact'}
              onChange={(e) => setDensity(e.target.checked ? 'compact' : 'default')}
            />
          </div>
        </div>
      </nav>

      {/* ── 4. Interactive Hero Slider (Carousel) ── */}
      <section className="nir-t-edu__carousel" aria-label="Educational Highlights Carousel">
        <div className="nir-t-edu__carousel-wrapper">
          {slides.map((slide, idx) => (
            <div 
              key={slide.id} 
              className={`nir-t-edu__carousel-slide ${idx === activeSlide ? 'nir-t-edu__carousel-slide--active' : ''}`}
              style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url(${slide.image})` }}
            >
              <div className="nir-t-edu__carousel-content">
                <h3 className="nir-t-edu__carousel-title">{slide.title}</h3>
                <p className="nir-t-edu__carousel-tagline">{slide.tagline}</p>
                <div className="nir-t-edu__carousel-actions">
                  <Button variant="primary" size="lg" onClick={() => alert(`Redirecting to: ${slide.title}`)}>
                    {slide.cta1}
                  </Button>
                  <Button variant="secondary" size="lg" style={{ color: '#ffffff', borderColor: '#ffffff' }} onClick={() => alert('Launching multimedia details...')}>
                    {slide.cta2}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Slider Controls */}
        <div className="nir-t-edu__carousel-indicators">
          {slides.map((_, idx) => (
            <button
              key={idx}
              className={`nir-t-edu__carousel-dot ${idx === activeSlide ? 'nir-t-edu__carousel-dot--active' : ''}`}
              onClick={() => setActiveSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ── 5. Initiatives Bento Grid ── */}
      <section className="nir-t-edu__bento-section">
        <div className="nir-t-edu__bento-inner">
          <h3 className="nir-t-edu__section-title">
            <span className="nir-t-edu__section-indicator"></span>
            National Educational Initiatives & Portals
          </h3>
          <div className="nir-t-edu__bento-grid">
            
            {/* Card 1: SWAYAM Portal */}
            <div className="nir-t-edu__bento-card">
              <span className="nir-t-edu__bento-lbl">Digital Learning</span>
              <h4 className="nir-t-edu__bento-card-title">SWAYAM Portal</h4>
              <p className="nir-t-edu__bento-desc">
                Integrated platform for online courses offering high quality education mapped to curriculum of school & higher education.
              </p>
              <a href="#" className="nir-t-edu__bento-link" onClick={(e) => { e.preventDefault(); alert('Redirecting to SWAYAM trust portal...'); }}>
                Register on SWAYAM →
              </a>
            </div>

            {/* Card 2: DIKSHA Portal */}
            <div className="nir-t-edu__bento-card">
              <span className="nir-t-edu__bento-lbl">School Education</span>
              <h4 className="nir-t-edu__bento-card-title">DIKSHA Digital Infrastructure</h4>
              <p className="nir-t-edu__bento-desc">
                National digital infrastructure for teachers, hosting rich interactive learning content in multiple languages.
              </p>
              <a href="#" className="nir-t-edu__bento-link" onClick={(e) => { e.preventDefault(); alert('Redirecting to DIKSHA digital page...'); }}>
                Access Study Material →
              </a>
            </div>

            {/* Card 3: Scholarship Portal */}
            <div className="nir-t-edu__bento-card">
              <span className="nir-t-edu__bento-lbl">Student Welfare</span>
              <h4 className="nir-t-edu__bento-card-title">National Scholarship Portal</h4>
              <p className="nir-t-edu__bento-desc">
                Single unified solution for student registration, scheme eligibility checks, processing, and direct benefit payout.
              </p>
              <a href="#" className="nir-t-edu__bento-link" onClick={(e) => { e.preventDefault(); alert('Opening NSP Scholarship portal...'); }}>
                Check Scheme Status →
              </a>
            </div>

            {/* Card 4: AISHE Higher Education Survey */}
            <div className="nir-t-edu__bento-card">
              <span className="nir-t-edu__bento-lbl">Data & Reports</span>
              <h4 className="nir-t-edu__bento-card-title">AISHE Portal</h4>
              <p className="nir-t-edu__bento-desc">
                All India Survey on Higher Education. Collects statistics on higher education institutions to formulate policy parameters.
              </p>
              <a href="#" className="nir-t-edu__bento-link" onClick={(e) => { e.preventDefault(); alert('Opening AISHE report page...'); }}>
                View Census Surveys →
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ── 6. Double Compartment layout: News Desk & Multimedia ── */}
      <section className="nir-t-edu__updates-section">
        <div className="nir-t-edu__updates-inner">
          <div className="nir-t-edu__updates-layout">
            
            {/* Left Column: Searchable Circulars/News */}
            <div className="nir-t-edu__news-column">
              <h3 className="nir-t-edu__section-title">
                <span className="nir-t-edu__section-indicator"></span>
                Announcements & Notifications
              </h3>
              
              {/* Category tabs */}
              <div className="nir-t-edu__tabs-bar" role="tablist" aria-label="Announcements categories">
                <button 
                  role="tab"
                  aria-selected={newsCategory === 'all'}
                  className={`nir-t-edu__tab-trigger ${newsCategory === 'all' ? 'nir-t-edu__tab-trigger--active' : ''}`}
                  onClick={() => setNewsCategory('all')}
                >
                  All News
                </button>
                <button 
                  role="tab"
                  aria-selected={newsCategory === 'announcements'}
                  className={`nir-t-edu__tab-trigger ${newsCategory === 'announcements' ? 'nir-t-edu__tab-trigger--active' : ''}`}
                  onClick={() => setNewsCategory('announcements')}
                >
                  Announcements
                </button>
                <button 
                  role="tab"
                  aria-selected={newsCategory === 'school'}
                  className={`nir-t-edu__tab-trigger ${newsCategory === 'school' ? 'nir-t-edu__tab-trigger--active' : ''}`}
                  onClick={() => setNewsCategory('school')}
                >
                  School Education
                </button>
                <button 
                  role="tab"
                  aria-selected={newsCategory === 'higher'}
                  className={`nir-t-edu__tab-trigger ${newsCategory === 'higher' ? 'nir-t-edu__tab-trigger--active' : ''}`}
                  onClick={() => setNewsCategory('higher')}
                >
                  Higher Education
                </button>
              </div>

              {/* Nirmaan search box */}
              <div className="nir-t-edu__search-box-row">
                <Input 
                  label="Search Announcements"
                  placeholder="Filter by keyword..."
                  value={newsQuery}
                  onChange={(e) => setNewsQuery(e.target.value)}
                  size="sm"
                  fullWidth
                />
              </div>

              {/* Updates List */}
              <div className="nir-t-edu__updates-list">
                {filteredUpdates.length > 0 ? (
                  filteredUpdates.map((item) => (
                    <article key={item.id} className="nir-t-edu__update-card">
                      <div className="nir-t-edu__update-meta">
                        <span className="nir-t-edu__update-date">{item.date}</span>
                        <span className="nir-t-edu__update-badge">{item.label}</span>
                        {item.isNew && <span className="nir-t-edu__new-tag">NEW</span>}
                      </div>
                      <h4 className="nir-t-edu__update-title">
                        <a href={item.link} onClick={(e) => { e.preventDefault(); alert(`Redirecting to document download for: ${item.title}`); }}>
                          {item.title}
                        </a>
                      </h4>
                    </article>
                  ))
                ) : (
                  <p className="nir-t-edu__empty-message">No matches found for your filter criteria.</p>
                )}
              </div>
            </div>

            {/* Right Column: Multimedia Corner with simulating active video player */}
            <div className="nir-t-edu__media-column">
              <h3 className="nir-t-edu__section-title">
                <span className="nir-t-edu__section-indicator"></span>
                Ministry Media Corner
              </h3>
              
              {/* Media tabs */}
              <div className="nir-t-edu__tabs-bar" role="tablist" aria-label="Media Corner Switcher">
                <button 
                  role="tab"
                  aria-selected={galleryTab === 'video'}
                  className={`nir-t-edu__tab-trigger ${galleryTab === 'video' ? 'nir-t-edu__tab-trigger--active' : ''}`}
                  onClick={() => setGalleryTab('video')}
                >
                  Video Address
                </button>
                <button 
                  role="tab"
                  aria-selected={galleryTab === 'photos'}
                  className={`nir-t-edu__tab-trigger ${galleryTab === 'photos' ? 'nir-t-edu__tab-trigger--active' : ''}`}
                  onClick={() => setGalleryTab('photos')}
                >
                  Recent Events Photo Grid
                </button>
              </div>

              {galleryTab === 'video' ? (
                <div className="nir-t-edu__video-card">
                  {/* Video Player Box */}
                  <div className="nir-t-edu__player-container">
                    <img 
                      src="/assets/education/video-thumbnail.png" 
                      alt="Ministry conference video address preview" 
                      className="nir-t-edu__video-thumb"
                    />
                    {!isVideoPlaying ? (
                      <button 
                        className="nir-t-edu__play-btn"
                        onClick={() => setIsVideoPlaying(true)}
                        aria-label="Play video address"
                      >
                        <svg className="nir-t-edu__play-icon" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                    ) : (
                      <div className="nir-t-edu__player-overlay">
                        {/* active overlay simulation */}
                        <div className="nir-t-edu__video-active-sign">
                          <span className="nir-t-edu__live-pulse"></span>
                          <span>PLAYING MOE CONCLAVE VIDEO</span>
                        </div>
                        <button 
                          className="nir-t-edu__pause-btn"
                          onClick={() => setIsVideoPlaying(false)}
                          aria-label="Pause video address"
                        >
                          <svg className="nir-t-edu__pause-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Player Controls Bar */}
                  <div className="nir-t-edu__player-controls">
                    <span className="nir-t-edu__player-time">
                      {isVideoPlaying ? `00:${videoProgress.toString().padStart(2, '0')}` : '00:00'} / 01:25
                    </span>
                    <div className="nir-t-edu__progress-bg">
                      <div 
                        className="nir-t-edu__progress-fill" 
                        style={{ width: `${isVideoPlaying ? videoProgress : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="nir-t-edu__video-info">
                    <h4 className="nir-t-edu__video-title">National Education Summit: Digital Integration</h4>
                    <p className="nir-t-edu__video-desc-txt">
                      Address by the Union Cabinet Minister on the adoption of high-tech digital classrooms and rural connectivity.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="nir-t-edu__photo-grid">
                  <div className="nir-t-edu__photo-card">
                    <img src="/assets/education/banner-swayam.png" alt="Students in Library" />
                    <span className="nir-t-edu__photo-label">Digital Campuses initiative</span>
                  </div>
                  <div className="nir-t-edu__photo-card">
                    <img src="/assets/education/banner-nep.png" alt="Classroom learning" />
                    <span className="nir-t-edu__photo-label">NEP 2020 rural models</span>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ── 7. Government Footer ── */}
      <footer className="nir-t-edu__footer">
        <div className="nir-t-edu__footer-inner">
          <div className="nir-t-edu__footer-grid">
            <div className="nir-t-edu__footer-col">
              <h5 className="nir-t-edu__footer-title">Ministry Profile</h5>
              <p className="nir-t-edu__footer-about">
                The Ministry of Education regulates, finances, and builds educational infrastructure across primary, secondary, and higher educational institutions in India.
              </p>
            </div>
            <div className="nir-t-edu__footer-col">
              <h5 className="nir-t-edu__footer-title">Higher Education Portals</h5>
              <ul className="nir-t-edu__footer-links">
                <li><a href="#">UGC Website</a></li>
                <li><a href="#">AICTE Portal</a></li>
                <li><a href="#">SWAYAM Online learning</a></li>
                <li><a href="#">AISHE statistics</a></li>
              </ul>
            </div>
            <div className="nir-t-edu__footer-col">
              <h5 className="nir-t-edu__footer-title">Schooling Programs</h5>
              <ul className="nir-t-edu__footer-links">
                <li><a href="#">DIKSHA framework</a></li>
                <li><a href="#">PM SHRI school models</a></li>
                <li><a href="#">NIPUN Bharat guidelines</a></li>
                <li><a href="#">National Teacher awards</a></li>
              </ul>
            </div>
            <div className="nir-t-edu__footer-col">
              <h5 className="nir-t-edu__footer-title">Support Desk</h5>
              <ul className="nir-t-edu__footer-links">
                <li><span>National Toll-Free:</span> 1800-116-200</li>
                <li><span>Scholarship Desk:</span> 0120-6619540</li>
                <li><span>Email Helpdesk:</span> support-moe@gov.in</li>
              </ul>
            </div>
          </div>
          <div className="nir-t-edu__footer-meta">
            <div>
              <span>© 2026 Ministry of Education, Government of India. All Rights Reserved.</span>
            </div>
            <div className="nir-t-edu__footer-compliance">
              <span className="nir-t-edu__compliance-badge">GIGW 3.0 COMPLIANT</span>
              <span className="nir-t-edu__compliance-badge">WCAG AAA ACCESSIBILITY</span>
              <a href="#" style={{ color: 'rgba(255,255,255,0.7)', marginLeft: '16px' }} onClick={(e) => { e.preventDefault(); alert('Website Policies loaded.'); }}>Website Policies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * EducationTemplate — Redesigned Ministry of Education Portal Page Template.
 * Fully styled using Nirmaan UI components and GIGW 3.0 standards.
 */
export function EducationTemplate(props: EducationTemplateProps) {
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  return (
    <div ref={setContainerRef} className="nir-t-edu-wrapper" style={{ width: '100%' }}>
      {containerRef && (
        <NirmanProvider defaultBrand="goi" defaultTheme="light" rootElement={containerRef}>
          <EducationPortalInner {...props} />
        </NirmanProvider>
      )}
    </div>
  );
}

export default EducationTemplate;
