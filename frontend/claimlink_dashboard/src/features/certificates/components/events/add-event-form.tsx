/**
 * AddEventForm Component
 *
 * Form for adding a new event to a certificate's history.
 * Includes date picker, category selection, description, and optional file upload.
 */

import { useState, useRef, type ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Upload, X, FileText, Image, Film } from 'lucide-react';
import type { EventCategory } from '../detail/certificate-events';

export interface AddEventFormData {
  date: string;
  category: EventCategory;
  description: string;
  file?: File;
}

interface AddEventFormProps {
  onSubmit: (data: AddEventFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const EVENT_CATEGORIES: { value: EventCategory; label: string; description: string }[] = [
  { value: 'appraisal', label: 'Appraisal', description: 'Valuation or assessment event' },
  { value: 'service', label: 'Service', description: 'Maintenance or service work' },
  { value: 'restoration', label: 'Restoration', description: 'Restoration or repair work' },
  { value: 'transfer', label: 'Transfer', description: 'Ownership transfer or handover' },
  { value: 'exhibition', label: 'Exhibition', description: 'Display or exhibition event' },
  { value: 'other', label: 'Other', description: 'Other type of event' },
];

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function AddEventForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
}: AddEventFormProps) {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<EventCategory>('other');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFileError(null);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Check file size
    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      setFileError(`File size must be less than ${MAX_FILE_SIZE_MB}MB`);
      return;
    }

    setFile(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      return;
    }

    onSubmit({
      date,
      category,
      description: description.trim(),
      file: file || undefined,
    });
  };

  const getFileIcon = () => {
    if (!file) return <FileText className="w-5 h-5" />;

    if (file.type.startsWith('image/')) {
      return <Image className="w-5 h-5 text-blue-500" />;
    }
    if (file.type.startsWith('video/')) {
      return <Film className="w-5 h-5 text-purple-500" />;
    }
    return <FileText className="w-5 h-5 text-gray-500" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Date Field */}
      <div className="space-y-2">
        <Label htmlFor="event-date" className="text-sm font-medium">
          Date *
        </Label>
        <div className="relative">
          <Input
            id="event-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="pl-10"
          />
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#69737c]" />
        </div>
      </div>

      {/* Category Field */}
      <div className="space-y-2">
        <Label htmlFor="event-category" className="text-sm font-medium">
          Category *
        </Label>
        <Select value={category} onValueChange={(v) => setCategory(v as EventCategory)}>
          <SelectTrigger id="event-category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {EVENT_CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                <div className="flex flex-col">
                  <span>{cat.label}</span>
                  <span className="text-xs text-[#69737c]">{cat.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <Label htmlFor="event-description" className="text-sm font-medium">
          Description *
        </Label>
        <Textarea
          id="event-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the event..."
          rows={4}
          required
          className="resize-none"
        />
        <p className="text-xs text-[#69737c]">
          Provide details about what happened during this event.
        </p>
      </div>

      {/* File Upload Field */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Attachment <span className="text-[#69737c] font-normal">(optional)</span>
        </Label>

        {file ? (
          <div className="flex items-center gap-3 p-3 bg-[#f5f5f5] rounded-lg">
            {getFileIcon()}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-[#69737c]">{formatFileSize(file.size)}</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemoveFile}
              className="h-8 w-8 p-0 text-[#69737c] hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#e1e1e1] rounded-lg cursor-pointer hover:border-[#615bff] hover:bg-[#f5f5ff] transition-colors"
          >
            <Upload className="w-8 h-8 text-[#69737c] mb-2" />
            <p className="text-sm text-[#69737c]">
              Click to upload a file
            </p>
            <p className="text-xs text-[#9ca3af] mt-1">
              Images, PDFs, or documents (max {MAX_FILE_SIZE_MB}MB)
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          accept="image/*,video/*,.pdf,.doc,.docx"
          className="hidden"
        />

        {fileError && (
          <p className="text-xs text-red-500">{fileError}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end pt-4 border-t border-[#e1e1e1]">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !description.trim()}
          className="bg-[#222526] hover:bg-[#333333]"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              Adding...
            </span>
          ) : (
            'Add Event'
          )}
        </Button>
      </div>
    </form>
  );
}
