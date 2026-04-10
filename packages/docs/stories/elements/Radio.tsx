import React, { forwardRef, useId, createContext, useContext } from 'react';
import './Radio.css';

// ── RadioGroup context ──
interface RadioGroupContextType {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

const RadioGroupContext = createContext<RadioGroupContextType | null>(null);

// ── RadioGroup ──
export interface RadioGroupProps {
  /** Group name — links all radios */
  name: string;
  /** Group label — required for accessibility */
  label: string;
  /** Currently selected value */
  value?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Helper text */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Disable all radios */
  disabled?: boolean;
  /** Size for all radios */
  size?: 'sm' | 'md';
  /** Orientation */
  direction?: 'vertical' | 'horizontal';
  /** Radio children */
  children: React.ReactNode;
}

/**
 * nir-e-radio-group — Wraps Radio items with shared name, value, and a11y.
 *
 * @a11y
 * - role="radiogroup" with aria-labelledby
 * - Arrow keys navigate between options (roving tabindex)
 */
export function RadioGroup({
  name,
  label,
  value,
  onChange,
  helperText,
  error,
  disabled = false,
  size = 'md',
  direction = 'vertical',
  children,
}: RadioGroupProps) {
  const labelId = useId();
  const helperId = helperText ? labelId + '-helper' : undefined;
  const errorId = error ? labelId + '-error' : undefined;
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

  return (
    <RadioGroupContext.Provider value={{ name, value, onChange, disabled, size }}>
      <fieldset
        className={[
          'nir-e-radio-group',
          'nir-e-radio-group--' + direction,
          error ? 'nir-e-radio-group--error' : '',
        ].filter(Boolean).join(' ')}
        role="radiogroup"
        aria-labelledby={labelId}
        aria-describedby={describedBy}
      >
        <legend className="nir-e-radio-group__legend" id={labelId}>
          {label}
        </legend>

        <div className="nir-e-radio-group__options">
          {children}
        </div>

        {error && (
          <p className="nir-e-radio-group__error" id={errorId} role="alert">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="nir-e-radio-group__helper" id={helperId}>
            {helperText}
          </p>
        )}
      </fieldset>
    </RadioGroupContext.Provider>
  );
}

RadioGroup.displayName = 'NirRadioGroup';

// ── Radio ──
export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Label text — required */
  label: string;
  /** Value for this option */
  value: string;
  /** Size (overrides group) */
  size?: 'sm' | 'md';
}

/**
 * nir-e-radio — Single radio option. Use inside RadioGroup.
 *
 * @a11y
 * - Native <input type="radio">
 * - Label linked via htmlFor/id
 * - Arrow Up/Down to navigate group
 * - Space to select
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      label,
      value,
      size: sizeProp,
      disabled: disabledProp,
      className = '',
      id: externalId,
      ...rest
    },
    ref
  ) => {
    const group = useContext(RadioGroupContext);
    const generatedId = useId();
    const inputId = externalId || generatedId;
    const size = sizeProp || group?.size || 'md';
    const disabled = disabledProp || group?.disabled || false;
    const isChecked = group?.value === value;
    const name = group?.name || rest.name || '';

    const handleChange = () => {
      if (group?.onChange) group.onChange(value);
    };

    return (
      <div className={[
        'nir-e-radio',
        'nir-e-radio--' + size,
        disabled ? 'nir-e-radio--disabled' : '',
        className,
      ].filter(Boolean).join(' ')}>
        <div className="nir-e-radio__control">
          <input
            ref={ref}
            type="radio"
            id={inputId}
            name={name}
            value={value}
            checked={group ? isChecked : undefined}
            defaultChecked={!group ? rest.defaultChecked : undefined}
            disabled={disabled}
            onChange={group ? handleChange : rest.onChange}
            className="nir-e-radio__input"
            {...rest}
          />
          <svg className="nir-e-radio__circle" viewBox="0 0 20 20" aria-hidden="true">
            <circle className="nir-e-radio__outer" cx="10" cy="10" r="9" />
            <circle className="nir-e-radio__inner" cx="10" cy="10" r="5" />
          </svg>
          <label className="nir-e-radio__label" htmlFor={inputId}>
            {label}
          </label>
        </div>
      </div>
    );
  }
);

Radio.displayName = 'NirRadio';
