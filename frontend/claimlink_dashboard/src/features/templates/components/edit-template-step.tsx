import { useState } from 'react';
import { type Template } from '@/shared/data';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/common';
import Icon from '@/shared/ui/icons';

interface EditTemplateStepProps {
  selectedTemplate: Template | null;
  onNext?: () => void;
  onBack?: () => void;
}

interface Field {
  id: string;
  name: string;
  label: string;
  inputType: string;
  immutable: boolean;
}

interface Language {
  id: string;
  code: string;
  name: string;
}

const mockLanguages: Language[] = [
  { id: 'en', code: 'EN', name: 'English' },
  { id: 'fr', code: 'FR', name: 'French' },
  { id: 'it', code: 'IT', name: 'Italian' },
];

const mockFields: Field[] = [
  { id: '1', name: 'files-mainImage', label: 'Main Image', inputType: 'images', immutable: false },
  { id: '2', name: 'title', label: 'Title', inputType: 'text', immutable: false },
  { id: '3', name: 'description', label: 'Description', inputType: 'text', immutable: false },
  { id: '4', name: 'issuedBy', label: 'Issued By', inputType: 'text', immutable: true },
  { id: '5', name: 'companyName', label: 'Company Name', inputType: 'text', immutable: false },
  { id: '6', name: 'vatNumber', label: 'VAT Number', inputType: 'text', immutable: false },
];

export function EditTemplateStep({ onNext, onBack }: EditTemplateStepProps) {
  const [languages] = useState<Language[]>(mockLanguages);
  const [fields] = useState<Field[]>(mockFields);
  const [searchIndex, setSearchIndex] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const handleAddLanguage = () => {
    // TODO: Implement add language logic
    console.log('Add language');
  };

  const handleAddSection = () => {
    // TODO: Implement add section logic
    console.log('Add section');
  };

  const handleAddField = () => {
    // TODO: Implement add field logic
    console.log('Add field');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  // Get paginated fields
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedFields = fields.slice(startIndex, endIndex);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm text-[#69737c] uppercase tracking-wider">
              Applied on 14 certificates
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Icon.Mint className="w-4 h-4" />
              Save as draft
            </Button>
            <Button>Preview changes</Button>
          </div>
        </div>
      </Card>

      {/* Multi Language Support */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium text-[#222526]">Multi Language Support</h2>
            <p className="text-sm text-[#69737c]">Add a new languages you plan to support</p>
          </div>
          <Button variant="outline" onClick={handleAddLanguage}>
            <Icon.Plus className="w-4 h-4 mr-2" />
            Add language
          </Button>
        </div>

        <div className="flex flex-wrap gap-4 mb-4">
          {languages.map((language) => (
            <div
              key={language.id}
              className="flex items-center gap-3 bg-[#f1f6f9] rounded-lg p-4 min-w-[200px]"
            >
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-[#69737c] font-bold">
                {language.code}
              </div>
              <div>
                <p className="font-medium text-[#222526]">{language.name}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-xs text-[#69737c] uppercase tracking-wider">
          {languages.length} languages
        </div>
      </Card>

      {/* Sections */}
      <Card className="p-6 bg-[#f4f3f3] border-[#e1e1e1]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium text-[#222526]">Certificate introduction</h2>
          </div>
          <Button variant="outline" size="sm">
            <Icon.Menu className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Company Name Field */}
          <div className="bg-white rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <Icon.Menu className="w-3 h-3 text-[#e1e1e1]" />
              <div className="w-12 h-12 bg-[#222526] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">Tt</span>
              </div>
              <div>
                <p className="font-medium text-[#222526]">Company Name</p>
                <p className="text-sm text-[#69737c]">Title</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Icon.InfoCircle className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Icon.Mint className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Icon.Close className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Certificate Title Field */}
          <div className="bg-white rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <Icon.Menu className="w-3 h-3 text-[#e1e1e1]" />
              <div className="w-12 h-12 bg-[#222526] rounded-lg flex items-center justify-center">
                <Icon.Mint className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-medium text-[#222526]">Certificate Title</p>
                <p className="text-sm text-[#69737c]">Input</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Icon.InfoCircle className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Icon.Mint className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Icon.Close className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Short description Field */}
          <div className="bg-white rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <Icon.Menu className="w-3 h-3 text-[#e1e1e1]" />
              <div className="w-12 h-12 bg-[#222526] rounded-lg flex items-center justify-center">
                <Icon.Mint className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-medium text-[#222526]">Short description</p>
                <p className="text-sm text-[#69737c]">Input</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Icon.InfoCircle className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Icon.Mint className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Icon.Close className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Issued By Field */}
          <div className="bg-white rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <Icon.Menu className="w-3 h-3 text-[#e1e1e1]" />
              <div className="w-12 h-12 bg-[#222526] rounded-lg flex items-center justify-center">
                <Icon.CircleStack className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-[#222526]">Issued By</p>
                <p className="text-sm text-[#69737c]">Badge</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Icon.InfoCircle className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Icon.Mint className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Icon.Close className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Certificate Section */}
      <Card className="p-6 bg-[#f4f3f3] border-[#e1e1e1]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium text-[#222526]">Certificate</h2>
          </div>
          <Button variant="outline" size="sm">
            <Icon.Menu className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Certificate Title Field */}
          <div className="bg-white rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <Icon.Menu className="w-3 h-3 text-[#e1e1e1]" />
              <div className="w-12 h-12 bg-[#222526] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">Tt</span>
              </div>
              <div>
                <p className="font-medium text-[#222526]">100% made in italy certificate</p>
                <p className="text-sm text-[#69737c]">Title</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Icon.InfoCircle className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Icon.Mint className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Icon.Close className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Company Name Field */}
          <div className="bg-white rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <Icon.Menu className="w-3 h-3 text-[#e1e1e1]" />
              <div className="w-12 h-12 bg-[#222526] rounded-lg flex items-center justify-center">
                <Icon.Mint className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-medium text-[#222526]">Company Name</p>
                <p className="text-sm text-[#69737c]">Input</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Icon.InfoCircle className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Icon.Mint className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Icon.Close className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* VAT Number Field */}
          <div className="bg-white rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <Icon.Menu className="w-3 h-3 text-[#e1e1e1]" />
              <div className="w-12 h-12 bg-[#222526] rounded-lg flex items-center justify-center">
                <Icon.Mint className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-medium text-[#222526]">VAT number</p>
                <p className="text-sm text-[#69737c]">Input</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Icon.InfoCircle className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Icon.Mint className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Icon.Close className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Image Gallery Field */}
          <div className="bg-white rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <Icon.Menu className="w-3 h-3 text-[#e1e1e1]" />
              <div className="w-12 h-12 bg-[#222526] rounded-lg flex items-center justify-center">
                <Icon.Mint className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-medium text-[#222526]">Image Gallery</p>
                <p className="text-sm text-[#69737c]">Image</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Icon.InfoCircle className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Icon.Mint className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Icon.Close className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* About Section */}
      <Card className="p-6 bg-[#f4f3f3] border-[#e1e1e1]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium text-[#222526]">About</h2>
          </div>
          <Button variant="outline" size="sm">
            <Icon.Menu className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Title Field */}
          <div className="bg-white rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <Icon.Menu className="w-3 h-3 text-[#e1e1e1]" />
              <div className="w-12 h-12 bg-[#222526] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">Tt</span>
              </div>
              <div>
                <p className="font-medium text-[#222526]">100% made in italy certificate</p>
                <p className="text-sm text-[#69737c]">Title</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Icon.InfoCircle className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Icon.Mint className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Icon.Close className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Company Name Field */}
          <div className="bg-white rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <Icon.Menu className="w-3 h-3 text-[#e1e1e1]" />
              <div className="w-12 h-12 bg-[#222526] rounded-lg flex items-center justify-center">
                <Icon.Mint className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-medium text-[#222526]">Company Name</p>
                <p className="text-sm text-[#69737c]">Input</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Icon.InfoCircle className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Icon.Mint className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Icon.Close className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* VAT Number Field */}
          <div className="bg-white rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <Icon.Menu className="w-3 h-3 text-[#e1e1e1]" />
              <div className="w-12 h-12 bg-[#222526] rounded-lg flex items-center justify-center">
                <Icon.Mint className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-medium text-[#222526]">VAT number</p>
                <p className="text-sm text-[#69737c]">Input</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Icon.InfoCircle className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Icon.Mint className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Icon.Close className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Experience Section */}
      <Card className="p-6 bg-[#f4f3f3] border-[#e1e1e1]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium text-[#222526]">Experience</h2>
          </div>
          <Button variant="outline" size="sm">
            <Icon.Menu className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Title Field */}
          <div className="bg-white rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <Icon.Menu className="w-3 h-3 text-[#e1e1e1]" />
              <div className="w-12 h-12 bg-[#222526] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">Tt</span>
              </div>
              <div>
                <p className="font-medium text-[#222526]">100% made in italy certificate</p>
                <p className="text-sm text-[#69737c]">Title</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Icon.InfoCircle className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Icon.Mint className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Icon.Close className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Company Name Field */}
          <div className="bg-white rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <Icon.Menu className="w-3 h-3 text-[#e1e1e1]" />
              <div className="w-12 h-12 bg-[#222526] rounded-lg flex items-center justify-center">
                <Icon.Mint className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-medium text-[#222526]">Company Name</p>
                <p className="text-sm text-[#69737c]">Input</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Icon.InfoCircle className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Icon.Mint className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Icon.Close className="w-4 h-4" />
              </Button>
        </div>
      </div>

          {/* VAT Number Field */}
          <div className="bg-white rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <Icon.Menu className="w-3 h-3 text-[#e1e1e1]" />
              <div className="w-12 h-12 bg-[#222526] rounded-lg flex items-center justify-center">
                <Icon.Mint className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-medium text-[#222526]">VAT number</p>
                <p className="text-sm text-[#69737c]">Input</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Icon.InfoCircle className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Icon.Mint className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Icon.Close className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Add New Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-[#222526]">Add New Section</h2>
            <p className="text-sm text-[#69737c]">Add a new section to group data fields</p>
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
              Select a field from a data structure that you can search by to index the certificate
        </p>
      </div>
          <Select value={searchIndex} onValueChange={setSearchIndex}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select field..." />
            </SelectTrigger>
            <SelectContent>
              {fields.map((field) => (
                <SelectItem key={field.id} value={field.name}>
                  {field.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Add New Field */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium text-[#222526]">Add New Field</h2>
            <p className="text-sm text-[#69737c]">Add a new field to this Data Structure</p>
          </div>
          <Button onClick={handleAddField}>
            <Icon.Plus className="w-4 h-4 mr-2" />
            Add field
          </Button>
        </div>

        {/* Fields Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16"></TableHead>
                <TableHead className="w-64">Name</TableHead>
                <TableHead className="w-64">Label</TableHead>
                <TableHead className="w-32">Input Type</TableHead>
                <TableHead className="w-24">Immutable</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedFields.map((field) => (
                <TableRow key={field.id}>
                  <TableCell>
                    <Icon.Menu className="w-4 h-4 text-[#e1e1e1]" />
                  </TableCell>
                  <TableCell className="font-mono text-sm">{field.name}</TableCell>
                  <TableCell>{field.label}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{field.inputType}</Badge>
                  </TableCell>
                  <TableCell>
                    {field.immutable && (
                      <Badge variant="outline">Yes</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Icon.InfoCircle className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Icon.Mint className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(fields.length / itemsPerPage)}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          itemsPerPageOptions={[5, 10, 20, 50]}
          className="border-t-0 bg-transparent px-0 py-4 rounded-none"
        />
      </Card>

      {/* Navigation buttons */}
      <div className="flex justify-center gap-4 pt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  );
}
