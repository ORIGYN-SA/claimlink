/**
 * DynamicTemplateForm Component
 * 
 * Generates form fields dynamically based on template structure
 * Used when creating a certificate from a template
 */

import { useState, useRef, useEffect, createRef, type ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUploadSection } from '@/components/common';
import type { Template } from '@/shared/data/templates';
import type {
  TemplateItem,
  TitleItem,
  InputItem,
  BadgeItem,
  ImageItem,
  VideoItem,
  CertificateFormData,
  LocalizedValue,
  TemplateLanguage,
} from '@/features/templates/types/template.types';
import { isLocalizedValue } from '@/features/templates/types/template.types';
import {
  getTemplateSections,
  getSectionItems,
  getTemplateLanguages,
  isTitleItem,
  isInputItem,
  isBadgeItem,
  isImageItem,
  isVideoItem,
  validateField,
  getInitialFormData,
} from '@/features/templates/utils/template-utils';
import { UPLOAD_CONFIG, isVideoFile } from '@/shared/config/upload.config';

interface DynamicTemplateFormProps {
  template: Template;
  onFormDataChange?: (formData: CertificateFormData) => void;
  initialData?: CertificateFormData;
  mode?: 'create' | 'edit';
}

export function DynamicTemplateForm({
  template,
  onFormDataChange,
  initialData,
  mode = 'create',
}: DynamicTemplateFormProps) {
  const [formData, setFormData] = useState<CertificateFormData>(
    initialData || getInitialFormData(template)
  );
  const [errors, setErrors] = useState<{ [itemId: string]: string }>({});
  const fileInputRefs = useRef<Map<string, React.RefObject<HTMLInputElement | null>>>(new Map());

  // Sync internal formData when template changes
  // This ensures badge defaults and other initial values are properly set
  useEffect(() => {
    const newFormData = getInitialFormData(template);
    setFormData((prev) => {
      // Merge: keep existing user-entered values but add any missing defaults
      const merged = { ...newFormData };
      Object.keys(prev).forEach((key) => {
        // Only keep non-empty values from previous state
        if (prev[key] !== undefined && prev[key] !== '' && prev[key] !== null) {
          merged[key] = prev[key];
        }
      });
      // Notify parent of the merged data with defaults
      onFormDataChange?.(merged);
      return merged;
    });
    setErrors({});
  }, [template.id]); // Re-run when template changes (don't include onFormDataChange to avoid infinite loop)

  // Handle value change
  const handleChange = (itemId: string, value: any) => {
    const updatedData = { ...formData, [itemId]: value };
    setFormData(updatedData);
    
    // Clear error for this field
    if (errors[itemId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[itemId];
        return newErrors;
      });
    }

    onFormDataChange?.(updatedData);
  };

  // Handle blur for validation
  const handleBlur = (item: TemplateItem) => {
    const value = formData[item.id];
    const result = validateField(item, value);

    if (!result.isValid && result.error) {
      setErrors((prev) => ({ ...prev, [item.id]: result.error! }));
    }
  };

  // Render Title Item
  const renderTitleItem = (item: TitleItem) => {
    const HeadingTag = item.style || 'h2';
    const alignmentClass = `text-${item.alignment || 'left'}`;
    
    return (
      <div className={alignmentClass}>
        {HeadingTag === 'h1' && (
          <h1 className="text-3xl font-bold text-[#222526]">
            {item.defaultValue || item.label}
          </h1>
        )}
        {HeadingTag === 'h2' && (
          <h2 className="text-2xl font-semibold text-[#222526]">
            {item.defaultValue || item.label}
          </h2>
        )}
        {HeadingTag === 'h3' && (
          <h3 className="text-xl font-semibold text-[#222526]">
            {item.defaultValue || item.label}
          </h3>
        )}
        {HeadingTag === 'h4' && (
          <h4 className="text-lg font-semibold text-[#222526]">
            {item.defaultValue || item.label}
          </h4>
        )}
      </div>
    );
  };

  // Get additional languages (non-default) from template
  const templateLanguages = template.structure ? getTemplateLanguages(template) : [];
  const defaultLanguage = templateLanguages.find((l) => l.isDefault) || templateLanguages[0];
  const additionalLanguages = templateLanguages.filter((l) => !l.isDefault && l.code !== defaultLanguage?.code);

  // Language flag emoji mapping
  const languageFlags: Record<string, string> = {
    en: '🇬🇧',
    it: '🇮🇹',
    fr: '🇫🇷',
    de: '🇩🇪',
    es: '🇪🇸',
    pt: '🇵🇹',
    nl: '🇳🇱',
    pl: '🇵🇱',
    ru: '🇷🇺',
    zh: '🇨🇳',
    ja: '🇯🇵',
    ko: '🇰🇷',
    ar: '🇸🇦',
  };

  // Helper to get the primary (default language) value from form data
  const getPrimaryValue = (itemId: string): string => {
    const value = formData[itemId];
    if (typeof value === 'string') return value;
    if (isLocalizedValue(value)) {
      return value[defaultLanguage?.code || 'en'] || '';
    }
    return '';
  };

  // Helper to get translation value for a specific language
  const getTranslationValue = (itemId: string, langCode: string): string => {
    const value = formData[itemId];
    if (isLocalizedValue(value)) {
      return value[langCode] || '';
    }
    return '';
  };

  // Handle primary value change (converts to LocalizedValue if translations exist)
  const handlePrimaryChange = (itemId: string, newValue: string) => {
    const currentValue = formData[itemId];

    if (additionalLanguages.length > 0) {
      // Multi-language mode: store as LocalizedValue
      const localizedValue: LocalizedValue = isLocalizedValue(currentValue)
        ? { ...currentValue }
        : {};
      localizedValue[defaultLanguage?.code || 'en'] = newValue;
      handleChange(itemId, localizedValue);
    } else {
      // Single language mode: store as string
      handleChange(itemId, newValue);
    }
  };

  // Handle translation value change
  const handleTranslationChange = (itemId: string, langCode: string, newValue: string) => {
    const currentValue = formData[itemId];
    const localizedValue: LocalizedValue = isLocalizedValue(currentValue)
      ? { ...currentValue }
      : { [defaultLanguage?.code || 'en']: typeof currentValue === 'string' ? currentValue : '' };

    localizedValue[langCode] = newValue;
    handleChange(itemId, localizedValue);
  };

  // Render Input Item with multi-language support
  const renderInputItem = (item: InputItem) => {
    const primaryValue = getPrimaryValue(item.id);
    const error = errors[item.id];
    const isImmutable = item.immutable && mode === 'edit';
    const isTextInput = item.inputType === 'text' || item.inputType === 'textarea' || item.multiline;
    const showTranslations = isTextInput && additionalLanguages.length > 0;

    return (
      <div className="space-y-2">
        <label htmlFor={item.id} className="text-sm font-medium text-[#222526] flex items-center gap-1">
          {item.label}
          {item.required && <span className="text-red-500">*</span>}
          {isImmutable && (
            <span className="text-xs text-[#69737c] font-normal ml-1">(Immutable)</span>
          )}
        </label>

        {item.description && (
          <p className="text-xs text-[#69737c]">{item.description}</p>
        )}

        {/* Primary (default language) input */}
        {item.multiline || item.inputType === 'textarea' ? (
          <Textarea
            id={item.id}
            value={primaryValue}
            onChange={(e) => handlePrimaryChange(item.id, e.target.value)}
            onBlur={() => handleBlur(item)}
            placeholder={item.placeholder}
            rows={item.rows || 3}
            disabled={item.immutable}
            className={error ? 'border-red-500' : isImmutable ? 'opacity-60 cursor-not-allowed' : ''}
          />
        ) : (
          <Input
            id={item.id}
            type={item.inputType}
            value={primaryValue}
            onChange={(e) => handlePrimaryChange(item.id, e.target.value)}
            onBlur={() => handleBlur(item)}
            placeholder={item.placeholder}
            disabled={item.immutable}
            className={error ? 'border-red-500' : isImmutable ? 'opacity-60 cursor-not-allowed' : ''}
          />
        )}

        {/* Translation fields for additional languages */}
        {showTranslations && additionalLanguages.map((lang) => (
          <div key={lang.code} className="mt-3 pl-4 border-l-2 border-[#e1e1e1]">
            <label
              htmlFor={`${item.id}-${lang.code}`}
              className="text-xs font-medium text-[#69737c] flex items-center gap-1.5 mb-1"
            >
              <span>{languageFlags[lang.code.toLowerCase()] || '🌐'}</span>
              <span>{lang.name}</span>
              <span className="font-normal text-[#9ca3af]">(optional)</span>
            </label>
            {item.multiline || item.inputType === 'textarea' ? (
              <Textarea
                id={`${item.id}-${lang.code}`}
                value={getTranslationValue(item.id, lang.code)}
                onChange={(e) => handleTranslationChange(item.id, lang.code, e.target.value)}
                placeholder={`${item.placeholder || item.label} in ${lang.name}...`}
                rows={(item.rows || 3) - 1}
                disabled={item.immutable}
                className={`text-sm ${isImmutable ? 'opacity-60 cursor-not-allowed' : ''}`}
              />
            ) : (
              <Input
                id={`${item.id}-${lang.code}`}
                type={item.inputType}
                value={getTranslationValue(item.id, lang.code)}
                onChange={(e) => handleTranslationChange(item.id, lang.code, e.target.value)}
                placeholder={`${item.placeholder || item.label} in ${lang.name}...`}
                disabled={item.immutable}
                className={`text-sm ${isImmutable ? 'opacity-60 cursor-not-allowed' : ''}`}
              />
            )}
          </div>
        ))}

        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  };

  // Render Badge Item
  const renderBadgeItem = (item: BadgeItem) => {
    const value = (formData[item.id] as string) || item.defaultValue || '';
    const error = errors[item.id];
    const isImmutable = item.immutable && mode === 'edit';

    // If immutable, just display as static badge (no editing allowed)
    if (item.immutable) {
      return (
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#222526] flex items-center gap-1">
            {item.label}
            {item.required && <span className="text-red-500">*</span>}
            {isImmutable && (
              <span className="text-xs text-[#69737c] font-normal ml-1">(Immutable)</span>
            )}
          </label>
          <Badge variant={item.badgeStyle as any || 'default'}>
            {value || item.label}
          </Badge>
        </div>
      );
    }

    // If predefined values exist, use select dropdown
    if (item.predefinedValues && item.predefinedValues.length > 0) {
      return (
        <div className="space-y-2">
          <label htmlFor={item.id} className="text-sm font-medium text-[#222526] flex items-center gap-1">
            {item.label}
            {item.required && <span className="text-red-500">*</span>}
          </label>
          
          <Select
            value={value}
            onValueChange={(val) => handleChange(item.id, val)}
          >
            <SelectTrigger id={item.id} className={error ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {item.predefinedValues.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}
        </div>
      );
    }

    // Otherwise, use text input
    return (
      <div className="space-y-2">
        <label htmlFor={item.id} className="text-sm font-medium text-[#222526] flex items-center gap-1">
          {item.label}
          {item.required && <span className="text-red-500">*</span>}
        </label>
        <Input
          id={item.id}
          value={value}
          onChange={(e) => handleChange(item.id, e.target.value)}
          onBlur={() => handleBlur(item)}
          placeholder="Enter value..."
          className={error ? 'border-red-500' : ''}
        />
        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  };

  // Render Image Item (supports videos when acceptVideo is true)
  const renderImageItem = (item: ImageItem) => {
    const value = formData[item.id];
    const files = Array.isArray(value) ? value : value ? [value] : [];
    const error = errors[item.id];
    const acceptVideo = item.acceptVideo === true;

    const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(event.target.files || []);

      if (item.multiple) {
        const currentFiles = Array.isArray(value) ? value : [];
        const maxImages = item.maxImages || 10;

        // Limit total number of files
        const newFiles = [...currentFiles, ...selectedFiles].slice(0, maxImages);
        handleChange(item.id, newFiles);
      } else {
        handleChange(item.id, selectedFiles[0] || null);
      }
    };

    const handleRemove = (index?: number) => {
      if (item.multiple && index !== undefined) {
        const currentFiles = Array.isArray(value) ? value : [];
        const newFiles = currentFiles.filter((_, i) => i !== index);
        handleChange(item.id, newFiles);
      } else {
        handleChange(item.id, item.multiple ? [] : null);
      }
    };

    // Get or create ref for this item
    if (!fileInputRefs.current.has(item.id)) {
      fileInputRefs.current.set(item.id, createRef<HTMLInputElement>());
    }
    const inputRef = fileInputRefs.current.get(item.id)!;

    const handleUploadClick = () => {
      inputRef.current?.click();
    };

    // Get preview URLs and track which are videos
    const previews = files.map((file) => {
      // Handle URL strings (existing images from on-chain data)
      if (typeof file === 'string') {
        const ext = file.split('.').pop()?.toLowerCase();
        const isVideo = ['mp4', 'webm', 'mov', 'avi'].includes(ext || '');
        return { url: file, isVideo };
      }
      // Handle File objects (new uploads)
      if (file instanceof File) {
        const isVideo = isVideoFile(file);
        if (file.type.startsWith('image/') || isVideo) {
          return { url: URL.createObjectURL(file), isVideo };
        }
      }
      return null;
    }).filter((preview): preview is { url: string; isVideo: boolean } => preview !== null);

    const formatFileTypes = () => {
      if (acceptVideo) {
        return UPLOAD_CONFIG.media.formatLabel;
      }
      if (!item.acceptedFormats) return 'All image types';
      return item.acceptedFormats.map((type) => type.split('/')[1].toUpperCase()).join(', ');
    };

    // Get the first file for selectedFile prop
    const firstFile = files[0] instanceof File ? files[0] : null;

    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#222526] flex items-center gap-1">
          {item.label}
          {item.required && <span className="text-red-500">*</span>}
        </label>

        {item.description && (
          <p className="text-xs text-[#69737c]">{item.description}</p>
        )}

        <ImageUploadSection
          previewUrl={previews[0]?.url || null}
          onFileSelect={handleFileSelect}
          onRemove={() => handleRemove(0)}
          onUploadClick={handleUploadClick}
          fileInputRef={inputRef}
          uploadText={`Upload ${item.multiple ? (acceptVideo ? 'media' : 'images') : (acceptVideo ? 'file' : 'image')} or drag ${item.multiple ? 'them' : 'it'} here`}
          acceptedFormats={formatFileTypes()}
          acceptVideo={acceptVideo}
          selectedFile={firstFile}
        />

        {item.multiple && files.length > 1 && (
          <div className="grid grid-cols-4 gap-2 mt-2">
            {previews.slice(1).map((preview, index) => (
              <div key={index} className="relative w-full h-20">
                {preview.isVideo ? (
                  <video
                    src={preview.url}
                    className="w-full h-full object-cover rounded"
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={preview.url}
                    alt={`Preview ${index + 2}`}
                    className="w-full h-full object-cover rounded"
                  />
                )}
                <button
                  onClick={() => handleRemove(index + 1)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {item.multiple && item.maxImages && (
          <p className="text-xs text-[#69737c]">
            {files.length} / {item.maxImages} {acceptVideo ? 'files' : 'images'}
          </p>
        )}

        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  };

  // Render Video Item
  const renderVideoItem = (item: VideoItem) => {
    const value = formData[item.id];
    const file = value instanceof File ? value : null;
    const error = errors[item.id];

    // Get or create ref for this item
    if (!fileInputRefs.current.has(item.id)) {
      fileInputRefs.current.set(item.id, createRef<HTMLInputElement>());
    }
    const inputRef = fileInputRefs.current.get(item.id)!;

    const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      if (selectedFile) {
        handleChange(item.id, selectedFile);
      }
    };

    const handleRemove = () => {
      handleChange(item.id, '');
    };

    const handleUploadClick = () => {
      inputRef.current?.click();
    };

    // Create preview URL for video
    const previewUrl = file && isVideoFile(file) ? URL.createObjectURL(file) : null;

    const formatFileTypes = () => {
      if (!item.acceptedFormats) return UPLOAD_CONFIG.video.formatLabel;
      return item.acceptedFormats.map((type) => type.split('/')[1].toUpperCase()).join(', ');
    };

    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#222526] flex items-center gap-1">
          {item.label}
          {item.required && <span className="text-red-500">*</span>}
        </label>

        {item.description && (
          <p className="text-xs text-[#69737c]">{item.description}</p>
        )}

        <div className="flex gap-4 w-full">
          {/* Video Preview */}
          <div className="relative bg-[#e1e1e1] rounded-[10px] w-[130px] h-[130px] flex items-center justify-center overflow-hidden group flex-shrink-0">
            {previewUrl ? (
              <>
                <video
                  src={previewUrl}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                  autoPlay={item.autoplay !== false}
                />
                <button
                  onClick={handleRemove}
                  className="absolute top-2 right-2 bg-[#222526] hover:bg-[#222526]/90 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove video"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </>
            ) : (
              <svg className="w-6 h-6 text-[#69737c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </div>

          {/* Upload Area */}
          <div
            onClick={handleUploadClick}
            className="flex-1 border-2 border-dashed border-[#e1e1e1] rounded-md p-6 bg-[#cddfec26] hover:bg-[#cde9ec40] hover:border-[#615bff] flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200"
          >
            <div className="w-10 h-10 bg-[#cde9ec] rounded-full flex items-center justify-center mb-3">
              <svg className="w-4 h-4 text-[#615bff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-[#615bff] font-medium mb-2">
              Upload video
            </p>
            <p className="text-[#69737c] text-sm">
              {formatFileTypes()} (max {UPLOAD_CONFIG.video.maxSizeMB}MB)
            </p>
            <input
              ref={inputRef}
              type="file"
              accept={item.acceptedFormats?.join(',') || UPLOAD_CONFIG.video.acceptString}
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  };

  // Render single item based on type
  const renderItem = (item: TemplateItem) => {
    if (isTitleItem(item)) return renderTitleItem(item);
    if (isInputItem(item)) return renderInputItem(item);
    if (isBadgeItem(item)) return renderBadgeItem(item);
    if (isImageItem(item)) return renderImageItem(item);
    if (isVideoItem(item)) return renderVideoItem(item);
    return null;
  };

  // Render form
  const sections = getTemplateSections(template);

  return (
    <div className="space-y-6">
      {sections.map((section) => {
        const items = getSectionItems(section);
        
        return (
          <Card key={section.id} className="p-6">
            <h3 className="text-lg font-semibold text-[#222526] mb-4">
              {section.name}
            </h3>
            
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id}>
                  {renderItem(item)}
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

