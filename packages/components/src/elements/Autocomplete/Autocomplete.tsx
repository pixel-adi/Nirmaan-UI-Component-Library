import React, { useId, useState, useRef, useEffect, useCallback, useMemo } from 'react';
import './Autocomplete.css';

export interface AutocompleteOption {
  value: string;
  label: string;
  description?: string;
}

export interface AutocompleteProps {
  /** Label */
  label: string;
  /** All available options */
  options: AutocompleteOption[];
  /** Currently selected value (controlled) */
  value?: string;
  /** Change handler (called with value string or null when cleared) */
  onChange?: (value: string | null) => void;
  /** Placeholder */
  placeholder?: string;
  /** Helper text */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Visual variant */
  variant?: 'outlined' | 'filled' | 'underline';
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Full width */
  fullWidth?: boolean;
  /** Disabled */
  disabled?: boolean;
  /** Minimum characters before showing suggestions (default 1) */
  minChars?: number;
  /** Max number of suggestions shown (default 10) */
  maxResults?: number;
  /** Name for form submission */
  name?: string;
  /** Message when no matches found */
  noResultsText?: string;
  /** Show a clear (×) button when there is typed text */
  clearable?: boolean;
}

/**
 * nir-e-autocomplete — Type-to-search with suggestion list.
 *
 * @a11y
 * - role="combobox" on input with aria-expanded, aria-controls, aria-autocomplete="list"
 * - Arrow keys navigate, Enter selects, Escape closes
 * - Filtered results announced via aria-live
 */
export function Autocomplete({
  label,
  options,
  value,
  onChange,
  placeholder = 'Start typing...',
  helperText,
  error,
  variant = 'outlined',
  size = 'md',
  fullWidth = false,
  disabled = false,
  minChars = 1,
  maxResults = 10,
  name,
  noResultsText = 'No matches found',
  clearable = true,
}: AutocompleteProps) {
  const id = useId();
  const listboxId = id + '-listbox';
  const labelId = id + '-label';
  const helperId = helperText ? id + '-helper' : undefined;
  const errorId = error ? id + '-error' : undefined;
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

  const selectedOption = options.find((o) => o.value === value);

  // Internal input text state — always tracks what's in the <input>
  const [inputValue, setInputValue] = useState(selectedOption?.label ?? '');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync when controlled value changes externally
  useEffect(() => {
    const opt = options.find((o) => o.value === value);
    setInputValue(opt?.label ?? '');
  }, [value, options]);

  // Filter options
  const filteredOptions = useMemo(() => {
    if (inputValue.length < minChars) return [];
    const q = inputValue.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q)).slice(0, maxResults);
  }, [inputValue, options, minChars, maxResults]);

  const close = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, []);

  const handleSelect = useCallback(
    (option: AutocompleteOption) => {
      setInputValue(option.label);
      onChange?.(option.value);
      close();
      // Return focus to input after selection
      requestAnimationFrame(() => inputRef.current?.focus());
    },
    [onChange, close]
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      // Prevent the input from blurring which would close the dropdown via outside-click
      e.preventDefault();
      setInputValue('');
      onChange?.(null);
      close();
      requestAnimationFrame(() => inputRef.current?.focus());
    },
    [onChange, close]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setInputValue(next);
    if (next.length >= minChars) {
      setOpen(true);
    } else {
      setOpen(false);
    }
    setActiveIndex(-1);
    // If user cleared the input, clear the selection too
    if (next === '' && value !== undefined) {
      onChange?.(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    const total = filteredOptions.length;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!open && inputValue.length >= minChars) setOpen(true);
        setActiveIndex((i) => (total === 0 ? -1 : (i + 1) % total));
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!open) return;
        setActiveIndex((i) => (total === 0 ? -1 : i <= 0 ? total - 1 : i - 1));
        break;
      case 'Enter':
        if (open && activeIndex >= 0 && filteredOptions[activeIndex]) {
          e.preventDefault();
          handleSelect(filteredOptions[activeIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        close();
        break;
      case 'Tab':
        close();
        break;
    }
  };

  // Close on outside click — using wrapperRef so the whole component (label+input+menu) is checked
  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [open, close]);

  // Scroll active item into view
  useEffect(() => {
    if (!listboxRef.current || activeIndex < 0) return;
    const item = listboxRef.current.querySelector<HTMLElement>(
      `[id="${id}-option-${activeIndex}"]`
    );
    item?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, id]);

  const showNoResults =
    open && inputValue.length >= minChars && filteredOptions.length === 0;
  const showClear = clearable && inputValue.length > 0 && !disabled;

  return (
    <div
      ref={wrapperRef}
      className={[
        'nir-e-autocomplete',
        `nir-e-autocomplete--${variant}`,
        `nir-e-autocomplete--${size}`,
        fullWidth ? 'nir-e-autocomplete--full' : '',
        error ? 'nir-e-autocomplete--error' : '',
        disabled ? 'nir-e-autocomplete--disabled' : '',
        open ? 'nir-e-autocomplete--open' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <label className="nir-e-autocomplete__label" id={labelId} htmlFor={id}>
        {label}
      </label>

      <div className="nir-e-autocomplete__wrapper">
        {/* Search icon */}
        <svg className="nir-e-autocomplete__icon" viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.8" fill="none" />
          <path d="M13 13l3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          id={id}
          className="nir-e-autocomplete__input"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-activedescendant={
            activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined
          }
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          aria-label={label}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (inputValue.length >= minChars && filteredOptions.length > 0) setOpen(true);
          }}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          spellCheck={false}
        />

        {/* Clear button — onMouseDown+preventDefault keeps input focused */}
        {showClear && (
          <button
            type="button"
            className="nir-e-autocomplete__clear"
            aria-label="Clear"
            tabIndex={-1}
            onMouseDown={handleClear}
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}

        {/* Dropdown */}
        {(open && (filteredOptions.length > 0 || showNoResults)) && (
          <ul
            ref={listboxRef}
            id={listboxId}
            className="nir-e-autocomplete__menu"
            role="listbox"
            aria-labelledby={labelId}
          >
            {/* Live count for screen readers */}
            <li role="presentation" className="nir-e-autocomplete__sr-count" aria-live="polite">
              {filteredOptions.length} result{filteredOptions.length !== 1 ? 's' : ''}
            </li>

            {filteredOptions.map((option, index) => {
              const isActive = index === activeIndex;
              const isSelected = option.value === value;
              return (
                <li
                  key={option.value}
                  id={`${id}-option-${index}`}
                  className={[
                    'nir-e-autocomplete__option',
                    isSelected ? 'nir-e-autocomplete__option--selected' : '',
                    isActive ? 'nir-e-autocomplete__option--active' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  role="option"
                  aria-selected={isSelected}
                  // onMouseDown+preventDefault: keeps the input focused so blur
                  // doesn't fire before click, preventing a race with the outside-click handler
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(option);
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <HighlightedLabel text={option.label} query={inputValue} />
                  {option.description && (
                    <span className="nir-e-autocomplete__option-description">
                      {option.description}
                    </span>
                  )}
                </li>
              );
            })}

            {showNoResults && (
              <li
                className="nir-e-autocomplete__no-results"
                role="option"
                aria-selected={false}
              >
                {noResultsText}
              </li>
            )}
          </ul>
        )}

        {name && <input type="hidden" name={name} value={value ?? ''} />}
      </div>

      {error && (
        <p className="nir-e-autocomplete__error" id={errorId} role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="nir-e-autocomplete__helper" id={helperId}>
          {helperText}
        </p>
      )}
    </div>
  );
}

Autocomplete.displayName = 'NirAutocomplete';

// ── Highlight matched portion of the label ──────────────────────────────────
function HighlightedLabel({ text, query }: { text: string; query: string }) {
  if (!query) return <span className="nir-e-autocomplete__option-label">{text}</span>;
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const idx = lowerText.indexOf(lowerQuery);
  if (idx === -1) return <span className="nir-e-autocomplete__option-label">{text}</span>;
  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + query.length);
  const after = text.slice(idx + query.length);
  return (
    <span className="nir-e-autocomplete__option-label">
      {before}
      <mark className="nir-e-autocomplete__match">{match}</mark>
      {after}
    </span>
  );
}
