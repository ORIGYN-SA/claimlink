import { Upload, X } from 'lucide-react';

interface CsvUploadSectionProps {
  fileName: string | null;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  onUploadClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  uploadText?: string;
  acceptedFormats?: string;
  displayedAddresses?: string[];
}

/**
 * DUMB COMPONENT - Pure presentation
 * Receives all data and handlers via props
 * Reusable across campaigns, whitelists, and other CSV upload features
 */
export function CsvUploadSection({
  fileName,
  onFileSelect,
  onRemove,
  onUploadClick,
  fileInputRef,
  uploadText = "Upload your sheet",
  acceptedFormats = "CSV",
  displayedAddresses = [],
}: CsvUploadSectionProps) {
  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove();
  };

  return (
    <div className="space-y-4">
      {/* Display uploaded addresses if available */}
      {displayedAddresses.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--charcoal)]">Recipients addresses</label>
          <div className="bg-[var(--paper)] border border-[var(--mouse)] rounded-lg p-4 relative group">
            <div className="text-sm text-[var(--slate)] font-mono break-all">
              {displayedAddresses.map((address, index) => (
                <div key={index}>
                  {address}
                  {index < displayedAddresses.length - 1 && <br />}
                </div>
              ))}
            </div>
            {fileName && (
              <button
                onClick={handleRemoveClick}
                className="absolute top-2 right-2 bg-[#222526] hover:bg-[#222526]/90 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove CSV file"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {fileName && (
            <p className="text-xs text-[var(--slate)]">
              Uploaded: {fileName}
            </p>
          )}
        </div>
      )}

      {/* Upload Area - show only if no file uploaded */}
      {!fileName && (
        <div
          onClick={onUploadClick}
          className="bg-[rgba(205,223,236,0.15)] border-2 border-dashed border-[var(--mouse)] rounded-lg p-6 text-center cursor-pointer hover:bg-[#cde9ec40] hover:border-[#615bff] transition-all duration-200"
        >
          <div className="w-10 h-10 bg-[var(--celeste)] rounded mx-auto mb-2 flex items-center justify-center">
            <Upload className="w-4 h-4 text-[#615bff]" />
          </div>
          <p className="text-[var(--space-purple)] font-medium mb-1">{uploadText}</p>
          <p className="text-[var(--slate)]">or drag it here</p>
          <p className="text-[var(--slate)] text-xs font-semibold">{acceptedFormats}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={onFileSelect}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}

