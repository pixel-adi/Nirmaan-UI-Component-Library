import * as react_jsx_runtime from 'react/jsx-runtime';
import React from 'react';

interface AutocompleteOption {
    value: string;
    label: string;
    description?: string;
}
interface AutocompleteProps {
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
declare function Autocomplete({ label, options, value, onChange, placeholder, helperText, error, size, fullWidth, disabled, minChars, maxResults, name, noResultsText, }: AutocompleteProps): react_jsx_runtime.JSX.Element;
declare namespace Autocomplete {
    var displayName: string;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
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
declare const Checkbox: React.ForwardRefExoticComponent<CheckboxProps & React.RefAttributes<HTMLInputElement>>;

interface DropdownOption {
    /** Unique value */
    value: string;
    /** Display label */
    label: string;
    /** Optional secondary text */
    description?: string;
    /** Disabled state */
    disabled?: boolean;
}
interface DropdownProps {
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
declare function Dropdown({ label, options, value, onChange, placeholder, helperText, error, size, fullWidth, disabled, name, }: DropdownProps): react_jsx_runtime.JSX.Element;
declare namespace Dropdown {
    var displayName: string;
}

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
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
declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;

interface RadioGroupProps {
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
declare function RadioGroup({ name, label, value, onChange, helperText, error, disabled, size, direction, children, }: RadioGroupProps): react_jsx_runtime.JSX.Element;
declare namespace RadioGroup {
    var displayName: string;
}
interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
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
declare const Radio: React.ForwardRefExoticComponent<RadioProps & React.RefAttributes<HTMLInputElement>>;

interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
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
declare const Toggle: React.ForwardRefExoticComponent<ToggleProps & React.RefAttributes<HTMLInputElement>>;

type NirTheme = 'light' | 'dark' | 'high-contrast';
type NirDensity = 'default' | 'compact' | 'spacious';
type NirBrand = 'nirman' | 'central-govt' | 'kerala' | 'tamilnadu' | 'up' | string;
interface NirmanContextType {
    theme: NirTheme;
    setTheme: (t: NirTheme) => void;
    toggleTheme: () => void;
    density: NirDensity;
    setDensity: (d: NirDensity) => void;
    brand: NirBrand;
    setBrand: (b: NirBrand) => void;
}
interface NirmanProviderProps {
    children: React.ReactNode;
    /** Initial appearance mode */
    defaultTheme?: NirTheme;
    /** Initial density */
    defaultDensity?: NirDensity;
    /** Initial brand identity */
    defaultBrand?: NirBrand;
    /** Root element to apply data attributes to. Defaults to documentElement */
    rootElement?: HTMLElement | null;
}
/**
 * NirmanProvider — Wraps your app with theme, density, and brand context.
 *
 * Sets `data-theme`, `data-density`, `data-brand` on the root element,
 * which CSS custom properties resolve against.
 *
 * @example
 * ```tsx
 * <NirmanProvider defaultTheme="light" defaultBrand="kerala">
 *   <App />
 * </NirmanProvider>
 * ```
 */
declare function NirmanProvider({ children, defaultTheme, defaultDensity, defaultBrand, rootElement, }: NirmanProviderProps): react_jsx_runtime.JSX.Element;
/**
 * useNirman — Access theme, density, and brand context.
 *
 * @example
 * ```tsx
 * const { theme, setTheme, brand } = useNirman();
 * ```
 */
declare function useNirman(): NirmanContextType;

export { Autocomplete, type AutocompleteOption, type AutocompleteProps, Button, type ButtonProps, Checkbox, type CheckboxProps, Dropdown, type DropdownOption, type DropdownProps, Input, type InputProps, type NirBrand, type NirDensity, type NirTheme, type NirmanContextType, NirmanProvider, type NirmanProviderProps, Radio, RadioGroup, type RadioGroupProps, type RadioProps, Toggle, type ToggleProps, useNirman };
