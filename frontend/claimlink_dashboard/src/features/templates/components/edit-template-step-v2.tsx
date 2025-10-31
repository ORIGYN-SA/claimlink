/**
 * EditTemplateStepV2 Component
 * 
 * Data-driven template editor that works with TemplateStructure
 * Allows users to edit template sections and items dynamically
 */

import { useState } from 'react';
import { type Template } from '@/shared/data';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Trash2 } from 'lucide-react';
import Icon from '@/shared/ui/icons';
import { TemplateSectionCard } from './template-section-card';
import type {
  TemplateItem,
  TemplateLanguage,
  TemplateSection,
} from '@/features/templates/types/template-structure.types';
import {
  getTemplateSections,
  getTemplateLanguages,
} from '@/features/templates/utils/template-utils';

interface EditTemplateStepV2Props {
  selectedTemplate: Template | null;
  onNext?: () => void;
  onBack?: () => void;
  onTemplateChange?: (template: Template) => void;
}

export function EditTemplateStepV2({
  selectedTemplate,
  onNext,
  onBack,
  onTemplateChange,
}: EditTemplateStepV2Props) {
  const [template, setTemplate] = useState<Template | null>(selectedTemplate);
  const [searchIndexField, setSearchIndexField] = useState<string>(
    template?.structure?.searchIndexField || ''
  );

  // Modal states
  const [showAddLanguageModal, setShowAddLanguageModal] = useState(false);
  const [showDeleteLanguageModal, setShowDeleteLanguageModal] = useState(false);
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [showEditFieldModal, setShowEditFieldModal] = useState(false);
  const [showDeleteFieldModal, setShowDeleteFieldModal] = useState(false);

  // Selected items for modals
  const [selectedLanguage, setSelectedLanguage] = useState<TemplateLanguage | null>(null);
  const [selectedField, setSelectedField] = useState<TemplateItem | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');

  // Form states
  const [languageForm, setLanguageForm] = useState({
    name: '',
    code: '',
    isDefault: false,
  });

  const [fieldForm, setFieldForm] = useState({
    label: '',
    type: 'input' as 'input' | 'badge' | 'image' | 'title',
    inputType: 'text' as 'text' | 'number' | 'textarea' | 'email' | 'url',
    placeholder: '',
    description: '',
    required: false,
    badgeStyle: 'default' as 'default' | 'success' | 'warning' | 'error' | 'info',
  });

  if (!template || !template.structure) {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-6">
        <Card className="p-6">
          <p className="text-[#69737c] text-center">
            No template selected or template has no structure
          </p>
        </Card>
      </div>
    );
  }

  const sections = getTemplateSections(template);
  const languages = getTemplateLanguages(template);
  const certificateCount = template.structure.metadata?.certificateCount || 0;

  // Get all items for search index dropdown
  const allItems = sections.flatMap((section) => section.items);

  // ============================================================================
  // Event Handlers - Language
  // ============================================================================

  const handleAddLanguage = () => {
    setLanguageForm({ name: '', code: '', isDefault: false });
    setShowAddLanguageModal(true);
  };

  const handleDeleteLanguageClick = (language: TemplateLanguage) => {
    setSelectedLanguage(language);
    setShowDeleteLanguageModal(true);
  };

  const handleConfirmAddLanguage = () => {
    if (!template?.structure || !languageForm.name || !languageForm.code) return;

    const newLanguage: TemplateLanguage = {
      id: `lang_${Date.now()}`,
      code: languageForm.code.toUpperCase(),
      name: languageForm.name,
      isDefault: languageForm.isDefault,
    };

    const updatedTemplate: Template = {
      ...template,
      structure: {
        ...template.structure,
        languages: [...(template.structure.languages || []), newLanguage],
      },
    };

    setTemplate(updatedTemplate);
    onTemplateChange?.(updatedTemplate);
    setShowAddLanguageModal(false);
  };

  const handleConfirmDeleteLanguage = () => {
    if (!template?.structure || !selectedLanguage) return;

    const updatedTemplate: Template = {
      ...template,
      structure: {
        ...template.structure,
        languages: template.structure.languages?.filter(
          (lang) => lang.id !== selectedLanguage.id
        ),
      },
    };

    setTemplate(updatedTemplate);
    onTemplateChange?.(updatedTemplate);
    setShowDeleteLanguageModal(false);
    setSelectedLanguage(null);
  };

  // ============================================================================
  // Event Handlers - Fields
  // ============================================================================

  const handleAddSection = () => {
    // TODO: Implement add section dialog
    console.log('Add section');
  };

  const handleAddItem = (sectionId: string) => {
    setSelectedSectionId(sectionId);
    setFieldForm({
      label: '',
      type: 'input',
      inputType: 'text',
      placeholder: '',
      description: '',
      required: false,
      badgeStyle: 'default',
    });
    setShowAddFieldModal(true);
  };

  const handleEditItem = (item: TemplateItem) => {
    setSelectedField(item);
    
    // Extract type-specific properties
    const inputType = item.type === 'input' ? (item as any).inputType || 'text' : 'text';
    const placeholder = item.type === 'input' ? (item as any).placeholder || '' : '';
    const badgeStyle = item.type === 'badge' ? (item as any).badgeStyle || 'default' : 'default';
    
    setFieldForm({
      label: item.label,
      type: item.type,
      inputType,
      placeholder,
      description: item.description || '',
      required: item.required || false,
      badgeStyle,
    });
    setShowEditFieldModal(true);
  };

  const handleDeleteItem = (item: TemplateItem) => {
    setSelectedField(item);
    setShowDeleteFieldModal(true);
  };

  const handleConfirmAddField = () => {
    if (!template?.structure || !selectedSectionId || !fieldForm.label) return;

    // Create field based on type
    let newField: TemplateItem;
    const baseProps = {
      id: `field_${Date.now()}`,
      label: fieldForm.label,
      description: fieldForm.description,
      required: fieldForm.required,
      order: 0, // Will be set by section
    };

    switch (fieldForm.type) {
      case 'input':
        newField = {
          ...baseProps,
          type: 'input',
          inputType: fieldForm.inputType,
          placeholder: fieldForm.placeholder,
        };
        break;
      case 'badge':
        newField = {
          ...baseProps,
          type: 'badge',
          badgeStyle: fieldForm.badgeStyle,
        };
        break;
      case 'image':
        newField = {
          ...baseProps,
          type: 'image',
        };
        break;
      case 'title':
        newField = {
          ...baseProps,
          type: 'title',
          style: 'h3',
        };
        break;
      default:
        return;
    }

    const updatedSections = template.structure.sections?.map((section) => {
      if (section.id === selectedSectionId) {
        const newOrder = section.items.length;
        return {
          ...section,
          items: [...section.items, { ...newField, order: newOrder }],
        };
      }
      return section;
    });

    const updatedTemplate: Template = {
      ...template,
      structure: {
        ...template.structure,
        sections: updatedSections,
      },
    };

    setTemplate(updatedTemplate);
    onTemplateChange?.(updatedTemplate);
    setShowAddFieldModal(false);
    setSelectedSectionId('');
  };

  const handleConfirmEditField = () => {
    if (!template?.structure || !selectedField || !fieldForm.label) return;

    const updatedSections = template.structure.sections?.map((section) => ({
      ...section,
      items: section.items.map((item) => {
        if (item.id !== selectedField.id) return item;

        // Update based on type
        const baseUpdate = {
          ...item,
          label: fieldForm.label,
          description: fieldForm.description,
          required: fieldForm.required,
        };

        if (fieldForm.type === 'input') {
          return {
            ...baseUpdate,
            type: 'input' as const,
            inputType: fieldForm.inputType,
            placeholder: fieldForm.placeholder,
          };
        } else if (fieldForm.type === 'badge') {
          return {
            ...baseUpdate,
            type: 'badge' as const,
            badgeStyle: fieldForm.badgeStyle,
          };
        } else {
          return baseUpdate;
        }
      }),
    }));

    const updatedTemplate: Template = {
      ...template,
      structure: {
        ...template.structure,
        sections: updatedSections,
      },
    };

    setTemplate(updatedTemplate);
    onTemplateChange?.(updatedTemplate);
    setShowEditFieldModal(false);
    setSelectedField(null);
  };

  const handleConfirmDeleteField = () => {
    if (!template?.structure || !selectedField) return;

    const updatedSections = template.structure.sections?.map((section) => ({
      ...section,
      items: section.items.filter((item) => item.id !== selectedField.id),
    }));

    const updatedTemplate: Template = {
      ...template,
      structure: {
        ...template.structure,
        sections: updatedSections,
      },
    };

    setTemplate(updatedTemplate);
    onTemplateChange?.(updatedTemplate);
    setShowDeleteFieldModal(false);
    setSelectedField(null);
  };

  const handleInfoItem = (item: TemplateItem) => {
    // TODO: Implement item info modal
    console.log('Show info for item:', item);
  };

  const handleToggleSection = (sectionId: string) => {
    // TODO: Implement section collapse/expand
    console.log('Toggle section:', sectionId);
  };

  const handleSaveDraft = () => {
    // TODO: Implement save draft
    console.log('Save draft');
  };

  const handlePreviewChanges = () => {
    onNext?.();
  };

  const handleSearchIndexChange = (itemId: string) => {
    setSearchIndexField(itemId);
    
    if (template.structure) {
      const updatedTemplate: Template = {
        ...template,
        structure: {
          ...template.structure,
          searchIndexField: itemId,
        },
      };
      setTemplate(updatedTemplate);
      onTemplateChange?.(updatedTemplate);
    }
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm text-[#69737c] uppercase tracking-wider">
              Applied on {certificateCount} {certificateCount === 1 ? 'certificate' : 'certificates'}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleSaveDraft}
            >
              <Icon.Mint className="w-4 h-4" />
              Save as draft
            </Button>
            <Button onClick={handlePreviewChanges}>Preview changes</Button>
          </div>
        </div>
      </Card>

      {/* Multi Language Support */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium text-[#222526]">Multi Language Support</h2>
            <p className="text-sm text-[#69737c]">Add new languages you plan to support</p>
          </div>
          <Button variant="outline" onClick={handleAddLanguage}>
            <Icon.Plus className="w-4 h-4 mr-2" />
            Add language
          </Button>
        </div>

        <div className="flex flex-wrap gap-4 mb-4">
          {languages.map((language: TemplateLanguage) => (
            <div
              key={language.id}
              className="flex items-center gap-3 bg-[#f1f6f9] rounded-lg p-4 min-w-[200px] relative group"
            >
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-[#69737c] font-bold">
                {language.code}
              </div>
              <div className="flex-1">
                <p className="font-medium text-[#222526]">{language.name}</p>
                {language.isDefault && (
                  <p className="text-xs text-[#69737c]">Default</p>
                )}
              </div>
              {!language.isDefault && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDeleteLanguageClick(language)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="text-xs text-[#69737c] uppercase tracking-wider">
          {languages.length} {languages.length === 1 ? 'language' : 'languages'}
        </div>
      </Card>

      {/* Template Sections */}
      {sections.map((section: TemplateSection) => (
        <TemplateSectionCard
          key={section.id}
          section={section}
          onAddItem={handleAddItem}
          onEditItem={handleEditItem}
          onDeleteItem={handleDeleteItem}
          onInfoItem={handleInfoItem}
          onToggleSection={handleToggleSection}
        />
      ))}

      {/* Add New Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-[#222526]">Add New Section</h2>
            <p className="text-sm text-[#69737c]">
              Note: Standard sections (Certificate Introduction, Certificate, About, Experience) are predefined.
              You can add custom sections if needed.
            </p>
          </div>
          <Button variant="outline" onClick={handleAddSection}>
            <Icon.Plus className="w-4 h-4 mr-2" />
            Add section
          </Button>
        </div>
      </Card>

      {/* Choose a search index */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-lg font-medium text-[#222526]">Choose a search index</h2>
            <p className="text-sm text-[#69737c]">
              Select a field from the template that you can use to search and index certificates
            </p>
          </div>
          <Select value={searchIndexField} onValueChange={handleSearchIndexChange}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select field..." />
            </SelectTrigger>
            <SelectContent>
              {allItems
                .filter((item) => item.type === 'input' || item.type === 'badge')
                .map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Navigation buttons */}
      <div className="flex justify-center gap-4 pt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handlePreviewChanges}>Next</Button>
      </div>

      {/* ========================================================================== */}
      {/* Modals */}
      {/* ========================================================================== */}

      {/* Add Language Modal */}
      <Dialog open={showAddLanguageModal} onOpenChange={setShowAddLanguageModal}>
        <DialogContent className="sm:max-w-[500px] !fixed !top-1/2 !left-1/2 !transform !-translate-x-1/2 !-translate-y-1/2">
          <DialogHeader>
            <DialogTitle>Add Language</DialogTitle>
            <DialogDescription>
              Add a new language to your template. Users will be able to view certificates in this language.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="language-name">Language Name</Label>
              <Input
                id="language-name"
                placeholder="e.g., English, Spanish, French"
                value={languageForm.name}
                onChange={(e) => setLanguageForm({ ...languageForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language-code">Language Code</Label>
              <Input
                id="language-code"
                placeholder="e.g., EN, ES, FR"
                maxLength={2}
                value={languageForm.code}
                onChange={(e) => setLanguageForm({ ...languageForm, code: e.target.value.toUpperCase() })}
              />
              <p className="text-xs text-[#69737c]">Use 2-letter ISO code</p>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="language-default"
                checked={languageForm.isDefault}
                onCheckedChange={(checked: boolean) =>
                  setLanguageForm({ ...languageForm, isDefault: checked })
                }
              />
              <Label
                htmlFor="language-default"
                className="text-sm font-normal cursor-pointer"
              >
                Set as default language
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddLanguageModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAddLanguage}
              disabled={!languageForm.name || !languageForm.code}
            >
              Add Language
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Language Modal */}
      <Dialog open={showDeleteLanguageModal} onOpenChange={setShowDeleteLanguageModal}>
        <DialogContent className="sm:max-w-[425px] !fixed !top-1/2 !left-1/2 !transform !-translate-x-1/2 !-translate-y-1/2">
          <DialogHeader>
            <DialogTitle>Delete Language</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedLanguage?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteLanguageModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDeleteLanguage}>
              Delete Language
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Field Modal */}
      <Dialog open={showAddFieldModal} onOpenChange={setShowAddFieldModal}>
        <DialogContent className="sm:max-w-[600px] !fixed !top-1/2 !left-1/2 !transform !-translate-x-1/2 !-translate-y-1/2">
          <DialogHeader>
            <DialogTitle>Add Field</DialogTitle>
            <DialogDescription>
              Add a new field to the selected section. This field will be available when creating certificates.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="field-label">Field Label *</Label>
              <Input
                id="field-label"
                placeholder="e.g., Certificate Title, Student Name"
                value={fieldForm.label}
                onChange={(e) => setFieldForm({ ...fieldForm, label: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="field-type">Field Type *</Label>
              <Select
                value={fieldForm.type}
                onValueChange={(value: any) => setFieldForm({ ...fieldForm, type: value })}
              >
                <SelectTrigger id="field-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="input">Text Input</SelectItem>
                  <SelectItem value="textarea">Text Area</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="badge">Badge</SelectItem>
                  <SelectItem value="readonly">Read Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {fieldForm.type === 'input' && (
              <div className="space-y-2">
                <Label htmlFor="field-placeholder">Placeholder</Label>
                <Input
                  id="field-placeholder"
                  placeholder="Enter placeholder text..."
                  value={fieldForm.placeholder}
                  onChange={(e) => setFieldForm({ ...fieldForm, placeholder: e.target.value })}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="field-description">Description</Label>
              <Textarea
                id="field-description"
                placeholder="Optional description to help users understand this field..."
                value={fieldForm.description}
                onChange={(e) => setFieldForm({ ...fieldForm, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="field-required"
                checked={fieldForm.required}
                onCheckedChange={(checked: boolean) =>
                  setFieldForm({ ...fieldForm, required: checked })
                }
              />
              <Label htmlFor="field-required" className="text-sm font-normal cursor-pointer">
                Required field
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddFieldModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmAddField} disabled={!fieldForm.label}>
              Add Field
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Field Modal */}
      <Dialog open={showEditFieldModal} onOpenChange={setShowEditFieldModal}>
        <DialogContent className="sm:max-w-[600px] !fixed !top-1/2 !left-1/2 !transform !-translate-x-1/2 !-translate-y-1/2">
          <DialogHeader>
            <DialogTitle>Edit Field</DialogTitle>
            <DialogDescription>
              Update the field properties. Changes will affect new certificates only.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-field-label">Field Label *</Label>
              <Input
                id="edit-field-label"
                placeholder="e.g., Certificate Title, Student Name"
                value={fieldForm.label}
                onChange={(e) => setFieldForm({ ...fieldForm, label: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-field-type">Field Type *</Label>
              <Select
                value={fieldForm.type}
                onValueChange={(value: any) => setFieldForm({ ...fieldForm, type: value })}
              >
                <SelectTrigger id="edit-field-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="input">Text Input</SelectItem>
                  <SelectItem value="textarea">Text Area</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="badge">Badge</SelectItem>
                  <SelectItem value="readonly">Read Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {fieldForm.type === 'input' && (
              <div className="space-y-2">
                <Label htmlFor="edit-field-placeholder">Placeholder</Label>
                <Input
                  id="edit-field-placeholder"
                  placeholder="Enter placeholder text..."
                  value={fieldForm.placeholder}
                  onChange={(e) => setFieldForm({ ...fieldForm, placeholder: e.target.value })}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="edit-field-description">Description</Label>
              <Textarea
                id="edit-field-description"
                placeholder="Optional description to help users understand this field..."
                value={fieldForm.description}
                onChange={(e) => setFieldForm({ ...fieldForm, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-field-required"
                checked={fieldForm.required}
                onCheckedChange={(checked: boolean) =>
                  setFieldForm({ ...fieldForm, required: checked })
                }
              />
              <Label htmlFor="edit-field-required" className="text-sm font-normal cursor-pointer">
                Required field
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditFieldModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmEditField} disabled={!fieldForm.label}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Field Modal */}
      <Dialog open={showDeleteFieldModal} onOpenChange={setShowDeleteFieldModal}>
        <DialogContent className="sm:max-w-[425px] !fixed !top-1/2 !left-1/2 !transform !-translate-x-1/2 !-translate-y-1/2">
          <DialogHeader>
            <DialogTitle>Delete Field</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the field "{selectedField?.label}"? This action cannot be undone
              and will affect the template structure.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteFieldModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDeleteField}>
              Delete Field
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

