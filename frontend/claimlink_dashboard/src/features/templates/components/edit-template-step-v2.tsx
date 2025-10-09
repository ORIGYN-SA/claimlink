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
  // Event Handlers
  // ============================================================================

  const handleAddLanguage = () => {
    // TODO: Implement add language dialog
    console.log('Add language');
  };

  const handleAddSection = () => {
    // TODO: Implement add section dialog
    console.log('Add section');
  };

  const handleAddItem = (sectionId: string) => {
    // TODO: Implement add item dialog
    console.log('Add item to section:', sectionId);
  };

  const handleEditItem = (item: TemplateItem) => {
    // TODO: Implement edit item dialog
    console.log('Edit item:', item);
  };

  const handleDeleteItem = (item: TemplateItem) => {
    // TODO: Implement delete confirmation
    console.log('Delete item:', item);
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
              className="flex items-center gap-3 bg-[#f1f6f9] rounded-lg p-4 min-w-[200px]"
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
    </div>
  );
}

