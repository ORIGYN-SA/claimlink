import { useState } from 'react';
import { useAuth } from '@/features/auth';
import { OrigynNftService } from '../api/origyn-nft.service';

const calculateHash = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

interface UseUploadImageReturn {
  uploadImage: (file: File, canisterId: string) => Promise<string>;
  isUploading: boolean;
  progress: number;
}

export const useUploadImage = (): UseUploadImageReturn => {
  const { authenticatedAgent } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadImage = async (file: File, canisterId: string): Promise<string> => {
    if (!authenticatedAgent) {
      throw new Error('Not authenticated');
    }

    setIsUploading(true);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const fileHash = await calculateHash(arrayBuffer);

      // Prepare 1MB chunks
      const chunkSize = 1024 * 1024;
      const chunks: Uint8Array[] = [];
      for (let i = 0; i < bytes.length; i += chunkSize) {
        chunks.push(bytes.slice(i, i + chunkSize));
      }

      const fileName = `${Date.now()}_${file.name}`;

      // Step 1: Initialize
      setProgress(5);
      await OrigynNftService.initUpload(
        authenticatedAgent,
        canisterId,
        fileName,
        fileHash,
        BigInt(bytes.length),
        BigInt(chunkSize)
      );

      // Step 2: Upload chunks
      for (let i = 0; i < chunks.length; i++) {
        await OrigynNftService.storeChunk(
          authenticatedAgent,
          canisterId,
          fileName,
          BigInt(i),
          Array.from(chunks[i])
        );
        setProgress(5 + ((i + 1) / chunks.length) * 85);
      }

      // Step 3: Finalize
      setProgress(90);
      const imageUrl = await OrigynNftService.finalizeUpload(
        authenticatedAgent,
        canisterId,
        fileName
      );

      setProgress(100);
      return imageUrl;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImage, isUploading, progress };
};
