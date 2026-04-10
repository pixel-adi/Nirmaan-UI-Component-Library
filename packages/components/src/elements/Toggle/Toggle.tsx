import React, { forwardRef, useId } from 'react';
import './Toggle.css';

export interface ToggleProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Label text — required for accessibility */
  label: string;
  /** Optional description shown below the label */
  description?: string;
  /** Size */
  size?: 'sm' | 'md';
  /** Label position */
  labelPosition?: 'left' | 'right';
}

/**
 * nir-e-toggle — Accessible switch for binary on/off states.
 *
 * @a11y
 * - Native <input type="checkbox" role="switch">
 * - Label linked via htmlFor/id
 * - Space to toggle
 * - Focus ring 2px offset
 */
export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      label,
      description,
      size = 'md',
      labelPosition = 'right',
      disabled = false,
      className = '',
      id: externalId,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = externalId || generatedId;
    const descId = description ? inputId + '-desc' : undefined;

    return (
      <div
        className={[
          'nir-e-toggle',
          'nir-e-toggle--' + size,
          'nir-e-toggle--label-' + labelPosition,
          disabled ? 'nir-e-toggle--disabled' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <label className="nir-e-toggle__control" htmlFor={inputId}>
          {labelPosition === 'left' && (
            <span className="nir-e-toggle__text">
              <span className="nir-e-toggle__label">{label}</span>
              {description && (
                <span className="nir-e-toggle__description" id={descId}>
                  {description}
                </span>
              )}
            </span>
          )}

          <span className="nir-e-toggle__switch">
            <input
              ref={ref}
              type="checkbox"
              role="switch"
              id={inputId}
              className="nir-e-toggle__input"
              disabled={disabled}
              aria-describedby={descId}
              {...rest}
            />
            <span className="nir-e-toggle__track" aria-hidden="true">
              <span className="nir-e-toggle__thumb" />
            </span>
          </span>

          {labelPosition === 'right' && (
            <span className="nir-e-toggle__text">
              <span className="nir-e-toggle__label">{label}</span>
              {description && (
                <span className="nir-e-toggle__description" id={descId}>
                  {description}
                </span>
              )}
            </span>
          )}
        </label>
      </div>
    );
  }
);

Toggle.displayName = 'NirToggle';
