import {
  FlipHorizontal,
  FlipVertical,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import type { ToolbarRenderInfoType } from "rc-image/lib/Preview";
import { type ReactNode, memo } from "react";
import { Flexbox } from "react-layout-kit";

import ActionIcon from "@/components/ActionIcon";

import { useStyles } from "../style";

export interface ToolbarProps {
  children?: ReactNode;
  info: Omit<ToolbarRenderInfoType, "current" | "total">;
  maxScale: number;
  minScale: number;
}

const Toolbar = memo<ToolbarProps>(({ children, info, minScale, maxScale }) => {
  const { styles } = useStyles();
  const {
    transform: { scale },
    actions: {
      onFlipY,
      onFlipX,
      onRotateLeft,
      onRotateRight,
      onZoomOut,
      onZoomIn,
    },
  } = info;

  return (
    <Flexbox className={styles.toolbar} gap={4} horizontal>
      <ActionIcon onClick={onFlipX}>
        <FlipHorizontal />
      </ActionIcon>
      <ActionIcon onClick={onFlipY}>
        <FlipVertical />
      </ActionIcon>
      <ActionIcon onClick={onRotateLeft}>
        <RotateCcw />
      </ActionIcon>
      <ActionIcon onClick={onRotateRight}>
        <RotateCw />
      </ActionIcon>
      <ActionIcon disabled={scale === minScale} onClick={onZoomOut}>
        <ZoomOut />
      </ActionIcon>
      <ActionIcon disabled={scale === maxScale} onClick={onZoomIn}>
        <ZoomIn />
      </ActionIcon>
      {children}
    </Flexbox>
  );
});

export default Toolbar;
