/**
 * V2 Content Renderer
 *
 * Recursive layout walker that maps V2LayoutNode types to React components.
 * Receives variant from the parent frame/view renderer.
 */

import type { V2LayoutNode } from '../types';
import {
  V2FieldNode,
  V2GroupNode,
  V2ColumnsNode,
  V2TextNode,
  V2AssetNode,
  V2SeparatorNode,
  V2SectionNode,
  V2GalleryNode,
  V2VideoNode,
  V2AttachmentsNode,
} from './nodes';

type Variant = 'certificate' | 'custom-certificate' | 'information' | 'default';

interface V2ContentRendererProps {
  content: V2LayoutNode[];
  variant: Variant;
}

function renderNode(node: V2LayoutNode, index: number, variant: Variant): React.ReactNode {
  const key = node.id || `v2-node-${index}`;

  switch (node.type) {
    // Leaf nodes
    case 'field':
      return <V2FieldNode key={key} node={node} variant={variant} />;
    case 'text':
      return <V2TextNode key={key} node={node} variant={variant} />;
    case 'asset':
      return <V2AssetNode key={key} node={node} />;
    case 'separator':
      return <V2SeparatorNode key={key} node={node} variant={variant} />;
    case 'gallery':
      return <V2GalleryNode key={key} node={node} />;
    case 'video':
      return <V2VideoNode key={key} node={node} />;
    case 'attachments':
      return <V2AttachmentsNode key={key} node={node} variant={variant} />;

    // Container nodes
    case 'group':
      return (
        <V2GroupNode
          key={key}
          node={node}
          renderNode={(child, i) => renderNode(child, i, variant)}
        />
      );
    case 'columns':
      return (
        <V2ColumnsNode
          key={key}
          node={node}
          renderNode={(child, i) => renderNode(child, i, variant)}
        />
      );
    case 'section':
      return (
        <V2SectionNode
          key={key}
          node={node}
          renderNode={(child, i) => renderNode(child, i, variant)}
        />
      );

    default:
      if (process.env.NODE_ENV === 'development') {
        console.warn(`V2ContentRenderer: Unknown node type "${(node as V2LayoutNode).type}"`, node);
      }
      return null;
  }
}

export function V2ContentRenderer({ content, variant }: V2ContentRendererProps) {
  if (!content || !Array.isArray(content)) return null;
  return <>{content.map((node, index) => renderNode(node, index, variant))}</>;
}
