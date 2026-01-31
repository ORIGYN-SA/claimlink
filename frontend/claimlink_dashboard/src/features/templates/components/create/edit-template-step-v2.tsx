/**
 * EditTemplateStepV2 Component
 *
 * Data-driven template editor that works with TemplateStructure
 * Allows users to edit template sections and items dynamically
 *
 * Uses templateEditorAtom for state management (Phase 3 migration)
 * - Consolidated 12 useState calls into single atom
 * - Modals, forms, and selections managed by atom reducer
 *
 * Includes validation warnings and semantic field presets for
 * proper certificate display compatibility.
 */

import { useEffect, useRef, useMemo } from "react";
import { useAtom } from "jotai";
import { type Template } from "@/shared/data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, AlertTriangle, Info, Sparkles } from "lucide-react";
import Icon from "@/shared/ui/icons";
import { TemplateSectionCard } from "../template-section-card";
import { CodeEditorStep } from "./code-editor-step";
import { templateEditorAtom } from "../../atoms/template-editor.atom";
import type {
  TemplateItem,
  TemplateLanguage,
  TemplateSection,
} from "@/features/templates/types/template.types";
import {
  getTemplateSections,
  getTemplateLanguages,
} from "@/features/templates/utils/template-utils";
import {
  validateTemplateForDisplay,
  SEMANTIC_FIELD_PRESETS,
  type SemanticFieldPreset,
} from "@/features/templates/utils/template-validation";

type EditorMode = 'ui' | 'code';

interface EditTemplateStepV2Props {
  selectedTemplate: Template | null;
  onNext?: () => void;
  onBack?: () => void;
  onTemplateChange?: (template: Template) => void;
  editorMode?: EditorMode;
  onEditorModeChange?: (mode: EditorMode) => void;
  isScratchMode?: boolean;
}

export function EditTemplateStepV2({
  selectedTemplate,
  onNext,
  onBack,
  onTemplateChange,
  editorMode = 'ui',
  onEditorModeChange,
  isScratchMode = false,
}: EditTemplateStepV2Props) {
  const [state, dispatch] = useAtom(templateEditorAtom);
  const isInitializedRef = useRef(false);
  const prevTemplateIdRef = useRef<string | null>(null);

  // Initialize atom with selected template (only when template ID changes)
  useEffect(() => {
    if (selectedTemplate && selectedTemplate.id !== prevTemplateIdRef.current) {
      prevTemplateIdRef.current = selectedTemplate.id;
      isInitializedRef.current = false;
      dispatch({ type: "SET_TEMPLATE", template: selectedTemplate });
      // Mark as initialized after a tick to allow state to settle
      requestAnimationFrame(() => {
        isInitializedRef.current = true;
      });
    }
  }, [selectedTemplate, dispatch]);

  // Notify parent of template changes (only after initialization and for actual edits)
  useEffect(() => {
    if (isInitializedRef.current && state.template && onTemplateChange) {
      onTemplateChange(state.template);
    }
  }, [state.template, onTemplateChange]);

  // Memoized validation warnings
  const validationResult = useMemo(() => {
    return validateTemplateForDisplay(state.template?.structure);
  }, [state.template?.structure]);

  if (!state.template || !state.template.structure) {
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

  const sections = getTemplateSections(state.template);
  const languages = getTemplateLanguages(state.template);
  const certificateCount =
    state.template.structure.metadata?.certificateCount || 0;

  // Get all items for search index dropdown
  const allItems = sections.flatMap((section) => section.items);

  // Helper to add a semantic field preset
  const handleAddSemanticField = (preset: SemanticFieldPreset, sectionId: string) => {
    if (!state.template?.structure) return;

    // Check if field with this ID already exists
    const existingField = allItems.find(item => item.id === preset.item.id);
    if (existingField) {
      // Field already exists, don't add duplicate
      console.log(`Field with ID "${preset.item.id}" already exists`);
      return;
    }

    const updatedSections = state.template.structure.sections?.map(
      (section) => {
        if (section.id === sectionId) {
          const newOrder = section.items.length;
          return {
            ...section,
            items: [...section.items, { ...preset.item, order: newOrder }],
          };
        }
        return section;
      }
    );

    const updatedTemplate: Template = {
      ...state.template,
      structure: {
        ...state.template.structure,
        sections: updatedSections,
      },
    };
    dispatch({ type: "UPDATE_TEMPLATE", template: updatedTemplate });
  };

  // ============================================================================
  // Event Handlers - Language
  // ============================================================================

  const handleAddLanguage = () => {
    dispatch({ type: "OPEN_ADD_LANGUAGE_MODAL" });
  };

  const handleDeleteLanguageClick = (language: TemplateLanguage) => {
    dispatch({ type: "OPEN_DELETE_LANGUAGE_MODAL", language });
  };

  const handleConfirmAddLanguage = () => {
    dispatch({ type: "ADD_LANGUAGE" });
  };

  const handleConfirmDeleteLanguage = () => {
    dispatch({ type: "DELETE_LANGUAGE" });
  };

  // ============================================================================
  // Event Handlers - Fields
  // ============================================================================

  const handleAddItem = (sectionId: string) => {
    dispatch({ type: "OPEN_ADD_FIELD_MODAL", sectionId });
  };

  const handleEditItem = (item: TemplateItem) => {
    dispatch({ type: "OPEN_EDIT_FIELD_MODAL", field: item });
  };

  const handleDeleteItem = (item: TemplateItem) => {
    dispatch({ type: "OPEN_DELETE_FIELD_MODAL", field: item });
  };

  const handleConfirmAddField = () => {
    dispatch({ type: "ADD_FIELD" });
  };

  const handleConfirmEditField = () => {
    dispatch({ type: "EDIT_FIELD" });
  };

  const handleConfirmDeleteField = () => {
    dispatch({ type: "DELETE_FIELD" });
  };

  const handleInfoItem = (item: TemplateItem) => {
    // TODO: Implement item info modal
    console.log("Show info for item:", item);
  };

  const handleToggleSection = (sectionId: string) => {
    // TODO: Implement section collapse/expand
    console.log("Toggle section:", sectionId);
  };

  const handleReorderItems = (sectionId: string, activeId: string, overId: string) => {
    dispatch({ type: "REORDER_ITEMS", sectionId, activeId, overId });
  };

  const handlePreviewChanges = () => {
    onNext?.();
  };

  const handleSearchIndexChange = (itemId: string) => {
    dispatch({ type: "SET_SEARCH_INDEX_FIELD", field: itemId });

    if (state.template?.structure) {
      const updatedTemplate: Template = {
        ...state.template,
        structure: {
          ...state.template.structure,
          searchIndexField: itemId,
        },
      };
      dispatch({ type: "UPDATE_TEMPLATE", template: updatedTemplate });
    }
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 sm:space-y-6">
      {/* Header Section */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          {/* Template Name */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <Label htmlFor="template-name" className="text-sm font-medium text-[#222526] sm:w-32 flex-shrink-0">
              Template Name
            </Label>
            <Input
              id="template-name"
              value={state.template?.name || ""}
              onChange={(e) => {
                if (state.template) {
                  const updatedTemplate: Template = {
                    ...state.template,
                    name: e.target.value,
                  };
                  dispatch({ type: "UPDATE_TEMPLATE", template: updatedTemplate });
                }
              }}
              placeholder="Enter template name..."
              className="flex-1 max-w-md"
            />
          </div>

          {/* Actions Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pt-2 border-t border-[#e1e1e1]">
            <div className="flex items-center gap-4">
              <div className="text-xs sm:text-sm text-[#69737c] uppercase tracking-wider">
                Applied on {certificateCount}{" "}
                {certificateCount === 1 ? "certificate" : "certificates"}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
              {/* Simple/Advanced Mode Toggle (Advanced disabled for now) */}
              <div className="flex rounded-lg border border-[#e1e1e1] overflow-hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-none bg-[#f1f6f9] text-[#222526] hover:bg-[#f1f6f9] text-xs"
                >
                  Simple Mode
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled
                  title="Advanced Mode - Coming Soon"
                  className="rounded-none text-[#69737c] text-xs opacity-50 cursor-not-allowed"
                >
                  Advanced
                </Button>
              </div>
              {isScratchMode && onEditorModeChange && (
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2 text-sm"
                  onClick={() => onEditorModeChange(editorMode === 'ui' ? 'code' : 'ui')}
                >
                  {editorMode === 'ui' ? (
                    <>
                      <Icon.Code className="w-4 h-4" />
                      Switch to Code
                    </>
                  ) : (
                    <>
                      <Icon.Grid className="w-4 h-4" />
                      Switch to UI
                    </>
                  )}
                </Button>
              )}
              <Button onClick={handlePreviewChanges} className="text-sm">Preview changes</Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Code Editor Mode */}
      {editorMode === 'code' ? (
        <CodeEditorStep
          selectedTemplate={state.template}
          onTemplateChange={(updatedTemplate) => {
            dispatch({ type: "UPDATE_TEMPLATE", template: updatedTemplate });
            onTemplateChange?.(updatedTemplate);
          }}
          embedded={true}
        />
      ) : (
        <>
          {/* Validation Warnings Panel */}
          {validationResult.warnings.length > 0 && (
            <Card className="p-4 sm:p-6 border-amber-200 bg-amber-50">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-amber-800 mb-2">
                Template Validation Warnings
              </h3>
              <ul className="space-y-2">
                {validationResult.warnings.map((warning, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-amber-700">
                    {warning.severity === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    )}
                    <span>{warning.message}</span>
                  </li>
                ))}
              </ul>
              {validationResult.warnings.some(w => w.suggestedIds) && (
                <p className="text-xs text-amber-600 mt-3">
                  Use the "Quick Add" buttons below to add recommended fields with standard IDs.
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Quick Add Semantic Fields */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#50be8f]" />
            <div>
              <h2 className="text-base sm:text-lg font-medium text-[#222526]">
                Quick Add Standard Fields
              </h2>
              <p className="text-xs sm:text-sm text-[#69737c]">
                Add fields with recommended IDs for proper certificate display
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {SEMANTIC_FIELD_PRESETS.map((preset) => {
            const alreadyExists = allItems.some(item => item.id === preset.item.id);
            const isNeeded =
              (preset.semantic === 'title' && !validationResult.hasTitleField) ||
              (preset.semantic === 'image' && !validationResult.hasImageField) ||
              (preset.semantic === 'description' && !validationResult.hasDescriptionField) ||
              (preset.semantic === 'company_logo' && !validationResult.hasCompanyLogoField) ||
              (preset.semantic === 'company_name' && !validationResult.hasCompanyNameField);

            return (
              <Button
                key={preset.item.id}
                variant={isNeeded ? "default" : "outline"}
                size="sm"
                disabled={alreadyExists}
                onClick={() => {
                  // Add to first section (Certificate) by default
                  const targetSection = sections[0]?.id || '';
                  if (targetSection) {
                    handleAddSemanticField(preset, targetSection);
                  }
                }}
                className={`text-xs ${isNeeded ? 'bg-[#50be8f] hover:bg-[#45a87d]' : ''}`}
                title={preset.description}
              >
                <Icon.Plus className="w-3 h-3 mr-1" />
                {preset.label}
                {alreadyExists && <span className="ml-1 text-[10px]">(exists)</span>}
              </Button>
            );
          })}
        </div>
      </Card>

      {/* Multi Language Support */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
          <div>
            <h2 className="text-base sm:text-lg font-medium text-[#222526]">
              Multi Language Support
            </h2>
            <p className="text-xs sm:text-sm text-[#69737c]">
              Add new languages you plan to support
            </p>
          </div>
          <Button variant="outline" onClick={handleAddLanguage} className="text-sm self-start sm:self-auto">
            <Icon.Plus className="w-4 h-4 mr-2" />
            Add language
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-4 mb-3 sm:mb-4">
          {languages.map((language: TemplateLanguage) => (
            <div
              key={language.id}
              className="flex items-center gap-2 sm:gap-3 bg-[#f1f6f9] rounded-lg p-2 sm:p-4 min-w-[140px] sm:min-w-[200px] relative group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center text-[#69737c] font-bold text-sm sm:text-base">
                {language.code}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#222526] text-sm sm:text-base truncate">{language.name}</p>
                {language.isDefault && (
                  <p className="text-[10px] sm:text-xs text-[#69737c]">Default</p>
                )}
              </div>
              {!language.isDefault && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                  onClick={() => handleDeleteLanguageClick(language)}
                >
                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="text-[10px] sm:text-xs text-[#69737c] uppercase tracking-wider">
          {languages.length} {languages.length === 1 ? "language" : "languages"}
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
          onReorderItems={handleReorderItems}
        />
      ))}

      {/* Add New Section - COMMENTED OUT: Templates now have fixed sections (Certificate & Information) */}
      {/* <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-[#222526]">Add New Section</h2>
            <p className="text-sm text-[#69737c]">
              Templates have 2 fixed sections: Certificate (formal certification data) and Information (about, experience, gallery).
            </p>
          </div>
          <Button variant="outline" onClick={handleAddSection}>
            <Icon.Plus className="w-4 h-4 mr-2" />
            Add section
          </Button>
        </div>
      </Card> */}

      {/* Choose a search index */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex-1">
            <h2 className="text-base sm:text-lg font-medium text-[#222526]">
              Choose a search index
            </h2>
            <p className="text-xs sm:text-sm text-[#69737c]">
              Select a field from the template that you can use to search and
              index certificates
            </p>
          </div>
          <Select
            value={state.searchIndexField}
            onValueChange={handleSearchIndexChange}
          >
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="Select field..." />
            </SelectTrigger>
            <SelectContent>
              {allItems
                .filter(
                  (item) => item.type === "input" || item.type === "badge",
                )
                .map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </Card>
        </>
      )}

      {/* Navigation buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 pt-4 sm:pt-6">
        <Button variant="outline" onClick={onBack} className="w-full sm:w-auto order-2 sm:order-1">
          Back
        </Button>
        <Button onClick={handlePreviewChanges} className="w-full sm:w-auto order-1 sm:order-2">Next</Button>
      </div>

      {/* ========================================================================== */}
      {/* Modals */}
      {/* ========================================================================== */}

      {/* Add Language Modal */}
      <Dialog
        open={state.modals.addLanguage}
        onOpenChange={() => dispatch({ type: "CLOSE_ALL_MODALS" })}
      >
        <DialogContent className="w-[calc(100%-2rem)] max-w-[500px] !fixed !top-1/2 !left-1/2 !transform !-translate-x-1/2 !-translate-y-1/2">
          <DialogHeader>
            <DialogTitle>Add Language</DialogTitle>
            <DialogDescription>
              Add a new language to your template. Users will be able to view
              certificates in this language.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="language-name">Language Name</Label>
              <Input
                id="language-name"
                placeholder="e.g., English, Spanish, French"
                value={state.languageForm.name}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_LANGUAGE_FORM",
                    field: "name",
                    value: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language-code">Language Code</Label>
              <Input
                id="language-code"
                placeholder="e.g., EN, ES, FR"
                maxLength={2}
                value={state.languageForm.code}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_LANGUAGE_FORM",
                    field: "code",
                    value: e.target.value.toUpperCase(),
                  })
                }
              />
              <p className="text-xs text-[#69737c]">Use 2-letter ISO code</p>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="language-default"
                checked={state.languageForm.isDefault}
                onCheckedChange={(checked: boolean) =>
                  dispatch({
                    type: "UPDATE_LANGUAGE_FORM",
                    field: "isDefault",
                    value: checked,
                  })
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
            <Button
              variant="outline"
              onClick={() => dispatch({ type: "CLOSE_ALL_MODALS" })}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAddLanguage}
              disabled={!state.languageForm.name || !state.languageForm.code}
            >
              Add Language
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Language Modal */}
      <Dialog
        open={state.modals.deleteLanguage}
        onOpenChange={() => dispatch({ type: "CLOSE_ALL_MODALS" })}
      >
        <DialogContent className="w-[calc(100%-2rem)] max-w-[425px] !fixed !top-1/2 !left-1/2 !transform !-translate-x-1/2 !-translate-y-1/2">
          <DialogHeader>
            <DialogTitle>Delete Language</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {state.selectedLanguage?.name}?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => dispatch({ type: "CLOSE_ALL_MODALS" })}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDeleteLanguage}>
              Delete Language
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Field Modal */}
      <Dialog
        open={state.modals.addField}
        onOpenChange={() => dispatch({ type: "CLOSE_ALL_MODALS" })}
      >
        <DialogContent className="w-[calc(100%-2rem)] max-w-[600px] max-h-[90vh] overflow-y-auto !fixed !top-1/2 !left-1/2 !transform !-translate-x-1/2 !-translate-y-1/2">
          <DialogHeader>
            <DialogTitle>Add Field</DialogTitle>
            <DialogDescription>
              Add a new field to the selected section. This field will be
              available when creating certificates.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Info tip about standard fields */}
            <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-blue-700">
                <strong>Tip:</strong> For certificate title, images, or description fields, use the{" "}
                <span className="font-medium">"Quick Add Standard Fields"</span> section above.
                Those fields use standard IDs that ensure proper certificate display.
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="field-label">Field Label *</Label>
              <Input
                id="field-label"
                placeholder="e.g., Certificate Title, Student Name"
                value={state.fieldForm.label}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD_FORM",
                    field: "label",
                    value: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="field-type">Field Type *</Label>
              <Select
                value={state.fieldForm.type}
                onValueChange={(value: any) =>
                  dispatch({
                    type: "UPDATE_FIELD_FORM",
                    field: "type",
                    value: value,
                  })
                }
              >
                <SelectTrigger id="field-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="input">Text Input</SelectItem>
                  <SelectItem value="textarea">Text Area</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="badge">Badge</SelectItem>
                  <SelectItem value="readonly">Read Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {state.fieldForm.type === "input" && (
              <div className="space-y-2">
                <Label htmlFor="field-placeholder">Placeholder</Label>
                <Input
                  id="field-placeholder"
                  placeholder="Enter placeholder text..."
                  value={state.fieldForm.placeholder}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_FIELD_FORM",
                      field: "placeholder",
                      value: e.target.value,
                    })
                  }
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="field-description">Description</Label>
              <Textarea
                id="field-description"
                placeholder="Optional description to help users understand this field..."
                value={state.fieldForm.description}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD_FORM",
                    field: "description",
                    value: e.target.value,
                  })
                }
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="field-required"
                checked={state.fieldForm.required}
                onCheckedChange={(checked: boolean) =>
                  dispatch({
                    type: "UPDATE_FIELD_FORM",
                    field: "required",
                    value: checked,
                  })
                }
              />
              <Label
                htmlFor="field-required"
                className="text-sm font-normal cursor-pointer"
              >
                Required field
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => dispatch({ type: "CLOSE_ALL_MODALS" })}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAddField}
              disabled={!state.fieldForm.label}
            >
              Add Field
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Field Modal */}
      <Dialog
        open={state.modals.editField}
        onOpenChange={() => dispatch({ type: "CLOSE_ALL_MODALS" })}
      >
        <DialogContent className="w-[calc(100%-2rem)] max-w-[600px] max-h-[90vh] overflow-y-auto !fixed !top-1/2 !left-1/2 !transform !-translate-x-1/2 !-translate-y-1/2">
          <DialogHeader>
            <DialogTitle>Edit Field</DialogTitle>
            <DialogDescription>
              Update the field properties. Changes will affect new certificates
              only.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-field-label">Field Label *</Label>
              <Input
                id="edit-field-label"
                placeholder="e.g., Certificate Title, Student Name"
                value={state.fieldForm.label}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD_FORM",
                    field: "label",
                    value: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-field-type">Field Type *</Label>
              <Select
                value={state.fieldForm.type}
                onValueChange={(value: any) =>
                  dispatch({
                    type: "UPDATE_FIELD_FORM",
                    field: "type",
                    value: value,
                  })
                }
              >
                <SelectTrigger id="edit-field-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="input">Text Input</SelectItem>
                  <SelectItem value="textarea">Text Area</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="badge">Badge</SelectItem>
                  <SelectItem value="readonly">Read Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {state.fieldForm.type === "input" && (
              <div className="space-y-2">
                <Label htmlFor="edit-field-placeholder">Placeholder</Label>
                <Input
                  id="edit-field-placeholder"
                  placeholder="Enter placeholder text..."
                  value={state.fieldForm.placeholder}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_FIELD_FORM",
                      field: "placeholder",
                      value: e.target.value,
                    })
                  }
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="edit-field-description">Description</Label>
              <Textarea
                id="edit-field-description"
                placeholder="Optional description to help users understand this field..."
                value={state.fieldForm.description}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD_FORM",
                    field: "description",
                    value: e.target.value,
                  })
                }
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-field-required"
                checked={state.fieldForm.required}
                onCheckedChange={(checked: boolean) =>
                  dispatch({
                    type: "UPDATE_FIELD_FORM",
                    field: "required",
                    value: checked,
                  })
                }
              />
              <Label
                htmlFor="edit-field-required"
                className="text-sm font-normal cursor-pointer"
              >
                Required field
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => dispatch({ type: "CLOSE_ALL_MODALS" })}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmEditField}
              disabled={!state.fieldForm.label}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Field Modal */}
      <Dialog
        open={state.modals.deleteField}
        onOpenChange={() => dispatch({ type: "CLOSE_ALL_MODALS" })}
      >
        <DialogContent className="w-[calc(100%-2rem)] max-w-[425px] !fixed !top-1/2 !left-1/2 !transform !-translate-x-1/2 !-translate-y-1/2">
          <DialogHeader>
            <DialogTitle>Delete Field</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the field "
              {state.selectedField?.label}"? This action cannot be undone and
              will affect the template structure.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => dispatch({ type: "CLOSE_ALL_MODALS" })}
            >
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
