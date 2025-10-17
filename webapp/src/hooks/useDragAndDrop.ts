import { useState, useCallback } from "react";

type DragEventHandler = (e: React.DragEvent) => void;

interface DragHandlers {
  onDragEnter: DragEventHandler;
  onDragLeave: DragEventHandler;
  onDragOver: DragEventHandler;
  onDrop: DragEventHandler;
}

const useDragAndDrop = (
  onFilesDropped: (files: File[]) => void
): [boolean, DragHandlers] => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter: DragEventHandler = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave: DragEventHandler = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver: DragEventHandler = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDrop: DragEventHandler = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      onFilesDropped(files);
    },
    [onFilesDropped]
  );

  const dragHandlers: DragHandlers = {
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDragOver: handleDragOver,
    onDrop: handleDrop,
  };

  return [isDragging, dragHandlers];
};

export default useDragAndDrop;
