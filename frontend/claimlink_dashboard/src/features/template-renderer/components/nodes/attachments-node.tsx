/**
 * Attachments Node Component
 *
 * Renders a list of downloadable file attachments.
 */

import { FileText, Download } from 'lucide-react';
import type { AttachmentsNode as AttachmentsNodeType } from '../../types';
import { useTemplateContext } from '../../context/template-context';
import { cn } from '@/lib/utils';

interface AttachmentsNodeProps {
  node: AttachmentsNodeType;
}

export function AttachmentsNode({ node }: AttachmentsNodeProps) {
  const { getFileArray, resolveAssetUrl } = useTemplateContext();

  // Get attachments from metadata
  const files = getFileArray(node.pointer);

  if (!files?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        'grid grid-cols-2 sm:grid-cols-1 gap-9 max-w-[660px] mx-auto',
        node.className
      )}
    >
      {files.map((file, index) => {
        const fileUrl = resolveAssetUrl(file.path);
        const fileName = file.path.split('/').pop() || file.path;

        return (
          <div
            key={file.id || index}
            className="p-3 bg-white rounded-lg shadow-sm border border-gray-100 min-w-[300px]"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3.5">
                <FileText className="w-6 h-6 text-gray-500" />
                <div className="text-left">
                  <p className="font-bold text-[#363636] text-sm truncate max-w-[180px]">
                    {fileName}
                  </p>
                </div>
              </div>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                aria-label={`Download ${fileName}`}
              >
                <Download className="w-5 h-5 text-gray-500" />
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
