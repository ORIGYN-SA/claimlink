import { CertificateEventRow } from "./certificate-event-row";

export interface CertificateEvent {
  date: string;
  description: string;
  attachmentUrl?: string;
}

export interface CertificateEventsData {
  events: CertificateEvent[];
}

interface CertificateEventsProps {
  data: CertificateEventsData;
  className?: string;
}

export function CertificateEvents({
  data,
  className = "",
}: CertificateEventsProps) {
  return (
    <div
      className={`bg-[#fcfafa] rounded-bl-[24px] rounded-br-[24px] w-full ${className}`}
    >
      {/* Main Events Section */}
      <div className="bg-[#222526] flex flex-col gap-16 rounded-bl-[24px] rounded-br-[24px] w-full">
        {/* Two-column layout: Title (sticky) + Events List */}
        <div className="flex gap-16 px-16 py-10 w-full">
          {/* Left Column - Sticky Title */}
          <div className="w-[389px] shrink-0 sticky top-0 flex flex-col items-center justify-center py-10">
            <p className="text-[#f9f8f4] text-[38px] font-['Gestura_Display_TRIAL'] font-extralight italic leading-[50px] w-full mb-0">
              Events
            </p>
            <div className="text-white text-[16px] font-light leading-8 w-full">
              <p className="mb-0">
                Log key updates to preserve the evolving story of your certified
                item, including restorations, exhibitions, and important status
                changes.
              </p>
            </div>
          </div>

          {/* Right Column - Events List */}
          <div className="flex-1 flex flex-col py-10">
            {data.events.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <p className="text-[#e1e1e1] text-[16px] font-light">
                  No events logged yet
                </p>
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
    </div>
  );
}

