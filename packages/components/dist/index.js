'use strict';

var react = require('react');
var jsxRuntime = require('react/jsx-runtime');

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
  const id = react.useId();
  const listboxId = id + "-listbox";
  const labelId = id + "-label";
  const helperId = helperText ? id + "-helper" : void 0;
  const errorId = error ? id + "-error" : void 0;
  const describedBy = [errorId, helperId].filter(Boolean).join(" ") || void 0;
  const selectedOption = options.find((o) => o.value === value);
  const [inputValue, setInputValue] = react.useState(selectedOption?.label ?? "");
  const [open, setOpen] = react.useState(false);
  const [activeIndex, setActiveIndex] = react.useState(-1);
  const inputRef = react.useRef(null);
  const listboxRef = react.useRef(null);
  const wrapperRef = react.useRef(null);
  react.useEffect(() => {
    const opt = options.find((o) => o.value === value);
    setInputValue(opt?.label ?? "");
  }, [value, options]);
  const filteredOptions = react.useMemo(() => {
    if (inputValue.length < minChars) return [];
    const q = inputValue.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q)).slice(0, maxResults);
  }, [inputValue, options, minChars, maxResults]);
  const close = react.useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, []);
  const handleSelect = react.useCallback(
    (option) => {
      setInputValue(option.label);
      onChange?.(option.value);
      close();
      requestAnimationFrame(() => inputRef.current?.focus());
    },
    [onChange, close]
  );
  const handleClear = react.useCallback(
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
  react.useEffect(() => {
    if (!open) return;
    const onMouseDown = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        close();
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open, close]);
  react.useEffect(() => {
    if (!listboxRef.current || activeIndex < 0) return;
    const item = listboxRef.current.querySelector(
      `[id="${id}-option-${activeIndex}"]`
    );
    item?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, id]);
  const showNoResults = open && inputValue.length >= minChars && filteredOptions.length === 0;
  const showClear = clearable && inputValue.length > 0 && !disabled;
  return /* @__PURE__ */ jsxRuntime.jsxs(
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
        /* @__PURE__ */ jsxRuntime.jsx("label", { className: "nir-e-autocomplete__label", id: labelId, htmlFor: id, children: label }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "nir-e-autocomplete__wrapper", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("svg", { className: "nir-e-autocomplete__icon", viewBox: "0 0 20 20", "aria-hidden": "true", children: [
            /* @__PURE__ */ jsxRuntime.jsx("circle", { cx: "8.5", cy: "8.5", r: "5.5", stroke: "currentColor", strokeWidth: "1.8", fill: "none" }),
            /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M13 13l3.5 3.5", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round" })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx(
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
          showClear && /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              type: "button",
              className: "nir-e-autocomplete__clear",
              "aria-label": "Clear",
              tabIndex: -1,
              onMouseDown: handleClear,
              children: /* @__PURE__ */ jsxRuntime.jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntime.jsx(
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
          open && (filteredOptions.length > 0 || showNoResults) && /* @__PURE__ */ jsxRuntime.jsxs(
            "ul",
            {
              ref: listboxRef,
              id: listboxId,
              className: "nir-e-autocomplete__menu",
              role: "listbox",
              "aria-labelledby": labelId,
              children: [
                /* @__PURE__ */ jsxRuntime.jsxs("li", { role: "presentation", className: "nir-e-autocomplete__sr-count", "aria-live": "polite", children: [
                  filteredOptions.length,
                  " result",
                  filteredOptions.length !== 1 ? "s" : ""
                ] }),
                filteredOptions.map((option, index) => {
                  const isActive = index === activeIndex;
                  const isSelected = option.value === value;
                  return /* @__PURE__ */ jsxRuntime.jsxs(
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
                        /* @__PURE__ */ jsxRuntime.jsx(HighlightedLabel, { text: option.label, query: inputValue }),
                        option.description && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "nir-e-autocomplete__option-description", children: option.description })
                      ]
                    },
                    option.value
                  );
                }),
                showNoResults && /* @__PURE__ */ jsxRuntime.jsx(
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
          name && /* @__PURE__ */ jsxRuntime.jsx("input", { type: "hidden", name, value: value ?? "" })
        ] }),
        error && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "nir-e-autocomplete__error", id: errorId, role: "alert", children: error }),
        helperText && !error && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "nir-e-autocomplete__helper", id: helperId, children: helperText })
      ]
    }
  );
}
Autocomplete.displayName = "NirAutocomplete";
function HighlightedLabel({ text, query }) {
  if (!query) return /* @__PURE__ */ jsxRuntime.jsx("span", { className: "nir-e-autocomplete__option-label", children: text });
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const idx = lowerText.indexOf(lowerQuery);
  if (idx === -1) return /* @__PURE__ */ jsxRuntime.jsx("span", { className: "nir-e-autocomplete__option-label", children: text });
  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + query.length);
  const after = text.slice(idx + query.length);
  return /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "nir-e-autocomplete__option-label", children: [
    before,
    /* @__PURE__ */ jsxRuntime.jsx("mark", { className: "nir-e-autocomplete__match", children: match }),
    after
  ] });
}
var Button = react.forwardRef(
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
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "button",
      {
        ref,
        className: classes,
        disabled: isDisabled,
        "aria-disabled": isDisabled || void 0,
        "aria-busy": loading || void 0,
        ...rest,
        children: [
          loading && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "nir-e-button__spinner", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntime.jsx("svg", { viewBox: "0 0 20 20", fill: "none", className: "nir-e-button__spinner-svg", children: /* @__PURE__ */ jsxRuntime.jsx(
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
          !loading && iconLeft && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "nir-e-button__icon", "aria-hidden": "true", children: iconLeft }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "nir-e-button__label", children }),
          !loading && iconRight && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "nir-e-button__icon", "aria-hidden": "true", children: iconRight }),
          loading && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "nir-sr-only", children: "Loading, please wait" })
        ]
      }
    );
  }
);
Button.displayName = "NirButton";
var Checkbox = react.forwardRef(
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
    const generatedId = react.useId();
    const inputId = externalId || generatedId;
    const helperId = helperText ? inputId + "-helper" : void 0;
    const errorId = error ? inputId + "-error" : void 0;
    const describedBy = [errorId, helperId].filter(Boolean).join(" ") || void 0;
    const internalRef = react.useRef(null);
    react.useEffect(() => {
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
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: wrapperClasses, children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "nir-e-checkbox__control", children: [
        /* @__PURE__ */ jsxRuntime.jsx(
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
        /* @__PURE__ */ jsxRuntime.jsxs("svg", { className: "nir-e-checkbox__box", viewBox: "0 0 20 20", "aria-hidden": "true", children: [
          /* @__PURE__ */ jsxRuntime.jsx("rect", { className: "nir-e-checkbox__bg", x: "1", y: "1", width: "18", height: "18", rx: "3" }),
          /* @__PURE__ */ jsxRuntime.jsx("path", { className: "nir-e-checkbox__check", d: "M5 10l3 3 7-7", fill: "none", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }),
          /* @__PURE__ */ jsxRuntime.jsx("line", { className: "nir-e-checkbox__dash", x1: "5", y1: "10", x2: "15", y2: "10", strokeWidth: "2", strokeLinecap: "round" })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx("label", { className: "nir-e-checkbox__label", htmlFor: inputId, children: label })
      ] }),
      error && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "nir-e-checkbox__error", id: errorId, role: "alert", children: error }),
      helperText && !error && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "nir-e-checkbox__helper", id: helperId, children: helperText })
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
  const id = react.useId();
  const listboxId = id + "-listbox";
  const labelId = id + "-label";
  const helperId = helperText ? id + "-helper" : void 0;
  const errorId = error ? id + "-error" : void 0;
  const describedBy = [errorId, helperId].filter(Boolean).join(" ") || void 0;
  const [open, setOpen] = react.useState(false);
  const [activeIndex, setActiveIndex] = react.useState(-1);
  const triggerRef = react.useRef(null);
  const listboxRef = react.useRef(null);
  const selectedOption = options.find((o) => o.value === value);
  options.filter((o) => !o.disabled);
  const close = react.useCallback(() => {
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
  react.useEffect(() => {
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
  return /* @__PURE__ */ jsxRuntime.jsxs(
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
        /* @__PURE__ */ jsxRuntime.jsx("label", { className: "nir-e-dropdown__label", id: labelId, htmlFor: id, children: label }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "nir-e-dropdown__wrapper", children: [
          /* @__PURE__ */ jsxRuntime.jsxs(
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
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: "nir-e-dropdown__value", children: selectedOption ? selectedOption.label : /* @__PURE__ */ jsxRuntime.jsx("span", { className: "nir-e-dropdown__placeholder", children: placeholder }) }),
                /* @__PURE__ */ jsxRuntime.jsx("svg", { className: "nir-e-dropdown__chevron", viewBox: "0 0 20 20", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M5 8l5 5 5-5", stroke: "currentColor", strokeWidth: "2", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }) })
              ]
            }
          ),
          open && /* @__PURE__ */ jsxRuntime.jsx(
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
                return /* @__PURE__ */ jsxRuntime.jsxs(
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
                      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "nir-e-dropdown__option-label", children: option.label }),
                      option.description && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "nir-e-dropdown__option-description", children: option.description }),
                      isSelected && /* @__PURE__ */ jsxRuntime.jsx("svg", { className: "nir-e-dropdown__check", viewBox: "0 0 20 20", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M5 10l3 3 7-7", stroke: "currentColor", strokeWidth: "2", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }) })
                    ]
                  },
                  option.value
                );
              })
            }
          ),
          name && /* @__PURE__ */ jsxRuntime.jsx("input", { type: "hidden", name, value: value || "" })
        ] }),
        error && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "nir-e-dropdown__error", id: errorId, role: "alert", children: error }),
        helperText && !error && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "nir-e-dropdown__helper", id: helperId, children: helperText })
      ]
    }
  );
}
Dropdown.displayName = "NirDropdown";
var Input = react.forwardRef(
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
    const generatedId = react.useId();
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
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: wrapperClasses, children: [
      /* @__PURE__ */ jsxRuntime.jsx("label", { className: "nir-e-input__label", htmlFor: inputId, children: label }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "nir-e-input__field-wrapper", children: [
        iconLeft && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "nir-e-input__icon nir-e-input__icon--left", "aria-hidden": "true", children: iconLeft }),
        /* @__PURE__ */ jsxRuntime.jsx(
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
        iconRight && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "nir-e-input__icon nir-e-input__icon--right", "aria-hidden": "true", children: iconRight })
      ] }),
      error && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "nir-e-input__error", id: errorId, role: "alert", children: error }),
      helperText && !error && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "nir-e-input__helper", id: helperId, children: helperText })
    ] });
  }
);
Input.displayName = "NirInput";
var RadioGroupContext = react.createContext(null);
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
  const labelId = react.useId();
  const helperId = helperText ? labelId + "-helper" : void 0;
  const errorId = error ? labelId + "-error" : void 0;
  const describedBy = [errorId, helperId].filter(Boolean).join(" ") || void 0;
  return /* @__PURE__ */ jsxRuntime.jsx(RadioGroupContext.Provider, { value: { name, value, onChange, disabled, size }, children: /* @__PURE__ */ jsxRuntime.jsxs(
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
        /* @__PURE__ */ jsxRuntime.jsx("legend", { className: "nir-e-radio-group__legend", id: labelId, children: label }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "nir-e-radio-group__options", children }),
        error && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "nir-e-radio-group__error", id: errorId, role: "alert", children: error }),
        helperText && !error && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "nir-e-radio-group__helper", id: helperId, children: helperText })
      ]
    }
  ) });
}
RadioGroup.displayName = "NirRadioGroup";
var Radio = react.forwardRef(
  ({
    label,
    value,
    size: sizeProp,
    disabled: disabledProp,
    className = "",
    id: externalId,
    ...rest
  }, ref) => {
    const group = react.useContext(RadioGroupContext);
    const generatedId = react.useId();
    const inputId = externalId || generatedId;
    const size = sizeProp || group?.size || "md";
    const disabled = disabledProp || group?.disabled || false;
    const isChecked = group?.value === value;
    const name = group?.name || rest.name || "";
    const handleChange = () => {
      if (group?.onChange) group.onChange(value);
    };
    return /* @__PURE__ */ jsxRuntime.jsx("div", { className: [
      "nir-e-radio",
      "nir-e-radio--" + size,
      disabled ? "nir-e-radio--disabled" : "",
      className
    ].filter(Boolean).join(" "), children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "nir-e-radio__control", children: [
      /* @__PURE__ */ jsxRuntime.jsx(
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
      /* @__PURE__ */ jsxRuntime.jsxs("svg", { className: "nir-e-radio__circle", viewBox: "0 0 20 20", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsxRuntime.jsx("circle", { className: "nir-e-radio__outer", cx: "10", cy: "10", r: "9" }),
        /* @__PURE__ */ jsxRuntime.jsx("circle", { className: "nir-e-radio__inner", cx: "10", cy: "10", r: "5" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx("label", { className: "nir-e-radio__label", htmlFor: inputId, children: label })
    ] }) });
  }
);
Radio.displayName = "NirRadio";
var Toggle = react.forwardRef(
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
    const generatedId = react.useId();
    const inputId = externalId || generatedId;
    const descId = description ? inputId + "-desc" : void 0;
    return /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        className: [
          "nir-e-toggle",
          "nir-e-toggle--" + size,
          "nir-e-toggle--label-" + labelPosition,
          disabled ? "nir-e-toggle--disabled" : "",
          className
        ].filter(Boolean).join(" "),
        children: /* @__PURE__ */ jsxRuntime.jsxs("label", { className: "nir-e-toggle__control", htmlFor: inputId, children: [
          labelPosition === "left" && /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "nir-e-toggle__text", children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "nir-e-toggle__label", children: label }),
            description && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "nir-e-toggle__description", id: descId, children: description })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "nir-e-toggle__switch", children: [
            /* @__PURE__ */ jsxRuntime.jsx(
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
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "nir-e-toggle__track", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "nir-e-toggle__thumb" }) })
          ] }),
          labelPosition === "right" && /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "nir-e-toggle__text", children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "nir-e-toggle__label", children: label }),
            description && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "nir-e-toggle__description", id: descId, children: description })
          ] })
        ] })
      }
    );
  }
);
Toggle.displayName = "NirToggle";
var NirmanContext = react.createContext(null);
function NirmanProvider({
  children,
  defaultTheme = "light",
  defaultDensity = "default",
  defaultBrand = "nirman",
  rootElement
}) {
  const [theme, setTheme] = react.useState(defaultTheme);
  const [density, setDensity] = react.useState(defaultDensity);
  const [brand, setBrand] = react.useState(defaultBrand);
  const toggleTheme = react.useCallback(() => {
    setTheme((prev) => prev === "light" ? "dark" : "light");
  }, []);
  react.useEffect(() => {
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
  react.useEffect(() => {
    if (defaultTheme) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => setTheme(e.matches ? "dark" : "light");
    mq.addEventListener("change", handler);
    if (mq.matches) setTheme("dark");
    return () => mq.removeEventListener("change", handler);
  }, [defaultTheme]);
  return /* @__PURE__ */ jsxRuntime.jsx(
    NirmanContext.Provider,
    {
      value: { theme, setTheme, toggleTheme, density, setDensity, brand, setBrand },
      children
    }
  );
}
function useNirman() {
  const ctx = react.useContext(NirmanContext);
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
  const [email, setEmail] = react.useState("");
  const [password, setPassword] = react.useState("");
  const [remember, setRemember] = react.useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin?.(email, password, remember);
  };
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "nir-t-login", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "nir-t-login__container", children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "nir-t-login__header", children: [
      logo && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "nir-t-login__logo", children: logo }),
      /* @__PURE__ */ jsxRuntime.jsx("h1", { className: "nir-t-login__title", children: title }),
      /* @__PURE__ */ jsxRuntime.jsx("p", { className: "nir-t-login__subtitle", children: subtitle })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("form", { className: "nir-t-login__form", onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "nir-t-login__fields", children: [
        /* @__PURE__ */ jsxRuntime.jsx(
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
        /* @__PURE__ */ jsxRuntime.jsx(
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
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "nir-t-login__actions", children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          Checkbox,
          {
            label: "Remember me",
            checked: remember,
            onChange: (e) => setRemember(e.target.checked)
          }
        ),
        onForgotPassword && /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            type: "button",
            className: "nir-t-login__link",
            onClick: onForgotPassword,
            children: "Forgot password?"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx(
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
    onSignUp && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "nir-t-login__footer", children: [
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "nir-t-login__footer-text", children: "Don't have an account?" }),
      /* @__PURE__ */ jsxRuntime.jsx(
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
  const [formData, setFormData] = react.useState(initialData);
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
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "nir-t-settings", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "nir-t-settings__container", children: [
    /* @__PURE__ */ jsxRuntime.jsx("aside", { className: "nir-t-settings__sidebar", children: /* @__PURE__ */ jsxRuntime.jsxs("nav", { className: "nir-t-settings__nav", children: [
      /* @__PURE__ */ jsxRuntime.jsx("a", { href: "#profile", className: "nir-t-settings__nav-item nir-t-settings__nav-item--active", children: "Profile" }),
      /* @__PURE__ */ jsxRuntime.jsx("a", { href: "#notifications", className: "nir-t-settings__nav-item", children: "Notifications" }),
      /* @__PURE__ */ jsxRuntime.jsx("a", { href: "#security", className: "nir-t-settings__nav-item", children: "Security" }),
      /* @__PURE__ */ jsxRuntime.jsx("a", { href: "#billing", className: "nir-t-settings__nav-item", children: "Billing" })
    ] }) }),
    /* @__PURE__ */ jsxRuntime.jsxs("main", { className: "nir-t-settings__main", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "nir-t-settings__header", children: [
        /* @__PURE__ */ jsxRuntime.jsx("h1", { className: "nir-t-settings__title", children: title }),
        /* @__PURE__ */ jsxRuntime.jsx("p", { className: "nir-t-settings__subtitle", children: subtitle })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("form", { className: "nir-t-settings__form", onSubmit: handleSubmit, children: [
        /* @__PURE__ */ jsxRuntime.jsxs("section", { className: "nir-t-settings__section", children: [
          /* @__PURE__ */ jsxRuntime.jsx("h2", { className: "nir-t-settings__section-title", children: "Personal Information" }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "nir-t-settings__grid", children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              Input,
              {
                label: "First Name",
                placeholder: "e.g. Jane",
                value: formData.firstName,
                onChange: handleInputChange("firstName"),
                fullWidth: true
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
              Input,
              {
                label: "Last Name",
                placeholder: "e.g. Doe",
                value: formData.lastName,
                onChange: handleInputChange("lastName"),
                fullWidth: true
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "nir-t-settings__grid-full", children: /* @__PURE__ */ jsxRuntime.jsx(
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
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "nir-t-settings__grid-full", children: /* @__PURE__ */ jsxRuntime.jsx(
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
        /* @__PURE__ */ jsxRuntime.jsx("hr", { className: "nir-t-settings__divider" }),
        /* @__PURE__ */ jsxRuntime.jsxs("section", { className: "nir-t-settings__section", children: [
          /* @__PURE__ */ jsxRuntime.jsx("h2", { className: "nir-t-settings__section-title", children: "Email Notifications" }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "nir-t-settings__toggles", children: [
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "nir-t-settings__toggle-row", children: [
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "nir-t-settings__toggle-info", children: [
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: "nir-t-settings__toggle-label", children: "Marketing emails" }),
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: "nir-t-settings__toggle-desc", children: "Receive updates about new features and promotions." })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsx(
                Toggle,
                {
                  label: "Toggle Marketing Emails",
                  checked: formData.marketingEmails,
                  onChange: handleToggleChange("marketingEmails")
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "nir-t-settings__toggle-row", children: [
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "nir-t-settings__toggle-info", children: [
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: "nir-t-settings__toggle-label", children: "Security alerts" }),
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: "nir-t-settings__toggle-desc", children: "Get notified when there's suspicious activity on your account." })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsx(
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
        /* @__PURE__ */ jsxRuntime.jsx("hr", { className: "nir-t-settings__divider" }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "nir-t-settings__actions", children: [
          /* @__PURE__ */ jsxRuntime.jsx(Button, { type: "button", variant: "secondary", children: "Cancel" }),
          /* @__PURE__ */ jsxRuntime.jsx(Button, { type: "submit", variant: "primary", disabled: isSaving, children: isSaving ? "Saving changes..." : "Save changes" })
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
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "nir-t-empty-state", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "nir-t-empty-state__content", children: [
    graphic && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "nir-t-empty-state__graphic", children: graphic }),
    /* @__PURE__ */ jsxRuntime.jsx("h2", { className: "nir-t-empty-state__title", children: title }),
    description && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "nir-t-empty-state__description", children: description }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "nir-t-empty-state__actions", children: [
      actionText && /* @__PURE__ */ jsxRuntime.jsx(
        Button,
        {
          variant: "primary",
          size: "lg",
          onClick: onAction,
          children: actionText
        }
      ),
      secondaryActionText && /* @__PURE__ */ jsxRuntime.jsx(
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

exports.Autocomplete = Autocomplete;
exports.Button = Button;
exports.Checkbox = Checkbox;
exports.Dropdown = Dropdown;
exports.EmptyStateTemplate = EmptyStateTemplate;
exports.Input = Input;
exports.LoginTemplate = LoginTemplate;
exports.NirmanProvider = NirmanProvider;
exports.Radio = Radio;
exports.RadioGroup = RadioGroup;
exports.SettingsTemplate = SettingsTemplate;
exports.Toggle = Toggle;
exports.useNirman = useNirman;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map