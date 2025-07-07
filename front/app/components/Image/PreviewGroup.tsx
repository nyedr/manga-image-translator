"use client";

import { Image } from "antd";
import { XIcon } from "lucide-react";
import { memo, useState, createContext, useContext, useMemo } from "react";

import usePreviewGroup from "./components/usePreviewGroup";
import type { PreviewGroupProps } from "./type";

const { PreviewGroup: AntdPreviewGroup } = Image;

interface PreviewGroupContextType {
  setCurrent: (index: number) => void;
}

const PreviewGroupContext = createContext<PreviewGroupContextType | null>(null);

export const usePreviewGroupContext = () => {
  const context = useContext(PreviewGroupContext);
  if (!context) {
    throw new Error(
      "usePreviewGroupContext must be used within a CustomPreviewGroup"
    );
  }
  return context;
};

const PreviewGroup = memo<PreviewGroupProps>(
  ({ items = [], children, enable = true, preview: initialPreview }) => {
    const [current, setCurrent] = useState(0);

    const preview = useMemo(
      () => ({
        ...initialPreview,
        current,
        onChange: (index: number) => {
          setCurrent(index);
        },
        closeIcon: <XIcon className="size-4" />,
      }),
      [current, initialPreview]
    );

    const mergePreview = usePreviewGroup(preview);

    if (!enable) return children;

    return (
      <PreviewGroupContext.Provider value={{ setCurrent }}>
        <AntdPreviewGroup items={items} preview={mergePreview}>
          {children}
        </AntdPreviewGroup>
      </PreviewGroupContext.Provider>
    );
  }
);

PreviewGroup.displayName = "PreviewGroup";

export default PreviewGroup;
