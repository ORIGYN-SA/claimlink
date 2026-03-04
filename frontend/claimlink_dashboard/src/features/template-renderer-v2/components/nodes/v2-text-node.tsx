/**
 * V2 Text Node
 *
 * Static text with style variants: heading, subheading, body, caption.
 * Variant-aware styling for certificate/information/default contexts.
 */

import type { V2TextNode as V2TextNodeType } from '../../types';
import { useV2LocalizedText } from '../../context/v2-template-context';
import { cn } from '@/lib/utils';

interface V2TextNodeProps {
  node: V2TextNodeType;
  variant: 'certificate' | 'custom-certificate' | 'information' | 'default';
}

export function V2TextNode({ node, variant }: V2TextNodeProps) {
  const text = useV2LocalizedText(node.content);
  if (!text) return null;

  const style = node.textStyle ?? 'body';

  // Certificate variant
  if (variant === 'certificate') {
    const styles = {
      heading: 'text-[14px] sm:text-[20px] font-semibold leading-4 sm:leading-5 text-[#061937] text-center tracking-[3px] sm:tracking-[5px] uppercase',
      subheading: 'text-[12px] sm:text-[14px] font-normal leading-5 sm:leading-6 text-[#69737c] tracking-[1px] sm:tracking-[1.4px] uppercase text-center',
      body: 'text-[14px] sm:text-[16px] text-[#222526] text-center',
      caption: 'text-[10px] sm:text-[12px] text-[#69737c] text-center tracking-[1px] uppercase',
    };
    const Tag = style === 'heading' ? 'h2' : style === 'subheading' ? 'h6' : 'p';
    return <Tag className={cn(styles[style], node.className)}>{text}</Tag>;
  }

  // Custom-certificate variant
  if (variant === 'custom-certificate') {
    const styles = {
      heading: 'text-[14px] sm:text-[20px] font-semibold leading-4 sm:leading-5 text-white text-center tracking-[3px] sm:tracking-[5px] uppercase',
      subheading: 'text-[12px] sm:text-[14px] font-normal leading-5 sm:leading-6 text-[#fcfafa] tracking-[1px] sm:tracking-[1.4px] uppercase text-center',
      body: 'text-[14px] sm:text-[16px] text-white text-center',
      caption: 'text-[10px] sm:text-[12px] text-white/80 text-center tracking-[1px] uppercase',
    };
    const Tag = style === 'heading' ? 'h2' : style === 'subheading' ? 'h6' : 'p';
    return <Tag className={cn(styles[style], node.className)}>{text}</Tag>;
  }

  // Information variant
  if (variant === 'information') {
    const styles = {
      heading: 'text-[#e1e1e1] text-[14px] sm:text-[16px] font-semibold leading-4 sm:leading-5 tracking-[1.5px] sm:tracking-[2.24px] uppercase',
      subheading: 'text-[#e1e1e1] text-[10px] sm:text-[12px] font-medium leading-normal tracking-[1px] sm:tracking-[1.2px] uppercase',
      body: 'text-white text-[14px] sm:text-[16px] font-light leading-6 sm:leading-8',
      caption: 'text-[#e1e1e1] text-[10px] sm:text-[12px] font-light tracking-[1px] uppercase',
    };
    const Tag = style === 'heading' ? 'h2' : style === 'subheading' ? 'h6' : 'p';
    return <Tag className={cn(styles[style], node.className)}>{text}</Tag>;
  }

  // Default variant
  const styles = {
    heading: 'font-semibold text-2xl leading-8 tracking-[-0.25px] text-center my-6',
    subheading: 'font-medium text-xs leading-5 tracking-[-0.1px] text-[#5f5f5f]',
    body: 'text-sm text-[#151515] whitespace-pre-wrap',
    caption: 'text-xs text-[#5f5f5f]',
  };
  const Tag = style === 'heading' ? 'h2' : style === 'subheading' ? 'h6' : 'p';
  return <Tag className={cn(styles[style], node.className)}>{text}</Tag>;
}
