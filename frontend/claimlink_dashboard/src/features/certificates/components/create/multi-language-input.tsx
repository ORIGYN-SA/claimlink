/**
 * MultiLanguageInput Component
 *
 * A text input component that supports multiple languages.
 * When a template has multiple languages, this shows language tabs
 * allowing users to enter values in each language.
 *
 * Usage:
 * ```tsx
 * <MultiLanguageInput
 *   languages={[{ code: 'en', name: 'English', isDefault: true }, { code: 'it', name: 'Italian' }]}
 *   value={{ en: 'Hello', it: 'Ciao' }}
 *   onChange={(value) => console.log(value)} // { en: '...', it: '...' }
 *   placeholder="Enter text..."
 * />
 * ```
 */

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { TemplateLanguage } from '@/features/templates/types/template.types';

export interface LocalizedValue {
  [languageCode: string]: string;
}

export interface MultiLanguageInputProps {
  /** Available languages from template */
  languages: TemplateLanguage[];
  /** Current localized value */
  value: LocalizedValue;
  /** Called when any language value changes */
  onChange: (value: LocalizedValue) => void;
  /** Called when input loses focus */
  onBlur?: () => void;
  /** Placeholder text */
  placeholder?: string;
  /** Whether to use textarea instead of input */
  multiline?: boolean;
  /** Number of rows for textarea */
  rows?: number;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether the input has an error */
  hasError?: boolean;
  /** ID for the input element */
  id?: string;
  /** Additional class name */
  className?: string;
}

/**
 * Language tab button component
 */
function LanguageTab({
  language,
  isActive,
  isRequired,
  hasValue,
  onClick,
}: {
  language: TemplateLanguage;
  isActive: boolean;
  isRequired: boolean;
  hasValue: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 text-xs font-medium rounded-t-md transition-colors border-b-2',
        isActive
          ? 'bg-white text-[#222526] border-[#615bff]'
          : 'bg-[#f5f5f5] text-[#69737c] border-transparent hover:bg-[#e8e8e8]',
        !hasValue && !isActive && 'opacity-60'
      )}
    >
      {language.name}
      {isRequired && language.isDefault && (
        <span className="text-red-500 ml-0.5">*</span>
      )}
      {hasValue && !isActive && (
        <span className="ml-1 w-1.5 h-1.5 rounded-full bg-[#50be8f] inline-block" />
      )}
    </button>
  );
}

export function MultiLanguageInput({
  languages,
  value,
  onChange,
  onBlur,
  placeholder,
  multiline = false,
  rows = 3,
  disabled = false,
  hasError = false,
  id,
  className,
}: MultiLanguageInputProps) {
  // Find default language or use first one
  const defaultLanguage = languages.find((l) => l.isDefault) || languages[0];
  const [activeLanguage, setActiveLanguage] = useState(defaultLanguage?.code || 'en');

  // If only one language, render a simple input
  if (languages.length <= 1) {
    const langCode = languages[0]?.code || 'en';
    const currentValue = value[langCode] || '';

    const handleChange = (newValue: string) => {
      onChange({ ...value, [langCode]: newValue });
    };

    if (multiline) {
      return (
        <Textarea
          id={id}
          value={currentValue}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className={cn(hasError && 'border-red-500', className)}
        />
      );
    }

    return (
      <Input
        id={id}
        value={currentValue}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(hasError && 'border-red-500', className)}
      />
    );
  }

  // Multiple languages - render with tabs
  const currentValue = value[activeLanguage] || '';
  const isDefaultLanguage = activeLanguage === defaultLanguage?.code;

  const handleChange = (newValue: string) => {
    onChange({ ...value, [activeLanguage]: newValue });
  };

  return (
    <div className={cn('border rounded-md overflow-hidden', hasError && 'border-red-500', className)}>
      {/* Language tabs */}
      <div className="flex gap-1 px-2 pt-2 bg-[#f9f9f9] border-b">
        {languages.map((language) => (
          <LanguageTab
            key={language.code}
            language={language}
            isActive={activeLanguage === language.code}
            isRequired={language.isDefault === true}
            hasValue={!!value[language.code]}
            onClick={() => setActiveLanguage(language.code)}
          />
        ))}
      </div>

      {/* Input area */}
      <div className="p-2">
        {multiline ? (
          <Textarea
            id={id}
            value={currentValue}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={onBlur}
            placeholder={
              placeholder
                ? `${placeholder}${!isDefaultLanguage ? ' (optional)' : ''}`
                : undefined
            }
            rows={rows}
            disabled={disabled}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
          />
        ) : (
          <Input
            id={id}
            value={currentValue}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={onBlur}
            placeholder={
              placeholder
                ? `${placeholder}${!isDefaultLanguage ? ' (optional)' : ''}`
                : undefined
            }
            disabled={disabled}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        )}

        {/* Helper text for non-default languages */}
        {!isDefaultLanguage && (
          <p className="text-xs text-[#69737c] mt-1">
            Optional: Leave empty to use {defaultLanguage?.name || 'default'} value
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Helper function to get the display value from a localized value
 * Falls back to default language if requested language is empty
 */
export function getLocalizedValue(
  value: LocalizedValue,
  languageCode: string,
  defaultLanguageCode: string = 'en'
): string {
  return value[languageCode] || value[defaultLanguageCode] || Object.values(value)[0] || '';
}

/**
 * Helper function to check if a localized value has a required default language value
 */
export function hasRequiredLanguageValue(
  value: LocalizedValue,
  defaultLanguageCode: string = 'en'
): boolean {
  return !!value[defaultLanguageCode];
}
