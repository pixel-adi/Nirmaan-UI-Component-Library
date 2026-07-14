import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '../../elements/Button';
import { Input } from '../../elements/Input';
import { Dropdown } from '../../elements/Dropdown';
import { Toggle } from '../../elements/Toggle';
import { NirmanProvider, useNirman } from '../../providers/NirmanProvider';
import './KeralaTemplate.css';

export interface KeralaTemplateProps {
  /** Title override */
  title?: string;
}

// Kerala State Emblem SVG (Representing the double elephants and conch shell)
const KeralaEmblem = () => (
  <svg className="nir-t-kl__emblem" viewBox="0 0 100 100" fill="currentColor" aria-hidden="true">
    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" fill="none" />
    {/* Left Elephant */}
    <path d="M22 65 C22 55, 30 45, 40 45 C42 45, 44 46, 44 48 C44 52, 34 54, 34 65 L22 65 Z" />
    {/* Right Elephant */}
    <path d="M78 65 C78 55, 70 45, 60 45 C58 45, 56 46, 56 48 C56 52, 66 54, 66 65 L78 65 Z" />
    {/* Center Sree Padmanabhaswamy Conch */}
    <path d="M46 55 C46 52, 48 50, 50 50 C52 50, 54 52, 54 55 C54 60, 46 60, 46 55 Z" />
    <path d="M42 62 L58 62 L55 70 L45 70 Z" />
    <path d="M40 75 L60 75 L58 80 L42 80 Z" />
  </svg>
);

function KeralaPortalInner({ title }: KeralaTemplateProps) {
  const { theme, setTheme, density, setDensity } = useNirman();
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'largest'>('normal');
  const [lang, setLang] = useState<string>('ml');

  // Interactive Carousel State
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const slides = useMemo(() => [
    {
      id: 0,
      image: '/assets/kerala/banner-services.png',
      title: 'e-Sevanam: Single Window Service Portal',
      tagline: 'Access over 900+ citizen services online. Apply for certificates, make utility payments, and track applications from Akshaya Centers.',
      cta1: 'Login to e-Sevanam',
      cta2: 'Find Akshaya Center'
    },
    {
      id: 1,
      image: '/assets/kerala/banner-tourism.png',
      title: "Kerala Tourism: God's Own Country",
      tagline: 'Experience the pristine beaches, serene backwaters, and rich heritage of Kerala. Explore destination guidelines for 2026.',
      cta1: 'Plan Your Trip',
      cta2: 'Watch Virtual Tour'
    }
  ], []);

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Citizen Services Search State
  const [serviceQuery, setServiceQuery] = useState<string>('');
  const services = useMemo(() => [
    { id: 's1', icon: '📝', name: 'Income Certificate', dept: 'Revenue' },
    { id: 's2', icon: '🏠', name: 'Building Permit', dept: 'LSGD (Local Bodies)' },
    { id: 's3', icon: '💼', name: 'Panchayat License', dept: 'Panchayat' },
    { id: 's4', icon: '👤', name: 'One Time Registration', dept: 'KPSC' },
    { id: 's5', icon: '👶', name: 'Birth & Death Registry', dept: 'Health' },
    { id: 's6', icon: '⚡', name: 'KSEB Electricity Bills', dept: 'KSEB Power' },
    { id: 's7', icon: '🚰', name: 'KWA Water Bill Payment', dept: 'Water Authority' },
    { id: 's8', icon: '🚜', name: 'Land Tax (e-Land)', dept: 'Revenue' }
  ], []);

  const filteredServices = useMemo(() => {
    return services.filter(s => s.name.toLowerCase().includes(serviceQuery.toLowerCase()) || 
                                s.dept.toLowerCase().includes(serviceQuery.toLowerCase()));
  }, [services, serviceQuery]);

  // Government Orders (GOs) Tab
  const [goCategory, setGoCategory] = useState<'all' | 'gad' | 'finance' | 'health'>('all');
  const [goQuery, setGoQuery] = useState<string>('');

  const governmentOrders = useMemo(() => [
    {
      id: 'go-1',
      date: '14 Jul 2026',
      number: 'G.O.(P) No. 42/2026/GAD',
      category: 'gad',
      label: 'Gen Administration',
      title: 'Declaration of public holidays in the state of Kerala for the calendar year 2027.',
      isNew: true
    },
    {
      id: 'go-2',
      date: '12 Jul 2026',
      number: 'G.O.(Rt) No. 1024/2026/Fin',
      category: 'finance',
      label: 'Finance Department',
      title: 'Sanctioning of funds for modernizing digital infrastructure in Grama Panchayats.',
      isNew: true
    },
    {
      id: 'go-3',
      date: '09 Jul 2026',
      number: 'G.O.(Rt) No. 784/2026/HWD',
      category: 'health',
      label: 'Health & Family Welfare',
      title: 'Guidelines on deployment of mobile medical teams under the e-Health mission.',
      isNew: false
    },
    {
      id: 'go-4',
      date: '06 Jul 2026',
      number: 'G.O.(P) No. 39/2026/Fin',
      category: 'finance',
      label: 'Finance Department',
      title: 'Revision of interest rates on treasury savings bank accounts and fixed deposits.',
      isNew: false
    },
    {
      id: 'go-5',
      date: '28 Jun 2026',
      number: 'G.O.(Rt) No. 642/2026/GAD',
      category: 'gad',
      label: 'Gen Administration',
      title: 'Reconstitution of administrative panels for local self government development projects.',
      isNew: false
    }
  ], []);

  const filteredGOs = useMemo(() => {
    return governmentOrders.filter(go => {
      const matchesCategory = goCategory === 'all' || go.category === goCategory;
      const matchesSearch = go.title.toLowerCase().includes(goQuery.toLowerCase()) || 
                            go.number.toLowerCase().includes(goQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [governmentOrders, goCategory, goQuery]);

  // Multimedia Active Gallery state
  const [galleryTab, setGalleryTab] = useState<'video' | 'photos'>('video');
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [videoProgress, setVideoProgress] = useState<number>(15);

  useEffect(() => {
    let playTimer: any;
    if (isVideoPlaying) {
      playTimer = setInterval(() => {
        setVideoProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 600);
    }
    return () => clearInterval(playTimer);
  }, [isVideoPlaying]);

  const textScaleClass = textSize === 'large' ? 'nir-t-kl--text-lg' : textSize === 'largest' ? 'nir-t-kl--text-xl' : '';

  return (
    <div className={`nir-t-kl ${textScaleClass}`} lang={lang}>
      {/* ── 1. Top Government ribbon bar ── */}
      <div className="nir-t-kl__top-bar">
        <div className="nir-t-kl__top-bar-inner">
          <div className="nir-t-kl__gov-identity">
            <span className="nir-t-kl__flag-dot"></span>
            <span>കേരള സർക്കാർ | GOVERNMENT OF KERALA</span>
          </div>
          <div className="nir-t-kl__top-actions">
            {/* Accessibility Controls */}
            <div className="nir-t-kl__a11y-controls">
              <button 
                className={`nir-t-kl__a11y-btn ${textSize === 'normal' ? 'nir-t-kl__a11y-btn--active' : ''}`}
                onClick={() => setTextSize('normal')}
                title="Normal text size"
                aria-label="Normal text size"
              >
                A
              </button>
              <button 
                className={`nir-t-kl__a11y-btn ${textSize === 'large' ? 'nir-t-kl__a11y-btn--active' : ''}`}
                onClick={() => setTextSize('large')}
                title="Large text size"
                aria-label="Large text size"
              >
                A+
              </button>
              <button 
                className={`nir-t-kl__a11y-btn ${textSize === 'largest' ? 'nir-t-kl__a11y-btn--active' : ''}`}
                onClick={() => setTextSize('largest')}
                title="Extra large text size"
                aria-label="Extra large text size"
              >
                A++
              </button>
              
              {/* Contrast theme selectors */}
              <button 
                className={`nir-t-kl__a11y-btn ${theme === 'light' ? 'nir-t-kl__a11y-btn--active' : ''}`}
                onClick={() => setTheme('light')}
                title="Light Theme"
              >
                Light
              </button>
              <button 
                className={`nir-t-kl__a11y-btn ${theme === 'dark' ? 'nir-t-kl__a11y-btn--active' : ''}`}
                onClick={() => setTheme('dark')}
                title="Dark Theme"
              >
                Dark
              </button>
              <button 
                className={`nir-t-kl__a11y-btn ${theme === 'high-contrast' ? 'nir-t-kl__a11y-btn--active' : ''}`}
                onClick={() => setTheme('high-contrast')}
                title="High Contrast Theme"
              >
                Contrast
              </button>
            </div>

            {/* Language switcher */}
            <div className="nir-t-kl__lang-dropdown">
              <Dropdown 
                label="Language Select"
                placeholder="Select Language"
                options={[
                  { value: 'ml', label: 'മലയാളം (Malayalam)' },
                  { value: 'en', label: 'English' }
                ]}
                value={lang}
                onChange={(val) => setLang(val)}
                size="sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Branding Header ── */}
      <header className="nir-t-kl__header">
        <div className="nir-t-kl__header-inner">
          <div className="nir-t-kl__logo-block">
            <KeralaEmblem />
            <div className="nir-t-kl__title-group">
              <h1 className="nir-t-kl__org-hi">കേരള സർക്കാർ</h1>
              <h2 className="nir-t-kl__org-en">Government of Kerala</h2>
              <p className="nir-t-kl__org-tagline">Official State Portal • Nirmaan UI State Theme</p>
            </div>
          </div>
          <div>
            <span className="nir-t-kl__portal-badge">e-Sevanam Certified</span>
          </div>
        </div>
      </header>

      {/* ── 3. Navigation Bar ── */}
      <nav className="nir-t-kl__nav" aria-label="Primary Portal Navigation">
        <div className="nir-t-kl__nav-inner">
          <ul className="nir-t-kl__nav-list">
            <li className="nir-t-kl__nav-item">
              <a href="#" className="nir-t-kl__nav-link nir-t-kl__nav-link--active">Home</a>
            </li>
            <li className="nir-t-kl__nav-item">
              <a href="#" className="nir-t-kl__nav-link">About Kerala</a>
            </li>
            <li className="nir-t-kl__nav-item">
              <a href="#" className="nir-t-kl__nav-link">Departments</a>
            </li>
            <li className="nir-t-kl__nav-item">
              <a href="#" className="nir-t-kl__nav-link">Government Orders (GOs)</a>
            </li>
            <li className="nir-t-kl__nav-item">
              <a href="#" className="nir-t-kl__nav-link">Citizen Services</a>
            </li>
            <li className="nir-t-kl__nav-item">
              <a href="#" className="nir-t-kl__nav-link">Media Center</a>
            </li>
            <li className="nir-t-kl__nav-item">
              <a href="#" className="nir-t-kl__nav-link">Contact</a>
            </li>
          </ul>
          <div className="nir-t-kl__nav-actions">
            <Toggle 
              label="Compact Density" 
              checked={density === 'compact'}
              onChange={(e) => setDensity(e.target.checked ? 'compact' : 'default')}
            />
          </div>
        </div>
      </nav>

      {/* ── 4. Hero Carousel ── */}
      <section className="nir-t-kl__carousel" aria-label="State Highlights Carousel">
        <div className="nir-t-kl__carousel-wrapper">
          {slides.map((slide, idx) => (
            <div 
              key={slide.id} 
              className={`nir-t-kl__carousel-slide ${idx === activeSlide ? 'nir-t-kl__carousel-slide--active' : ''}`}
              style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.65)), url(${slide.image})` }}
            >
              <div className="nir-t-kl__carousel-content">
                <h3 className="nir-t-kl__carousel-title">{slide.title}</h3>
                <p className="nir-t-kl__carousel-tagline">{slide.tagline}</p>
                <div className="nir-t-kl__carousel-actions">
                  <Button variant="primary" size="lg" onClick={() => alert(`Redirecting to: ${slide.title}`)}>
                    {slide.cta1}
                  </Button>
                  <Button variant="secondary" size="lg" style={{ color: '#ffffff', borderColor: '#ffffff' }} onClick={() => alert('Launching details...')}>
                    {slide.cta2}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Carousel Indicators */}
        <div className="nir-t-kl__carousel-indicators">
          {slides.map((_, idx) => (
            <button
              key={idx}
              className={`nir-t-kl__carousel-dot ${idx === activeSlide ? 'nir-t-kl__carousel-dot--active' : ''}`}
              onClick={() => setActiveSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ── 5. e-Sevanam Citizen Services Finder ── */}
      <section className="nir-t-kl__services-section">
        <div className="nir-t-kl__services-inner">
          <h3 className="nir-t-kl__section-title">
            <span className="nir-t-kl__section-indicator"></span>
            e-Sevanam Citizen Services Finder
          </h3>
          
          {/* Services search box */}
          <div className="nir-t-kl__services-search-row">
            <Input 
              label="Search Services"
              placeholder="Search by certificate name or department (e.g. Income, Revenue, KSEB)..."
              value={serviceQuery}
              onChange={(e) => setServiceQuery(e.target.value)}
              fullWidth
            />
          </div>

          {/* Services grid */}
          <div className="nir-t-kl__services-grid">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <div key={service.id} className="nir-t-kl__service-card" onClick={() => alert(`Redirecting to e-Sevanam portal for: ${service.name}`)}>
                  <div className="nir-t-kl__service-icon">{service.icon}</div>
                  <div className="nir-t-kl__service-info">
                    <h4 className="nir-t-kl__service-title">{service.name}</h4>
                    <span className="nir-t-kl__service-dept">{service.dept} Department</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="nir-t-kl__empty-message">No services found matching your keyword. Please try a different query.</p>
            )}
          </div>
        </div>
      </section>

      {/* ── 6. Double compartment: Government Orders (GOs) & Multimedia ── */}
      <section className="nir-t-kl__updates-section">
        <div className="nir-t-kl__updates-inner">
          <div className="nir-t-kl__updates-layout">
            
            {/* Left: Searchable Government Orders */}
            <div className="nir-t-kl__orders-column">
              <h3 className="nir-t-kl__section-title">
                <span className="nir-t-kl__section-indicator"></span>
                Latest Government Orders & Circulars
              </h3>

              {/* Category tabs */}
              <div className="nir-t-kl__tabs-bar" role="tablist" aria-label="GO categories">
                <button 
                  role="tab"
                  aria-selected={goCategory === 'all'}
                  className={`nir-t-kl__tab-trigger ${goCategory === 'all' ? 'nir-t-kl__tab-trigger--active' : ''}`}
                  onClick={() => setGoCategory('all')}
                >
                  All GOs
                </button>
                <button 
                  role="tab"
                  aria-selected={goCategory === 'gad'}
                  className={`nir-t-kl__tab-trigger ${goCategory === 'gad' ? 'nir-t-kl__tab-trigger--active' : ''}`}
                  onClick={() => setGoCategory('gad')}
                >
                  General Administration
                </button>
                <button 
                  role="tab"
                  aria-selected={goCategory === 'finance'}
                  className={`nir-t-kl__tab-trigger ${goCategory === 'finance' ? 'nir-t-kl__tab-trigger--active' : ''}`}
                  onClick={() => setGoCategory('finance')}
                >
                  Finance
                </button>
                <button 
                  role="tab"
                  aria-selected={goCategory === 'health'}
                  className={`nir-t-kl__tab-trigger ${goCategory === 'health' ? 'nir-t-kl__tab-trigger--active' : ''}`}
                  onClick={() => setGoCategory('health')}
                >
                  Health
                </button>
              </div>

              {/* GO search box */}
              <div className="nir-t-kl__search-box-row">
                <Input 
                  label="Search Government Orders"
                  placeholder="Filter by G.O. number or title keyword..."
                  value={goQuery}
                  onChange={(e) => setGoQuery(e.target.value)}
                  size="sm"
                  fullWidth
                />
              </div>

              {/* Orders List */}
              <div className="nir-t-kl__orders-list">
                {filteredGOs.length > 0 ? (
                  filteredGOs.map((go) => (
                    <article key={go.id} className="nir-t-kl__order-card">
                      <div className="nir-t-kl__order-meta">
                        <span className="nir-t-kl__order-date">{go.date}</span>
                        <span className="nir-t-kl__order-badge">{go.label}</span>
                        {go.isNew && <span className="nir-t-kl__new-tag">NEW</span>}
                      </div>
                      <h4 className="nir-t-kl__order-title">
                        <a href="#" onClick={(e) => { e.preventDefault(); alert(`Downloading G.O. PDF: ${go.number}`); }}>
                          {go.title}
                        </a>
                      </h4>
                      <div className="nir-t-kl__order-footer">
                        <span>Paper ID: {go.number}</span>
                        <button className="nir-t-kl__order-dl-btn" onClick={() => alert(`Downloading: ${go.number}`)}>
                          Download (PDF)
                        </button>
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="nir-t-kl__empty-message">No government orders match your filter criteria.</p>
                )}
              </div>
            </div>

            {/* Right: Media Corner with simulated player */}
            <div className="nir-t-kl__media-column">
              <h3 className="nir-t-kl__section-title">
                <span className="nir-t-kl__section-indicator"></span>
                State Media Desk
              </h3>

              {/* Media tabs */}
              <div className="nir-t-kl__tabs-bar" role="tablist" aria-label="Media tab switcher">
                <button 
                  role="tab"
                  aria-selected={galleryTab === 'video'}
                  className={`nir-t-kl__tab-trigger ${galleryTab === 'video' ? 'nir-t-kl__tab-trigger--active' : ''}`}
                  onClick={() => setGalleryTab('video')}
                >
                  Conclave Video
                </button>
                <button 
                  role="tab"
                  aria-selected={galleryTab === 'photos'}
                  className={`nir-t-kl__tab-trigger ${galleryTab === 'photos' ? 'nir-t-kl__tab-trigger--active' : ''}`}
                  onClick={() => setGalleryTab('photos')}
                >
                  Scenic Photo Gallery
                </button>
              </div>

              {galleryTab === 'video' ? (
                <div className="nir-t-kl__video-card">
                  {/* Video Player Frame */}
                  <div className="nir-t-kl__player-container">
                    <img 
                      src="/assets/kerala/video-thumbnail.png" 
                      alt="Kerala conclave video thumbnail" 
                      className="nir-t-kl__video-thumb"
                    />
                    {!isVideoPlaying ? (
                      <button 
                        className="nir-t-kl__play-btn"
                        onClick={() => setIsVideoPlaying(true)}
                        aria-label="Play conclave presentation"
                      >
                        <svg className="nir-t-kl__play-icon" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                    ) : (
                      <div className="nir-t-kl__player-overlay">
                        <div className="nir-t-kl__video-active-sign">
                          <span className="nir-t-kl__live-pulse"></span>
                          <span>PLAYING KERALA CONCLAVE</span>
                        </div>
                        <button 
                          className="nir-t-kl__pause-btn"
                          onClick={() => setIsVideoPlaying(false)}
                          aria-label="Pause presentation"
                        >
                          <svg className="nir-t-kl__pause-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Player controls */}
                  <div className="nir-t-kl__player-controls">
                    <span className="nir-t-kl__player-time">
                      {isVideoPlaying ? `00:${videoProgress.toString().padStart(2, '0')}` : '00:00'} / 01:40
                    </span>
                    <div className="nir-t-kl__progress-bg">
                      <div 
                        className="nir-t-kl__progress-fill" 
                        style={{ width: `${isVideoPlaying ? videoProgress : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="nir-t-kl__video-info">
                    <h4 className="nir-t-kl__video-title">Kerala Developmental Conclave: Clean Energy</h4>
                    <p className="nir-t-kl__video-desc-txt">
                      Highlights of state initiatives targeting solar grids, wind farming, and high-speed rural fiber networks.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="nir-t-kl__photo-grid">
                  <div className="nir-t-kl__photo-card">
                    <img src="/assets/kerala/banner-tourism.png" alt="Kerala Houseboat sailing" />
                    <span className="nir-t-kl__photo-label">Alappuzha Backwaters Cruise</span>
                  </div>
                  <div className="nir-t-kl__photo-card">
                    <img src="/assets/kerala/banner-services.png" alt="Citizen Services Portal map" />
                    <span className="nir-t-kl__photo-label">e-Sevanam digital dashboard</span>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ── 7. Footer ── */}
      <footer className="nir-t-kl__footer">
        <div className="nir-t-kl__footer-inner">
          <div className="nir-t-kl__footer-grid">
            <div className="nir-t-kl__footer-col">
              <h5 className="nir-t-kl__footer-title">State Profile</h5>
              <p className="nir-t-kl__footer-about">
                The official state portal of the Government of Kerala. Providing transparent information, quick link access to public services, and official orders.
              </p>
            </div>
            <div className="nir-t-kl__footer-col">
              <h5 className="nir-t-kl__footer-title">Citizen Helpdesk</h5>
              <ul className="nir-t-kl__footer-links">
                <li><a href="#">e-Sevanam Portal</a></li>
                <li><a href="#">Akshaya Service Centers</a></li>
                <li><a href="#">CM Grievance Cell</a></li>
                <li><a href="#">Utility bill gates</a></li>
              </ul>
            </div>
            <div className="nir-t-kl__footer-col">
              <h5 className="nir-t-kl__footer-title">Departments</h5>
              <ul className="nir-t-kl__footer-links">
                <li><a href="#">Revenue & Land Records</a></li>
                <li><a href="#">Health & Family Welfare</a></li>
                <li><a href="#">Local Self Government</a></li>
                <li><a href="#">General Administration</a></li>
              </ul>
            </div>
            <div className="nir-t-kl__footer-col">
              <h5 className="nir-t-kl__footer-title">helplines</h5>
              <ul className="nir-t-kl__footer-links">
                <li><span>Citizen Call Center:</span> 155300 (Toll-Free)</li>
                <li><span>District Helpdesk:</span> 0471-2335522</li>
                <li><span>Email Assistance:</span> stateportal.itsd@kerala.gov.in</li>
              </ul>
            </div>
          </div>
          <div className="nir-t-kl__footer-meta">
            <div>
              <span>© 2026 Government of Kerala. Managed by IT Department & National Informatics Centre.</span>
            </div>
            <div className="nir-t-kl__footer-compliance">
              <span className="nir-t-kl__compliance-badge">GIGW 3.0 COMPLIANT</span>
              <span className="nir-t-kl__compliance-badge">WCAG AAA ACCESSIBILITY</span>
              <a href="#" style={{ color: 'rgba(255,255,255,0.7)', marginLeft: '16px' }} onClick={(e) => { e.preventDefault(); alert('Website Policies loaded.'); }}>Website Policies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * KeralaTemplate — Redesigned Government of Kerala State Portal Page Template.
 * Dynamically themed via data-brand="kl" with Forest Green and Gold.
 */
export function KeralaTemplate(props: KeralaTemplateProps) {
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  return (
    <div ref={setContainerRef} className="nir-t-kl-wrapper" style={{ width: '100%' }}>
      {containerRef && (
        <NirmanProvider defaultBrand="kl" defaultTheme="light" rootElement={containerRef}>
          <KeralaPortalInner {...props} />
        </NirmanProvider>
      )}
    </div>
  );
}

export default KeralaTemplate;
