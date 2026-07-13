'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Typography } from '@/components/ui/Typography';
import { UploadZone } from './UploadZone';
import { useTryOnStore } from '@/store/useTryOnStore';
import { Divider } from '@/components/ui/Divider';

interface TryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TryOnModal({ isOpen, onClose }: TryOnModalProps) {
  const reset = useTryOnStore((state) => state.reset);

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="large">
      <div className="p-8 sm:p-12">
        {/* Header */}
        <div className="text-center mb-8">
          <Typography variant="label" gold className="mb-3">
            AI Technology
          </Typography>
          <Typography variant="h2">
            Virtual <span className="italic">Try-On</span>
          </Typography>
          <div className="mt-4 max-w-[400px] mx-auto">
            <Typography variant="body" muted className="!text-[14px]">
              Experience MONO pieces on you before you buy.
              Our AI creates a personalized visualization in seconds.
            </Typography>
          </div>
        </div>

        <Divider className="mb-8" />

        {/* Upload zone */}
        <UploadZone />
      </div>
    </Modal>
  );
}
