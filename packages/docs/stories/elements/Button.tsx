import React, { forwardRef } from 'react';
import './Button.css';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost';
  /** Size — md (44px) meets WCAG 2.5.8 touch target */
  size?: 'sm' | 'md' | 'lg';
  /** Full width */
  fullWidth?: boolean;
  /** Loading state — shows spinner, announces to SR */
  loading?: boolean;
  /** Icon before label */
  iconLeft?: React.ReactNode;
  /** Icon after label */
  iconRight?: React.ReactNode;
}

/**
 * nir-e-button — Primary interactive element
 *
 * @a11y role: button (native), aria-disabled, aria-busy
 * @keyboard Enter/Space to activate
 * @touch Min 44×44px (md), focus ring 2px offset ≥3:1
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      disabled = false,
      iconLeft,
      iconRight,
      children,
      className = '',
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const classes = [
      'nir-e-button',
      'nir-e-button--' + variant,
      'nir-e-button--' + size,
      fullWidth ? 'nir-e-button--full' : '',
      loading ? 'nir-e-button--loading' : '',
      isDisabled ? 'nir-e-button--disabled' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        className={classes}
        disabled={isDisabled}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        {...rest}
      >
        {loading && (
          <span className="nir-e-button__spinner" aria-hidden="true">
            <svg viewBox="0 0 20 20" fill="none" className="nir-e-button__spinner-svg">
              <circle
                cx="10" cy="10" r="8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="50.26"
                strokeDashoffset="25.13"
              />
            </svg>
          </span>
        )}
        {!loading && iconLeft && (
          <span className="nir-e-button__icon" aria-hidden="true">{iconLeft}</span>
        )}
        <span className="nir-e-button__label">{children}</span>
        {!loading && iconRight && (
          <span className="nir-e-button__icon" aria-hidden="true">{iconRight}</span>
        )}
        {loading && (
          <span className="nir-sr-only">Loading, please wait</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'NirButton';
