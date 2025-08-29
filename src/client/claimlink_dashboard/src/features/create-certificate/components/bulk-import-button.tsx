import { Button } from "@/components/ui/button";

export function BulkImportButton() {
  return (
    <Button
      className="w-full h-[48px] bg-[#69737c] hover:bg-[#5a6269] text-white rounded-full"
      onClick={() => {
        // Handle bulk import
        console.log('Bulk import clicked');
      }}
    >
      Bulk import
    </Button>
  );
}
