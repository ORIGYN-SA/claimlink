/**
 * Template Block Component
 *
 * Recursive renderer that maps template node types to React components.
 * This is the core rendering engine for ORIGYN templates.
 */

import type { TemplateNode } from '../types';
import {
  ColumnsNode,
  ElementsNode,
  SectionNode,
  TitleNode,
  SubTitleNode,
  TextNode,
  ValueFieldNode,
  FieldNode,
  ImageNode,
  MainImageNode,
  MultiImageNode,
  CollectionImageNode,
  GalleryNode,
  VideoNode,
  AttachmentsNode,
  SeparatorNode,
  HistoryNode,
} from './nodes';

interface TemplateBlockProps {
  nodes: TemplateNode[];
}

/**
 * Render a single template node
 */
function renderNode(node: TemplateNode, index: number): React.ReactNode {
  const key = node.id || `node-${index}`;

  switch (node.type) {
    // Layout nodes
    case 'columns':
      return (
        <ColumnsNode
          key={key}
          node={node}
          renderNode={renderNode}
        />
      );

    case 'elements':
      return (
        <ElementsNode
          key={key}
          node={node}
          renderNode={renderNode}
        />
      );

    case 'section':
      return (
        <SectionNode
          key={key}
          node={node}
          renderNode={renderNode}
        />
      );

    // Text nodes
    case 'title':
      return <TitleNode key={key} node={node} />;

    case 'subTitle':
      return <SubTitleNode key={key} node={node} />;

    case 'text':
      return <TextNode key={key} node={node} />;

    case 'valueField':
      return <ValueFieldNode key={key} node={node} />;

    case 'field':
      return <FieldNode key={key} node={node} />;

    // Media nodes
    case 'image':
      return <ImageNode key={key} node={node} />;

    case 'mainImage':
      return <MainImageNode key={key} node={node} />;

    case 'multiImage':
      return <MultiImageNode key={key} node={node} />;

    case 'collectionImage':
      return <CollectionImageNode key={key} node={node} />;

    case 'gallery':
      return <GalleryNode key={key} node={node} />;

    case 'video':
      return <VideoNode key={key} node={node} />;

    case 'attachments':
    case 'filesAttachments':
      return <AttachmentsNode key={key} node={node} />;

    // Special nodes
    case 'separator':
      return <SeparatorNode key={key} node={node} />;

    case 'history':
      return <HistoryNode key={key} node={node} />;

    case 'certificate':
      // Certificate node is a placeholder - can be extended later
      return null;

    default:
      // Log unknown node types in development
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `TemplateBlock: Unknown node type "${(node as TemplateNode).type}"`,
          node
        );
      }
      return null;
  }
}

/**
 * Template Block - renders an array of template nodes
 */
export function TemplateBlock({ nodes }: TemplateBlockProps) {
  if (!nodes || !Array.isArray(nodes)) {
    return null;
  }

  return <>{nodes.map((node, index) => renderNode(node, index))}</>;
}
