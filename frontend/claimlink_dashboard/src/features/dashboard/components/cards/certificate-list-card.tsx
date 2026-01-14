import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SearchInput } from "@/components/common"
import { cn } from "@/lib/utils"

interface CertificateItem {
  title: string
  date: string
  imageUrl?: string
}

interface CertificateListCardProps {
  title: string
  subtitle: string
  items: CertificateItem[]
  searchPlaceholder?: string
  onViewAll?: () => void
  className?: string
}

export function CertificateListCard({
  title,
  subtitle,
  items,
  searchPlaceholder = "Search for an item",
  onViewAll,
  className
}: CertificateListCardProps) {
  return (
    <Card className={cn("shadow-[0_2px_4px_0_rgba(0,0,0,0.05)] overflow-hidden", className)}>
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-[14px] text-[#222526] font-normal">
              {title}
            </CardTitle>
            <CardDescription className="text-[13px] text-[#69737c]">
              {subtitle}
            </CardDescription>
          </div>
          {onViewAll && (
            <Button
              variant="link"
              onClick={onViewAll}
              className="text-[13px] text-[#615bff] hover:text-[#615bff]/80 p-0 h-auto"
            >
              View all
            </Button>
          )}
        </div>
        <div className="mt-2">
          <SearchInput placeholder={searchPlaceholder} />
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {items.map((item, index) => (
          <div key={index} className="py-2">
            <div className="flex items-center gap-4 p-2">
              <div
                className="h-20 w-20 rounded-2xl bg-center bg-cover bg-no-repeat flex-shrink-0"
                style={{
                  backgroundImage: item.imageUrl ? `url(${item.imageUrl})` : undefined,
                  backgroundColor: item.imageUrl ? undefined : "#eee"
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-base text-[#061937] truncate">
                  {item.title}
                </div>
                <div className="flex items-center gap-2 text-[13px] text-[#69737c]">
                  {item.date}
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
