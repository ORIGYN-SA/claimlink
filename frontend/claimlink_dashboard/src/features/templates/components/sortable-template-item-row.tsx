/**
 * SortableTemplateItemRow Component
 *
 * Wrapper around TemplateItemRow that enables drag-and-drop reordering
 * using @dnd-kit/sortable
 */

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TemplateItemRow, type TemplateItemRowProps } from './template-item-row';

export function SortableTemplateItemRow(props: TemplateItemRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TemplateItemRow
        {...props}
        isDragging={isDragging}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}
