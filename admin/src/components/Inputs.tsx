// admin\src\components\Inputs.tsx
'use client';
import React from 'react';
import { useState, useEffect } from "react";

// ❗ BASE STYLE
const baseClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500";

// ❗ ERROR STYLE
const errorClasses = "border-red-500";

// ------------------------------------------------------------
// TEXTAREA
// ------------------------------------------------------------
export function TextArea({ label, name, value, onChange, error }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={4}
        className={`${baseClasses} ${error ? errorClasses : ""}`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

// ------------------------------------------------------------
// TEXT INPUT
// ------------------------------------------------------------
export function TextInput({ label, name, value, onChange, error }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className={`${baseClasses} ${error ? errorClasses : ""}`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

// ------------------------------------------------------------
// NUMBER INPUT
// ------------------------------------------------------------
export function NumberInput({ label, name, value, onChange, error }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        className={`${baseClasses} ${error ? errorClasses : ""}`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

// ------------------------------------------------------------
// URL INPUT
// ------------------------------------------------------------
export function UrlInput({ label, name, value, onChange, error }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="url"
        name={name}
        value={value}
        onChange={onChange}
        className={`${baseClasses} ${error ? errorClasses : ""}`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

// ------------------------------------------------------------
// CHECKBOX
// ------------------------------------------------------------
export function CheckBox({ label, name, checked, onChange }: any) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
      />
      <label className="ml-2 text-sm text-gray-700">{label}</label>
    </div>
  );
}

// ------------------------------------------------------------
// COMMA SEPARATED INPUT
// ------------------------------------------------------------
interface CommaSeparatedInputProps {
  label: string;
  name: string;
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function CommaSeparatedInput({
  label,
  name,
  value,
  onChange,
  placeholder = "Type items separated by commas",
  className = "",
}: CommaSeparatedInputProps) {
  
  const [currentInputText, setCurrentInputText] = useState(() => value.join(", "));
  const [isFocused, setIsFocused] = useState(false);
  useEffect(() => {
    if (isFocused) return;
    const formattedText = value.join(", ");
    if (currentInputText !== formattedText) setCurrentInputText(formattedText);
  }, [value, isFocused]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setCurrentInputText(text); 
    const items = text.split(",").map((item) => item.trim()).filter(Boolean);
    onChange(items);
  };
  
  const handleBlur = () => {
      setIsFocused(false);
      const formattedText = value.join(", ");
      if (currentInputText !== formattedText) setCurrentInputText(formattedText);
  };
  
  const handleFocus = () => { setIsFocused(true); };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        name={name}
        value={currentInputText}
        onChange={handleChange}
        onFocus={handleFocus} // Added
        onBlur={handleBlur}   // Modified
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}

// ------------------------------------------------------------
// ENTER SEPARATED INPUT (Textarea-based)
// ------------------------------------------------------------
interface EnterSeparatedInputProps {
  label: string;
  name: string;
  value: string[];
  onChange: (values: string[]) => void;
  rows?: number;
  placeholder?: string;
  error?: string;
}

export function EnterSeparatedInput({
  label,
  name,
  value,
  onChange,
  rows = 4,
  placeholder = "One item per line",
  error,
}: EnterSeparatedInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      <textarea
        name={name}
        rows={rows}
        value={value.join("\n")}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(
            e.target.value
              .split("\n")
              .map((v) => v.trim())
              .filter(Boolean)
          )
        }
        className={`${baseClasses} ${error ? errorClasses : ""}`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}


interface BaseInputProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
}

// Helper function to consolidate shared styling logic (optional but cleaner)
const getInputClasses = (error: string | undefined, disabled: boolean | undefined) => {
  const errorStyles = error ? errorClasses : "";
  const disabledStyles = disabled 
    ? "bg-gray-100 disabled:cursor-not-allowed" 
    : "bg-white"; // Assuming default background is white when not disabled
  
  return `${baseClasses} ${errorStyles} ${disabledStyles}`;
};

// ------------------------------------------------------------
// YEAR INPUT (Uses type="number")
// ------------------------------------------------------------
export function YearInput({ label, name, value, onChange, error, disabled }: BaseInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        min="1900"
        max="2100"
        step="1"
        disabled={disabled} // <-- Pass disabled prop
        className={getInputClasses(error, disabled)}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

// ------------------------------------------------------------
// YEAR AND MONTH INPUT (Uses type="month")
// ------------------------------------------------------------
export function YearMonthInput({ label, name, value, onChange, error, disabled }: BaseInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="month"
        name={name}
        value={value} 
        onChange={onChange}
        disabled={disabled} // <-- Pass disabled prop
        className={getInputClasses(error, disabled)}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

// ------------------------------------------------------------
// FULL DATE INPUT (Uses type="date")
// ------------------------------------------------------------
export function DateInput({ label, name, value, onChange, error, disabled }: BaseInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="date"
        name={name}
        // Use the OR operator for initial empty state, similar to your original code
        value={value || ""} 
        onChange={onChange}
        disabled={disabled} // <-- Pass disabled prop
        className={getInputClasses(error, disabled)}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

// ------------------------------------------------------------
// SELECT INPUT (Reusable)
// ------------------------------------------------------------
export function SelectInput({ label, name, value, onChange, error, options}: {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  options: string[] | Record<string, string>;
}) {
  const parsedOptions: Record<string, string> = Array.isArray(options)
    ? options.reduce((acc: Record<string, string>, item: string) => {
        acc[item] = item;
        return acc;
      }, {})
    : options;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select name={name} value={value} onChange={onChange} className={`w-full border p-2 rounded ${error ? "border-red-500" : ""}`} >
        {Object.entries(parsedOptions).map(([val, text]) => (
          <option key={val} value={val}>{text}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
