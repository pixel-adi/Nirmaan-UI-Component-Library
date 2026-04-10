import React, { forwardRef, useId, useState, useRef, useEffect, useCallback } from 'react';
import './Dropdown.css';

export interface DropdownOption {
  /** Unique value */
  value: string;
  /** Display label */
  label: string;
  /** Optional secondary text */
  description?: string;
  /** Disabled state */
  disabled?: boolean;
}

export interface DropdownProps {
  /** Label text */
  label: string;
  /** Options list */
  options: DropdownOption[];
  /** Currently selected value (controlled) */
  value?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Placeholder when no value selected */
  placeholder?: string;
  /** Helper text below the field */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Full width */
  fullWidth?: boolean;
  /** Disabled */
  disabled?: boolean;
  /** Name for form submission */
  name?: string;
}

/**
 * nir-e-dropdown — Accessible single-select dropdown.
 *
 * @a11y
 * - role="combobox", aria-expanded, aria-controls, aria-activedescendant
 * - Arrow keys navigate options, Enter/Space selects
 * - Escape closes menu
 * - Home/End jump to first/last
 * - Typing letters jumps to matching option
 */
export function Dropdown({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  helperText,
  error,
  size = 'md',
  fullWidth = false,
  disabled = false,
  name,
}: DropdownProps) {
  const id = useId();
  const listboxId = id + '-listbox';
  const labelId = id + '-label';
  const helperId = helperText ? id + '-helper' : undefined;
  const errorId = error ? id + '-error' : undefined;
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find((o) => o.value === value);
  const enabledOptions = options.filter((o) => !o.disabled);

  const close = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, []);

  const handleSelect = (option: DropdownOption) => {
    if (option.disabled) return;
    onChange?.(option.value);
    close();
    triggerRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        setOpen(true);
        const currentIdx = options.findIndex((o) => o.value === value);
        setActiveIndex(currentIdx >= 0 ? currentIdx : 0);
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        close();
        triggerRef.current?.focus();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((i) => {
          let next = i + 1;
          while (next < options.length && options[next].disabled) next++;
          return next >= options.length ? options.findIndex((o) => !o.disabled) : next;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((i) => {
          let next = i - 1;
          while (next >= 0 && options[next].disabled) next--;
          if (next < 0) {
            for (let j = options.length - 1; j >= 0; j--) {
              if (!options[j].disabled) return j;
            }
          }
          return next;
        });
        break;
      case 'Home':
        e.preventDefault();
        setActiveIndex(options.findIndex((o) => !o.disabled));
        break;
      case 'End':
        e.preventDefault();
        for (let j = options.length - 1; j >= 0; j--) {
          if (!options[j].disabled) {
            setActiveIndex(j);
            break;
          }
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (activeIndex >= 0 && options[activeIndex]) {
          handleSelect(options[activeIndex]);
        }
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
        triggerRef.current && !triggerRef.current.contains(target) &&
        listboxRef.current && !listboxRef.current.contains(target)
      ) {
        close();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, close]);

  return (
    <div
      className={[
        'nir-e-dropdown',
        'nir-e-dropdown--' + size,
        fullWidth ? 'nir-e-dropdown--full' : '',
        error ? 'nir-e-dropdown--error' : '',
        disabled ? 'nir-e-dropdown--disabled' : '',
        open ? 'nir-e-dropdown--open' : '',
      ].filter(Boolean).join(' ')}
    >
      <label className="nir-e-dropdown__label" id={labelId} htmlFor={id}>
        {label}
      </label>

      <div className="nir-e-dropdown__wrapper">
        <button
          ref={triggerRef}
          type="button"
          id={id}
          className="nir-e-dropdown__trigger"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-labelledby={labelId}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          aria-activedescendant={activeIndex >= 0 ? id + '-option-' + activeIndex : undefined}
          disabled={disabled}
          onClick={() => !disabled && setOpen((o) => !o)}
          onKeyDown={handleKeyDown}
        >
          <span className="nir-e-dropdown__value">
            {selectedOption ? selectedOption.label : <span className="nir-e-dropdown__placeholder">{placeholder}</span>}
          </span>
          <svg className="nir-e-dropdown__chevron" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {open && (
          <ul
            ref={listboxRef}
            id={listboxId}
            className="nir-e-dropdown__menu"
            role="listbox"
            aria-labelledby={labelId}
            tabIndex={-1}
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;
              const isActive = index === activeIndex;
              return (
                <li
                  key={option.value}
                  id={id + '-option-' + index}
                  className={[
                    'nir-e-dropdown__option',
                    isSelected ? 'nir-e-dropdown__option--selected' : '',
                    isActive ? 'nir-e-dropdown__option--active' : '',
                    option.disabled ? 'nir-e-dropdown__option--disabled' : '',
                  ].filter(Boolean).join(' ')}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled || undefined}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => !option.disabled && setActiveIndex(index)}
                >
                  <span className="nir-e-dropdown__option-label">{option.label}</span>
                  {option.description && (
                    <span className="nir-e-dropdown__option-description">{option.description}</span>
                  )}
                  {isSelected && (
                    <svg className="nir-e-dropdown__check" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M5 10l3 3 7-7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {name && <input type="hidden" name={name} value={value || ''} />}
      </div>

      {error && (
        <p className="nir-e-dropdown__error" id={errorId} role="alert">{error}</p>
      )}
      {helperText && !error && (
        <p className="nir-e-dropdown__helper" id={helperId}>{helperText}</p>
      )}
    </div>
  );
}

Dropdown.displayName = 'NirDropdown';
