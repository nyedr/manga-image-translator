import type { ImageProps as AntdImageProps } from "antd";
import type { ImagePreviewType } from "rc-image";
import type {
  GroupConsumerProps as AntdPreviewGroupProps,
  PreviewGroupPreview,
} from "rc-image/lib/PreviewGroup";
import type { CSSProperties, ReactNode, Ref } from "react";

export interface PreviewGroupPreviewOptions extends PreviewGroupPreview {
  toolbarAddon?: ReactNode;
}

export interface PreviewGroupProps extends AntdPreviewGroupProps {
  enable?: boolean;
  items?: string[];
  preview?: PreviewGroupPreviewOptions;
  children?: ReactNode;
}

export interface ImagePreviewOptions extends ImagePreviewType {
  toolbarAddon?: ReactNode;
  onVisibleChange?: (visible: boolean, prevVisible: boolean) => void;
  styles?: any;
  minScale?: number;
  maxScale?: number;
  rootClassName?: string;
  imageRender?: (originalNode: React.ReactNode, info: any) => React.ReactNode;
  toolbarRender?: (originalNode: React.ReactNode, info: any) => React.ReactNode;
}

export interface ImageProps extends Omit<AntdImageProps, "preview"> {
  actions?: ReactNode;
  alwaysShowActions?: boolean;
  classNames?: {
    image?: string;
    wrapper?: string;
  };
  isLoading?: boolean;
  maxHeight?: number | string;
  maxWidth?: number | string;
  minHeight?: number | string;
  minWidth?: number | string;
  objectFit?: "cover" | "contain";
  preview?: boolean | ImagePreviewOptions;
  ref?: Ref<HTMLDivElement>;
  size?: number | string;
  styles?: {
    image?: CSSProperties;
    wrapper?: CSSProperties;
  };
  toolbarAddon?: ReactNode;
  variant?: "borderless" | "filled" | "outlined";
}
