import { useState } from "react";
import { CertificateEventRow } from "./certificate-event-row";
import { AddEventDialog } from "../events/add-event-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

/**
 * Event category types
 */
export type EventCategory =
  | 'appraisal'    // Valuation events
  | 'service'      // Maintenance/service events
  | 'restoration'  // Restoration work
  | 'transfer'     // Ownership transfers
  | 'exhibition'   // Display/exhibition events
  | 'other';       // Other events

export interface CertificateEvent {
  date: string;           // ISO date string or display format
  dateTimestamp?: number; // Unix timestamp for sorting
  category?: EventCategory;
  description: string;
  attachmentUrl?: string;
  attachmentFilename?: string;
}

export interface CertificateEventsData {
  events: CertificateEvent[];
}

interface CertificateEventsProps {
  data: CertificateEventsData;
  canisterId?: string;
  tokenId?: string;
  onEventAdded?: () => void;
  className?: string;
}

export function CertificateEvents({
  data,
  canisterId,
  tokenId,
  onEventAdded,
  className = "",
}: CertificateEventsProps) {
  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false);

  const handleEventAdded = () => {
    setIsAddEventDialogOpen(false);
    onEventAdded?.();
  };

  return (
    <div
      className={`bg-[#fcfafa] rounded-bl-[24px] rounded-br-[24px] w-full ${className}`}
    >
      {/* Main Events Section */}
      <div className="bg-[#222526] flex flex-col gap-8 sm:gap-16 rounded-bl-[24px] rounded-br-[24px] w-full">
        {/* Two-column layout: Title (sticky) + Events List */}
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-16 px-4 sm:px-16 py-6 sm:py-10 w-full">
          {/* Left Column - Sticky Title */}
          <div className="w-full lg:w-[389px] shrink-0 lg:sticky lg:top-0 flex flex-col items-center justify-center py-4 sm:py-10">
            <p className="text-[#f9f8f4] text-[24px] sm:text-[38px] font-['Gestura_Display_TRIAL'] font-extralight italic leading-[32px] sm:leading-[50px] w-full mb-0">
              Events
            </p>
            <div className="text-white text-[14px] sm:text-[16px] font-light leading-6 sm:leading-8 w-full">
              <p className="mb-4">
                Log key updates to preserve the evolving story of your certified
                item, including restorations, exhibitions, and important status
                changes.
              </p>
              {/* Add Event Button */}
              {canisterId && tokenId && (
                <Button
                  onClick={() => setIsAddEventDialogOpen(true)}
                  variant="outline"
                  className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Event
                </Button>
              )}
            </div>
          </div>

          {/* Right Column - Events List */}
          <div className="flex-1 flex flex-col py-4 sm:py-10">
            {data.events.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 sm:py-16 gap-4">
                <p className="text-[#e1e1e1] text-[14px] sm:text-[16px] font-light">
                  No events logged yet
                </p>
                {canisterId && tokenId && (
                  <Button
                    onClick={() => setIsAddEventDialogOpen(true)}
                    variant="outline"
                    size="sm"
                    className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Log your first event
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex flex-col w-full">
                {data.events.map((event, index) => (
                  <CertificateEventRow
                    key={index}
                    date={event.date}
                    description={event.description}
                    attachmentUrl={event.attachmentUrl}
                    isFirst={index === 0}
                    isLast={index === data.events.length - 1}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Event Dialog */}
      {canisterId && tokenId && (
        <AddEventDialog
          open={isAddEventDialogOpen}
          onOpenChange={setIsAddEventDialogOpen}
          canisterId={canisterId}
          tokenId={tokenId}
          onSuccess={handleEventAdded}
        />
      )}
    </div>
  );
}

