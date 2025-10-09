/**
 * DynamicTemplateForm Component
 * 
 * Generates form fields dynamically based on template structure
 * Used when creating a certificate from a template
 */

import { useState, useRef, createRef, type ChangeEvent } from 'react';
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
  CertificateFormData,
} from '@/features/templates/types/template-structure.types';
import {
  getTemplateSections,
  getSectionItems,
  isTitleItem,
  isInputItem,
  isBadgeItem,
  isImageItem,
  validateField,
  getInitialFormData,
} from '@/features/templates/utils/template-utils';

interface DynamicTemplateFormProps {
  template: Template;
  onFormDataChange?: (formData: CertificateFormData) => void;
  initialData?: CertificateFormData;
}

export function DynamicTemplateForm({
  template,
  onFormDataChange,
  initialData,
}: DynamicTemplateFormProps) {
  const [formData, setFormData] = useState<CertificateFormData>(
    initialData || getInitialFormData(template)
  );
  const [errors, setErrors] = useState<{ [itemId: string]: string }>({});
  const fileInputRefs = useRef<Map<string, React.RefObject<HTMLInputElement | null>>>(new Map());

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

  // Render Input Item
  const renderInputItem = (item: InputItem) => {
    const value = (formData[item.id] as string) || '';
    const error = errors[item.id];

    return (
      <div className="space-y-2">
        <label htmlFor={item.id} className="text-sm font-medium text-[#222526] flex items-center gap-1">
          {item.label}
          {item.required && <span className="text-red-500">*</span>}
        </label>
        
        {item.description && (
          <p className="text-xs text-[#69737c]">{item.description}</p>
        )}

        {item.multiline || item.inputType === 'textarea' ? (
          <Textarea
            id={item.id}
            value={value}
            onChange={(e) => handleChange(item.id, e.target.value)}
            onBlur={() => handleBlur(item)}
            placeholder={item.placeholder}
            rows={item.rows || 3}
            disabled={item.immutable}
            className={error ? 'border-red-500' : ''}
          />
        ) : (
          <Input
            id={item.id}
            type={item.inputType}
            value={value}
            onChange={(e) => handleChange(item.id, e.target.value)}
            onBlur={() => handleBlur(item)}
            placeholder={item.placeholder}
            disabled={item.immutable}
            className={error ? 'border-red-500' : ''}
          />
        )}

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

    // If immutable or no custom values allowed, just display
    if (item.immutable || !item.allowCustomValue) {
      return (
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#222526] flex items-center gap-1">
            {item.label}
            {item.required && <span className="text-red-500">*</span>}
          </label>
          <Badge variant={item.badgeStyle as any || 'default'}>
            {value || item.label}
          </Badge>
        </div>
      );
    }

    // If predefined values, use select
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

  // Render Image Item
  const renderImageItem = (item: ImageItem) => {
    const value = formData[item.id];
    const files = Array.isArray(value) ? value : value ? [value] : [];
    const error = errors[item.id];

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

    // Get preview URLs
    const previewUrls = files.map((file) => {
      if (file instanceof File && file.type.startsWith('image/')) {
        return URL.createObjectURL(file);
      }
      return null;
    }).filter((url): url is string => url !== null);

    const formatFileTypes = () => {
      if (!item.acceptedFormats) return 'All image types';
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

        <ImageUploadSection
          previewUrl={previewUrls[0] || null}
          onFileSelect={handleFileSelect}
          onRemove={() => handleRemove(0)}
          onUploadClick={handleUploadClick}
          fileInputRef={inputRef}
          uploadText={`Upload ${item.multiple ? 'images' : 'image'} or drag ${item.multiple ? 'them' : 'it'} here`}
          acceptedFormats={formatFileTypes()}
        />

        {item.multiple && files.length > 1 && (
          <div className="grid grid-cols-4 gap-2 mt-2">
            {previewUrls.slice(1).map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Preview ${index + 2}`}
                  className="w-full h-20 object-cover rounded"
                />
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
            {files.length} / {item.maxImages} images
          </p>
        )}

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

