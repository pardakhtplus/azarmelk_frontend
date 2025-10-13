"use client";
import { api } from "@/services/axios-client";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
import toast from "react-hot-toast";

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

export default function useUserUploadWatermarkedFileChunking({
  id,
}: {
  id?: string;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingProgress, setUploadingProgress] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const uploadWatermarkedFileChunkingUser = useMutation({
    mutationKey: ["uploadWatermarkedFileChunkingUser", id],
    mutationFn: async (props: { file: File }) => {
      try {
        setIsUploading(true);
        setUploadingProgress(0);

        // Create new AbortController for this upload session
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;
        console.log("Created new AbortController for upload");

        // Check if already aborted before starting
        if (signal.aborted) {
          throw new Error("Upload canceled");
        }

        const totalChunks = Math.ceil(props.file.size / CHUNK_SIZE);
        let uploadedChunks = 0;
        let uploadId = "0";
        let key = "0";
        const parts: { ETag: string; PartNumber: number }[] = [];

        // Initial request to get uploadId and key
        const initialRes = await api.client.bucket.uploadWaterMarkedChunkFiles({
          index: 0,
          totalChunks: totalChunks,
          uploadId: uploadId,
          key: key,
          fileName: props.file.name,
          fileType: props.file.type,
          type: "estateGallery",
          signal,
        });

        // Check if aborted after initial request
        if (signal.aborted) {
          throw new Error("Upload canceled");
        }

        if (initialRes.status >= 300) return null;

        const initialData = initialRes.data as any;
        uploadId = initialData.data[0].uploadId;
        key = initialData.data[0].key;

        // Upload chunks
        for (let i = 0; i < totalChunks; i++) {
          // Check if aborted before each chunk
          if (signal.aborted) {
            console.log("Signal aborted before chunk", i);
            throw new Error("Upload canceled");
          }

          const start = i * CHUNK_SIZE;
          const end = Math.min(start + CHUNK_SIZE, props.file.size);
          const chunk = props.file.slice(start, end);

          const res = await api.client.bucket.uploadWaterMarkedChunkFiles({
            index: i,
            totalChunks: totalChunks,
            uploadId: uploadId,
            key: key,
            fileName: props.file.name,
            fileType: props.file.type,
            chunk: chunk,
            parts: parts,
            signal,
          });

          // Check if aborted after each request
          if (signal.aborted) {
            console.log("Signal aborted after chunk", i);
            throw new Error("Upload canceled");
          }

          if (res.status >= 300) return null;

          const data = res.data as any;

          // Update progress
          uploadedChunks++;
          setUploadingProgress(
            Math.round((uploadedChunks / totalChunks) * 100),
          );

          // Store parts for final request (except for the last chunk)
          if (i !== totalChunks - 1) {
            parts.push({
              ETag: data.data[0].ETag,
              PartNumber: data.data[0].PartNumber,
            });
          }

          // Final chunk completed
          if (uploadedChunks === totalChunks) {
            setIsUploading(false);
            abortControllerRef.current = null;
            setUploadingProgress(100);

            return {
              url: data.data[1]?.url,
              key: key,
              mimeType: props.file.type,
              fileName: props.file.name,
            };
          }
        }
      } catch (error: any) {
        console.log(error, "error");

        // Handle different types of cancellation
        if (
          error.name === "AbortError" ||
          error.message === "Upload canceled" ||
          error.code === "ERR_CANCELED"
        ) {
          console.log("Upload was canceled", error);
          // Don't show error toast for cancellation
          return null;
        } else {
          console.log("Upload error (not cancellation):", error);
          toast.error("مشکلی پیش آمده!");
        }
        return null;
      } finally {
        setIsUploading(false);
        // Clear the abort controller reference
        abortControllerRef.current = null;
      }
    },
  });

  // Function to cancel ongoing uploads
  const cancelUpload = useCallback(() => {
    console.log("Cancel upload called");
    if (abortControllerRef.current) {
      console.log("Aborting current upload");
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsUploading(false);
      setUploadingProgress(0);
    }

    // Also cancel the mutation if it's running
    if (uploadWatermarkedFileChunkingUser.isPending) {
      console.log("Resetting mutation");
      uploadWatermarkedFileChunkingUser.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadWatermarkedFileChunkingUser.isPending]);

  return {
    uploadWatermarkedFileChunkingUser,
    uploadingProgress,
    isUploading,
    cancelUpload,
  };
}
