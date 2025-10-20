import { useMemo, useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CsvUploadSection } from "@/components/common/csv-upload-section";
import { Pagination } from "@/components/common";

type ImportStatus = "Success" | "Failed";

interface ImportHistoryItem {
  id: string;
  fileName: string;
  date: string; // dd/mm/yyyy
  status: ImportStatus;
}

export interface BulkImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BulkImportDialog({ open, onOpenChange }: BulkImportDialogProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Mocked history to match Figma preview; replace with real data later
  const history: ImportHistoryItem[] = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => ({
        id: "6540eab93303bd86eb31a5ca",
        fileName: "name.csv",
        date: "03/01/2024",
        status: i % 2 === 0 ? "Success" : "Failed",
      })),
    []
  );

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFileName(f.name);
  };

  const handleRemove = () => setFileName(null);

  const handleDownloadTemplate = () => {
    // Placeholder: wire to real asset later
    console.log("Download CSV template");
  };

  const statusBadge = (status: ImportStatus) => (
    <Badge
      variant="secondary"
      className={
        status === "Success"
          ? "bg-[color:var(--jade-90)] text-[color:var(--charcoal)] border border-[#e1e1e1]"
          : "bg-red-50 text-red-600 border border-red-200"
      }
    >
      {status}
    </Badge>
  );

  const totalPages = Math.max(1, Math.ceil(history.length / itemsPerPage));
  const pagedRows = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return history.slice(start, start + itemsPerPage);
  }, [history, currentPage, itemsPerPage]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[720px] p-0 border-0 overflow-hidden !fixed !top-1/2 !left-1/2 !transform !-translate-x-1/2 !-translate-y-1/2 !z-[9999]"
        showCloseButton
      >
        <div className="bg-white rounded-[20px] border border-[#e1e1e1]">
          {/* Header */}
          <div className="px-8 pt-8 pb-4 text-center">
            <DialogTitle className="text-[#222526] text-xl font-semibold mb-2">Bulk import</DialogTitle>
            <DialogDescription className="text-[#69737c] text-[13px]">
              Fusce ultricies nibh ac magna molestie tempor. Pellentesque molestie ante ut orci venenatis, sit amet.
            </DialogDescription>
          </div>

          {/* Actions */}
          <div className="px-8 pb-6 flex items-center justify-center gap-3">
            <Button className="rounded-full h-10 px-5 bg-[#222526] text-white hover:bg-[#222526]/90" onClick={handleUploadClick}>
              Import CSV template
            </Button>
            <Button variant="outline" className="rounded-full h-10 px-5" onClick={handleDownloadTemplate}>
              Download CSV template
            </Button>
          </div>

          {/* CSV Upload (inline, collapses once selected) */}
          <div className="px-8 pb-6">
            <CsvUploadSection
              fileName={fileName}
              onFileSelect={handleFileSelect}
              onRemove={handleRemove}
              onUploadClick={handleUploadClick}
              fileInputRef={fileInputRef}
              uploadText="Upload your CSV"
              acceptedFormats="CSV"
            />
          </div>

          {/* Table */}
          <div className="px-6 pb-6">
            <div className="overflow-hidden rounded-[16px] border border-[#efece3]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#222526]">
                    <TableHead className="text-white">Import ID</TableHead>
                    <TableHead className="text-white">File Name</TableHead>
                    <TableHead className="text-white">Date</TableHead>
                    <TableHead className="text-white">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagedRows.map((row, idx) => (
                    <TableRow key={idx} className="bg-white">
                      <TableCell className="text-[#222526]">{row.id}</TableCell>
                      <TableCell className="text-[#222526]">{row.fileName}</TableCell>
                      <TableCell className="text-[#222526]">{row.date}</TableCell>
                      <TableCell>{statusBadge(row.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(n) => {
                setItemsPerPage(n);
                setCurrentPage(1);
              }}
              className="px-6"
              contentClassName="!z-[10000]"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


