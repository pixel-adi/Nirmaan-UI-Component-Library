import React, { useState, useMemo } from 'react';
import { Button } from '../../elements/Button';
import { Input } from '../../elements/Input';
import { Dropdown } from '../../elements/Dropdown';
import { Checkbox } from '../../elements/Checkbox';
import { Toggle } from '../../elements/Toggle';
import { NirmanProvider, useNirman } from '../../providers/NirmanProvider';
import './PfrdaTemplate.css';

export interface PfrdaTemplateProps {
  /** Title override */
  title?: string;
}

// Ashoka Emblem SVG element
const AshokaEmblem = () => (
  <svg className="nir-t-pfrda__emblem" viewBox="0 0 100 150" fill="currentColor">
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

// Inner component that consumes useNirman context
function PfrdaPortalInner({ title }: PfrdaTemplateProps) {
  const { theme, setTheme, density, setDensity } = useNirman();
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'largest'>('normal');
  const [lang, setLang] = useState<string>('en');

  // Interactive Pension Calculator States
  const [age, setAge] = useState<number>(30);
  const [contribution, setContribution] = useState<number>(5000);
  const [expectedReturn, setExpectedReturn] = useState<number>(10);

  // Circulars and Search States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | 'nps' | 'apy' | 'regs'>('all');

  // Sample Circulars Data
  const circulars = useMemo(() => [
    {
      id: '1',
      day: '12',
      month: 'Jul',
      category: 'nps',
      tag: 'NPS',
      title: 'Revision of processing fees for online transactions via Netbanking and UPI payment gateways.',
      ref: 'PFRDA/2026/07/NPS-04'
    },
    {
      id: '2',
      day: '08',
      month: 'Jul',
      category: 'apy',
      tag: 'APY',
      title: 'APY subscriber onboarding guidelines and performance metrics for Regional Rural Banks (RRBs).',
      ref: 'PFRDA/2026/07/APY-02'
    },
    {
      id: '3',
      day: '05',
      month: 'Jul',
      category: 'regs',
      tag: 'Regulations',
      title: 'Pension Fund Regulatory and Development Authority (Point of Presence) Amendment Regulations, 2026.',
      ref: 'PFRDA/2026/REG/03'
    },
    {
      id: '4',
      day: '28',
      month: 'Jun',
      category: 'nps',
      tag: 'NPS',
      title: 'Standard Operating Procedure (SOP) for processing partial withdrawals under National Pension System.',
      ref: 'PFRDA/2026/06/NPS-18'
    },
    {
      id: '5',
      day: '20',
      month: 'regs',
      tag: 'Regulations',
      title: 'Guidelines on cybersecurity framework and cyber resilience measures for Pension Fund Managers.',
      ref: 'PFRDA/2026/REG/02'
    }
  ], []);

  // Filtered Circulars
  const filteredCirculars = useMemo(() => {
    return circulars.filter((item) => {
      const matchesTab = activeTab === 'all' || item.category === activeTab;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.ref.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [circulars, activeTab, searchQuery]);

  // NPS Pension Calculation Logic
  const calcResults = useMemo(() => {
    const yearsToRetire = Math.max(0, 60 - age);
    const months = yearsToRetire * 12;
    const monthlyRate = (expectedReturn / 100) / 12;

    let accumulatedCorpus = 0;
    if (months > 0 && monthlyRate > 0) {
      // Future Value of an Annuity Due (monthly compounding)
      accumulatedCorpus = contribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    } else if (months > 0) {
      accumulatedCorpus = contribution * months;
    }

    // NPS Rule: 40% annuity purchase minimum, 60% lump sum max
    const annuityCorpus = accumulatedCorpus * 0.40;
    const lumpSum = accumulatedCorpus * 0.60;

    // Estimate pension assuming 6% annual annuity rate
    const estimatedPension = (annuityCorpus * 0.06) / 12;

    const formatCurrency = (val: number) => {
      if (val >= 10000000) {
        return `₹${(val / 10000000).toFixed(2)} Cr`;
      }
      if (val >= 100000) {
        return `₹${(val / 100000).toFixed(2)} Lakh`;
      }
      return `₹${Math.round(val).toLocaleString('en-IN')}`;
    };

    return {
      corpus: formatCurrency(accumulatedCorpus),
      pension: formatCurrency(estimatedPension),
      lumpsum: formatCurrency(lumpSum),
      rawCorpus: accumulatedCorpus
    };
  }, [age, contribution, expectedReturn]);

  // Dynamic class for text scaling
  const textScaleClass = textSize === 'large' ? 'nir-t-pfrda--text-lg' : textSize === 'largest' ? 'nir-t-pfrda--text-xl' : '';

  return (
    <div className={`nir-t-pfrda ${textScaleClass}`} lang={lang}>
      {/* ── 1. Top Government ribbon bar ── */}
      <div className="nir-t-pfrda__top-bar">
        <div className="nir-t-pfrda__top-bar-inner">
          <div className="nir-t-pfrda__gov-identity">
            <span className="nir-t-pfrda__flag-dot"></span>
            <span>भारत सरकार | GOVERNMENT OF INDIA</span>
          </div>
          <div className="nir-t-pfrda__top-actions">
            {/* Accessibility Controls */}
            <div className="nir-t-pfrda__a11y-controls">
              <button 
                className={`nir-t-pfrda__a11y-btn ${textSize === 'normal' ? 'nir-t-pfrda__a11y-btn--active' : ''}`}
                onClick={() => setTextSize('normal')}
                title="Normal text size"
                aria-label="Normal text size"
              >
                A
              </button>
              <button 
                className={`nir-t-pfrda__a11y-btn ${textSize === 'large' ? 'nir-t-pfrda__a11y-btn--active' : ''}`}
                onClick={() => setTextSize('large')}
                title="Large text size"
                aria-label="Large text size"
              >
                A+
              </button>
              <button 
                className={`nir-t-pfrda__a11y-btn ${textSize === 'largest' ? 'nir-t-pfrda__a11y-btn--active' : ''}`}
                onClick={() => setTextSize('largest')}
                title="Extra large text size"
                aria-label="Extra large text size"
              >
                A++
              </button>
              
              {/* Contrast toggles directly mapped to Nirmaan themes */}
              <button 
                className={`nir-t-pfrda__a11y-btn ${theme === 'light' ? 'nir-t-pfrda__a11y-btn--active' : ''}`}
                onClick={() => setTheme('light')}
                title="Light Theme"
              >
                Light
              </button>
              <button 
                className={`nir-t-pfrda__a11y-btn ${theme === 'dark' ? 'nir-t-pfrda__a11y-btn--active' : ''}`}
                onClick={() => setTheme('dark')}
                title="Dark Theme"
              >
                Dark
              </button>
              <button 
                className={`nir-t-pfrda__a11y-btn ${theme === 'high-contrast' ? 'nir-t-pfrda__a11y-btn--active' : ''}`}
                onClick={() => setTheme('high-contrast')}
                title="High Contrast Theme"
              >
                Contrast
              </button>
            </div>

            {/* Language Switcher using Nirmaan UI Dropdown Component */}
            <div className="nir-t-pfrda__lang-dropdown">
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

      {/* ── 2. Identity Header ── */}
      <header className="nir-t-pfrda__header">
        <div className="nir-t-pfrda__header-inner">
          <div className="nir-t-pfrda__logo-block">
            <AshokaEmblem />
            <div className="nir-t-pfrda__title-group">
              <h1 className="nir-t-pfrda__org-hi">पेंशन निधि विनियामक और विकास प्राधिकरण</h1>
              <h2 className="nir-t-pfrda__org-en">Pension Fund Regulatory and Development Authority</h2>
              <p className="nir-t-pfrda__org-tagline">Nirmaan UI Compliant Portal • GIGW 3.0 Standard</p>
            </div>
          </div>
          <div>
            <span className="nir-t-pfrda__portal-badge">PFRDA CONNECT</span>
          </div>
        </div>
      </header>

      {/* ── 3. Navigation Bar ── */}
      <nav className="nir-t-pfrda__nav" aria-label="Primary Portal Navigation">
        <div className="nir-t-pfrda__nav-inner">
          <ul className="nir-t-pfrda__nav-list">
            <li className="nir-t-pfrda__nav-item">
              <a href="#" className="nir-t-pfrda__nav-link nir-t-pfrda__nav-link--active">Home</a>
            </li>
            <li className="nir-t-pfrda__nav-item">
              <a href="#" className="nir-t-pfrda__nav-link">About PFRDA</a>
            </li>
            <li className="nir-t-pfrda__nav-item">
              <a href="#" className="nir-t-pfrda__nav-link">Pension Schemes</a>
            </li>
            <li className="nir-t-pfrda__nav-item">
              <a href="#" className="nir-t-pfrda__nav-link">Subscriber Corner</a>
            </li>
            <li className="nir-t-pfrda__nav-item">
              <a href="#" className="nir-t-pfrda__nav-link">Regulatory Framework</a>
            </li>
            <li className="nir-t-pfrda__nav-item">
              <a href="#" className="nir-t-pfrda__nav-link">Knowledge Center</a>
            </li>
            <li className="nir-t-pfrda__nav-item">
              <a href="#" className="nir-t-pfrda__nav-link">Contact</a>
            </li>
          </ul>
          <div className="nir-t-pfrda__nav-actions">
            {/* Interactive Toggle for Density mode demonstration */}
            <Toggle 
              label="Compact Density" 
              checked={density === 'compact'}
              onChange={(e) => setDensity(e.target.checked ? 'compact' : 'default')}
            />
          </div>
        </div>
      </nav>

      {/* ── 4. Hero banner with Pension Calculator ── */}
      <section className="nir-t-pfrda__hero-section">
        <div className="nir-t-pfrda__hero-inner">
          <div className="nir-t-pfrda__hero-content">
            <h3 className="nir-t-pfrda__hero-heading">Securing Your Golden Years with Trusted Pensions</h3>
            <p className="nir-t-pfrda__hero-tagline-text">
              PFRDA regulates and promotes the Indian pension sector, ensuring security, transparency, and robust retirement wealth accumulation for a self-reliant, pension-secure India.
            </p>
            <div className="nir-t-pfrda__hero-ctas">
              <Button variant="primary" size="lg" onClick={() => alert('Redirecting to NPS registration portal...')}>
                Register for NPS
              </Button>
              <Button variant="secondary" size="lg" style={{ color: '#ffffff', borderColor: '#ffffff' }} onClick={() => alert('Redirecting to contribution gate...')}>
                Contribute Online
              </Button>
            </div>
            
            {/* Circular Search Input using Nirmaan UI Input Component */}
            <div className="nir-t-pfrda__hero-search-row">
              <Input 
                label="Search circulars, regulations, guidelines..."
                placeholder="Search circulars, regulations, guidelines..."
                className="nir-t-pfrda__hero-search-input-comp"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search PFRDA circulars"
                fullWidth
              />
              <Button variant="primary" size="md" onClick={() => alert(`Searching for "${searchQuery}"`)}>Search</Button>
            </div>
          </div>

          {/* Interactive Pension Calculator Card */}
          <div className="nir-t-pfrda__calc-card">
            <h4 className="nir-t-pfrda__calc-title">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2zm0-4H7V7h10v2zm0 8H7v-2h10v2z" />
              </svg>
              NPS Pension Estimator
            </h4>
            <div className="nir-t-pfrda__calc-form">
              {/* Age Row (Slider + Number input) */}
              <div className="nir-t-pfrda__calc-field-row">
                <div className="nir-t-pfrda__calc-slider-group">
                  <div className="nir-t-pfrda__calc-slider-label">
                    <span>Current Age (Years)</span>
                  </div>
                  <input 
                    type="range" 
                    min="18" 
                    max="60" 
                    value={age} 
                    onChange={(e) => setAge(parseInt(e.target.value) || 18)}
                    className="nir-t-pfrda__calc-slider"
                    aria-label="Current Age Slider"
                  />
                </div>
                <Input 
                  type="number"
                  label="Age"
                  min="18"
                  max="60"
                  value={age.toString()}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val >= 18 && val <= 60) setAge(val);
                    else if (e.target.value === '') setAge(18);
                  }}
                  className="nir-t-pfrda__calc-num-input"
                  size="sm"
                />
              </div>

              {/* Contribution Row (Slider + Number input) */}
              <div className="nir-t-pfrda__calc-field-row">
                <div className="nir-t-pfrda__calc-slider-group">
                  <div className="nir-t-pfrda__calc-slider-label">
                    <span>Monthly Contribution (₹)</span>
                  </div>
                  <input 
                    type="range" 
                    min="500" 
                    max="15000" 
                    step="500"
                    value={contribution} 
                    onChange={(e) => setContribution(parseInt(e.target.value) || 500)}
                    className="nir-t-pfrda__calc-slider"
                    aria-label="Monthly Contribution Slider"
                  />
                </div>
                <Input 
                  type="number"
                  label="Amount (₹)"
                  min="500"
                  max="100000"
                  step="500"
                  value={contribution.toString()}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val >= 0) setContribution(val);
                  }}
                  className="nir-t-pfrda__calc-num-input"
                  size="sm"
                />
              </div>

              {/* Expected Returns Row (Slider + Number input) */}
              <div className="nir-t-pfrda__calc-field-row">
                <div className="nir-t-pfrda__calc-slider-group">
                  <div className="nir-t-pfrda__calc-slider-label">
                    <span>Expected Returns (%)</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="15" 
                    step="0.5"
                    value={expectedReturn} 
                    onChange={(e) => setExpectedReturn(parseFloat(e.target.value) || 5)}
                    className="nir-t-pfrda__calc-slider"
                    aria-label="Expected Returns Slider"
                  />
                </div>
                <Input 
                  type="number"
                  label="Returns (%)"
                  min="5"
                  max="25"
                  step="0.1"
                  value={expectedReturn.toString()}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (val >= 0) setExpectedReturn(val);
                  }}
                  className="nir-t-pfrda__calc-num-input"
                  size="sm"
                />
              </div>

              {/* Output Results */}
              <div className="nir-t-pfrda__calc-results">
                <div className="nir-t-pfrda__calc-result-item">
                  <span className="nir-t-pfrda__calc-result-lbl">Accumulated Corpus (at Age 60)</span>
                  <span className="nir-t-pfrda__calc-result-val">{calcResults.corpus}</span>
                </div>
                <div className="nir-t-pfrda__calc-result-item">
                  <span className="nir-t-pfrda__calc-result-lbl">Estimated Monthly Pension</span>
                  <span className="nir-t-pfrda__calc-result-val nir-t-pfrda__calc-result-val--large">{calcResults.pension}</span>
                </div>
                <div className="nir-t-pfrda__calc-result-item">
                  <span className="nir-t-pfrda__calc-result-lbl">Lumpsum Withdrawal (60%)</span>
                  <span className="nir-t-pfrda__calc-result-val">{calcResults.lumpsum}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Bento Stats Dashboard ── */}
      <section className="nir-t-pfrda__bento-section">
        <div className="nir-t-pfrda__bento-inner">
          <h3 className="nir-t-pfrda__section-title">
            <span className="nir-t-pfrda__section-indicator"></span>
            National Pension Sector at a Glance
          </h3>
          <div className="nir-t-pfrda__bento-grid">
            {/* Card 1: Large AUM */}
            <div className="nir-t-pfrda__bento-card nir-t-pfrda__bento-card--large">
              <div className="nir-t-pfrda__bento-card-header">
                <span className="nir-t-pfrda__bento-lbl">Assets Under Management (AUM)</span>
                <div className="nir-t-pfrda__bento-icon-box">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z" />
                  </svg>
                </div>
              </div>
              <div>
                <div className="nir-t-pfrda__bento-val-group">
                  <p className="nir-t-pfrda__bento-val">₹11.23 Lakh Crore</p>
                  <span className="nir-t-pfrda__bento-trend">+21.4% YoY</span>
                </div>
                <p className="nir-t-pfrda__bento-desc">
                  Total assets held under NPS, APY and government sector schemes, reflecting massive growth and trust in the regulatory framework.
                </p>
              </div>
            </div>

            {/* Card 2: NPS Subscribers */}
            <div className="nir-t-pfrda__bento-card">
              <div className="nir-t-pfrda__bento-card-header">
                <span className="nir-t-pfrda__bento-lbl">NPS Subscribers</span>
                <div className="nir-t-pfrda__bento-icon-box">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                  </svg>
                </div>
              </div>
              <div>
                <div className="nir-t-pfrda__bento-val-group">
                  <p className="nir-t-pfrda__bento-val">6.84 Crore</p>
                </div>
                <p className="nir-t-pfrda__bento-desc">
                  Subscribers across Central/State Government, Corporate, and All Citizens models.
                </p>
              </div>
            </div>

            {/* Card 3: APY Enrollment */}
            <div className="nir-t-pfrda__bento-card">
              <div className="nir-t-pfrda__bento-card-header">
                <span className="nir-t-pfrda__bento-lbl">Atal Pension Yojana</span>
                <div className="nir-t-pfrda__bento-icon-box">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z" />
                  </svg>
                </div>
              </div>
              <div>
                <div className="nir-t-pfrda__bento-val-group">
                  <p className="nir-t-pfrda__bento-val">5.29 Crore</p>
                  <span className="nir-t-pfrda__bento-trend">+14.2%</span>
                </div>
                <p className="nir-t-pfrda__bento-desc">
                  Providing guaranteed pensions for citizens working in India's unorganized sector.
                </p>
              </div>
            </div>

            {/* Card 4: Pension Fund Managers */}
            <div className="nir-t-pfrda__bento-card nir-t-pfrda__bento-card--large">
              <div className="nir-t-pfrda__bento-card-header">
                <span className="nir-t-pfrda__bento-lbl">Registered Intermediaries</span>
                <div className="nir-t-pfrda__bento-icon-box">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 7V3H2v18h20V7H12zm-6 12H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm10 12h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm4 12h-2v-2h2v2zm0-4h-2v-2h2v2z" />
                  </svg>
                </div>
              </div>
              <div>
                <div className="nir-t-pfrda__bento-val-group">
                  <p className="nir-t-pfrda__bento-val">11 PFMs • 78 POPs</p>
                </div>
                <p className="nir-t-pfrda__bento-desc">
                  Regulated Pension Fund Managers, Trustee Banks, Points of Presence, and Custodians operating under strict guidelines to preserve capital and deliver optimal returns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Schemes Comparison Compartment ── */}
      <section className="nir-t-pfrda__schemes-section">
        <div className="nir-t-pfrda__schemes-inner">
          <h3 className="nir-t-pfrda__section-title">
            <span className="nir-t-pfrda__section-indicator"></span>
            Choosing the Right Pension Scheme
          </h3>
          <div className="nir-t-pfrda__schemes-grid">
            {/* NPS Scheme Card */}
            <div className="nir-t-pfrda__scheme-card nir-t-pfrda__scheme-card--nps">
              <h4 className="nir-t-pfrda__scheme-title">National Pension System (NPS)</h4>
              <p className="nir-t-pfrda__scheme-desc">
                A flexible, market-linked, voluntary defined contribution scheme designed to enable systematic savings and secure retirement wealth.
              </p>
              <ul className="nir-t-pfrda__scheme-features">
                <li>Available to all Indian citizens aged 18 to 75 years.</li>
                <li>Choice of active choice or auto choice asset allocation (Equity, Corporate Debt, Gov Securities).</li>
                <li>Additional tax benefit under Sec 80CCD(1B) up to ₹50,000.</li>
                <li>Low cost structure with highly regulated fund managers.</li>
              </ul>
              <div className="nir-t-pfrda__scheme-actions">
                <Button variant="primary" onClick={() => alert('Opening NPS details...')}>Learn More</Button>
                <Button variant="ghost" onClick={() => alert('Opening NPS FAQ...')}>FAQ</Button>
              </div>
            </div>

            {/* APY Scheme Card */}
            <div className="nir-t-pfrda__scheme-card nir-t-pfrda__scheme-card--apy">
              <h4 className="nir-t-pfrda__scheme-title">Atal Pension Yojana (APY)</h4>
              <p className="nir-t-pfrda__scheme-desc">
                A government-guaranteed pension scheme targeting workers in the unorganized sector to prevent financial vulnerability in old age.
              </p>
              <ul className="nir-t-pfrda__scheme-features">
                <li>Open to Indian citizens aged 18 to 40 years.</li>
                <li>Guaranteed minimum pension options: ₹1,000, ₹2,000, ₹3,000, ₹4,000, or ₹5,000 per month.</li>
                <li>Pension begins at age 60; spouse receives pension after death.</li>
                <li>Subsidized government co-contributions for eligible members.</li>
              </ul>
              <div className="nir-t-pfrda__scheme-actions">
                <Button variant="primary" onClick={() => alert('Opening APY details...')}>Learn More</Button>
                <Button variant="ghost" onClick={() => alert('Opening APY FAQ...')}>FAQ</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Latest Updates & Tab Selector ── */}
      <section className="nir-t-pfrda__updates-section">
        <div className="nir-t-pfrda__updates-inner">
          <div className="nir-t-pfrda__updates-layout">
            
            {/* Circulars List on the Left */}
            <div>
              <h3 className="nir-t-pfrda__section-title">
                <span className="nir-t-pfrda__section-indicator"></span>
                Latest Circulars & Notifications
              </h3>
              
              {/* Tab Selector */}
              <div className="nir-t-pfrda__tabs-bar" role="tablist" aria-label="Circular categories">
                <button 
                  role="tab"
                  aria-selected={activeTab === 'all'}
                  className={`nir-t-pfrda__tab-trigger ${activeTab === 'all' ? 'nir-t-pfrda__tab-trigger--active' : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  All Circulars
                </button>
                <button 
                  role="tab"
                  aria-selected={activeTab === 'nps'}
                  className={`nir-t-pfrda__tab-trigger ${activeTab === 'nps' ? 'nir-t-pfrda__tab-trigger--active' : ''}`}
                  onClick={() => setActiveTab('nps')}
                >
                  NPS Updates
                </button>
                <button 
                  role="tab"
                  aria-selected={activeTab === 'apy'}
                  className={`nir-t-pfrda__tab-trigger ${activeTab === 'apy' ? 'nir-t-pfrda__tab-trigger--active' : ''}`}
                  onClick={() => setActiveTab('apy')}
                >
                  APY Updates
                </button>
                <button 
                  role="tab"
                  aria-selected={activeTab === 'regs'}
                  className={`nir-t-pfrda__tab-trigger ${activeTab === 'regs' ? 'nir-t-pfrda__tab-trigger--active' : ''}`}
                  onClick={() => setActiveTab('regs')}
                >
                  Regulations
                </button>
              </div>

              {/* Dynamic Circular List */}
              <div className="nir-t-pfrda__circulars-list">
                {filteredCirculars.length > 0 ? (
                  filteredCirculars.map((item) => (
                    <article key={item.id} className="nir-t-pfrda__circular-card">
                      <div className="nir-t-pfrda__circular-date-badge" aria-hidden="true">
                        <span className="nir-t-pfrda__circular-day">{item.day}</span>
                        <span className="nir-t-pfrda__circular-month">{item.month}</span>
                      </div>
                      <div className="nir-t-pfrda__circular-content">
                        <div className="nir-t-pfrda__circular-meta">
                          <span className="nir-t-pfrda__circular-tag">{item.tag}</span>
                          <span>Reference: {item.ref}</span>
                        </div>
                        <h4 className="nir-t-pfrda__circular-title">
                          <a href="#" onClick={(e) => { e.preventDefault(); alert(`Downloading circular ${item.ref}...`); }}>
                            {item.title}
                          </a>
                        </h4>
                      </div>
                      <button 
                        className="nir-t-pfrda__circular-download-btn"
                        title="Download PDF document"
                        aria-label={`Download PDF for circular ${item.ref}`}
                        onClick={() => alert(`Downloading circular ${item.ref}...`)}
                      >
                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z" />
                        </svg>
                      </button>
                    </article>
                  ))
                ) : (
                  <p style={{ textAlign: 'center', padding: '24px 0', color: 'var(--nir-color-text-secondary)' }}>
                    No circulars found matching your search.
                  </p>
                )}
              </div>
            </div>

            {/* Quick Links Column */}
            <div>
              <h3 className="nir-t-pfrda__section-title">
                <span className="nir-t-pfrda__section-indicator"></span>
                Grievance & Redressal
              </h3>
              <div className="nir-t-pfrda__corner-card">
                <h4 className="nir-t-pfrda__corner-title">Quick Portals</h4>
                <div className="nir-t-pfrda__corner-links">
                  <a href="#" className="nir-t-pfrda__corner-link" onClick={(e) => { e.preventDefault(); alert('Opening NPS Trust Portal...'); }}>
                    <span>NPS Trust Website</span>
                    <span>→</span>
                  </a>
                  <a href="#" className="nir-t-pfrda__corner-link" onClick={(e) => { e.preventDefault(); alert('Opening Grievance Portal...'); }}>
                    <span>Lodge Grievance (CGMS)</span>
                    <span>→</span>
                  </a>
                  <a href="#" className="nir-t-pfrda__corner-link" onClick={(e) => { e.preventDefault(); alert('Opening CRA Login Portal...'); }}>
                    <span>CRA Account Login</span>
                    <span>→</span>
                  </a>
                  <a href="#" className="nir-t-pfrda__corner-link" onClick={(e) => { e.preventDefault(); alert('Opening NPS Ki Pathshala...'); }}>
                    <span>NPS Ki Pathshala (Awareness)</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 8. Government Footer ── */}
      <footer className="nir-t-pfrda__footer">
        <div className="nir-t-pfrda__footer-inner">
          <div className="nir-t-pfrda__footer-grid">
            <div className="nir-t-pfrda__footer-col">
              <h5 className="nir-t-pfrda__footer-title">PFRDA REGULATORY</h5>
              <p className="nir-t-pfrda__footer-about">
                The Pension Fund Regulatory and Development Authority is the statutory regulatory body established by the Government of India to promote, regulate, and ensure the orderly growth of pension schemes.
              </p>
            </div>
            <div className="nir-t-pfrda__footer-col">
              <h5 className="nir-t-pfrda__footer-title">IMPORTANT SCHEMES</h5>
              <ul className="nir-t-pfrda__footer-links">
                <li><a href="#">National Pension System (NPS)</a></li>
                <li><a href="#">Atal Pension Yojana (APY)</a></li>
                <li><a href="#">Corporate Pension Models</a></li>
                <li><a href="#">Government NPS Contributions</a></li>
              </ul>
            </div>
            <div className="nir-t-pfrda__footer-col">
              <h5 className="nir-t-pfrda__footer-title">RESOURCE CENTRE</h5>
              <ul className="nir-t-pfrda__footer-links">
                <li><a href="#">PFRDA Acts & Regulations</a></li>
                <li><a href="#">Guidelines & Master Circulars</a></li>
                <li><a href="#">Public Disclosures & Tenders</a></li>
                <li><a href="#">RTI Act Disclosures</a></li>
              </ul>
            </div>
            <div className="nir-t-pfrda__footer-col">
              <h5 className="nir-t-pfrda__footer-title">HELPLINE SUPPORT</h5>
              <ul className="nir-t-pfrda__footer-links">
                <li><span>Toll-Free (NPS):</span> <a href="tel:1800110708">1800 110 708</a></li>
                <li><span>Toll-Free (APY):</span> <a href="tel:1800110069">1800 110 069</a></li>
                <li><span>Email Helpdesk:</span> <a href="mailto:helpdesk@pfrda.org.in">helpdesk@pfrda.org.in</a></li>
              </ul>
            </div>
          </div>
          <div className="nir-t-pfrda__footer-meta">
            <div>
              <span>© 2026 Pension Fund Regulatory and Development Authority. All Rights Reserved.</span>
            </div>
            <div className="nir-t-pfrda__footer-compliance">
              <span className="nir-t-pfrda__compliance-badge">GIGW 3.0 COMPLIANT</span>
              <span className="nir-t-pfrda__compliance-badge">WCAG AAA ACCESSIBILITY</span>
              <a href="#" style={{ color: 'rgba(255,255,255,0.7)', marginLeft: '16px' }} onClick={(e) => { e.preventDefault(); alert('Website Policies loaded.'); }}>Website Policies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * PfrdaTemplate — Redesigned PFRDA CONNECT Portal Page Template.
 * Fully styled using Nirmaan UI Layer 1 elements and Central Government token overrides.
 */
export function PfrdaTemplate(props: PfrdaTemplateProps) {
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  return (
    <div ref={setContainerRef} className="nir-t-pfrda-wrapper" style={{ width: '100%' }}>
      {containerRef && (
        <NirmanProvider defaultBrand="goi" defaultTheme="light" rootElement={containerRef}>
          <PfrdaPortalInner {...props} />
        </NirmanProvider>
      )}
    </div>
  );
}

export default PfrdaTemplate;
