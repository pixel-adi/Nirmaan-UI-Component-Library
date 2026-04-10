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
  size = "md",
  fullWidth = false,
  disabled = false,
  minChars = 1,
  maxResults = 10,
  name,
  noResultsText = "No matches found"
}) {
  const id = react.useId();
  const listboxId = id + "-listbox";
  const labelId = id + "-label";
  const helperId = helperText ? id + "-helper" : void 0;
  const errorId = error ? id + "-error" : void 0;
  const describedBy = [errorId, helperId].filter(Boolean).join(" ") || void 0;
  const selectedOption = options.find((o) => o.value === value);
  const [inputValue, setInputValue] = react.useState(selectedOption?.label || "");
  const [open, setOpen] = react.useState(false);
  const [activeIndex, setActiveIndex] = react.useState(-1);
  const inputRef = react.useRef(null);
  const listboxRef = react.useRef(null);
  react.useEffect(() => {
    if (value) {
      const opt = options.find((o) => o.value === value);
      if (opt) setInputValue(opt.label);
    } else {
      setInputValue("");
    }
  }, [value, options]);
  const filteredOptions = react.useMemo(() => {
    if (inputValue.length < minChars) return [];
    const query = inputValue.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(query)).slice(0, maxResults);
  }, [inputValue, options, minChars, maxResults]);
  const close = react.useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, []);
  const handleSelect = (option) => {
    setInputValue(option.label);
    onChange?.(option.value);
    close();
    inputRef.current?.focus();
  };
  const handleInputChange = (e) => {
    const next = e.target.value;
    setInputValue(next);
    setOpen(next.length >= minChars);
    setActiveIndex(-1);
    if (next === "" && value) {
      onChange?.(null);
    }
  };
  const handleKeyDown = (e) => {
    if (disabled) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open && inputValue.length >= minChars) setOpen(true);
        setActiveIndex((i) => (i + 1) % Math.max(filteredOptions.length, 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!open) return;
        setActiveIndex((i) => i <= 0 ? filteredOptions.length - 1 : i - 1);
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
    const handleClick = (e) => {
      const target = e.target;
      if (inputRef.current && !inputRef.current.contains(target) && listboxRef.current && !listboxRef.current.contains(target)) {
        close();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, close]);
  const showNoResults = open && inputValue.length >= minChars && filteredOptions.length === 0;
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      className: [
        "nir-e-autocomplete",
        "nir-e-autocomplete--" + size,
        fullWidth ? "nir-e-autocomplete--full" : "",
        error ? "nir-e-autocomplete--error" : "",
        disabled ? "nir-e-autocomplete--disabled" : "",
        open ? "nir-e-autocomplete--open" : ""
      ].filter(Boolean).join(" "),
      children: [
        /* @__PURE__ */ jsxRuntime.jsx("label", { className: "nir-e-autocomplete__label", id: labelId, htmlFor: id, children: label }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "nir-e-autocomplete__wrapper", children: [
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
              "aria-activedescendant": activeIndex >= 0 ? id + "-option-" + activeIndex : void 0,
              "aria-describedby": describedBy,
              "aria-invalid": error ? true : void 0,
              value: inputValue,
              onChange: handleInputChange,
              onKeyDown: handleKeyDown,
              onFocus: () => inputValue.length >= minChars && setOpen(true),
              placeholder,
              disabled,
              autoComplete: "off"
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsxs("svg", { className: "nir-e-autocomplete__icon", viewBox: "0 0 20 20", "aria-hidden": "true", children: [
            /* @__PURE__ */ jsxRuntime.jsx("circle", { cx: "9", cy: "9", r: "6", stroke: "currentColor", strokeWidth: "2", fill: "none" }),
            /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M14 14l4 4", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" })
          ] }),
          open && (filteredOptions.length > 0 || showNoResults) && /* @__PURE__ */ jsxRuntime.jsxs(
            "ul",
            {
              ref: listboxRef,
              id: listboxId,
              className: "nir-e-autocomplete__menu",
              role: "listbox",
              "aria-labelledby": labelId,
              children: [
                filteredOptions.map((option, index) => {
                  const isActive = index === activeIndex;
                  const isSelected = option.value === value;
                  return /* @__PURE__ */ jsxRuntime.jsxs(
                    "li",
                    {
                      id: id + "-option-" + index,
                      className: [
                        "nir-e-autocomplete__option",
                        isSelected ? "nir-e-autocomplete__option--selected" : "",
                        isActive ? "nir-e-autocomplete__option--active" : ""
                      ].filter(Boolean).join(" "),
                      role: "option",
                      "aria-selected": isSelected,
                      onClick: () => handleSelect(option),
                      onMouseEnter: () => setActiveIndex(index),
                      children: [
                        /* @__PURE__ */ jsxRuntime.jsx(HighlightedLabel, { text: option.label, query: inputValue }),
                        option.description && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "nir-e-autocomplete__option-description", children: option.description })
                      ]
                    },
                    option.value
                  );
                }),
                showNoResults && /* @__PURE__ */ jsxRuntime.jsx("li", { className: "nir-e-autocomplete__no-results", role: "option", "aria-selected": "false", children: noResultsText })
              ]
            }
          ),
          name && /* @__PURE__ */ jsxRuntime.jsx("input", { type: "hidden", name, value: value || "" })
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

exports.Autocomplete = Autocomplete;
exports.Button = Button;
exports.Checkbox = Checkbox;
exports.Dropdown = Dropdown;
exports.Input = Input;
exports.NirmanProvider = NirmanProvider;
exports.Radio = Radio;
exports.RadioGroup = RadioGroup;
exports.Toggle = Toggle;
exports.useNirman = useNirman;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map