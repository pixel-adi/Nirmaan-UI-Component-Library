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
  /** Currently selected value */
  value?: string;
  /** Change handler (called with value string or null when cleared) */
  onChange?: (value: string | null) => void;
  /** Placeholder */
  placeholder?: string;
  /** Helper text */
  helperText?: string;
  /** Error message */
  error?: string;
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
  size = 'md',
  fullWidth = false,
  disabled = false,
  minChars = 1,
  maxResults = 10,
  name,
  noResultsText = 'No matches found',
}: AutocompleteProps) {
  const id = useId();
  const listboxId = id + '-listbox';
  const labelId = id + '-label';
  const helperId = helperText ? id + '-helper' : undefined;
  const errorId = error ? id + '-error' : undefined;
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

  const selectedOption = options.find((o) => o.value === value);
  const [inputValue, setInputValue] = useState(selectedOption?.label || '');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  // Sync input when value prop changes externally
  useEffect(() => {
    if (value) {
      const opt = options.find((o) => o.value === value);
      if (opt) setInputValue(opt.label);
    } else {
      setInputValue('');
    }
  }, [value, options]);

  // Filter options based on input
  const filteredOptions = useMemo(() => {
    if (inputValue.length < minChars) return [];
    const query = inputValue.toLowerCase();
    return options
      .filter((o) => o.label.toLowerCase().includes(query))
      .slice(0, maxResults);
  }, [inputValue, options, minChars, maxResults]);

  const close = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, []);

  const handleSelect = (option: AutocompleteOption) => {
    setInputValue(option.label);
    onChange?.(option.value);
    close();
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setInputValue(next);
    setOpen(next.length >= minChars);
    setActiveIndex(-1);
    if (next === '' && value) {
      onChange?.(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!open && inputValue.length >= minChars) setOpen(true);
        setActiveIndex((i) => (i + 1) % Math.max(filteredOptions.length, 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!open) return;
        setActiveIndex((i) => (i <= 0 ? filteredOptions.length - 1 : i - 1));
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

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        inputRef.current && !inputRef.current.contains(target) &&
        listboxRef.current && !listboxRef.current.contains(target)
      ) {
        close();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, close]);

  const showNoResults = open && inputValue.length >= minChars && filteredOptions.length === 0;

  return (
    <div
      className={[
        'nir-e-autocomplete',
        'nir-e-autocomplete--' + size,
        fullWidth ? 'nir-e-autocomplete--full' : '',
        error ? 'nir-e-autocomplete--error' : '',
        disabled ? 'nir-e-autocomplete--disabled' : '',
        open ? 'nir-e-autocomplete--open' : '',
      ].filter(Boolean).join(' ')}
    >
      <label className="nir-e-autocomplete__label" id={labelId} htmlFor={id}>
        {label}
      </label>

      <div className="nir-e-autocomplete__wrapper">
        <input
          ref={inputRef}
          type="text"
          id={id}
          className="nir-e-autocomplete__input"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-activedescendant={activeIndex >= 0 ? id + '-option-' + activeIndex : undefined}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue.length >= minChars && setOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
        />

        <svg className="nir-e-autocomplete__icon" viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M14 14l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>

        {open && (filteredOptions.length > 0 || showNoResults) && (
          <ul
            ref={listboxRef}
            id={listboxId}
            className="nir-e-autocomplete__menu"
            role="listbox"
            aria-labelledby={labelId}
          >
            {filteredOptions.map((option, index) => {
              const isActive = index === activeIndex;
              const isSelected = option.value === value;
              return (
                <li
                  key={option.value}
                  id={id + '-option-' + index}
                  className={[
                    'nir-e-autocomplete__option',
                    isSelected ? 'nir-e-autocomplete__option--selected' : '',
                    isActive ? 'nir-e-autocomplete__option--active' : '',
                  ].filter(Boolean).join(' ')}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <HighlightedLabel text={option.label} query={inputValue} />
                  {option.description && (
                    <span className="nir-e-autocomplete__option-description">{option.description}</span>
                  )}
                </li>
              );
            })}
            {showNoResults && (
              <li className="nir-e-autocomplete__no-results" role="option" aria-selected="false">
                {noResultsText}
              </li>
            )}
          </ul>
        )}

        {name && <input type="hidden" name={name} value={value || ''} />}
      </div>

      {error && (
        <p className="nir-e-autocomplete__error" id={errorId} role="alert">{error}</p>
      )}
      {helperText && !error && (
        <p className="nir-e-autocomplete__helper" id={helperId}>{helperText}</p>
      )}
    </div>
  );
}

Autocomplete.displayName = 'NirAutocomplete';

// Highlight matched portion of label
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
