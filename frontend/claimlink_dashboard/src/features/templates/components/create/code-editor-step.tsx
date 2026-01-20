/**
 * CodeEditorStep Component
 *
 * JSON code editor for developers who want to manually create templates.
 * Features:
 * - Monaco Editor with JSON syntax highlighting
 * - Left sidebar for language/section navigation
 * - Toolbar with Copy, Export, Reset buttons
 * - Real-time JSON validation
 */

import { useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import Icon from '@/shared/ui/icons';
import type { Template } from '@/shared/data';
import type { TemplateStructure } from '../../types/template.types';
import {
  parseTemplateJson,
  formatJson,
  downloadTemplateJson,
  copyToClipboard,
  createBlankTemplate,
  type ValidationError,
} from '../../utils/template-json-utils';

interface CodeEditorStepProps {
  selectedTemplate: Template | null;
  onNext?: () => void;
  onBack?: () => void;
  onTemplateChange?: (template: Template) => void;
  /** When true, hides header, footer, and shows a minimal layout for embedding in UI editor */
  embedded?: boolean;
}

export function CodeEditorStep({
  selectedTemplate,
  onNext,
  onBack,
  onTemplateChange,
  embedded = false,
}: CodeEditorStepProps) {
  // Initial JSON from template structure or blank template
  const getInitialJson = useCallback(() => {
    if (selectedTemplate?.structure) {
      return formatJson(selectedTemplate.structure);
    }
    return formatJson(createBlankTemplate());
  }, [selectedTemplate]);

  const [editorValue, setEditorValue] = useState<string>(getInitialJson);
  const [initialValue, setInitialValue] = useState<string>(getInitialJson);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isValid, setIsValid] = useState(true);
  const [languagesOpen, setLanguagesOpen] = useState(true);
  const [sectionsOpen, setSectionsOpen] = useState(true);

  // Parse current JSON to get structure for sidebar
  const [currentStructure, setCurrentStructure] = useState<TemplateStructure | null>(
    selectedTemplate?.structure || createBlankTemplate()
  );

  // Reset editor when template changes
  useEffect(() => {
    const json = getInitialJson();
    setEditorValue(json);
    setInitialValue(json);
    setCurrentStructure(selectedTemplate?.structure || createBlankTemplate());
  }, [selectedTemplate, getInitialJson]);

  // Validate JSON and update structure on change
  const handleEditorChange = useCallback((value: string | undefined) => {
    const json = value || '';
    setEditorValue(json);

    const result = parseTemplateJson(json);
    setIsValid(result.valid);
    setValidationErrors(result.errors);

    if (result.valid && result.data) {
      setCurrentStructure(result.data);

      // Update parent template
      if (selectedTemplate && onTemplateChange) {
        onTemplateChange({
          ...selectedTemplate,
          structure: result.data,
        });
      }
    }
  }, [selectedTemplate, onTemplateChange]);

  // Copy JSON to clipboard
  const handleCopy = async () => {
    const success = await copyToClipboard(editorValue);
    if (success) {
      toast.success('JSON copied to clipboard');
    } else {
      toast.error('Failed to copy to clipboard');
    }
  };

  // Export JSON as file
  const handleExport = () => {
    if (!isValid || !currentStructure) {
      toast.error('Cannot export invalid JSON');
      return;
    }
    const filename = selectedTemplate?.name
      ? `${selectedTemplate.name.toLowerCase().replace(/\s+/g, '-')}-template.json`
      : 'template.json';
    downloadTemplateJson(currentStructure, filename);
    toast.success(`Template exported as ${filename}`);
  };

  // Reset to initial/saved state
  const handleReset = () => {
    setEditorValue(initialValue);
    const result = parseTemplateJson(initialValue);
    setIsValid(result.valid);
    setValidationErrors(result.errors);
    if (result.valid && result.data) {
      setCurrentStructure(result.data);
    }
    toast.info('Editor reset to initial state');
  };

  // Navigate to a specific section/item in the editor
  const handleNavigateToSection = (sectionName: string) => {
    // Find the line containing this section name
    const lines = editorValue.split('\n');
    const lineIndex = lines.findIndex(line =>
      line.includes(`"name": "${sectionName}"`) ||
      line.includes(`"id": "section_${sectionName.toLowerCase()}"`)
    );
    if (lineIndex !== -1) {
      // Monaco editor line numbers are 1-indexed
      toast.info(`Navigate to line ${lineIndex + 1}`);
    }
  };

  // Navigate to a language in the editor
  const handleNavigateToLanguage = (langCode: string) => {
    const lines = editorValue.split('\n');
    const lineIndex = lines.findIndex(line =>
      line.includes(`"code": "${langCode}"`)
    );
    if (lineIndex !== -1) {
      toast.info(`Navigate to line ${lineIndex + 1}`);
    }
  };

  // Proceed to next step
  const handleNext = () => {
    if (!isValid) {
      toast.error('Please fix JSON errors before proceeding');
      return;
    }
    onNext?.();
  };

  // For embedded mode, render a simplified layout
  if (embedded) {
    return (
      <Card className="border border-[#e1e1e1] rounded-[16px] overflow-hidden">
        <div className="flex min-h-[500px]">
          {/* Left Sidebar */}
          <div className="w-[220px] border-r border-[#e1e1e1] bg-[#fafafa] p-4 flex flex-col">
            <p className="text-[12px] text-[#69737c] uppercase tracking-wider mb-3">
              Navigation
            </p>

            {/* Languages Section */}
            <Collapsible open={languagesOpen} onOpenChange={setLanguagesOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium text-[#222526] hover:bg-[#f0f0f0] rounded px-2">
                <span>Languages ({currentStructure?.languages?.length || 0})</span>
                <Icon.Chevron
                  className={`w-4 h-4 transition-transform ${languagesOpen ? 'rotate-180' : ''}`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-2">
                {currentStructure?.languages?.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => handleNavigateToLanguage(lang.code)}
                    className="w-full text-left py-1.5 px-2 text-[13px] text-[#69737c] hover:bg-[#e8e8e8] rounded flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#615bff]" />
                    {lang.name}
                    {lang.isDefault && (
                      <span className="text-[10px] text-[#615bff] ml-auto">(default)</span>
                    )}
                  </button>
                ))}
              </CollapsibleContent>
            </Collapsible>

            {/* Sections */}
            <Collapsible open={sectionsOpen} onOpenChange={setSectionsOpen} className="mt-3">
              <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium text-[#222526] hover:bg-[#f0f0f0] rounded px-2">
                <span>Sections ({currentStructure?.sections?.length || 0})</span>
                <Icon.Chevron
                  className={`w-4 h-4 transition-transform ${sectionsOpen ? 'rotate-180' : ''}`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-2">
                {currentStructure?.sections?.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleNavigateToSection(section.name)}
                    className="w-full text-left py-1.5 px-2 text-[13px] text-[#69737c] hover:bg-[#e8e8e8] rounded flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#50be8f]" />
                    {section.name}
                    <span className="text-[10px] text-[#9ca3af] ml-auto">
                      {section.items?.length || 0} items
                    </span>
                  </button>
                ))}
              </CollapsibleContent>
            </Collapsible>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Help Links */}
            <div className="border-t border-[#e1e1e1] pt-4 mt-4 space-y-2">
              <button className="w-full text-left py-1.5 px-2 text-[13px] text-[#615bff] hover:bg-[#e8e8e8] rounded">
                Technical help
              </button>
              <button className="w-full text-left py-1.5 px-2 text-[13px] text-[#615bff] hover:bg-[#e8e8e8] rounded">
                Contact us
              </button>
            </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 flex flex-col">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-[#e1e1e1] bg-[#f8f8f8]">
              <div className="flex items-center gap-2">
                <Icon.Code className="w-4 h-4 text-[#69737c]" />
                <span className="text-[13px] text-[#69737c]">template.json</span>
                {!isValid && (
                  <span className="text-[11px] text-red-500 ml-2">
                    ({validationErrors.length} error{validationErrors.length !== 1 ? 's' : ''})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8 px-3 text-[13px]"
                >
                  <Icon.Copy className="w-4 h-4 mr-1.5" />
                  Copy
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExport}
                  disabled={!isValid}
                  className="h-8 px-3 text-[13px]"
                >
                  <Icon.Download className="w-4 h-4 mr-1.5" />
                  Export
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="h-8 px-3 text-[13px]"
                >
                  <Icon.Reset className="w-4 h-4 mr-1.5" />
                  Reset
                </Button>
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1">
              <Editor
                height="100%"
                defaultLanguage="json"
                value={editorValue}
                onChange={handleEditorChange}
                theme="vs-light"
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  formatOnPaste: true,
                  formatOnType: true,
                  tabSize: 2,
                  automaticLayout: true,
                }}
              />
            </div>

            {/* Error Panel */}
            {validationErrors.length > 0 && (
              <div className="border-t border-[#e1e1e1] bg-[#fef2f2] p-3 max-h-[120px] overflow-y-auto">
                <p className="text-[12px] font-medium text-red-600 mb-2">Validation Errors:</p>
                <ul className="space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="text-[12px] text-red-500 flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      <span>
                        <code className="bg-red-100 px-1 rounded text-[11px]">{error.path}</code>
                        {' '}{error.message}
                        {error.line && <span className="text-red-400 ml-1">(line {error.line})</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card className="border border-[#e1e1e1] rounded-[16px] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#e1e1e1]">
          <h2 className="text-[24px] text-[#222526] font-medium tracking-[1.2px] text-center">
            Code your template
          </h2>
          <p className="text-[13px] text-[#69737c] text-center mt-1">
            Edit your template structure using JSON format
          </p>
        </div>

        {/* Main Content */}
        <div className="flex min-h-[500px]">
          {/* Left Sidebar */}
          <div className="w-[220px] border-r border-[#e1e1e1] bg-[#fafafa] p-4 flex flex-col">
            <p className="text-[12px] text-[#69737c] uppercase tracking-wider mb-3">
              Navigation
            </p>

            {/* Languages Section */}
            <Collapsible open={languagesOpen} onOpenChange={setLanguagesOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium text-[#222526] hover:bg-[#f0f0f0] rounded px-2">
                <span>Languages ({currentStructure?.languages?.length || 0})</span>
                <Icon.Chevron
                  className={`w-4 h-4 transition-transform ${languagesOpen ? 'rotate-180' : ''}`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-2">
                {currentStructure?.languages?.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => handleNavigateToLanguage(lang.code)}
                    className="w-full text-left py-1.5 px-2 text-[13px] text-[#69737c] hover:bg-[#e8e8e8] rounded flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#615bff]" />
                    {lang.name}
                    {lang.isDefault && (
                      <span className="text-[10px] text-[#615bff] ml-auto">(default)</span>
                    )}
                  </button>
                ))}
              </CollapsibleContent>
            </Collapsible>

            {/* Sections */}
            <Collapsible open={sectionsOpen} onOpenChange={setSectionsOpen} className="mt-3">
              <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium text-[#222526] hover:bg-[#f0f0f0] rounded px-2">
                <span>Sections ({currentStructure?.sections?.length || 0})</span>
                <Icon.Chevron
                  className={`w-4 h-4 transition-transform ${sectionsOpen ? 'rotate-180' : ''}`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-2">
                {currentStructure?.sections?.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleNavigateToSection(section.name)}
                    className="w-full text-left py-1.5 px-2 text-[13px] text-[#69737c] hover:bg-[#e8e8e8] rounded flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#50be8f]" />
                    {section.name}
                    <span className="text-[10px] text-[#9ca3af] ml-auto">
                      {section.items?.length || 0} items
                    </span>
                  </button>
                ))}
              </CollapsibleContent>
            </Collapsible>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Help Links */}
            <div className="border-t border-[#e1e1e1] pt-4 mt-4 space-y-2">
              <button className="w-full text-left py-1.5 px-2 text-[13px] text-[#615bff] hover:bg-[#e8e8e8] rounded">
                Technical help
              </button>
              <button className="w-full text-left py-1.5 px-2 text-[13px] text-[#615bff] hover:bg-[#e8e8e8] rounded">
                Contact us
              </button>
            </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 flex flex-col">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-[#e1e1e1] bg-[#f8f8f8]">
              <div className="flex items-center gap-2">
                <Icon.Code className="w-4 h-4 text-[#69737c]" />
                <span className="text-[13px] text-[#69737c]">template.json</span>
                {!isValid && (
                  <span className="text-[11px] text-red-500 ml-2">
                    ({validationErrors.length} error{validationErrors.length !== 1 ? 's' : ''})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8 px-3 text-[13px]"
                >
                  <Icon.Copy className="w-4 h-4 mr-1.5" />
                  Copy
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExport}
                  disabled={!isValid}
                  className="h-8 px-3 text-[13px]"
                >
                  <Icon.Download className="w-4 h-4 mr-1.5" />
                  Export
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="h-8 px-3 text-[13px]"
                >
                  <Icon.Reset className="w-4 h-4 mr-1.5" />
                  Reset
                </Button>
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1">
              <Editor
                height="100%"
                defaultLanguage="json"
                value={editorValue}
                onChange={handleEditorChange}
                theme="vs-light"
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  formatOnPaste: true,
                  formatOnType: true,
                  tabSize: 2,
                  automaticLayout: true,
                }}
              />
            </div>

            {/* Error Panel */}
            {validationErrors.length > 0 && (
              <div className="border-t border-[#e1e1e1] bg-[#fef2f2] p-3 max-h-[120px] overflow-y-auto">
                <p className="text-[12px] font-medium text-red-600 mb-2">Validation Errors:</p>
                <ul className="space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="text-[12px] text-red-500 flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      <span>
                        <code className="bg-red-100 px-1 rounded text-[11px]">{error.path}</code>
                        {' '}{error.message}
                        {error.line && <span className="text-red-400 ml-1">(line {error.line})</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#e1e1e1] flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onBack}
            className="px-6"
          >
            Back
          </Button>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                // Save as draft logic would go here
                toast.info('Draft saved');
              }}
              className="px-6"
            >
              Save as draft
            </Button>
            <Button
              onClick={handleNext}
              disabled={!isValid}
              className="bg-[#222526] hover:bg-[#333333] text-white px-6"
            >
              Preview changes
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
