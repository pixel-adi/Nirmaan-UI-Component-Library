import { forwardRef, useId, useRef, useEffect, createContext, useContext, useState, useMemo, useCallback } from 'react';
import { jsxs, jsx } from 'react/jsx-runtime';

/* @nirman/components — निर्माण Design System */

function Autocomplete({
  label,
  options,
  value,
  onChange,
  placeholder = "Start typing...",
  helperText,
  error,
  variant = "outlined",
  size = "md",
  fullWidth = false,
  disabled = false,
  minChars = 1,
  maxResults = 10,
  name,
  noResultsText = "No matches found",
  clearable = true
}) {
  const id = useId();
  const listboxId = id + "-listbox";
  const labelId = id + "-label";
  const helperId = helperText ? id + "-helper" : void 0;
  const errorId = error ? id + "-error" : void 0;
  const describedBy = [errorId, helperId].filter(Boolean).join(" ") || void 0;
  const selectedOption = options.find((o) => o.value === value);
  const [inputValue, setInputValue] = useState(selectedOption?.label ?? "");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const listboxRef = useRef(null);
  const wrapperRef = useRef(null);
  useEffect(() => {
    const opt = options.find((o) => o.value === value);
    setInputValue(opt?.label ?? "");
  }, [value, options]);
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
    (option) => {
      setInputValue(option.label);
      onChange?.(option.value);
      close();
      requestAnimationFrame(() => inputRef.current?.focus());
    },
    [onChange, close]
  );
  const handleClear = useCallback(
    (e) => {
      e.preventDefault();
      setInputValue("");
      onChange?.(null);
      close();
      requestAnimationFrame(() => inputRef.current?.focus());
    },
    [onChange, close]
  );
  const handleInputChange = (e) => {
    const next = e.target.value;
    setInputValue(next);
    if (next.length >= minChars) {
      setOpen(true);
    } else {
      setOpen(false);
    }
    setActiveIndex(-1);
    if (next === "" && value !== void 0) {
      onChange?.(null);
    }
  };
  const handleKeyDown = (e) => {
    if (disabled) return;
    const total = filteredOptions.length;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open && inputValue.length >= minChars) setOpen(true);
        setActiveIndex((i) => total === 0 ? -1 : (i + 1) % total);
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!open) return;
        setActiveIndex((i) => total === 0 ? -1 : i <= 0 ? total - 1 : i - 1);
        break;
      case "Enter":
        if (open && activeIndex >= 0 && filteredOptions[activeIndex]) {
          e.preventDefault();
          handleSelect(filteredOptions[activeIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "Tab":
        close();
        break;
    }
  };
  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        close();
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open, close]);
  useEffect(() => {
    if (!listboxRef.current || activeIndex < 0) return;
    const item = listboxRef.current.querySelector(
      `[id="${id}-option-${activeIndex}"]`
    );
    item?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, id]);
  const showNoResults = open && inputValue.length >= minChars && filteredOptions.length === 0;
  const showClear = clearable && inputValue.length > 0 && !disabled;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: wrapperRef,
      className: [
        "nir-e-autocomplete",
        `nir-e-autocomplete--${variant}`,
        `nir-e-autocomplete--${size}`,
        fullWidth ? "nir-e-autocomplete--full" : "",
        error ? "nir-e-autocomplete--error" : "",
        disabled ? "nir-e-autocomplete--disabled" : "",
        open ? "nir-e-autocomplete--open" : ""
      ].filter(Boolean).join(" "),
      children: [
        /* @__PURE__ */ jsx("label", { className: "nir-e-autocomplete__label", id: labelId, htmlFor: id, children: label }),
        /* @__PURE__ */ jsxs("div", { className: "nir-e-autocomplete__wrapper", children: [
          /* @__PURE__ */ jsxs("svg", { className: "nir-e-autocomplete__icon", viewBox: "0 0 20 20", "aria-hidden": "true", children: [
            /* @__PURE__ */ jsx("circle", { cx: "8.5", cy: "8.5", r: "5.5", stroke: "currentColor", strokeWidth: "1.8", fill: "none" }),
            /* @__PURE__ */ jsx("path", { d: "M13 13l3.5 3.5", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round" })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              ref: inputRef,
              type: "text",
              id,
              className: "nir-e-autocomplete__input",
              role: "combobox",
              "aria-autocomplete": "list",
              "aria-expanded": open,
              "aria-controls": listboxId,
              "aria-activedescendant": activeIndex >= 0 ? `${id}-option-${activeIndex}` : void 0,
              "aria-describedby": describedBy,
              "aria-invalid": error ? true : void 0,
              "aria-label": label,
              value: inputValue,
              onChange: handleInputChange,
              onKeyDown: handleKeyDown,
              onFocus: () => {
                if (inputValue.length >= minChars && filteredOptions.length > 0) setOpen(true);
              },
              placeholder,
              disabled,
              autoComplete: "off",
              spellCheck: false
            }
          ),
          showClear && /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "nir-e-autocomplete__clear",
              "aria-label": "Clear",
              tabIndex: -1,
              onMouseDown: handleClear,
              children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx(
                "path",
                {
                  d: "M4 4l8 8M12 4l-8 8",
                  stroke: "currentColor",
                  strokeWidth: "1.8",
                  strokeLinecap: "round"
                }
              ) })
            }
          ),
          open && (filteredOptions.length > 0 || showNoResults) && /* @__PURE__ */ jsxs(
            "ul",
            {
              ref: listboxRef,
              id: listboxId,
              className: "nir-e-autocomplete__menu",
              role: "listbox",
              "aria-labelledby": labelId,
              children: [
                /* @__PURE__ */ jsxs("li", { role: "presentation", className: "nir-e-autocomplete__sr-count", "aria-live": "polite", children: [
                  filteredOptions.length,
                  " result",
                  filteredOptions.length !== 1 ? "s" : ""
                ] }),
                filteredOptions.map((option, index) => {
                  const isActive = index === activeIndex;
                  const isSelected = option.value === value;
                  return /* @__PURE__ */ jsxs(
                    "li",
                    {
                      id: `${id}-option-${index}`,
                      className: [
                        "nir-e-autocomplete__option",
                        isSelected ? "nir-e-autocomplete__option--selected" : "",
                        isActive ? "nir-e-autocomplete__option--active" : ""
                      ].filter(Boolean).join(" "),
                      role: "option",
                      "aria-selected": isSelected,
                      onMouseDown: (e) => {
                        e.preventDefault();
                        handleSelect(option);
                      },
                      onMouseEnter: () => setActiveIndex(index),
                      children: [
                        /* @__PURE__ */ jsx(HighlightedLabel, { text: option.label, query: inputValue }),
                        option.description && /* @__PURE__ */ jsx("span", { className: "nir-e-autocomplete__option-description", children: option.description })
                      ]
                    },
                    option.value
                  );
                }),
                showNoResults && /* @__PURE__ */ jsx(
                  "li",
                  {
                    className: "nir-e-autocomplete__no-results",
                    role: "option",
                    "aria-selected": false,
                    children: noResultsText
                  }
                )
              ]
            }
          ),
          name && /* @__PURE__ */ jsx("input", { type: "hidden", name, value: value ?? "" })
        ] }),
        error && /* @__PURE__ */ jsx("p", { className: "nir-e-autocomplete__error", id: errorId, role: "alert", children: error }),
        helperText && !error && /* @__PURE__ */ jsx("p", { className: "nir-e-autocomplete__helper", id: helperId, children: helperText })
      ]
    }
  );
}
Autocomplete.displayName = "NirAutocomplete";
function HighlightedLabel({ text, query }) {
  if (!query) return /* @__PURE__ */ jsx("span", { className: "nir-e-autocomplete__option-label", children: text });
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const idx = lowerText.indexOf(lowerQuery);
  if (idx === -1) return /* @__PURE__ */ jsx("span", { className: "nir-e-autocomplete__option-label", children: text });
  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + query.length);
  const after = text.slice(idx + query.length);
  return /* @__PURE__ */ jsxs("span", { className: "nir-e-autocomplete__option-label", children: [
    before,
    /* @__PURE__ */ jsx("mark", { className: "nir-e-autocomplete__match", children: match }),
    after
  ] });
}
var Button = forwardRef(
  ({
    variant = "primary",
    size = "md",
    fullWidth = false,
    loading = false,
    disabled = false,
    iconLeft,
    iconRight,
    children,
    className = "",
    ...rest
  }, ref) => {
    const isDisabled = disabled || loading;
    const classes = [
      "nir-e-button",
      "nir-e-button--" + variant,
      "nir-e-button--" + size,
      fullWidth ? "nir-e-button--full" : "",
      loading ? "nir-e-button--loading" : "",
      isDisabled ? "nir-e-button--disabled" : "",
      className
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ jsxs(
      "button",
      {
        ref,
        className: classes,
        disabled: isDisabled,
        "aria-disabled": isDisabled || void 0,
        "aria-busy": loading || void 0,
        ...rest,
        children: [
          loading && /* @__PURE__ */ jsx("span", { className: "nir-e-button__spinner", "aria-hidden": "true", children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 20 20", fill: "none", className: "nir-e-button__spinner-svg", children: /* @__PURE__ */ jsx(
            "circle",
            {
              cx: "10",
              cy: "10",
              r: "8",
              stroke: "currentColor",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeDasharray: "50.26",
              strokeDashoffset: "25.13"
            }
          ) }) }),
          !loading && iconLeft && /* @__PURE__ */ jsx("span", { className: "nir-e-button__icon", "aria-hidden": "true", children: iconLeft }),
          /* @__PURE__ */ jsx("span", { className: "nir-e-button__label", children }),
          !loading && iconRight && /* @__PURE__ */ jsx("span", { className: "nir-e-button__icon", "aria-hidden": "true", children: iconRight }),
          loading && /* @__PURE__ */ jsx("span", { className: "nir-sr-only", children: "Loading, please wait" })
        ]
      }
    );
  }
);
Button.displayName = "NirButton";
var Checkbox = forwardRef(
  ({
    label,
    helperText,
    error,
    indeterminate = false,
    size = "md",
    disabled = false,
    className = "",
    id: externalId,
    ...rest
  }, forwardedRef) => {
    const generatedId = useId();
    const inputId = externalId || generatedId;
    const helperId = helperText ? inputId + "-helper" : void 0;
    const errorId = error ? inputId + "-error" : void 0;
    const describedBy = [errorId, helperId].filter(Boolean).join(" ") || void 0;
    const internalRef = useRef(null);
    useEffect(() => {
      const el = internalRef.current;
      if (el) el.indeterminate = indeterminate;
    }, [indeterminate]);
    const setRef = (node) => {
      internalRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    };
    const wrapperClasses = [
      "nir-e-checkbox",
      "nir-e-checkbox--" + size,
      error ? "nir-e-checkbox--error" : "",
      disabled ? "nir-e-checkbox--disabled" : "",
      className
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ jsxs("div", { className: wrapperClasses, children: [
      /* @__PURE__ */ jsxs("div", { className: "nir-e-checkbox__control", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            ref: setRef,
            type: "checkbox",
            id: inputId,
            className: "nir-e-checkbox__input",
            disabled,
            "aria-invalid": error ? true : void 0,
            "aria-describedby": describedBy,
            ...rest
          }
        ),
        /* @__PURE__ */ jsxs("svg", { className: "nir-e-checkbox__box", viewBox: "0 0 20 20", "aria-hidden": "true", children: [
          /* @__PURE__ */ jsx("rect", { className: "nir-e-checkbox__bg", x: "1", y: "1", width: "18", height: "18", rx: "3" }),
          /* @__PURE__ */ jsx("path", { className: "nir-e-checkbox__check", d: "M5 10l3 3 7-7", fill: "none", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }),
          /* @__PURE__ */ jsx("line", { className: "nir-e-checkbox__dash", x1: "5", y1: "10", x2: "15", y2: "10", strokeWidth: "2", strokeLinecap: "round" })
        ] }),
        /* @__PURE__ */ jsx("label", { className: "nir-e-checkbox__label", htmlFor: inputId, children: label })
      ] }),
      error && /* @__PURE__ */ jsx("p", { className: "nir-e-checkbox__error", id: errorId, role: "alert", children: error }),
      helperText && !error && /* @__PURE__ */ jsx("p", { className: "nir-e-checkbox__helper", id: helperId, children: helperText })
    ] });
  }
);
Checkbox.displayName = "NirCheckbox";
function Dropdown({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  helperText,
  error,
  size = "md",
  fullWidth = false,
  disabled = false,
  name
}) {
  const id = useId();
  const listboxId = id + "-listbox";
  const labelId = id + "-label";
  const helperId = helperText ? id + "-helper" : void 0;
  const errorId = error ? id + "-error" : void 0;
  const describedBy = [errorId, helperId].filter(Boolean).join(" ") || void 0;
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const triggerRef = useRef(null);
  const listboxRef = useRef(null);
  const selectedOption = options.find((o) => o.value === value);
  options.filter((o) => !o.disabled);
  const close = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, []);
  const handleSelect = (option) => {
    if (option.disabled) return;
    onChange?.(option.value);
    close();
    triggerRef.current?.focus();
  };
  const handleKeyDown = (e) => {
    if (disabled) return;
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        setOpen(true);
        const currentIdx = options.findIndex((o) => o.value === value);
        setActiveIndex(currentIdx >= 0 ? currentIdx : 0);
      }
      return;
    }
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        close();
        triggerRef.current?.focus();
        break;
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => {
          let next = i + 1;
          while (next < options.length && options[next].disabled) next++;
          return next >= options.length ? options.findIndex((o) => !o.disabled) : next;
        });
        break;
      case "ArrowUp":
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
      case "Home":
        e.preventDefault();
        setActiveIndex(options.findIndex((o) => !o.disabled));
        break;
      case "End":
        e.preventDefault();
        for (let j = options.length - 1; j >= 0; j--) {
          if (!options[j].disabled) {
            setActiveIndex(j);
            break;
          }
        }
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (activeIndex >= 0 && options[activeIndex]) {
          handleSelect(options[activeIndex]);
        }
        break;
      case "Tab":
        close();
        break;
    }
  };
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      const target = e.target;
      if (triggerRef.current && !triggerRef.current.contains(target) && listboxRef.current && !listboxRef.current.contains(target)) {
        close();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, close]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: [
        "nir-e-dropdown",
        "nir-e-dropdown--" + size,
        fullWidth ? "nir-e-dropdown--full" : "",
        error ? "nir-e-dropdown--error" : "",
        disabled ? "nir-e-dropdown--disabled" : "",
        open ? "nir-e-dropdown--open" : ""
      ].filter(Boolean).join(" "),
      children: [
        /* @__PURE__ */ jsx("label", { className: "nir-e-dropdown__label", id: labelId, htmlFor: id, children: label }),
        /* @__PURE__ */ jsxs("div", { className: "nir-e-dropdown__wrapper", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              ref: triggerRef,
              type: "button",
              id,
              className: "nir-e-dropdown__trigger",
              role: "combobox",
              "aria-haspopup": "listbox",
              "aria-expanded": open,
              "aria-controls": listboxId,
              "aria-labelledby": labelId,
              "aria-describedby": describedBy,
              "aria-invalid": error ? true : void 0,
              "aria-activedescendant": activeIndex >= 0 ? id + "-option-" + activeIndex : void 0,
              disabled,
              onClick: () => !disabled && setOpen((o) => !o),
              onKeyDown: handleKeyDown,
              children: [
                /* @__PURE__ */ jsx("span", { className: "nir-e-dropdown__value", children: selectedOption ? selectedOption.label : /* @__PURE__ */ jsx("span", { className: "nir-e-dropdown__placeholder", children: placeholder }) }),
                /* @__PURE__ */ jsx("svg", { className: "nir-e-dropdown__chevron", viewBox: "0 0 20 20", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M5 8l5 5 5-5", stroke: "currentColor", strokeWidth: "2", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }) })
              ]
            }
          ),
          open && /* @__PURE__ */ jsx(
            "ul",
            {
              ref: listboxRef,
              id: listboxId,
              className: "nir-e-dropdown__menu",
              role: "listbox",
              "aria-labelledby": labelId,
              tabIndex: -1,
              children: options.map((option, index) => {
                const isSelected = option.value === value;
                const isActive = index === activeIndex;
                return /* @__PURE__ */ jsxs(
                  "li",
                  {
                    id: id + "-option-" + index,
                    className: [
                      "nir-e-dropdown__option",
                      isSelected ? "nir-e-dropdown__option--selected" : "",
                      isActive ? "nir-e-dropdown__option--active" : "",
                      option.disabled ? "nir-e-dropdown__option--disabled" : ""
                    ].filter(Boolean).join(" "),
                    role: "option",
                    "aria-selected": isSelected,
                    "aria-disabled": option.disabled || void 0,
                    onClick: () => handleSelect(option),
                    onMouseEnter: () => !option.disabled && setActiveIndex(index),
                    children: [
                      /* @__PURE__ */ jsx("span", { className: "nir-e-dropdown__option-label", children: option.label }),
                      option.description && /* @__PURE__ */ jsx("span", { className: "nir-e-dropdown__option-description", children: option.description }),
                      isSelected && /* @__PURE__ */ jsx("svg", { className: "nir-e-dropdown__check", viewBox: "0 0 20 20", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M5 10l3 3 7-7", stroke: "currentColor", strokeWidth: "2", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }) })
                    ]
                  },
                  option.value
                );
              })
            }
          ),
          name && /* @__PURE__ */ jsx("input", { type: "hidden", name, value: value || "" })
        ] }),
        error && /* @__PURE__ */ jsx("p", { className: "nir-e-dropdown__error", id: errorId, role: "alert", children: error }),
        helperText && !error && /* @__PURE__ */ jsx("p", { className: "nir-e-dropdown__helper", id: helperId, children: helperText })
      ]
    }
  );
}
Dropdown.displayName = "NirDropdown";
var Input = forwardRef(
  ({
    label,
    helperText,
    error,
    size = "md",
    fullWidth = false,
    disabled = false,
    iconLeft,
    iconRight,
    className = "",
    id: externalId,
    ...rest
  }, ref) => {
    const generatedId = useId();
    const inputId = externalId || generatedId;
    const helperId = helperText ? inputId + "-helper" : void 0;
    const errorId = error ? inputId + "-error" : void 0;
    const describedBy = [errorId, helperId].filter(Boolean).join(" ") || void 0;
    const wrapperClasses = [
      "nir-e-input",
      "nir-e-input--" + size,
      fullWidth ? "nir-e-input--full" : "",
      error ? "nir-e-input--error" : "",
      disabled ? "nir-e-input--disabled" : "",
      className
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ jsxs("div", { className: wrapperClasses, children: [
      /* @__PURE__ */ jsx("label", { className: "nir-e-input__label", htmlFor: inputId, children: label }),
      /* @__PURE__ */ jsxs("div", { className: "nir-e-input__field-wrapper", children: [
        iconLeft && /* @__PURE__ */ jsx("span", { className: "nir-e-input__icon nir-e-input__icon--left", "aria-hidden": "true", children: iconLeft }),
        /* @__PURE__ */ jsx(
          "input",
          {
            ref,
            id: inputId,
            className: "nir-e-input__field",
            disabled,
            "aria-invalid": error ? true : void 0,
            "aria-describedby": describedBy,
            ...rest
          }
        ),
        iconRight && /* @__PURE__ */ jsx("span", { className: "nir-e-input__icon nir-e-input__icon--right", "aria-hidden": "true", children: iconRight })
      ] }),
      error && /* @__PURE__ */ jsx("p", { className: "nir-e-input__error", id: errorId, role: "alert", children: error }),
      helperText && !error && /* @__PURE__ */ jsx("p", { className: "nir-e-input__helper", id: helperId, children: helperText })
    ] });
  }
);
Input.displayName = "NirInput";
var RadioGroupContext = createContext(null);
function RadioGroup({
  name,
  label,
  value,
  onChange,
  helperText,
  error,
  disabled = false,
  size = "md",
  direction = "vertical",
  children
}) {
  const labelId = useId();
  const helperId = helperText ? labelId + "-helper" : void 0;
  const errorId = error ? labelId + "-error" : void 0;
  const describedBy = [errorId, helperId].filter(Boolean).join(" ") || void 0;
  return /* @__PURE__ */ jsx(RadioGroupContext.Provider, { value: { name, value, onChange, disabled, size }, children: /* @__PURE__ */ jsxs(
    "fieldset",
    {
      className: [
        "nir-e-radio-group",
        "nir-e-radio-group--" + direction,
        error ? "nir-e-radio-group--error" : ""
      ].filter(Boolean).join(" "),
      role: "radiogroup",
      "aria-labelledby": labelId,
      "aria-describedby": describedBy,
      children: [
        /* @__PURE__ */ jsx("legend", { className: "nir-e-radio-group__legend", id: labelId, children: label }),
        /* @__PURE__ */ jsx("div", { className: "nir-e-radio-group__options", children }),
        error && /* @__PURE__ */ jsx("p", { className: "nir-e-radio-group__error", id: errorId, role: "alert", children: error }),
        helperText && !error && /* @__PURE__ */ jsx("p", { className: "nir-e-radio-group__helper", id: helperId, children: helperText })
      ]
    }
  ) });
}
RadioGroup.displayName = "NirRadioGroup";
var Radio = forwardRef(
  ({
    label,
    value,
    size: sizeProp,
    disabled: disabledProp,
    className = "",
    id: externalId,
    ...rest
  }, ref) => {
    const group = useContext(RadioGroupContext);
    const generatedId = useId();
    const inputId = externalId || generatedId;
    const size = sizeProp || group?.size || "md";
    const disabled = disabledProp || group?.disabled || false;
    const isChecked = group?.value === value;
    const name = group?.name || rest.name || "";
    const handleChange = () => {
      if (group?.onChange) group.onChange(value);
    };
    return /* @__PURE__ */ jsx("div", { className: [
      "nir-e-radio",
      "nir-e-radio--" + size,
      disabled ? "nir-e-radio--disabled" : "",
      className
    ].filter(Boolean).join(" "), children: /* @__PURE__ */ jsxs("div", { className: "nir-e-radio__control", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          ref,
          type: "radio",
          id: inputId,
          name,
          value,
          checked: group ? isChecked : void 0,
          defaultChecked: !group ? rest.defaultChecked : void 0,
          disabled,
          onChange: group ? handleChange : rest.onChange,
          className: "nir-e-radio__input",
          ...rest
        }
      ),
      /* @__PURE__ */ jsxs("svg", { className: "nir-e-radio__circle", viewBox: "0 0 20 20", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("circle", { className: "nir-e-radio__outer", cx: "10", cy: "10", r: "9" }),
        /* @__PURE__ */ jsx("circle", { className: "nir-e-radio__inner", cx: "10", cy: "10", r: "5" })
      ] }),
      /* @__PURE__ */ jsx("label", { className: "nir-e-radio__label", htmlFor: inputId, children: label })
    ] }) });
  }
);
Radio.displayName = "NirRadio";
var Toggle = forwardRef(
  ({
    label,
    description,
    size = "md",
    labelPosition = "right",
    disabled = false,
    className = "",
    id: externalId,
    ...rest
  }, ref) => {
    const generatedId = useId();
    const inputId = externalId || generatedId;
    const descId = description ? inputId + "-desc" : void 0;
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: [
          "nir-e-toggle",
          "nir-e-toggle--" + size,
          "nir-e-toggle--label-" + labelPosition,
          disabled ? "nir-e-toggle--disabled" : "",
          className
        ].filter(Boolean).join(" "),
        children: /* @__PURE__ */ jsxs("label", { className: "nir-e-toggle__control", htmlFor: inputId, children: [
          labelPosition === "left" && /* @__PURE__ */ jsxs("span", { className: "nir-e-toggle__text", children: [
            /* @__PURE__ */ jsx("span", { className: "nir-e-toggle__label", children: label }),
            description && /* @__PURE__ */ jsx("span", { className: "nir-e-toggle__description", id: descId, children: description })
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "nir-e-toggle__switch", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                ref,
                type: "checkbox",
                role: "switch",
                id: inputId,
                className: "nir-e-toggle__input",
                disabled,
                "aria-describedby": descId,
                ...rest
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "nir-e-toggle__track", "aria-hidden": "true", children: /* @__PURE__ */ jsx("span", { className: "nir-e-toggle__thumb" }) })
          ] }),
          labelPosition === "right" && /* @__PURE__ */ jsxs("span", { className: "nir-e-toggle__text", children: [
            /* @__PURE__ */ jsx("span", { className: "nir-e-toggle__label", children: label }),
            description && /* @__PURE__ */ jsx("span", { className: "nir-e-toggle__description", id: descId, children: description })
          ] })
        ] })
      }
    );
  }
);
Toggle.displayName = "NirToggle";
var NirmanContext = createContext(null);
function NirmanProvider({
  children,
  defaultTheme = "light",
  defaultDensity = "default",
  defaultBrand = "nirman",
  rootElement
}) {
  const [theme, setTheme] = useState(defaultTheme);
  const [density, setDensity] = useState(defaultDensity);
  const [brand, setBrand] = useState(defaultBrand);
  const toggleTheme = useCallback(() => {
    setTheme((prev) => prev === "light" ? "dark" : "light");
  }, []);
  useEffect(() => {
    const root = rootElement || document.documentElement;
    root.setAttribute("data-theme", theme);
    root.setAttribute("data-density", density);
    root.setAttribute("data-brand", brand);
    return () => {
      root.removeAttribute("data-theme");
      root.removeAttribute("data-density");
      root.removeAttribute("data-brand");
    };
  }, [theme, density, brand, rootElement]);
  useEffect(() => {
    if (defaultTheme) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => setTheme(e.matches ? "dark" : "light");
    mq.addEventListener("change", handler);
    if (mq.matches) setTheme("dark");
    return () => mq.removeEventListener("change", handler);
  }, [defaultTheme]);
  return /* @__PURE__ */ jsx(
    NirmanContext.Provider,
    {
      value: { theme, setTheme, toggleTheme, density, setDensity, brand, setBrand },
      children
    }
  );
}
function useNirman() {
  const ctx = useContext(NirmanContext);
  if (!ctx) {
    throw new Error(
      "useNirman() must be used within a <NirmanProvider>. Wrap your app root with <NirmanProvider> to use Nirman theme context."
    );
  }
  return ctx;
}
function LoginTemplate({
  logo,
  title = "Welcome back",
  subtitle = "Please enter your details to sign in.",
  onLogin,
  onForgotPassword,
  onSignUp,
  isLoading = false
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin?.(email, password, remember);
  };
  return /* @__PURE__ */ jsx("div", { className: "nir-t-login", children: /* @__PURE__ */ jsxs("div", { className: "nir-t-login__container", children: [
    /* @__PURE__ */ jsxs("div", { className: "nir-t-login__header", children: [
      logo && /* @__PURE__ */ jsx("div", { className: "nir-t-login__logo", children: logo }),
      /* @__PURE__ */ jsx("h1", { className: "nir-t-login__title", children: title }),
      /* @__PURE__ */ jsx("p", { className: "nir-t-login__subtitle", children: subtitle })
    ] }),
    /* @__PURE__ */ jsxs("form", { className: "nir-t-login__form", onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsxs("div", { className: "nir-t-login__fields", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "email",
            label: "Email",
            placeholder: "Enter your email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            required: true,
            fullWidth: true
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "password",
            label: "Password",
            placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            required: true,
            fullWidth: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "nir-t-login__actions", children: [
        /* @__PURE__ */ jsx(
          Checkbox,
          {
            label: "Remember me",
            checked: remember,
            onChange: (e) => setRemember(e.target.checked)
          }
        ),
        onForgotPassword && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "nir-t-login__link",
            onClick: onForgotPassword,
            children: "Forgot password?"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "submit",
          variant: "primary",
          size: "lg",
          fullWidth: true,
          disabled: isLoading || !email || !password,
          children: isLoading ? "Signing in..." : "Sign in"
        }
      )
    ] }),
    onSignUp && /* @__PURE__ */ jsxs("div", { className: "nir-t-login__footer", children: [
      /* @__PURE__ */ jsx("span", { className: "nir-t-login__footer-text", children: "Don't have an account?" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "nir-t-login__link nir-t-login__link--strong",
          onClick: onSignUp,
          children: "Sign up"
        }
      )
    ] })
  ] }) });
}
var DEFAULT_TIMEZONES = [
  { label: "Pacific Time (US & Canada)", value: "PST" },
  { label: "Mountain Time (US & Canada)", value: "MST" },
  { label: "Central Time (US & Canada)", value: "CST" },
  { label: "Eastern Time (US & Canada)", value: "EST" },
  { label: "Greenwich Mean Time (London)", value: "GMT" },
  { label: "Central European Time (Paris)", value: "CET" },
  { label: "Indian Standard Time (New Delhi)", value: "IST" },
  { label: "Japan Standard Time (Tokyo)", value: "JST" },
  { label: "Australian Eastern Time (Sydney)", value: "AET" }
];
function SettingsTemplate({
  title = "Account Settings",
  subtitle = "Manage your profile and preferences.",
  initialData = {
    firstName: "",
    lastName: "",
    email: "",
    timezone: "",
    marketingEmails: false,
    securityAlerts: true
  },
  timezoneOptions = DEFAULT_TIMEZONES,
  onSave,
  isSaving = false
}) {
  const [formData, setFormData] = useState(initialData);
  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };
  const handleToggleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.checked }));
  };
  const handleTimezoneChange = (value) => {
    setFormData((prev) => ({ ...prev, timezone: value || "" }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave?.(formData);
  };
  return /* @__PURE__ */ jsx("div", { className: "nir-t-settings", children: /* @__PURE__ */ jsxs("div", { className: "nir-t-settings__container", children: [
    /* @__PURE__ */ jsx("aside", { className: "nir-t-settings__sidebar", children: /* @__PURE__ */ jsxs("nav", { className: "nir-t-settings__nav", children: [
      /* @__PURE__ */ jsx("a", { href: "#profile", className: "nir-t-settings__nav-item nir-t-settings__nav-item--active", children: "Profile" }),
      /* @__PURE__ */ jsx("a", { href: "#notifications", className: "nir-t-settings__nav-item", children: "Notifications" }),
      /* @__PURE__ */ jsx("a", { href: "#security", className: "nir-t-settings__nav-item", children: "Security" }),
      /* @__PURE__ */ jsx("a", { href: "#billing", className: "nir-t-settings__nav-item", children: "Billing" })
    ] }) }),
    /* @__PURE__ */ jsxs("main", { className: "nir-t-settings__main", children: [
      /* @__PURE__ */ jsxs("div", { className: "nir-t-settings__header", children: [
        /* @__PURE__ */ jsx("h1", { className: "nir-t-settings__title", children: title }),
        /* @__PURE__ */ jsx("p", { className: "nir-t-settings__subtitle", children: subtitle })
      ] }),
      /* @__PURE__ */ jsxs("form", { className: "nir-t-settings__form", onSubmit: handleSubmit, children: [
        /* @__PURE__ */ jsxs("section", { className: "nir-t-settings__section", children: [
          /* @__PURE__ */ jsx("h2", { className: "nir-t-settings__section-title", children: "Personal Information" }),
          /* @__PURE__ */ jsxs("div", { className: "nir-t-settings__grid", children: [
            /* @__PURE__ */ jsx(
              Input,
              {
                label: "First Name",
                placeholder: "e.g. Jane",
                value: formData.firstName,
                onChange: handleInputChange("firstName"),
                fullWidth: true
              }
            ),
            /* @__PURE__ */ jsx(
              Input,
              {
                label: "Last Name",
                placeholder: "e.g. Doe",
                value: formData.lastName,
                onChange: handleInputChange("lastName"),
                fullWidth: true
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "nir-t-settings__grid-full", children: /* @__PURE__ */ jsx(
              Input,
              {
                type: "email",
                label: "Email Address",
                placeholder: "jane@example.com",
                value: formData.email,
                onChange: handleInputChange("email"),
                fullWidth: true
              }
            ) }),
            /* @__PURE__ */ jsx("div", { className: "nir-t-settings__grid-full", children: /* @__PURE__ */ jsx(
              Autocomplete,
              {
                label: "Timezone",
                placeholder: "Search timezones...",
                options: timezoneOptions,
                value: formData.timezone,
                onChange: handleTimezoneChange,
                fullWidth: true
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsx("hr", { className: "nir-t-settings__divider" }),
        /* @__PURE__ */ jsxs("section", { className: "nir-t-settings__section", children: [
          /* @__PURE__ */ jsx("h2", { className: "nir-t-settings__section-title", children: "Email Notifications" }),
          /* @__PURE__ */ jsxs("div", { className: "nir-t-settings__toggles", children: [
            /* @__PURE__ */ jsxs("div", { className: "nir-t-settings__toggle-row", children: [
              /* @__PURE__ */ jsxs("div", { className: "nir-t-settings__toggle-info", children: [
                /* @__PURE__ */ jsx("span", { className: "nir-t-settings__toggle-label", children: "Marketing emails" }),
                /* @__PURE__ */ jsx("span", { className: "nir-t-settings__toggle-desc", children: "Receive updates about new features and promotions." })
              ] }),
              /* @__PURE__ */ jsx(
                Toggle,
                {
                  label: "Toggle Marketing Emails",
                  checked: formData.marketingEmails,
                  onChange: handleToggleChange("marketingEmails")
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "nir-t-settings__toggle-row", children: [
              /* @__PURE__ */ jsxs("div", { className: "nir-t-settings__toggle-info", children: [
                /* @__PURE__ */ jsx("span", { className: "nir-t-settings__toggle-label", children: "Security alerts" }),
                /* @__PURE__ */ jsx("span", { className: "nir-t-settings__toggle-desc", children: "Get notified when there's suspicious activity on your account." })
              ] }),
              /* @__PURE__ */ jsx(
                Toggle,
                {
                  label: "Toggle Security Alerts",
                  checked: formData.securityAlerts,
                  onChange: handleToggleChange("securityAlerts")
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("hr", { className: "nir-t-settings__divider" }),
        /* @__PURE__ */ jsxs("div", { className: "nir-t-settings__actions", children: [
          /* @__PURE__ */ jsx(Button, { type: "button", variant: "secondary", children: "Cancel" }),
          /* @__PURE__ */ jsx(Button, { type: "submit", variant: "primary", disabled: isSaving, children: isSaving ? "Saving changes..." : "Save changes" })
        ] })
      ] })
    ] })
  ] }) });
}
function EmptyStateTemplate({
  graphic,
  title,
  description,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction
}) {
  return /* @__PURE__ */ jsx("div", { className: "nir-t-empty-state", children: /* @__PURE__ */ jsxs("div", { className: "nir-t-empty-state__content", children: [
    graphic && /* @__PURE__ */ jsx("div", { className: "nir-t-empty-state__graphic", children: graphic }),
    /* @__PURE__ */ jsx("h2", { className: "nir-t-empty-state__title", children: title }),
    description && /* @__PURE__ */ jsx("p", { className: "nir-t-empty-state__description", children: description }),
    /* @__PURE__ */ jsxs("div", { className: "nir-t-empty-state__actions", children: [
      actionText && /* @__PURE__ */ jsx(
        Button,
        {
          variant: "primary",
          size: "lg",
          onClick: onAction,
          children: actionText
        }
      ),
      secondaryActionText && /* @__PURE__ */ jsx(
        Button,
        {
          variant: "secondary",
          size: "lg",
          onClick: onSecondaryAction,
          children: secondaryActionText
        }
      )
    ] })
  ] }) });
}
var AshokaEmblem = () => /* @__PURE__ */ jsxs("svg", { className: "nir-t-pfrda__emblem", viewBox: "0 0 100 150", fill: "currentColor", children: [
  /* @__PURE__ */ jsx("path", { d: "M50 10 C53 10 55 12 55 15 C55 18 53 20 50 20 C47 20 45 18 45 15 C45 12 47 10 50 10 Z" }),
  /* @__PURE__ */ jsx("path", { d: "M40 22 L60 22 L58 35 L42 35 Z" }),
  /* @__PURE__ */ jsx("path", { d: "M38 37 C38 37 42 45 50 45 C58 45 62 37 62 37 L65 75 L35 75 Z" }),
  /* @__PURE__ */ jsx("rect", { x: "42", y: "77", width: "16", height: "50", rx: "2" }),
  /* @__PURE__ */ jsx("path", { d: "M30 128 L70 128 L68 135 L32 135 Z" }),
  /* @__PURE__ */ jsx("circle", { cx: "50", cy: "102", r: "6", stroke: "currentColor", strokeWidth: "1", fill: "none" }),
  /* @__PURE__ */ jsx("line", { x1: "50", y1: "96", x2: "50", y2: "108", stroke: "currentColor", strokeWidth: "1" }),
  /* @__PURE__ */ jsx("line", { x1: "44", y1: "102", x2: "56", y2: "102", stroke: "currentColor", strokeWidth: "1" })
] });
function PfrdaPortalInner({ title }) {
  const { theme, setTheme, density, setDensity } = useNirman();
  const [textSize, setTextSize] = useState("normal");
  const [lang, setLang] = useState("en");
  const [age, setAge] = useState(30);
  const [contribution, setContribution] = useState(5e3);
  const [expectedReturn, setExpectedReturn] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const circulars = useMemo(() => [
    {
      id: "1",
      day: "12",
      month: "Jul",
      category: "nps",
      tag: "NPS",
      title: "Revision of processing fees for online transactions via Netbanking and UPI payment gateways.",
      ref: "PFRDA/2026/07/NPS-04"
    },
    {
      id: "2",
      day: "08",
      month: "Jul",
      category: "apy",
      tag: "APY",
      title: "APY subscriber onboarding guidelines and performance metrics for Regional Rural Banks (RRBs).",
      ref: "PFRDA/2026/07/APY-02"
    },
    {
      id: "3",
      day: "05",
      month: "Jul",
      category: "regs",
      tag: "Regulations",
      title: "Pension Fund Regulatory and Development Authority (Point of Presence) Amendment Regulations, 2026.",
      ref: "PFRDA/2026/REG/03"
    },
    {
      id: "4",
      day: "28",
      month: "Jun",
      category: "nps",
      tag: "NPS",
      title: "Standard Operating Procedure (SOP) for processing partial withdrawals under National Pension System.",
      ref: "PFRDA/2026/06/NPS-18"
    },
    {
      id: "5",
      day: "20",
      month: "regs",
      tag: "Regulations",
      title: "Guidelines on cybersecurity framework and cyber resilience measures for Pension Fund Managers.",
      ref: "PFRDA/2026/REG/02"
    }
  ], []);
  const filteredCirculars = useMemo(() => {
    return circulars.filter((item) => {
      const matchesTab = activeTab === "all" || item.category === activeTab;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.ref.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [circulars, activeTab, searchQuery]);
  const calcResults = useMemo(() => {
    const yearsToRetire = Math.max(0, 60 - age);
    const months = yearsToRetire * 12;
    const monthlyRate = expectedReturn / 100 / 12;
    let accumulatedCorpus = 0;
    if (months > 0 && monthlyRate > 0) {
      accumulatedCorpus = contribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    } else if (months > 0) {
      accumulatedCorpus = contribution * months;
    }
    const annuityCorpus = accumulatedCorpus * 0.4;
    const lumpSum = accumulatedCorpus * 0.6;
    const estimatedPension = annuityCorpus * 0.06 / 12;
    const formatCurrency = (val) => {
      if (val >= 1e7) {
        return `\u20B9${(val / 1e7).toFixed(2)} Cr`;
      }
      if (val >= 1e5) {
        return `\u20B9${(val / 1e5).toFixed(2)} Lakh`;
      }
      return `\u20B9${Math.round(val).toLocaleString("en-IN")}`;
    };
    return {
      corpus: formatCurrency(accumulatedCorpus),
      pension: formatCurrency(estimatedPension),
      lumpsum: formatCurrency(lumpSum),
      rawCorpus: accumulatedCorpus
    };
  }, [age, contribution, expectedReturn]);
  const textScaleClass = textSize === "large" ? "nir-t-pfrda--text-lg" : textSize === "largest" ? "nir-t-pfrda--text-xl" : "";
  return /* @__PURE__ */ jsxs("div", { className: `nir-t-pfrda ${textScaleClass}`, lang, children: [
    /* @__PURE__ */ jsx("div", { className: "nir-t-pfrda__top-bar", children: /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__top-bar-inner", children: [
      /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__gov-identity", children: [
        /* @__PURE__ */ jsx("span", { className: "nir-t-pfrda__flag-dot" }),
        /* @__PURE__ */ jsx("span", { children: "\u092D\u093E\u0930\u0924 \u0938\u0930\u0915\u093E\u0930 | GOVERNMENT OF INDIA" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__top-actions", children: [
        /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__a11y-controls", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              className: `nir-t-pfrda__a11y-btn ${textSize === "normal" ? "nir-t-pfrda__a11y-btn--active" : ""}`,
              onClick: () => setTextSize("normal"),
              title: "Normal text size",
              "aria-label": "Normal text size",
              children: "A"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: `nir-t-pfrda__a11y-btn ${textSize === "large" ? "nir-t-pfrda__a11y-btn--active" : ""}`,
              onClick: () => setTextSize("large"),
              title: "Large text size",
              "aria-label": "Large text size",
              children: "A+"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: `nir-t-pfrda__a11y-btn ${textSize === "largest" ? "nir-t-pfrda__a11y-btn--active" : ""}`,
              onClick: () => setTextSize("largest"),
              title: "Extra large text size",
              "aria-label": "Extra large text size",
              children: "A++"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: `nir-t-pfrda__a11y-btn ${theme === "light" ? "nir-t-pfrda__a11y-btn--active" : ""}`,
              onClick: () => setTheme("light"),
              title: "Light Theme",
              children: "Light"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: `nir-t-pfrda__a11y-btn ${theme === "dark" ? "nir-t-pfrda__a11y-btn--active" : ""}`,
              onClick: () => setTheme("dark"),
              title: "Dark Theme",
              children: "Dark"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: `nir-t-pfrda__a11y-btn ${theme === "high-contrast" ? "nir-t-pfrda__a11y-btn--active" : ""}`,
              onClick: () => setTheme("high-contrast"),
              title: "High Contrast Theme",
              children: "Contrast"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "nir-t-pfrda__lang-dropdown", children: /* @__PURE__ */ jsx(
          Dropdown,
          {
            label: "Language Select",
            placeholder: "Select Language",
            options: [
              { value: "en", label: "English" },
              { value: "hi", label: "\u0939\u093F\u0928\u094D\u0926\u0940" }
            ],
            value: lang,
            onChange: (val) => setLang(val),
            size: "sm"
          }
        ) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("header", { className: "nir-t-pfrda__header", children: /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__header-inner", children: [
      /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__logo-block", children: [
        /* @__PURE__ */ jsx(AshokaEmblem, {}),
        /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__title-group", children: [
          /* @__PURE__ */ jsx("h1", { className: "nir-t-pfrda__org-hi", children: "\u092A\u0947\u0902\u0936\u0928 \u0928\u093F\u0927\u093F \u0935\u093F\u0928\u093F\u092F\u093E\u092E\u0915 \u0914\u0930 \u0935\u093F\u0915\u093E\u0938 \u092A\u094D\u0930\u093E\u0927\u093F\u0915\u0930\u0923" }),
          /* @__PURE__ */ jsx("h2", { className: "nir-t-pfrda__org-en", children: "Pension Fund Regulatory and Development Authority" }),
          /* @__PURE__ */ jsx("p", { className: "nir-t-pfrda__org-tagline", children: "Nirmaan UI Compliant Portal \u2022 GIGW 3.0 Standard" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("span", { className: "nir-t-pfrda__portal-badge", children: "PFRDA CONNECT" }) })
    ] }) }),
    /* @__PURE__ */ jsx("nav", { className: "nir-t-pfrda__nav", "aria-label": "Primary Portal Navigation", children: /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__nav-inner", children: [
      /* @__PURE__ */ jsxs("ul", { className: "nir-t-pfrda__nav-list", children: [
        /* @__PURE__ */ jsx("li", { className: "nir-t-pfrda__nav-item", children: /* @__PURE__ */ jsx("a", { href: "#", className: "nir-t-pfrda__nav-link nir-t-pfrda__nav-link--active", children: "Home" }) }),
        /* @__PURE__ */ jsx("li", { className: "nir-t-pfrda__nav-item", children: /* @__PURE__ */ jsx("a", { href: "#", className: "nir-t-pfrda__nav-link", children: "About PFRDA" }) }),
        /* @__PURE__ */ jsx("li", { className: "nir-t-pfrda__nav-item", children: /* @__PURE__ */ jsx("a", { href: "#", className: "nir-t-pfrda__nav-link", children: "Pension Schemes" }) }),
        /* @__PURE__ */ jsx("li", { className: "nir-t-pfrda__nav-item", children: /* @__PURE__ */ jsx("a", { href: "#", className: "nir-t-pfrda__nav-link", children: "Subscriber Corner" }) }),
        /* @__PURE__ */ jsx("li", { className: "nir-t-pfrda__nav-item", children: /* @__PURE__ */ jsx("a", { href: "#", className: "nir-t-pfrda__nav-link", children: "Regulatory Framework" }) }),
        /* @__PURE__ */ jsx("li", { className: "nir-t-pfrda__nav-item", children: /* @__PURE__ */ jsx("a", { href: "#", className: "nir-t-pfrda__nav-link", children: "Knowledge Center" }) }),
        /* @__PURE__ */ jsx("li", { className: "nir-t-pfrda__nav-item", children: /* @__PURE__ */ jsx("a", { href: "#", className: "nir-t-pfrda__nav-link", children: "Contact" }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "nir-t-pfrda__nav-actions", children: /* @__PURE__ */ jsx(
        Toggle,
        {
          label: "Compact Density",
          checked: density === "compact",
          onChange: (e) => setDensity(e.target.checked ? "compact" : "default")
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "nir-t-pfrda__hero-section", children: /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__hero-inner", children: [
      /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__hero-content", children: [
        /* @__PURE__ */ jsx("h3", { className: "nir-t-pfrda__hero-heading", children: "Securing Your Golden Years with Trusted Pensions" }),
        /* @__PURE__ */ jsx("p", { className: "nir-t-pfrda__hero-tagline-text", children: "PFRDA regulates and promotes the Indian pension sector, ensuring security, transparency, and robust retirement wealth accumulation for a self-reliant, pension-secure India." }),
        /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__hero-ctas", children: [
          /* @__PURE__ */ jsx(Button, { variant: "primary", size: "lg", onClick: () => alert("Redirecting to NPS registration portal..."), children: "Register for NPS" }),
          /* @__PURE__ */ jsx(Button, { variant: "secondary", size: "lg", style: { color: "#ffffff", borderColor: "#ffffff" }, onClick: () => alert("Redirecting to contribution gate..."), children: "Contribute Online" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__hero-search-row", children: [
          /* @__PURE__ */ jsx(
            Input,
            {
              label: "Search circulars, regulations, guidelines...",
              placeholder: "Search circulars, regulations, guidelines...",
              className: "nir-t-pfrda__hero-search-input-comp",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              "aria-label": "Search PFRDA circulars",
              fullWidth: true
            }
          ),
          /* @__PURE__ */ jsx(Button, { variant: "primary", size: "md", onClick: () => alert(`Searching for "${searchQuery}"`), children: "Search" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__calc-card", children: [
        /* @__PURE__ */ jsxs("h4", { className: "nir-t-pfrda__calc-title", children: [
          /* @__PURE__ */ jsx("svg", { width: "18", height: "18", fill: "currentColor", viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2zm0-4H7V7h10v2zm0 8H7v-2h10v2z" }) }),
          "NPS Pension Estimator"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__calc-form", children: [
          /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__calc-field-row", children: [
            /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__calc-slider-group", children: [
              /* @__PURE__ */ jsx("div", { className: "nir-t-pfrda__calc-slider-label", children: /* @__PURE__ */ jsx("span", { children: "Current Age (Years)" }) }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "range",
                  min: "18",
                  max: "60",
                  value: age,
                  onChange: (e) => setAge(parseInt(e.target.value) || 18),
                  className: "nir-t-pfrda__calc-slider",
                  "aria-label": "Current Age Slider"
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "number",
                label: "Age",
                min: "18",
                max: "60",
                value: age.toString(),
                onChange: (e) => {
                  const val = parseInt(e.target.value);
                  if (val >= 18 && val <= 60) setAge(val);
                  else if (e.target.value === "") setAge(18);
                },
                className: "nir-t-pfrda__calc-num-input",
                size: "sm"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__calc-field-row", children: [
            /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__calc-slider-group", children: [
              /* @__PURE__ */ jsx("div", { className: "nir-t-pfrda__calc-slider-label", children: /* @__PURE__ */ jsx("span", { children: "Monthly Contribution (\u20B9)" }) }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "range",
                  min: "500",
                  max: "15000",
                  step: "500",
                  value: contribution,
                  onChange: (e) => setContribution(parseInt(e.target.value) || 500),
                  className: "nir-t-pfrda__calc-slider",
                  "aria-label": "Monthly Contribution Slider"
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "number",
                label: "Amount (\u20B9)",
                min: "500",
                max: "100000",
                step: "500",
                value: contribution.toString(),
                onChange: (e) => {
                  const val = parseInt(e.target.value);
                  if (val >= 0) setContribution(val);
                },
                className: "nir-t-pfrda__calc-num-input",
                size: "sm"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__calc-field-row", children: [
            /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__calc-slider-group", children: [
              /* @__PURE__ */ jsx("div", { className: "nir-t-pfrda__calc-slider-label", children: /* @__PURE__ */ jsx("span", { children: "Expected Returns (%)" }) }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "range",
                  min: "5",
                  max: "15",
                  step: "0.5",
                  value: expectedReturn,
                  onChange: (e) => setExpectedReturn(parseFloat(e.target.value) || 5),
                  className: "nir-t-pfrda__calc-slider",
                  "aria-label": "Expected Returns Slider"
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "number",
                label: "Returns (%)",
                min: "5",
                max: "25",
                step: "0.1",
                value: expectedReturn.toString(),
                onChange: (e) => {
                  const val = parseFloat(e.target.value);
                  if (val >= 0) setExpectedReturn(val);
                },
                className: "nir-t-pfrda__calc-num-input",
                size: "sm"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__calc-results", children: [
            /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__calc-result-item", children: [
              /* @__PURE__ */ jsx("span", { className: "nir-t-pfrda__calc-result-lbl", children: "Accumulated Corpus (at Age 60)" }),
              /* @__PURE__ */ jsx("span", { className: "nir-t-pfrda__calc-result-val", children: calcResults.corpus })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__calc-result-item", children: [
              /* @__PURE__ */ jsx("span", { className: "nir-t-pfrda__calc-result-lbl", children: "Estimated Monthly Pension" }),
              /* @__PURE__ */ jsx("span", { className: "nir-t-pfrda__calc-result-val nir-t-pfrda__calc-result-val--large", children: calcResults.pension })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__calc-result-item", children: [
              /* @__PURE__ */ jsx("span", { className: "nir-t-pfrda__calc-result-lbl", children: "Lumpsum Withdrawal (60%)" }),
              /* @__PURE__ */ jsx("span", { className: "nir-t-pfrda__calc-result-val", children: calcResults.lumpsum })
            ] })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "nir-t-pfrda__bento-section", children: /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__bento-inner", children: [
      /* @__PURE__ */ jsxs("h3", { className: "nir-t-pfrda__section-title", children: [
        /* @__PURE__ */ jsx("span", { className: "nir-t-pfrda__section-indicator" }),
        "National Pension Sector at a Glance"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__bento-grid", children: [
        /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__bento-card nir-t-pfrda__bento-card--large", children: [
          /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__bento-card-header", children: [
            /* @__PURE__ */ jsx("span", { className: "nir-t-pfrda__bento-lbl", children: "Assets Under Management (AUM)" }),
            /* @__PURE__ */ jsx("div", { className: "nir-t-pfrda__bento-icon-box", children: /* @__PURE__ */ jsx("svg", { width: "20", height: "20", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z" }) }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__bento-val-group", children: [
              /* @__PURE__ */ jsx("p", { className: "nir-t-pfrda__bento-val", children: "\u20B911.23 Lakh Crore" }),
              /* @__PURE__ */ jsx("span", { className: "nir-t-pfrda__bento-trend", children: "+21.4% YoY" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "nir-t-pfrda__bento-desc", children: "Total assets held under NPS, APY and government sector schemes, reflecting massive growth and trust in the regulatory framework." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__bento-card", children: [
          /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__bento-card-header", children: [
            /* @__PURE__ */ jsx("span", { className: "nir-t-pfrda__bento-lbl", children: "NPS Subscribers" }),
            /* @__PURE__ */ jsx("div", { className: "nir-t-pfrda__bento-icon-box", children: /* @__PURE__ */ jsx("svg", { width: "20", height: "20", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" }) }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "nir-t-pfrda__bento-val-group", children: /* @__PURE__ */ jsx("p", { className: "nir-t-pfrda__bento-val", children: "6.84 Crore" }) }),
            /* @__PURE__ */ jsx("p", { className: "nir-t-pfrda__bento-desc", children: "Subscribers across Central/State Government, Corporate, and All Citizens models." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__bento-card", children: [
          /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__bento-card-header", children: [
            /* @__PURE__ */ jsx("span", { className: "nir-t-pfrda__bento-lbl", children: "Atal Pension Yojana" }),
            /* @__PURE__ */ jsx("div", { className: "nir-t-pfrda__bento-icon-box", children: /* @__PURE__ */ jsx("svg", { width: "20", height: "20", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z" }) }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__bento-val-group", children: [
              /* @__PURE__ */ jsx("p", { className: "nir-t-pfrda__bento-val", children: "5.29 Crore" }),
              /* @__PURE__ */ jsx("span", { className: "nir-t-pfrda__bento-trend", children: "+14.2%" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "nir-t-pfrda__bento-desc", children: "Providing guaranteed pensions for citizens working in India's unorganized sector." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__bento-card nir-t-pfrda__bento-card--large", children: [
          /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__bento-card-header", children: [
            /* @__PURE__ */ jsx("span", { className: "nir-t-pfrda__bento-lbl", children: "Registered Intermediaries" }),
            /* @__PURE__ */ jsx("div", { className: "nir-t-pfrda__bento-icon-box", children: /* @__PURE__ */ jsx("svg", { width: "20", height: "20", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M12 7V3H2v18h20V7H12zm-6 12H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm10 12h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm4 12h-2v-2h2v2zm0-4h-2v-2h2v2z" }) }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "nir-t-pfrda__bento-val-group", children: /* @__PURE__ */ jsx("p", { className: "nir-t-pfrda__bento-val", children: "11 PFMs \u2022 78 POPs" }) }),
            /* @__PURE__ */ jsx("p", { className: "nir-t-pfrda__bento-desc", children: "Regulated Pension Fund Managers, Trustee Banks, Points of Presence, and Custodians operating under strict guidelines to preserve capital and deliver optimal returns." })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "nir-t-pfrda__schemes-section", children: /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__schemes-inner", children: [
      /* @__PURE__ */ jsxs("h3", { className: "nir-t-pfrda__section-title", children: [
        /* @__PURE__ */ jsx("span", { className: "nir-t-pfrda__section-indicator" }),
        "Choosing the Right Pension Scheme"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__schemes-grid", children: [
        /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__scheme-card nir-t-pfrda__scheme-card--nps", children: [
          /* @__PURE__ */ jsx("h4", { className: "nir-t-pfrda__scheme-title", children: "National Pension System (NPS)" }),
          /* @__PURE__ */ jsx("p", { className: "nir-t-pfrda__scheme-desc", children: "A flexible, market-linked, voluntary defined contribution scheme designed to enable systematic savings and secure retirement wealth." }),
          /* @__PURE__ */ jsxs("ul", { className: "nir-t-pfrda__scheme-features", children: [
            /* @__PURE__ */ jsx("li", { children: "Available to all Indian citizens aged 18 to 75 years." }),
            /* @__PURE__ */ jsx("li", { children: "Choice of active choice or auto choice asset allocation (Equity, Corporate Debt, Gov Securities)." }),
            /* @__PURE__ */ jsx("li", { children: "Additional tax benefit under Sec 80CCD(1B) up to \u20B950,000." }),
            /* @__PURE__ */ jsx("li", { children: "Low cost structure with highly regulated fund managers." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__scheme-actions", children: [
            /* @__PURE__ */ jsx(Button, { variant: "primary", onClick: () => alert("Opening NPS details..."), children: "Learn More" }),
            /* @__PURE__ */ jsx(Button, { variant: "ghost", onClick: () => alert("Opening NPS FAQ..."), children: "FAQ" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__scheme-card nir-t-pfrda__scheme-card--apy", children: [
          /* @__PURE__ */ jsx("h4", { className: "nir-t-pfrda__scheme-title", children: "Atal Pension Yojana (APY)" }),
          /* @__PURE__ */ jsx("p", { className: "nir-t-pfrda__scheme-desc", children: "A government-guaranteed pension scheme targeting workers in the unorganized sector to prevent financial vulnerability in old age." }),
          /* @__PURE__ */ jsxs("ul", { className: "nir-t-pfrda__scheme-features", children: [
            /* @__PURE__ */ jsx("li", { children: "Open to Indian citizens aged 18 to 40 years." }),
            /* @__PURE__ */ jsx("li", { children: "Guaranteed minimum pension options: \u20B91,000, \u20B92,000, \u20B93,000, \u20B94,000, or \u20B95,000 per month." }),
            /* @__PURE__ */ jsx("li", { children: "Pension begins at age 60; spouse receives pension after death." }),
            /* @__PURE__ */ jsx("li", { children: "Subsidized government co-contributions for eligible members." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__scheme-actions", children: [
            /* @__PURE__ */ jsx(Button, { variant: "primary", onClick: () => alert("Opening APY details..."), children: "Learn More" }),
            /* @__PURE__ */ jsx(Button, { variant: "ghost", onClick: () => alert("Opening APY FAQ..."), children: "FAQ" })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "nir-t-pfrda__updates-section", children: /* @__PURE__ */ jsx("div", { className: "nir-t-pfrda__updates-inner", children: /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__updates-layout", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h3", { className: "nir-t-pfrda__section-title", children: [
          /* @__PURE__ */ jsx("span", { className: "nir-t-pfrda__section-indicator" }),
          "Latest Circulars & Notifications"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__tabs-bar", role: "tablist", "aria-label": "Circular categories", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              role: "tab",
              "aria-selected": activeTab === "all",
              className: `nir-t-pfrda__tab-trigger ${activeTab === "all" ? "nir-t-pfrda__tab-trigger--active" : ""}`,
              onClick: () => setActiveTab("all"),
              children: "All Circulars"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              role: "tab",
              "aria-selected": activeTab === "nps",
              className: `nir-t-pfrda__tab-trigger ${activeTab === "nps" ? "nir-t-pfrda__tab-trigger--active" : ""}`,
              onClick: () => setActiveTab("nps"),
              children: "NPS Updates"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              role: "tab",
              "aria-selected": activeTab === "apy",
              className: `nir-t-pfrda__tab-trigger ${activeTab === "apy" ? "nir-t-pfrda__tab-trigger--active" : ""}`,
              onClick: () => setActiveTab("apy"),
              children: "APY Updates"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              role: "tab",
              "aria-selected": activeTab === "regs",
              className: `nir-t-pfrda__tab-trigger ${activeTab === "regs" ? "nir-t-pfrda__tab-trigger--active" : ""}`,
              onClick: () => setActiveTab("regs"),
              children: "Regulations"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "nir-t-pfrda__circulars-list", children: filteredCirculars.length > 0 ? filteredCirculars.map((item) => /* @__PURE__ */ jsxs("article", { className: "nir-t-pfrda__circular-card", children: [
          /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__circular-date-badge", "aria-hidden": "true", children: [
            /* @__PURE__ */ jsx("span", { className: "nir-t-pfrda__circular-day", children: item.day }),
            /* @__PURE__ */ jsx("span", { className: "nir-t-pfrda__circular-month", children: item.month })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__circular-content", children: [
            /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__circular-meta", children: [
              /* @__PURE__ */ jsx("span", { className: "nir-t-pfrda__circular-tag", children: item.tag }),
              /* @__PURE__ */ jsxs("span", { children: [
                "Reference: ",
                item.ref
              ] })
            ] }),
            /* @__PURE__ */ jsx("h4", { className: "nir-t-pfrda__circular-title", children: /* @__PURE__ */ jsx("a", { href: "#", onClick: (e) => {
              e.preventDefault();
              alert(`Downloading circular ${item.ref}...`);
            }, children: item.title }) })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "nir-t-pfrda__circular-download-btn",
              title: "Download PDF document",
              "aria-label": `Download PDF for circular ${item.ref}`,
              onClick: () => alert(`Downloading circular ${item.ref}...`),
              children: /* @__PURE__ */ jsx("svg", { width: "18", height: "18", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z" }) })
            }
          )
        ] }, item.id)) : /* @__PURE__ */ jsx("p", { style: { textAlign: "center", padding: "24px 0", color: "var(--nir-color-text-secondary)" }, children: "No circulars found matching your search." }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h3", { className: "nir-t-pfrda__section-title", children: [
          /* @__PURE__ */ jsx("span", { className: "nir-t-pfrda__section-indicator" }),
          "Grievance & Redressal"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__corner-card", children: [
          /* @__PURE__ */ jsx("h4", { className: "nir-t-pfrda__corner-title", children: "Quick Portals" }),
          /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__corner-links", children: [
            /* @__PURE__ */ jsxs("a", { href: "#", className: "nir-t-pfrda__corner-link", onClick: (e) => {
              e.preventDefault();
              alert("Opening NPS Trust Portal...");
            }, children: [
              /* @__PURE__ */ jsx("span", { children: "NPS Trust Website" }),
              /* @__PURE__ */ jsx("span", { children: "\u2192" })
            ] }),
            /* @__PURE__ */ jsxs("a", { href: "#", className: "nir-t-pfrda__corner-link", onClick: (e) => {
              e.preventDefault();
              alert("Opening Grievance Portal...");
            }, children: [
              /* @__PURE__ */ jsx("span", { children: "Lodge Grievance (CGMS)" }),
              /* @__PURE__ */ jsx("span", { children: "\u2192" })
            ] }),
            /* @__PURE__ */ jsxs("a", { href: "#", className: "nir-t-pfrda__corner-link", onClick: (e) => {
              e.preventDefault();
              alert("Opening CRA Login Portal...");
            }, children: [
              /* @__PURE__ */ jsx("span", { children: "CRA Account Login" }),
              /* @__PURE__ */ jsx("span", { children: "\u2192" })
            ] }),
            /* @__PURE__ */ jsxs("a", { href: "#", className: "nir-t-pfrda__corner-link", onClick: (e) => {
              e.preventDefault();
              alert("Opening NPS Ki Pathshala...");
            }, children: [
              /* @__PURE__ */ jsx("span", { children: "NPS Ki Pathshala (Awareness)" }),
              /* @__PURE__ */ jsx("span", { children: "\u2192" })
            ] })
          ] })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx("footer", { className: "nir-t-pfrda__footer", children: /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__footer-inner", children: [
      /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__footer-grid", children: [
        /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__footer-col", children: [
          /* @__PURE__ */ jsx("h5", { className: "nir-t-pfrda__footer-title", children: "PFRDA REGULATORY" }),
          /* @__PURE__ */ jsx("p", { className: "nir-t-pfrda__footer-about", children: "The Pension Fund Regulatory and Development Authority is the statutory regulatory body established by the Government of India to promote, regulate, and ensure the orderly growth of pension schemes." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__footer-col", children: [
          /* @__PURE__ */ jsx("h5", { className: "nir-t-pfrda__footer-title", children: "IMPORTANT SCHEMES" }),
          /* @__PURE__ */ jsxs("ul", { className: "nir-t-pfrda__footer-links", children: [
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#", children: "National Pension System (NPS)" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#", children: "Atal Pension Yojana (APY)" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#", children: "Corporate Pension Models" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#", children: "Government NPS Contributions" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__footer-col", children: [
          /* @__PURE__ */ jsx("h5", { className: "nir-t-pfrda__footer-title", children: "RESOURCE CENTRE" }),
          /* @__PURE__ */ jsxs("ul", { className: "nir-t-pfrda__footer-links", children: [
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#", children: "PFRDA Acts & Regulations" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#", children: "Guidelines & Master Circulars" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#", children: "Public Disclosures & Tenders" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#", children: "RTI Act Disclosures" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__footer-col", children: [
          /* @__PURE__ */ jsx("h5", { className: "nir-t-pfrda__footer-title", children: "HELPLINE SUPPORT" }),
          /* @__PURE__ */ jsxs("ul", { className: "nir-t-pfrda__footer-links", children: [
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("span", { children: "Toll-Free (NPS):" }),
              " ",
              /* @__PURE__ */ jsx("a", { href: "tel:1800110708", children: "1800 110 708" })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("span", { children: "Toll-Free (APY):" }),
              " ",
              /* @__PURE__ */ jsx("a", { href: "tel:1800110069", children: "1800 110 069" })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("span", { children: "Email Helpdesk:" }),
              " ",
              /* @__PURE__ */ jsx("a", { href: "mailto:helpdesk@pfrda.org.in", children: "helpdesk@pfrda.org.in" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__footer-meta", children: [
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("span", { children: "\xA9 2026 Pension Fund Regulatory and Development Authority. All Rights Reserved." }) }),
        /* @__PURE__ */ jsxs("div", { className: "nir-t-pfrda__footer-compliance", children: [
          /* @__PURE__ */ jsx("span", { className: "nir-t-pfrda__compliance-badge", children: "GIGW 3.0 COMPLIANT" }),
          /* @__PURE__ */ jsx("span", { className: "nir-t-pfrda__compliance-badge", children: "WCAG AAA ACCESSIBILITY" }),
          /* @__PURE__ */ jsx("a", { href: "#", style: { color: "rgba(255,255,255,0.7)", marginLeft: "16px" }, onClick: (e) => {
            e.preventDefault();
            alert("Website Policies loaded.");
          }, children: "Website Policies" })
        ] })
      ] })
    ] }) })
  ] });
}
function PfrdaTemplate(props) {
  const [containerRef, setContainerRef] = useState(null);
  return /* @__PURE__ */ jsx("div", { ref: setContainerRef, className: "nir-t-pfrda-wrapper", style: { width: "100%" }, children: containerRef && /* @__PURE__ */ jsx(NirmanProvider, { defaultBrand: "goi", defaultTheme: "light", rootElement: containerRef, children: /* @__PURE__ */ jsx(PfrdaPortalInner, { ...props }) }) });
}
var AshokaEmblem2 = () => /* @__PURE__ */ jsxs("svg", { className: "nir-t-edu__emblem", viewBox: "0 0 100 150", fill: "currentColor", "aria-hidden": "true", children: [
  /* @__PURE__ */ jsx("path", { d: "M50 10 C53 10 55 12 55 15 C55 18 53 20 50 20 C47 20 45 18 45 15 C45 12 47 10 50 10 Z" }),
  /* @__PURE__ */ jsx("path", { d: "M40 22 L60 22 L58 35 L42 35 Z" }),
  /* @__PURE__ */ jsx("path", { d: "M38 37 C38 37 42 45 50 45 C58 45 62 37 62 37 L65 75 L35 75 Z" }),
  /* @__PURE__ */ jsx("rect", { x: "42", y: "77", width: "16", height: "50", rx: "2" }),
  /* @__PURE__ */ jsx("path", { d: "M30 128 L70 128 L68 135 L32 135 Z" }),
  /* @__PURE__ */ jsx("circle", { cx: "50", cy: "102", r: "6", stroke: "currentColor", strokeWidth: "1", fill: "none" }),
  /* @__PURE__ */ jsx("line", { x1: "50", y1: "96", x2: "50", y2: "108", stroke: "currentColor", strokeWidth: "1" }),
  /* @__PURE__ */ jsx("line", { x1: "44", y1: "102", x2: "56", y2: "102", stroke: "currentColor", strokeWidth: "1" })
] });
function EducationPortalInner({ title }) {
  const { theme, setTheme, density, setDensity } = useNirman();
  const [textSize, setTextSize] = useState("normal");
  const [lang, setLang] = useState("en");
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = useMemo(() => [
    {
      id: 0,
      image: "/assets/education/banner-swayam.png",
      title: "SWAYAM: Free Online Learning Platform",
      tagline: "Access high-quality education from premium Indian faculties anywhere, anytime. Onboarding and course registrations are open for 2026.",
      cta1: "Explore Courses",
      cta2: "Watch Intro Video"
    },
    {
      id: 1,
      image: "/assets/education/banner-nep.png",
      title: "National Education Policy 2020",
      tagline: "Transforming the school and higher education ecosystem of India to be equitable, vibrant, and aligned with global standards.",
      cta1: "Read NEP Policy",
      cta2: "Implementation Progress"
    }
  ], []);
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6e3);
    return () => clearInterval(timer);
  }, [slides.length]);
  const [galleryTab, setGalleryTab] = useState("video");
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(35);
  const [newsQuery, setNewsQuery] = useState("");
  const [newsCategory, setNewsCategory] = useState("all");
  const updatesList = useMemo(() => [
    {
      id: "1",
      date: "14 Jul 2026",
      category: "announcements",
      label: "Announcement",
      title: "Applications invited for National Teachers Award 2026. Last date for submission extended.",
      link: "#",
      isNew: true
    },
    {
      id: "2",
      date: "10 Jul 2026",
      category: "school",
      label: "School Education",
      title: "Guidelines on digital literacy integration in PM SHRI Schools for the academic session 2026-27.",
      link: "#",
      isNew: true
    },
    {
      id: "3",
      date: "08 Jul 2026",
      category: "higher",
      label: "Higher Education",
      title: "Implementation scheme for Indian Knowledge Systems (IKS) courses in technical institutions.",
      link: "#"
    },
    {
      id: "4",
      date: "05 Jul 2026",
      category: "announcements",
      label: "Announcement",
      title: "SWAYAM semester-end exam schedule released for July-December courses.",
      link: "#"
    },
    {
      id: "5",
      date: "29 Jun 2026",
      category: "higher",
      label: "Higher Education",
      title: "AISHE (All India Survey on Higher Education) report released for 2024-2025. Key trends inside.",
      link: "#"
    }
  ], []);
  const filteredUpdates = useMemo(() => {
    return updatesList.filter((item) => {
      const matchesCategory = newsCategory === "all" || item.category === newsCategory;
      const matchesSearch = item.title.toLowerCase().includes(newsQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [updatesList, newsCategory, newsQuery]);
  useEffect(() => {
    let playTimer;
    if (isVideoPlaying) {
      playTimer = setInterval(() => {
        setVideoProgress((prev) => prev >= 100 ? 0 : prev + 1);
      }, 500);
    }
    return () => clearInterval(playTimer);
  }, [isVideoPlaying]);
  const textScaleClass = textSize === "large" ? "nir-t-edu--text-lg" : textSize === "largest" ? "nir-t-edu--text-xl" : "";
  return /* @__PURE__ */ jsxs("div", { className: `nir-t-edu ${textScaleClass}`, lang, children: [
    /* @__PURE__ */ jsx("div", { className: "nir-t-edu__top-bar", children: /* @__PURE__ */ jsxs("div", { className: "nir-t-edu__top-bar-inner", children: [
      /* @__PURE__ */ jsxs("div", { className: "nir-t-edu__gov-identity", children: [
        /* @__PURE__ */ jsx("span", { className: "nir-t-edu__flag-dot" }),
        /* @__PURE__ */ jsx("span", { children: "\u0936\u093F\u0915\u094D\u0937\u093E \u092E\u0902\u0924\u094D\u0930\u093E\u0932\u092F | MINISTRY OF EDUCATION" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "nir-t-edu__top-actions", children: [
        /* @__PURE__ */ jsxs("div", { className: "nir-t-edu__a11y-controls", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              className: `nir-t-edu__a11y-btn ${textSize === "normal" ? "nir-t-edu__a11y-btn--active" : ""}`,
              onClick: () => setTextSize("normal"),
              title: "Normal text size",
              "aria-label": "Normal text size",
              children: "A"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: `nir-t-edu__a11y-btn ${textSize === "large" ? "nir-t-edu__a11y-btn--active" : ""}`,
              onClick: () => setTextSize("large"),
              title: "Large text size",
              "aria-label": "Large text size",
              children: "A+"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: `nir-t-edu__a11y-btn ${textSize === "largest" ? "nir-t-edu__a11y-btn--active" : ""}`,
              onClick: () => setTextSize("largest"),
              title: "Extra large text size",
              "aria-label": "Extra large text size",
              children: "A++"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: `nir-t-edu__a11y-btn ${theme === "light" ? "nir-t-edu__a11y-btn--active" : ""}`,
              onClick: () => setTheme("light"),
              title: "Light Theme",
              children: "Light"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: `nir-t-edu__a11y-btn ${theme === "dark" ? "nir-t-edu__a11y-btn--active" : ""}`,
              onClick: () => setTheme("dark"),
              title: "Dark Theme",
              children: "Dark"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: `nir-t-edu__a11y-btn ${theme === "high-contrast" ? "nir-t-edu__a11y-btn--active" : ""}`,
              onClick: () => setTheme("high-contrast"),
              title: "High Contrast Theme",
              children: "Contrast"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "nir-t-edu__lang-dropdown", children: /* @__PURE__ */ jsx(
          Dropdown,
          {
            label: "Language Select",
            placeholder: "Select Language",
            options: [
              { value: "en", label: "English" },
              { value: "hi", label: "\u0939\u093F\u0928\u094D\u0926\u0940" }
            ],
            value: lang,
            onChange: (val) => setLang(val),
            size: "sm"
          }
        ) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("header", { className: "nir-t-edu__header", children: /* @__PURE__ */ jsxs("div", { className: "nir-t-edu__header-inner", children: [
      /* @__PURE__ */ jsxs("div", { className: "nir-t-edu__logo-block", children: [
        /* @__PURE__ */ jsx(AshokaEmblem2, {}),
        /* @__PURE__ */ jsxs("div", { className: "nir-t-edu__title-group", children: [
          /* @__PURE__ */ jsx("h1", { className: "nir-t-edu__org-hi", children: "\u0936\u093F\u0915\u094D\u0937\u093E \u092E\u0902\u0924\u094D\u0930\u093E\u0932\u092F" }),
          /* @__PURE__ */ jsx("h2", { className: "nir-t-edu__org-en", children: "Ministry of Education" }),
          /* @__PURE__ */ jsx("p", { className: "nir-t-edu__org-tagline", children: "Department of School Education & Literacy \u2022 Department of Higher Education" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("span", { className: "nir-t-edu__portal-badge", children: "NEP 2020 ALIGNED" }) })
    ] }) }),
    /* @__PURE__ */ jsx("nav", { className: "nir-t-edu__nav", "aria-label": "Primary Portal Navigation", children: /* @__PURE__ */ jsxs("div", { className: "nir-t-edu__nav-inner", children: [
      /* @__PURE__ */ jsxs("ul", { className: "nir-t-edu__nav-list", children: [
        /* @__PURE__ */ jsx("li", { className: "nir-t-edu__nav-item", children: /* @__PURE__ */ jsx("a", { href: "#", className: "nir-t-edu__nav-link nir-t-edu__nav-link--active", children: "Home" }) }),
        /* @__PURE__ */ jsx("li", { className: "nir-t-edu__nav-item", children: /* @__PURE__ */ jsx("a", { href: "#", className: "nir-t-edu__nav-link", children: "About MoE" }) }),
        /* @__PURE__ */ jsx("li", { className: "nir-t-edu__nav-item", children: /* @__PURE__ */ jsx("a", { href: "#", className: "nir-t-edu__nav-link", children: "School Education" }) }),
        /* @__PURE__ */ jsx("li", { className: "nir-t-edu__nav-item", children: /* @__PURE__ */ jsx("a", { href: "#", className: "nir-t-edu__nav-link", children: "Higher Education" }) }),
        /* @__PURE__ */ jsx("li", { className: "nir-t-edu__nav-item", children: /* @__PURE__ */ jsx("a", { href: "#", className: "nir-t-edu__nav-link", children: "Policy & Reforms" }) }),
        /* @__PURE__ */ jsx("li", { className: "nir-t-edu__nav-item", children: /* @__PURE__ */ jsx("a", { href: "#", className: "nir-t-edu__nav-link", children: "Media Center" }) }),
        /* @__PURE__ */ jsx("li", { className: "nir-t-edu__nav-item", children: /* @__PURE__ */ jsx("a", { href: "#", className: "nir-t-edu__nav-link", children: "Documents" }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "nir-t-edu__nav-actions", children: /* @__PURE__ */ jsx(
        Toggle,
        {
          label: "Compact Density",
          checked: density === "compact",
          onChange: (e) => setDensity(e.target.checked ? "compact" : "default")
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "nir-t-edu__carousel", "aria-label": "Educational Highlights Carousel", children: [
      /* @__PURE__ */ jsx("div", { className: "nir-t-edu__carousel-wrapper", children: slides.map((slide, idx) => /* @__PURE__ */ jsx(
        "div",
        {
          className: `nir-t-edu__carousel-slide ${idx === activeSlide ? "nir-t-edu__carousel-slide--active" : ""}`,
          style: { backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url(${slide.image})` },
          children: /* @__PURE__ */ jsxs("div", { className: "nir-t-edu__carousel-content", children: [
            /* @__PURE__ */ jsx("h3", { className: "nir-t-edu__carousel-title", children: slide.title }),
            /* @__PURE__ */ jsx("p", { className: "nir-t-edu__carousel-tagline", children: slide.tagline }),
            /* @__PURE__ */ jsxs("div", { className: "nir-t-edu__carousel-actions", children: [
              /* @__PURE__ */ jsx(Button, { variant: "primary", size: "lg", onClick: () => alert(`Redirecting to: ${slide.title}`), children: slide.cta1 }),
              /* @__PURE__ */ jsx(Button, { variant: "secondary", size: "lg", style: { color: "#ffffff", borderColor: "#ffffff" }, onClick: () => alert("Launching multimedia details..."), children: slide.cta2 })
            ] })
          ] })
        },
        slide.id
      )) }),
      /* @__PURE__ */ jsx("div", { className: "nir-t-edu__carousel-indicators", children: slides.map((_, idx) => /* @__PURE__ */ jsx(
        "button",
        {
          className: `nir-t-edu__carousel-dot ${idx === activeSlide ? "nir-t-edu__carousel-dot--active" : ""}`,
          onClick: () => setActiveSlide(idx),
          "aria-label": `Go to slide ${idx + 1}`
        },
        idx
      )) })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "nir-t-edu__bento-section", children: /* @__PURE__ */ jsxs("div", { className: "nir-t-edu__bento-inner", children: [
      /* @__PURE__ */ jsxs("h3", { className: "nir-t-edu__section-title", children: [
        /* @__PURE__ */ jsx("span", { className: "nir-t-edu__section-indicator" }),
        "National Educational Initiatives & Portals"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "nir-t-edu__bento-grid", children: [
        /* @__PURE__ */ jsxs("div", { className: "nir-t-edu__bento-card", children: [
          /* @__PURE__ */ jsx("span", { className: "nir-t-edu__bento-lbl", children: "Digital Learning" }),
          /* @__PURE__ */ jsx("h4", { className: "nir-t-edu__bento-card-title", children: "SWAYAM Portal" }),
          /* @__PURE__ */ jsx("p", { className: "nir-t-edu__bento-desc", children: "Integrated platform for online courses offering high quality education mapped to curriculum of school & higher education." }),
          /* @__PURE__ */ jsx("a", { href: "#", className: "nir-t-edu__bento-link", onClick: (e) => {
            e.preventDefault();
            alert("Redirecting to SWAYAM trust portal...");
          }, children: "Register on SWAYAM \u2192" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "nir-t-edu__bento-card", children: [
          /* @__PURE__ */ jsx("span", { className: "nir-t-edu__bento-lbl", children: "School Education" }),
          /* @__PURE__ */ jsx("h4", { className: "nir-t-edu__bento-card-title", children: "DIKSHA Digital Infrastructure" }),
          /* @__PURE__ */ jsx("p", { className: "nir-t-edu__bento-desc", children: "National digital infrastructure for teachers, hosting rich interactive learning content in multiple languages." }),
          /* @__PURE__ */ jsx("a", { href: "#", className: "nir-t-edu__bento-link", onClick: (e) => {
            e.preventDefault();
            alert("Redirecting to DIKSHA digital page...");
          }, children: "Access Study Material \u2192" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "nir-t-edu__bento-card", children: [
          /* @__PURE__ */ jsx("span", { className: "nir-t-edu__bento-lbl", children: "Student Welfare" }),
          /* @__PURE__ */ jsx("h4", { className: "nir-t-edu__bento-card-title", children: "National Scholarship Portal" }),
          /* @__PURE__ */ jsx("p", { className: "nir-t-edu__bento-desc", children: "Single unified solution for student registration, scheme eligibility checks, processing, and direct benefit payout." }),
          /* @__PURE__ */ jsx("a", { href: "#", className: "nir-t-edu__bento-link", onClick: (e) => {
            e.preventDefault();
            alert("Opening NSP Scholarship portal...");
          }, children: "Check Scheme Status \u2192" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "nir-t-edu__bento-card", children: [
          /* @__PURE__ */ jsx("span", { className: "nir-t-edu__bento-lbl", children: "Data & Reports" }),
          /* @__PURE__ */ jsx("h4", { className: "nir-t-edu__bento-card-title", children: "AISHE Portal" }),
          /* @__PURE__ */ jsx("p", { className: "nir-t-edu__bento-desc", children: "All India Survey on Higher Education. Collects statistics on higher education institutions to formulate policy parameters." }),
          /* @__PURE__ */ jsx("a", { href: "#", className: "nir-t-edu__bento-link", onClick: (e) => {
            e.preventDefault();
            alert("Opening AISHE report page...");
          }, children: "View Census Surveys \u2192" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "nir-t-edu__updates-section", children: /* @__PURE__ */ jsx("div", { className: "nir-t-edu__updates-inner", children: /* @__PURE__ */ jsxs("div", { className: "nir-t-edu__updates-layout", children: [
      /* @__PURE__ */ jsxs("div", { className: "nir-t-edu__news-column", children: [
        /* @__PURE__ */ jsxs("h3", { className: "nir-t-edu__section-title", children: [
          /* @__PURE__ */ jsx("span", { className: "nir-t-edu__section-indicator" }),
          "Announcements & Notifications"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "nir-t-edu__tabs-bar", role: "tablist", "aria-label": "Announcements categories", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              role: "tab",
              "aria-selected": newsCategory === "all",
              className: `nir-t-edu__tab-trigger ${newsCategory === "all" ? "nir-t-edu__tab-trigger--active" : ""}`,
              onClick: () => setNewsCategory("all"),
              children: "All News"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              role: "tab",
              "aria-selected": newsCategory === "announcements",
              className: `nir-t-edu__tab-trigger ${newsCategory === "announcements" ? "nir-t-edu__tab-trigger--active" : ""}`,
              onClick: () => setNewsCategory("announcements"),
              children: "Announcements"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              role: "tab",
              "aria-selected": newsCategory === "school",
              className: `nir-t-edu__tab-trigger ${newsCategory === "school" ? "nir-t-edu__tab-trigger--active" : ""}`,
              onClick: () => setNewsCategory("school"),
              children: "School Education"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              role: "tab",
              "aria-selected": newsCategory === "higher",
              className: `nir-t-edu__tab-trigger ${newsCategory === "higher" ? "nir-t-edu__tab-trigger--active" : ""}`,
              onClick: () => setNewsCategory("higher"),
              children: "Higher Education"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "nir-t-edu__search-box-row", children: /* @__PURE__ */ jsx(
          Input,
          {
            label: "Search Announcements",
            placeholder: "Filter by keyword...",
            value: newsQuery,
            onChange: (e) => setNewsQuery(e.target.value),
            size: "sm",
            fullWidth: true
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "nir-t-edu__updates-list", children: filteredUpdates.length > 0 ? filteredUpdates.map((item) => /* @__PURE__ */ jsxs("article", { className: "nir-t-edu__update-card", children: [
          /* @__PURE__ */ jsxs("div", { className: "nir-t-edu__update-meta", children: [
            /* @__PURE__ */ jsx("span", { className: "nir-t-edu__update-date", children: item.date }),
            /* @__PURE__ */ jsx("span", { className: "nir-t-edu__update-badge", children: item.label }),
            item.isNew && /* @__PURE__ */ jsx("span", { className: "nir-t-edu__new-tag", children: "NEW" })
          ] }),
          /* @__PURE__ */ jsx("h4", { className: "nir-t-edu__update-title", children: /* @__PURE__ */ jsx("a", { href: item.link, onClick: (e) => {
            e.preventDefault();
            alert(`Redirecting to document download for: ${item.title}`);
          }, children: item.title }) })
        ] }, item.id)) : /* @__PURE__ */ jsx("p", { className: "nir-t-edu__empty-message", children: "No matches found for your filter criteria." }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "nir-t-edu__media-column", children: [
        /* @__PURE__ */ jsxs("h3", { className: "nir-t-edu__section-title", children: [
          /* @__PURE__ */ jsx("span", { className: "nir-t-edu__section-indicator" }),
          "Ministry Media Corner"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "nir-t-edu__tabs-bar", role: "tablist", "aria-label": "Media Corner Switcher", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              role: "tab",
              "aria-selected": galleryTab === "video",
              className: `nir-t-edu__tab-trigger ${galleryTab === "video" ? "nir-t-edu__tab-trigger--active" : ""}`,
              onClick: () => setGalleryTab("video"),
              children: "Video Address"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              role: "tab",
              "aria-selected": galleryTab === "photos",
              className: `nir-t-edu__tab-trigger ${galleryTab === "photos" ? "nir-t-edu__tab-trigger--active" : ""}`,
              onClick: () => setGalleryTab("photos"),
              children: "Recent Events Photo Grid"
            }
          )
        ] }),
        galleryTab === "video" ? /* @__PURE__ */ jsxs("div", { className: "nir-t-edu__video-card", children: [
          /* @__PURE__ */ jsxs("div", { className: "nir-t-edu__player-container", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: "/assets/education/video-thumbnail.png",
                alt: "Ministry conference video address preview",
                className: "nir-t-edu__video-thumb"
              }
            ),
            !isVideoPlaying ? /* @__PURE__ */ jsx(
              "button",
              {
                className: "nir-t-edu__play-btn",
                onClick: () => setIsVideoPlaying(true),
                "aria-label": "Play video address",
                children: /* @__PURE__ */ jsx("svg", { className: "nir-t-edu__play-icon", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M8 5v14l11-7z" }) })
              }
            ) : /* @__PURE__ */ jsxs("div", { className: "nir-t-edu__player-overlay", children: [
              /* @__PURE__ */ jsxs("div", { className: "nir-t-edu__video-active-sign", children: [
                /* @__PURE__ */ jsx("span", { className: "nir-t-edu__live-pulse" }),
                /* @__PURE__ */ jsx("span", { children: "PLAYING MOE CONCLAVE VIDEO" })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: "nir-t-edu__pause-btn",
                  onClick: () => setIsVideoPlaying(false),
                  "aria-label": "Pause video address",
                  children: /* @__PURE__ */ jsx("svg", { className: "nir-t-edu__pause-icon", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M6 19h4V5H6v14zm8-14v14h4V5h-4z" }) })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "nir-t-edu__player-controls", children: [
            /* @__PURE__ */ jsxs("span", { className: "nir-t-edu__player-time", children: [
              isVideoPlaying ? `00:${videoProgress.toString().padStart(2, "0")}` : "00:00",
              " / 01:25"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "nir-t-edu__progress-bg", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: "nir-t-edu__progress-fill",
                style: { width: `${isVideoPlaying ? videoProgress : 0}%` }
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "nir-t-edu__video-info", children: [
            /* @__PURE__ */ jsx("h4", { className: "nir-t-edu__video-title", children: "National Education Summit: Digital Integration" }),
            /* @__PURE__ */ jsx("p", { className: "nir-t-edu__video-desc-txt", children: "Address by the Union Cabinet Minister on the adoption of high-tech digital classrooms and rural connectivity." })
          ] })
        ] }) : /* @__PURE__ */ jsxs("div", { className: "nir-t-edu__photo-grid", children: [
          /* @__PURE__ */ jsxs("div", { className: "nir-t-edu__photo-card", children: [
            /* @__PURE__ */ jsx("img", { src: "/assets/education/banner-swayam.png", alt: "Students in Library" }),
            /* @__PURE__ */ jsx("span", { className: "nir-t-edu__photo-label", children: "Digital Campuses initiative" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "nir-t-edu__photo-card", children: [
            /* @__PURE__ */ jsx("img", { src: "/assets/education/banner-nep.png", alt: "Classroom learning" }),
            /* @__PURE__ */ jsx("span", { className: "nir-t-edu__photo-label", children: "NEP 2020 rural models" })
          ] })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx("footer", { className: "nir-t-edu__footer", children: /* @__PURE__ */ jsxs("div", { className: "nir-t-edu__footer-inner", children: [
      /* @__PURE__ */ jsxs("div", { className: "nir-t-edu__footer-grid", children: [
        /* @__PURE__ */ jsxs("div", { className: "nir-t-edu__footer-col", children: [
          /* @__PURE__ */ jsx("h5", { className: "nir-t-edu__footer-title", children: "Ministry Profile" }),
          /* @__PURE__ */ jsx("p", { className: "nir-t-edu__footer-about", children: "The Ministry of Education regulates, finances, and builds educational infrastructure across primary, secondary, and higher educational institutions in India." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "nir-t-edu__footer-col", children: [
          /* @__PURE__ */ jsx("h5", { className: "nir-t-edu__footer-title", children: "Higher Education Portals" }),
          /* @__PURE__ */ jsxs("ul", { className: "nir-t-edu__footer-links", children: [
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#", children: "UGC Website" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#", children: "AICTE Portal" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#", children: "SWAYAM Online learning" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#", children: "AISHE statistics" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "nir-t-edu__footer-col", children: [
          /* @__PURE__ */ jsx("h5", { className: "nir-t-edu__footer-title", children: "Schooling Programs" }),
          /* @__PURE__ */ jsxs("ul", { className: "nir-t-edu__footer-links", children: [
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#", children: "DIKSHA framework" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#", children: "PM SHRI school models" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#", children: "NIPUN Bharat guidelines" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#", children: "National Teacher awards" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "nir-t-edu__footer-col", children: [
          /* @__PURE__ */ jsx("h5", { className: "nir-t-edu__footer-title", children: "Support Desk" }),
          /* @__PURE__ */ jsxs("ul", { className: "nir-t-edu__footer-links", children: [
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("span", { children: "National Toll-Free:" }),
              " 1800-116-200"
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("span", { children: "Scholarship Desk:" }),
              " 0120-6619540"
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("span", { children: "Email Helpdesk:" }),
              " support-moe@gov.in"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "nir-t-edu__footer-meta", children: [
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("span", { children: "\xA9 2026 Ministry of Education, Government of India. All Rights Reserved." }) }),
        /* @__PURE__ */ jsxs("div", { className: "nir-t-edu__footer-compliance", children: [
          /* @__PURE__ */ jsx("span", { className: "nir-t-edu__compliance-badge", children: "GIGW 3.0 COMPLIANT" }),
          /* @__PURE__ */ jsx("span", { className: "nir-t-edu__compliance-badge", children: "WCAG AAA ACCESSIBILITY" }),
          /* @__PURE__ */ jsx("a", { href: "#", style: { color: "rgba(255,255,255,0.7)", marginLeft: "16px" }, onClick: (e) => {
            e.preventDefault();
            alert("Website Policies loaded.");
          }, children: "Website Policies" })
        ] })
      ] })
    ] }) })
  ] });
}
function EducationTemplate(props) {
  const [containerRef, setContainerRef] = useState(null);
  return /* @__PURE__ */ jsx("div", { ref: setContainerRef, className: "nir-t-edu-wrapper", style: { width: "100%" }, children: containerRef && /* @__PURE__ */ jsx(NirmanProvider, { defaultBrand: "goi", defaultTheme: "light", rootElement: containerRef, children: /* @__PURE__ */ jsx(EducationPortalInner, { ...props }) }) });
}
var KeralaEmblem = () => /* @__PURE__ */ jsxs("svg", { className: "nir-t-kl__emblem", viewBox: "0 0 100 100", fill: "currentColor", "aria-hidden": "true", children: [
  /* @__PURE__ */ jsx("circle", { cx: "50", cy: "50", r: "45", stroke: "currentColor", strokeWidth: "2", fill: "none" }),
  /* @__PURE__ */ jsx("path", { d: "M22 65 C22 55, 30 45, 40 45 C42 45, 44 46, 44 48 C44 52, 34 54, 34 65 L22 65 Z" }),
  /* @__PURE__ */ jsx("path", { d: "M78 65 C78 55, 70 45, 60 45 C58 45, 56 46, 56 48 C56 52, 66 54, 66 65 L78 65 Z" }),
  /* @__PURE__ */ jsx("path", { d: "M46 55 C46 52, 48 50, 50 50 C52 50, 54 52, 54 55 C54 60, 46 60, 46 55 Z" }),
  /* @__PURE__ */ jsx("path", { d: "M42 62 L58 62 L55 70 L45 70 Z" }),
  /* @__PURE__ */ jsx("path", { d: "M40 75 L60 75 L58 80 L42 80 Z" })
] });
function KeralaPortalInner({ title }) {
  const { theme, setTheme, density, setDensity } = useNirman();
  const [textSize, setTextSize] = useState("normal");
  const [lang, setLang] = useState("ml");
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = useMemo(() => [
    {
      id: 0,
      image: "/assets/kerala/banner-services.png",
      title: "e-Sevanam: Single Window Service Portal",
      tagline: "Access over 900+ citizen services online. Apply for certificates, make utility payments, and track applications from Akshaya Centers.",
      cta1: "Login to e-Sevanam",
      cta2: "Find Akshaya Center"
    },
    {
      id: 1,
      image: "/assets/kerala/banner-tourism.png",
      title: "Kerala Tourism: God's Own Country",
      tagline: "Experience the pristine beaches, serene backwaters, and rich heritage of Kerala. Explore destination guidelines for 2026.",
      cta1: "Plan Your Trip",
      cta2: "Watch Virtual Tour"
    }
  ], []);
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [slides.length]);
  const [serviceQuery, setServiceQuery] = useState("");
  const services = useMemo(() => [
    { id: "s1", icon: "\u{1F4DD}", name: "Income Certificate", dept: "Revenue" },
    { id: "s2", icon: "\u{1F3E0}", name: "Building Permit", dept: "LSGD (Local Bodies)" },
    { id: "s3", icon: "\u{1F4BC}", name: "Panchayat License", dept: "Panchayat" },
    { id: "s4", icon: "\u{1F464}", name: "One Time Registration", dept: "KPSC" },
    { id: "s5", icon: "\u{1F476}", name: "Birth & Death Registry", dept: "Health" },
    { id: "s6", icon: "\u26A1", name: "KSEB Electricity Bills", dept: "KSEB Power" },
    { id: "s7", icon: "\u{1F6B0}", name: "KWA Water Bill Payment", dept: "Water Authority" },
    { id: "s8", icon: "\u{1F69C}", name: "Land Tax (e-Land)", dept: "Revenue" }
  ], []);
  const filteredServices = useMemo(() => {
    return services.filter((s) => s.name.toLowerCase().includes(serviceQuery.toLowerCase()) || s.dept.toLowerCase().includes(serviceQuery.toLowerCase()));
  }, [services, serviceQuery]);
  const [goCategory, setGoCategory] = useState("all");
  const [goQuery, setGoQuery] = useState("");
  const governmentOrders = useMemo(() => [
    {
      id: "go-1",
      date: "14 Jul 2026",
      number: "G.O.(P) No. 42/2026/GAD",
      category: "gad",
      label: "Gen Administration",
      title: "Declaration of public holidays in the state of Kerala for the calendar year 2027.",
      isNew: true
    },
    {
      id: "go-2",
      date: "12 Jul 2026",
      number: "G.O.(Rt) No. 1024/2026/Fin",
      category: "finance",
      label: "Finance Department",
      title: "Sanctioning of funds for modernizing digital infrastructure in Grama Panchayats.",
      isNew: true
    },
    {
      id: "go-3",
      date: "09 Jul 2026",
      number: "G.O.(Rt) No. 784/2026/HWD",
      category: "health",
      label: "Health & Family Welfare",
      title: "Guidelines on deployment of mobile medical teams under the e-Health mission.",
      isNew: false
    },
    {
      id: "go-4",
      date: "06 Jul 2026",
      number: "G.O.(P) No. 39/2026/Fin",
      category: "finance",
      label: "Finance Department",
      title: "Revision of interest rates on treasury savings bank accounts and fixed deposits.",
      isNew: false
    },
    {
      id: "go-5",
      date: "28 Jun 2026",
      number: "G.O.(Rt) No. 642/2026/GAD",
      category: "gad",
      label: "Gen Administration",
      title: "Reconstitution of administrative panels for local self government development projects.",
      isNew: false
    }
  ], []);
  const filteredGOs = useMemo(() => {
    return governmentOrders.filter((go) => {
      const matchesCategory = goCategory === "all" || go.category === goCategory;
      const matchesSearch = go.title.toLowerCase().includes(goQuery.toLowerCase()) || go.number.toLowerCase().includes(goQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [governmentOrders, goCategory, goQuery]);
  const [galleryTab, setGalleryTab] = useState("video");
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(15);
  useEffect(() => {
    let playTimer;
    if (isVideoPlaying) {
      playTimer = setInterval(() => {
        setVideoProgress((prev) => prev >= 100 ? 0 : prev + 1);
      }, 600);
    }
    return () => clearInterval(playTimer);
  }, [isVideoPlaying]);
  const textScaleClass = textSize === "large" ? "nir-t-kl--text-lg" : textSize === "largest" ? "nir-t-kl--text-xl" : "";
  return /* @__PURE__ */ jsxs("div", { className: `nir-t-kl ${textScaleClass}`, lang, children: [
    /* @__PURE__ */ jsx("div", { className: "nir-t-kl__top-bar", children: /* @__PURE__ */ jsxs("div", { className: "nir-t-kl__top-bar-inner", children: [
      /* @__PURE__ */ jsxs("div", { className: "nir-t-kl__gov-identity", children: [
        /* @__PURE__ */ jsx("span", { className: "nir-t-kl__flag-dot" }),
        /* @__PURE__ */ jsx("span", { children: "\u0D15\u0D47\u0D30\u0D33 \u0D38\u0D7C\u0D15\u0D4D\u0D15\u0D3E\u0D7C | GOVERNMENT OF KERALA" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "nir-t-kl__top-actions", children: [
        /* @__PURE__ */ jsxs("div", { className: "nir-t-kl__a11y-controls", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              className: `nir-t-kl__a11y-btn ${textSize === "normal" ? "nir-t-kl__a11y-btn--active" : ""}`,
              onClick: () => setTextSize("normal"),
              title: "Normal text size",
              "aria-label": "Normal text size",
              children: "A"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: `nir-t-kl__a11y-btn ${textSize === "large" ? "nir-t-kl__a11y-btn--active" : ""}`,
              onClick: () => setTextSize("large"),
              title: "Large text size",
              "aria-label": "Large text size",
              children: "A+"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: `nir-t-kl__a11y-btn ${textSize === "largest" ? "nir-t-kl__a11y-btn--active" : ""}`,
              onClick: () => setTextSize("largest"),
              title: "Extra large text size",
              "aria-label": "Extra large text size",
              children: "A++"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: `nir-t-kl__a11y-btn ${theme === "light" ? "nir-t-kl__a11y-btn--active" : ""}`,
              onClick: () => setTheme("light"),
              title: "Light Theme",
              children: "Light"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: `nir-t-kl__a11y-btn ${theme === "dark" ? "nir-t-kl__a11y-btn--active" : ""}`,
              onClick: () => setTheme("dark"),
              title: "Dark Theme",
              children: "Dark"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: `nir-t-kl__a11y-btn ${theme === "high-contrast" ? "nir-t-kl__a11y-btn--active" : ""}`,
              onClick: () => setTheme("high-contrast"),
              title: "High Contrast Theme",
              children: "Contrast"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "nir-t-kl__lang-dropdown", children: /* @__PURE__ */ jsx(
          Dropdown,
          {
            label: "Language Select",
            placeholder: "Select Language",
            options: [
              { value: "ml", label: "\u0D2E\u0D32\u0D2F\u0D3E\u0D33\u0D02 (Malayalam)" },
              { value: "en", label: "English" }
            ],
            value: lang,
            onChange: (val) => setLang(val),
            size: "sm"
          }
        ) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("header", { className: "nir-t-kl__header", children: /* @__PURE__ */ jsxs("div", { className: "nir-t-kl__header-inner", children: [
      /* @__PURE__ */ jsxs("div", { className: "nir-t-kl__logo-block", children: [
        /* @__PURE__ */ jsx(KeralaEmblem, {}),
        /* @__PURE__ */ jsxs("div", { className: "nir-t-kl__title-group", children: [
          /* @__PURE__ */ jsx("h1", { className: "nir-t-kl__org-hi", children: "\u0D15\u0D47\u0D30\u0D33 \u0D38\u0D7C\u0D15\u0D4D\u0D15\u0D3E\u0D7C" }),
          /* @__PURE__ */ jsx("h2", { className: "nir-t-kl__org-en", children: "Government of Kerala" }),
          /* @__PURE__ */ jsx("p", { className: "nir-t-kl__org-tagline", children: "Official State Portal \u2022 Nirmaan UI State Theme" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("span", { className: "nir-t-kl__portal-badge", children: "e-Sevanam Certified" }) })
    ] }) }),
    /* @__PURE__ */ jsx("nav", { className: "nir-t-kl__nav", "aria-label": "Primary Portal Navigation", children: /* @__PURE__ */ jsxs("div", { className: "nir-t-kl__nav-inner", children: [
      /* @__PURE__ */ jsxs("ul", { className: "nir-t-kl__nav-list", children: [
        /* @__PURE__ */ jsx("li", { className: "nir-t-kl__nav-item", children: /* @__PURE__ */ jsx("a", { href: "#", className: "nir-t-kl__nav-link nir-t-kl__nav-link--active", children: "Home" }) }),
        /* @__PURE__ */ jsx("li", { className: "nir-t-kl__nav-item", children: /* @__PURE__ */ jsx("a", { href: "#", className: "nir-t-kl__nav-link", children: "About Kerala" }) }),
        /* @__PURE__ */ jsx("li", { className: "nir-t-kl__nav-item", children: /* @__PURE__ */ jsx("a", { href: "#", className: "nir-t-kl__nav-link", children: "Departments" }) }),
        /* @__PURE__ */ jsx("li", { className: "nir-t-kl__nav-item", children: /* @__PURE__ */ jsx("a", { href: "#", className: "nir-t-kl__nav-link", children: "Government Orders (GOs)" }) }),
        /* @__PURE__ */ jsx("li", { className: "nir-t-kl__nav-item", children: /* @__PURE__ */ jsx("a", { href: "#", className: "nir-t-kl__nav-link", children: "Citizen Services" }) }),
        /* @__PURE__ */ jsx("li", { className: "nir-t-kl__nav-item", children: /* @__PURE__ */ jsx("a", { href: "#", className: "nir-t-kl__nav-link", children: "Media Center" }) }),
        /* @__PURE__ */ jsx("li", { className: "nir-t-kl__nav-item", children: /* @__PURE__ */ jsx("a", { href: "#", className: "nir-t-kl__nav-link", children: "Contact" }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "nir-t-kl__nav-actions", children: /* @__PURE__ */ jsx(
        Toggle,
        {
          label: "Compact Density",
          checked: density === "compact",
          onChange: (e) => setDensity(e.target.checked ? "compact" : "default")
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "nir-t-kl__carousel", "aria-label": "State Highlights Carousel", children: [
      /* @__PURE__ */ jsx("div", { className: "nir-t-kl__carousel-wrapper", children: slides.map((slide, idx) => /* @__PURE__ */ jsx(
        "div",
        {
          className: `nir-t-kl__carousel-slide ${idx === activeSlide ? "nir-t-kl__carousel-slide--active" : ""}`,
          style: { backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.65)), url(${slide.image})` },
          children: /* @__PURE__ */ jsxs("div", { className: "nir-t-kl__carousel-content", children: [
            /* @__PURE__ */ jsx("h3", { className: "nir-t-kl__carousel-title", children: slide.title }),
            /* @__PURE__ */ jsx("p", { className: "nir-t-kl__carousel-tagline", children: slide.tagline }),
            /* @__PURE__ */ jsxs("div", { className: "nir-t-kl__carousel-actions", children: [
              /* @__PURE__ */ jsx(Button, { variant: "primary", size: "lg", onClick: () => alert(`Redirecting to: ${slide.title}`), children: slide.cta1 }),
              /* @__PURE__ */ jsx(Button, { variant: "secondary", size: "lg", style: { color: "#ffffff", borderColor: "#ffffff" }, onClick: () => alert("Launching details..."), children: slide.cta2 })
            ] })
          ] })
        },
        slide.id
      )) }),
      /* @__PURE__ */ jsx("div", { className: "nir-t-kl__carousel-indicators", children: slides.map((_, idx) => /* @__PURE__ */ jsx(
        "button",
        {
          className: `nir-t-kl__carousel-dot ${idx === activeSlide ? "nir-t-kl__carousel-dot--active" : ""}`,
          onClick: () => setActiveSlide(idx),
          "aria-label": `Go to slide ${idx + 1}`
        },
        idx
      )) })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "nir-t-kl__services-section", children: /* @__PURE__ */ jsxs("div", { className: "nir-t-kl__services-inner", children: [
      /* @__PURE__ */ jsxs("h3", { className: "nir-t-kl__section-title", children: [
        /* @__PURE__ */ jsx("span", { className: "nir-t-kl__section-indicator" }),
        "e-Sevanam Citizen Services Finder"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "nir-t-kl__services-search-row", children: /* @__PURE__ */ jsx(
        Input,
        {
          label: "Search Services",
          placeholder: "Search by certificate name or department (e.g. Income, Revenue, KSEB)...",
          value: serviceQuery,
          onChange: (e) => setServiceQuery(e.target.value),
          fullWidth: true
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "nir-t-kl__services-grid", children: filteredServices.length > 0 ? filteredServices.map((service) => /* @__PURE__ */ jsxs("div", { className: "nir-t-kl__service-card", onClick: () => alert(`Redirecting to e-Sevanam portal for: ${service.name}`), children: [
        /* @__PURE__ */ jsx("div", { className: "nir-t-kl__service-icon", children: service.icon }),
        /* @__PURE__ */ jsxs("div", { className: "nir-t-kl__service-info", children: [
          /* @__PURE__ */ jsx("h4", { className: "nir-t-kl__service-title", children: service.name }),
          /* @__PURE__ */ jsxs("span", { className: "nir-t-kl__service-dept", children: [
            service.dept,
            " Department"
          ] })
        ] })
      ] }, service.id)) : /* @__PURE__ */ jsx("p", { className: "nir-t-kl__empty-message", children: "No services found matching your keyword. Please try a different query." }) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "nir-t-kl__updates-section", children: /* @__PURE__ */ jsx("div", { className: "nir-t-kl__updates-inner", children: /* @__PURE__ */ jsxs("div", { className: "nir-t-kl__updates-layout", children: [
      /* @__PURE__ */ jsxs("div", { className: "nir-t-kl__orders-column", children: [
        /* @__PURE__ */ jsxs("h3", { className: "nir-t-kl__section-title", children: [
          /* @__PURE__ */ jsx("span", { className: "nir-t-kl__section-indicator" }),
          "Latest Government Orders & Circulars"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "nir-t-kl__tabs-bar", role: "tablist", "aria-label": "GO categories", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              role: "tab",
              "aria-selected": goCategory === "all",
              className: `nir-t-kl__tab-trigger ${goCategory === "all" ? "nir-t-kl__tab-trigger--active" : ""}`,
              onClick: () => setGoCategory("all"),
              children: "All GOs"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              role: "tab",
              "aria-selected": goCategory === "gad",
              className: `nir-t-kl__tab-trigger ${goCategory === "gad" ? "nir-t-kl__tab-trigger--active" : ""}`,
              onClick: () => setGoCategory("gad"),
              children: "General Administration"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              role: "tab",
              "aria-selected": goCategory === "finance",
              className: `nir-t-kl__tab-trigger ${goCategory === "finance" ? "nir-t-kl__tab-trigger--active" : ""}`,
              onClick: () => setGoCategory("finance"),
              children: "Finance"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              role: "tab",
              "aria-selected": goCategory === "health",
              className: `nir-t-kl__tab-trigger ${goCategory === "health" ? "nir-t-kl__tab-trigger--active" : ""}`,
              onClick: () => setGoCategory("health"),
              children: "Health"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "nir-t-kl__search-box-row", children: /* @__PURE__ */ jsx(
          Input,
          {
            label: "Search Government Orders",
            placeholder: "Filter by G.O. number or title keyword...",
            value: goQuery,
            onChange: (e) => setGoQuery(e.target.value),
            size: "sm",
            fullWidth: true
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "nir-t-kl__orders-list", children: filteredGOs.length > 0 ? filteredGOs.map((go) => /* @__PURE__ */ jsxs("article", { className: "nir-t-kl__order-card", children: [
          /* @__PURE__ */ jsxs("div", { className: "nir-t-kl__order-meta", children: [
            /* @__PURE__ */ jsx("span", { className: "nir-t-kl__order-date", children: go.date }),
            /* @__PURE__ */ jsx("span", { className: "nir-t-kl__order-badge", children: go.label }),
            go.isNew && /* @__PURE__ */ jsx("span", { className: "nir-t-kl__new-tag", children: "NEW" })
          ] }),
          /* @__PURE__ */ jsx("h4", { className: "nir-t-kl__order-title", children: /* @__PURE__ */ jsx("a", { href: "#", onClick: (e) => {
            e.preventDefault();
            alert(`Downloading G.O. PDF: ${go.number}`);
          }, children: go.title }) }),
          /* @__PURE__ */ jsxs("div", { className: "nir-t-kl__order-footer", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "Paper ID: ",
              go.number
            ] }),
            /* @__PURE__ */ jsx("button", { className: "nir-t-kl__order-dl-btn", onClick: () => alert(`Downloading: ${go.number}`), children: "Download (PDF)" })
          ] })
        ] }, go.id)) : /* @__PURE__ */ jsx("p", { className: "nir-t-kl__empty-message", children: "No government orders match your filter criteria." }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "nir-t-kl__media-column", children: [
        /* @__PURE__ */ jsxs("h3", { className: "nir-t-kl__section-title", children: [
          /* @__PURE__ */ jsx("span", { className: "nir-t-kl__section-indicator" }),
          "State Media Desk"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "nir-t-kl__tabs-bar", role: "tablist", "aria-label": "Media tab switcher", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              role: "tab",
              "aria-selected": galleryTab === "video",
              className: `nir-t-kl__tab-trigger ${galleryTab === "video" ? "nir-t-kl__tab-trigger--active" : ""}`,
              onClick: () => setGalleryTab("video"),
              children: "Conclave Video"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              role: "tab",
              "aria-selected": galleryTab === "photos",
              className: `nir-t-kl__tab-trigger ${galleryTab === "photos" ? "nir-t-kl__tab-trigger--active" : ""}`,
              onClick: () => setGalleryTab("photos"),
              children: "Scenic Photo Gallery"
            }
          )
        ] }),
        galleryTab === "video" ? /* @__PURE__ */ jsxs("div", { className: "nir-t-kl__video-card", children: [
          /* @__PURE__ */ jsxs("div", { className: "nir-t-kl__player-container", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: "/assets/kerala/video-thumbnail.png",
                alt: "Kerala conclave video thumbnail",
                className: "nir-t-kl__video-thumb"
              }
            ),
            !isVideoPlaying ? /* @__PURE__ */ jsx(
              "button",
              {
                className: "nir-t-kl__play-btn",
                onClick: () => setIsVideoPlaying(true),
                "aria-label": "Play conclave presentation",
                children: /* @__PURE__ */ jsx("svg", { className: "nir-t-kl__play-icon", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M8 5v14l11-7z" }) })
              }
            ) : /* @__PURE__ */ jsxs("div", { className: "nir-t-kl__player-overlay", children: [
              /* @__PURE__ */ jsxs("div", { className: "nir-t-kl__video-active-sign", children: [
                /* @__PURE__ */ jsx("span", { className: "nir-t-kl__live-pulse" }),
                /* @__PURE__ */ jsx("span", { children: "PLAYING KERALA CONCLAVE" })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: "nir-t-kl__pause-btn",
                  onClick: () => setIsVideoPlaying(false),
                  "aria-label": "Pause presentation",
                  children: /* @__PURE__ */ jsx("svg", { className: "nir-t-kl__pause-icon", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M6 19h4V5H6v14zm8-14v14h4V5h-4z" }) })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "nir-t-kl__player-controls", children: [
            /* @__PURE__ */ jsxs("span", { className: "nir-t-kl__player-time", children: [
              isVideoPlaying ? `00:${videoProgress.toString().padStart(2, "0")}` : "00:00",
              " / 01:40"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "nir-t-kl__progress-bg", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: "nir-t-kl__progress-fill",
                style: { width: `${isVideoPlaying ? videoProgress : 0}%` }
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "nir-t-kl__video-info", children: [
            /* @__PURE__ */ jsx("h4", { className: "nir-t-kl__video-title", children: "Kerala Developmental Conclave: Clean Energy" }),
            /* @__PURE__ */ jsx("p", { className: "nir-t-kl__video-desc-txt", children: "Highlights of state initiatives targeting solar grids, wind farming, and high-speed rural fiber networks." })
          ] })
        ] }) : /* @__PURE__ */ jsxs("div", { className: "nir-t-kl__photo-grid", children: [
          /* @__PURE__ */ jsxs("div", { className: "nir-t-kl__photo-card", children: [
            /* @__PURE__ */ jsx("img", { src: "/assets/kerala/banner-tourism.png", alt: "Kerala Houseboat sailing" }),
            /* @__PURE__ */ jsx("span", { className: "nir-t-kl__photo-label", children: "Alappuzha Backwaters Cruise" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "nir-t-kl__photo-card", children: [
            /* @__PURE__ */ jsx("img", { src: "/assets/kerala/banner-services.png", alt: "Citizen Services Portal map" }),
            /* @__PURE__ */ jsx("span", { className: "nir-t-kl__photo-label", children: "e-Sevanam digital dashboard" })
          ] })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx("footer", { className: "nir-t-kl__footer", children: /* @__PURE__ */ jsxs("div", { className: "nir-t-kl__footer-inner", children: [
      /* @__PURE__ */ jsxs("div", { className: "nir-t-kl__footer-grid", children: [
        /* @__PURE__ */ jsxs("div", { className: "nir-t-kl__footer-col", children: [
          /* @__PURE__ */ jsx("h5", { className: "nir-t-kl__footer-title", children: "State Profile" }),
          /* @__PURE__ */ jsx("p", { className: "nir-t-kl__footer-about", children: "The official state portal of the Government of Kerala. Providing transparent information, quick link access to public services, and official orders." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "nir-t-kl__footer-col", children: [
          /* @__PURE__ */ jsx("h5", { className: "nir-t-kl__footer-title", children: "Citizen Helpdesk" }),
          /* @__PURE__ */ jsxs("ul", { className: "nir-t-kl__footer-links", children: [
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#", children: "e-Sevanam Portal" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#", children: "Akshaya Service Centers" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#", children: "CM Grievance Cell" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#", children: "Utility bill gates" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "nir-t-kl__footer-col", children: [
          /* @__PURE__ */ jsx("h5", { className: "nir-t-kl__footer-title", children: "Departments" }),
          /* @__PURE__ */ jsxs("ul", { className: "nir-t-kl__footer-links", children: [
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#", children: "Revenue & Land Records" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#", children: "Health & Family Welfare" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#", children: "Local Self Government" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#", children: "General Administration" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "nir-t-kl__footer-col", children: [
          /* @__PURE__ */ jsx("h5", { className: "nir-t-kl__footer-title", children: "helplines" }),
          /* @__PURE__ */ jsxs("ul", { className: "nir-t-kl__footer-links", children: [
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("span", { children: "Citizen Call Center:" }),
              " 155300 (Toll-Free)"
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("span", { children: "District Helpdesk:" }),
              " 0471-2335522"
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("span", { children: "Email Assistance:" }),
              " stateportal.itsd@kerala.gov.in"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "nir-t-kl__footer-meta", children: [
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("span", { children: "\xA9 2026 Government of Kerala. Managed by IT Department & National Informatics Centre." }) }),
        /* @__PURE__ */ jsxs("div", { className: "nir-t-kl__footer-compliance", children: [
          /* @__PURE__ */ jsx("span", { className: "nir-t-kl__compliance-badge", children: "GIGW 3.0 COMPLIANT" }),
          /* @__PURE__ */ jsx("span", { className: "nir-t-kl__compliance-badge", children: "WCAG AAA ACCESSIBILITY" }),
          /* @__PURE__ */ jsx("a", { href: "#", style: { color: "rgba(255,255,255,0.7)", marginLeft: "16px" }, onClick: (e) => {
            e.preventDefault();
            alert("Website Policies loaded.");
          }, children: "Website Policies" })
        ] })
      ] })
    ] }) })
  ] });
}
function KeralaTemplate(props) {
  const [containerRef, setContainerRef] = useState(null);
  return /* @__PURE__ */ jsx("div", { ref: setContainerRef, className: "nir-t-kl-wrapper", style: { width: "100%" }, children: containerRef && /* @__PURE__ */ jsx(NirmanProvider, { defaultBrand: "kl", defaultTheme: "light", rootElement: containerRef, children: /* @__PURE__ */ jsx(KeralaPortalInner, { ...props }) }) });
}

export { Autocomplete, Button, Checkbox, Dropdown, EducationTemplate, EmptyStateTemplate, Input, KeralaTemplate, LoginTemplate, NirmanProvider, PfrdaTemplate, Radio, RadioGroup, SettingsTemplate, Toggle, useNirman };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map