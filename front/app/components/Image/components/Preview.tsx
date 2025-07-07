"use client";

import { type PropsWithChildren, memo, useEffect, useRef } from "react";

interface PreviewProps extends PropsWithChildren {
  visible?: boolean;
}

const Preview = memo<PreviewProps>(({ children, visible }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;

    const handleDisableZoom = (event: any) => {
      event.preventDefault();
    };

    if (visible) {
      ref.current.addEventListener("wheel", handleDisableZoom, {
        passive: false,
      });
    } else {
      ref.current.removeEventListener("wheel", handleDisableZoom);
    }
  }, [visible]);

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      {children}
    </div>
  );
});

export default Preview;
