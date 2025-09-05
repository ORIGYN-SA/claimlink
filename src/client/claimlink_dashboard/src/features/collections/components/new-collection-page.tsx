import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { mockTemplates } from '@/shared/data/templates'
import { Upload, FileText, HardDrive } from 'lucide-react'

export function NewCollectionPage() {
  const [collectionName, setCollectionName] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')

  return (
    <div className="space-y-6">
      {/* Main Form Section */}
      <div className="max-w-4xl">
        <Card className="border-[#efece3] bg-white rounded-[25px]">
          <CardHeader className="pb-6">
            <CardTitle className="text-[#222526] text-2xl font-medium">
              Collection information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Image Upload Section */}
            <div className="flex gap-4">
              <div className="bg-[#e1e1e1] rounded-[10px] w-[130px] h-[130px] flex items-center justify-center">
                <Upload className="w-6 h-6 text-[#69737c]" />
              </div>
              <div className="flex-1 border-2 border-dashed border-[#e1e1e1] rounded-md p-6 bg-[#cddfec26] flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 bg-[#cde9ec] rounded-full flex items-center justify-center mb-3">
                  <Upload className="w-4 h-4 text-[#615bff]" />
                </div>
                <p className="text-[#615bff] font-medium mb-2">
                  Upload your Collection cover
                </p>
                <p className="text-[#69737c] text-sm">
                  JPEG, PNG, SVG, PDF
                </p>
              </div>
            </div>

            {/* Collection Name Input */}
            <div className="space-y-2">
              <label className="text-[#69737c] font-medium text-sm">
                Collection name
              </label>
              <Input
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                placeholder="Enter collection name"
                className="rounded-full border-[#e1e1e1] h-11"
              />
            </div>

            {/* Template Selection */}
            <div className="space-y-2">
              <label className="text-[#69737c] font-medium text-sm">
                Select your template
              </label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger className="rounded-full border-[#e1e1e1] h-11 w-full">
                  <SelectValue placeholder="Choose a template" />
                </SelectTrigger>
                <SelectContent>
                  {mockTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Create Button */}
            <div className="flex justify-end pt-4">
              <Button className="bg-[#222526] hover:bg-[#222526]/90 rounded-full px-6 py-3 text-white font-medium">
                Create collection
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar Information */}
      <div className="max-w-md">
        <Card className="border-[#e1e1e1] bg-white rounded-[25px]">
          <CardContent className="p-6 space-y-6">
            {/* General Information */}
            <div className="space-y-2">
              <h3 className="text-[#222526] font-medium text-lg">General information</h3>
              <p className="text-[#69737c] text-sm leading-relaxed">
                Vestibulum eu purus eu orci commodo elementum et et lorem. Curabitur pharetra velit ut facilisis ultrices.
              </p>
            </div>

            {/* Separator */}
            <hr className="border-[#e1e1e1]" />

            {/* Price Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#222526]" />
                <span className="text-[#222526] font-medium text-sm uppercase tracking-wider">Price</span>
              </div>

              {/* Deployment Cost */}
              <div className="bg-[#cddfec26] rounded-xl p-4 space-y-2">
                <p className="text-[#69737c] font-medium text-sm">Deployment cost:</p>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#615bff] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">O</span>
                  </div>
                  <span className="text-[#222526] font-semibold text-lg">1325 OGY</span>
                  <span className="text-[#69737c] text-sm">($15)</span>
                </div>
              </div>

              {/* Certificate Cost */}
              <div className="bg-[#cddfec26] rounded-xl p-4 space-y-2">
                <p className="text-[#69737c] font-medium text-sm">Certificate cost:</p>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-[#615bff] rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-white text-xs font-bold">O</span>
                  </div>
                  <div>
                    <p className="text-[#222526] font-semibold text-lg">17 OGY + 17 OGY / 100mb</p>
                    <p className="text-[#69737c] text-sm">($0.2 + 0.2 / 100mb)</p>
                  </div>
                </div>
              </div>

              <p className="text-[#69737c] text-sm leading-relaxed">
                When you deploy your collection, you will need to pay 1325 OGY as fees. Each certificate will also cost you 17 OGY + 17 OGY / 100 mb.
              </p>
            </div>

            {/* Separator */}
            <hr className="border-[#e1e1e1]" />

            {/* Storage Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-[#222526]" />
                <span className="text-[#222526] font-medium text-sm uppercase tracking-wider">Storage</span>
              </div>

              <div className="space-y-2">
                <p className="text-[#69737c] font-medium text-sm">Storage included in your collection</p>
                <p className="text-[#222526] font-semibold text-lg">2 GB</p>
              </div>

              <p className="text-[#69737c] text-sm leading-relaxed">
                Storage description commodo elementum et et lorem. Curabitur pharetra velit ut facilisis ultrices.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
