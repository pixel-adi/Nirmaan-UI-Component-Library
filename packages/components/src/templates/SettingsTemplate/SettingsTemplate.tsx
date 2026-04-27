import React, { useState } from 'react';
import { Input } from '../../elements/Input';
import { Button } from '../../elements/Button';
import { Toggle } from '../../elements/Toggle';
import { Autocomplete, AutocompleteOption } from '../../elements/Autocomplete';
import './SettingsTemplate.css';

export interface SettingsTemplateProps {
  /** Page title */
  title?: string;
  /** Subtitle text */
  subtitle?: string;
  /** Initial profile data */
  initialData?: {
    firstName: string;
    lastName: string;
    email: string;
    timezone: string;
    marketingEmails: boolean;
    securityAlerts: boolean;
  };
  /** Timezone options for the autocomplete */
  timezoneOptions?: AutocompleteOption[];
  /** Callback when the save button is clicked */
  onSave?: (data: any) => void;
  /** Loading state for the save button */
  isSaving?: boolean;
}

const DEFAULT_TIMEZONES: AutocompleteOption[] = [
  { label: 'Pacific Time (US & Canada)', value: 'PST' },
  { label: 'Mountain Time (US & Canada)', value: 'MST' },
  { label: 'Central Time (US & Canada)', value: 'CST' },
  { label: 'Eastern Time (US & Canada)', value: 'EST' },
  { label: 'Greenwich Mean Time (London)', value: 'GMT' },
  { label: 'Central European Time (Paris)', value: 'CET' },
  { label: 'Indian Standard Time (New Delhi)', value: 'IST' },
  { label: 'Japan Standard Time (Tokyo)', value: 'JST' },
  { label: 'Australian Eastern Time (Sydney)', value: 'AET' },
];

/**
 * nir-t-settings — Standard Settings/Profile Page Template.
 * Composes Input, Autocomplete, Toggle, and Button elements into a common dashboard layout.
 */
export function SettingsTemplate({
  title = 'Account Settings',
  subtitle = 'Manage your profile and preferences.',
  initialData = {
    firstName: '',
    lastName: '',
    email: '',
    timezone: '',
    marketingEmails: false,
    securityAlerts: true,
  },
  timezoneOptions = DEFAULT_TIMEZONES,
  onSave,
  isSaving = false,
}: SettingsTemplateProps) {
  const [formData, setFormData] = useState(initialData);

  const handleInputChange = (field: keyof typeof initialData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleToggleChange = (field: keyof typeof initialData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.checked }));
  };

  const handleTimezoneChange = (value: string | null) => {
    setFormData((prev) => ({ ...prev, timezone: value || '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(formData);
  };

  return (
    <div className="nir-t-settings">
      <div className="nir-t-settings__container">
        
        {/* Sidebar / Navigation */}
        <aside className="nir-t-settings__sidebar">
          <nav className="nir-t-settings__nav">
            <a href="#profile" className="nir-t-settings__nav-item nir-t-settings__nav-item--active">
              Profile
            </a>
            <a href="#notifications" className="nir-t-settings__nav-item">
              Notifications
            </a>
            <a href="#security" className="nir-t-settings__nav-item">
              Security
            </a>
            <a href="#billing" className="nir-t-settings__nav-item">
              Billing
            </a>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="nir-t-settings__main">
          <div className="nir-t-settings__header">
            <h1 className="nir-t-settings__title">{title}</h1>
            <p className="nir-t-settings__subtitle">{subtitle}</p>
          </div>

          <form className="nir-t-settings__form" onSubmit={handleSubmit}>
            
            {/* Profile Section */}
            <section className="nir-t-settings__section">
              <h2 className="nir-t-settings__section-title">Personal Information</h2>
              <div className="nir-t-settings__grid">
                <Input
                  label="First Name"
                  placeholder="e.g. Jane"
                  value={formData.firstName}
                  onChange={handleInputChange('firstName')}
                  fullWidth
                />
                <Input
                  label="Last Name"
                  placeholder="e.g. Doe"
                  value={formData.lastName}
                  onChange={handleInputChange('lastName')}
                  fullWidth
                />
                <div className="nir-t-settings__grid-full">
                  <Input
                    type="email"
                    label="Email Address"
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    fullWidth
                  />
                </div>
                <div className="nir-t-settings__grid-full">
                  <Autocomplete
                    label="Timezone"
                    placeholder="Search timezones..."
                    options={timezoneOptions}
                    value={formData.timezone}
                    onChange={handleTimezoneChange}
                    fullWidth
                  />
                </div>
              </div>
            </section>

            <hr className="nir-t-settings__divider" />

            {/* Notifications Section */}
            <section className="nir-t-settings__section">
              <h2 className="nir-t-settings__section-title">Email Notifications</h2>
              <div className="nir-t-settings__toggles">
                <div className="nir-t-settings__toggle-row">
                  <div className="nir-t-settings__toggle-info">
                    <span className="nir-t-settings__toggle-label">Marketing emails</span>
                    <span className="nir-t-settings__toggle-desc">Receive updates about new features and promotions.</span>
                  </div>
                  <Toggle
                    label="Toggle Marketing Emails"
                    checked={formData.marketingEmails}
                    onChange={handleToggleChange('marketingEmails')}
                  />
                </div>
                
                <div className="nir-t-settings__toggle-row">
                  <div className="nir-t-settings__toggle-info">
                    <span className="nir-t-settings__toggle-label">Security alerts</span>
                    <span className="nir-t-settings__toggle-desc">Get notified when there's suspicious activity on your account.</span>
                  </div>
                  <Toggle
                    label="Toggle Security Alerts"
                    checked={formData.securityAlerts}
                    onChange={handleToggleChange('securityAlerts')}
                  />
                </div>
              </div>
            </section>

            <hr className="nir-t-settings__divider" />

            {/* Actions */}
            <div className="nir-t-settings__actions">
              <Button type="button" variant="secondary">
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSaving}>
                {isSaving ? 'Saving changes...' : 'Save changes'}
              </Button>
            </div>
            
          </form>
        </main>

      </div>
    </div>
  );
}

export default SettingsTemplate;
