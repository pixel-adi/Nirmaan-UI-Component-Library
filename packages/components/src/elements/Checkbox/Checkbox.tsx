import React, { forwardRef, useId, useEffect, useRef } from 'react';
import './Checkbox.css';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Label text — required for accessibility */
  label: string;
  /** Helper text below the checkbox */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Indeterminate state (partially selected group) */
  indeterminate?: boolean;
  /** Size */
  size?: 'sm' | 'md';
}

/**
 * nir-e-checkbox — Binary or indeterminate selection.
 *
 * @a11y
 * - Native <input type="checkbox"> (role implicit)
 * - Label linked via htmlFor/id
 * - aria-checked="mixed" for indeterminate
 * - aria-describedby for helper/error text
 * - aria-invalid when error
 * - Min touch target: 44×44px tap area
 *
 * @keyboard
 * - Tab: focus
 * - Space: toggle checked
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      helperText,
      error,
      indeterminate = false,
      size = 'md',
      disabled = false,
      className = '',
      id: externalId,
      ...rest
    },
    forwardedRef
  ) => {
    const generatedId = useId();
    const inputId = externalId || generatedId;
    const helperId = helperText ? inputId + '-helper' : undefined;
    const errorId = error ? inputId + '-error' : undefined;
    const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

    const internalRef = useRef<HTMLInputElement>(null);

    // Handle indeterminate (can't be set via HTML attribute)
    useEffect(() => {
      const el = internalRef.current;
      if (el) el.indeterminate = indeterminate;
    }, [indeterminate]);

    // Merge refs
    const setRef = (node: HTMLInputElement | null) => {
      (internalRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
    };

    const wrapperClasses = [
      'nir-e-checkbox',
      'nir-e-checkbox--' + size,
      error ? 'nir-e-checkbox--error' : '',
      disabled ? 'nir-e-checkbox--disabled' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={wrapperClasses}>
        <div className="nir-e-checkbox__control">
          <input
            ref={setRef}
            type="checkbox"
            id={inputId}
            className="nir-e-checkbox__input"
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            {...rest}
          />
          <svg className="nir-e-checkbox__box" viewBox="0 0 20 20" aria-hidden="true">
            <rect className="nir-e-checkbox__bg" x="1" y="1" width="18" height="18" rx="3" />
            <path className="nir-e-checkbox__check" d="M5 10l3 3 7-7" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line className="nir-e-checkbox__dash" x1="5" y1="10" x2="15" y2="10" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <label className="nir-e-checkbox__label" htmlFor={inputId}>
            {label}
          </label>
        </div>

        {error && (
          <p className="nir-e-checkbox__error" id={errorId} role="alert">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="nir-e-checkbox__helper" id={helperId}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'NirCheckbox';
