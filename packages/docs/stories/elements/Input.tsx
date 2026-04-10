import React, { forwardRef, useId } from 'react';
import './Input.css';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Label text — required for accessibility */
  label: string;
  /** Helper text below the input */
  helperText?: string;
  /** Error message — shows error state when provided */
  error?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Full width */
  fullWidth?: boolean;
  /** Left icon/prefix */
  iconLeft?: React.ReactNode;
  /** Right icon/suffix */
  iconRight?: React.ReactNode;
}

/**
 * nir-e-input — Text input field with label, helper text, and error state.
 *
 * @a11y
 * - Label linked via htmlFor/id (native)
 * - aria-describedby links to helper/error text
 * - aria-invalid when error is present
 * - Error announced via aria-live="polite"
 * - Min touch target: 44px (md)
 *
 * @keyboard
 * - Tab: focus
 * - Type: input
 * - Standard text editing shortcuts
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      size = 'md',
      fullWidth = false,
      disabled = false,
      iconLeft,
      iconRight,
      className = '',
      id: externalId,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = externalId || generatedId;
    const helperId = helperText ? inputId + '-helper' : undefined;
    const errorId = error ? inputId + '-error' : undefined;
    const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

    const wrapperClasses = [
      'nir-e-input',
      'nir-e-input--' + size,
      fullWidth ? 'nir-e-input--full' : '',
      error ? 'nir-e-input--error' : '',
      disabled ? 'nir-e-input--disabled' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={wrapperClasses}>
        <label className="nir-e-input__label" htmlFor={inputId}>
          {label}
        </label>

        <div className="nir-e-input__field-wrapper">
          {iconLeft && (
            <span className="nir-e-input__icon nir-e-input__icon--left" aria-hidden="true">
              {iconLeft}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className="nir-e-input__field"
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            {...rest}
          />

          {iconRight && (
            <span className="nir-e-input__icon nir-e-input__icon--right" aria-hidden="true">
              {iconRight}
            </span>
          )}
        </div>

        {error && (
          <p className="nir-e-input__error" id={errorId} role="alert">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="nir-e-input__helper" id={helperId}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'NirInput';
