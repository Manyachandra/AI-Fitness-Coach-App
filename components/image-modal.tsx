"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, X } from "lucide-react";
import Image from "next/image";

interface ImageModalProps {
  open: boolean;
  onClose: () => void;
  query: string;
}

export default function ImageModal({ open, onClose, query }: ImageModalProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchImage = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) throw new Error("Failed to generate image");

      const data = await response.json();
      setImageUrl(data.imageUrl);
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate image. Please check your API keys.");
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    if (open && query) {
      fetchImage();
    } else {
      setImageUrl(null);
    }
  }, [open, query, fetchImage]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{query}</DialogTitle>
          <DialogDescription>
            AI-generated visual representation
          </DialogDescription>
        </DialogHeader>
        <div className="relative min-h-[400px] flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Generating image...
              </p>
            </div>
          ) : imageUrl ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full h-full"
            >
              <Image
                src={imageUrl}
                alt={query}
                width={800}
                height={600}
                className="rounded-lg object-contain w-full h-auto"
              />
            </motion.div>
          ) : (
            <p className="text-muted-foreground">No image available</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

