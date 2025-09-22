import { CollectionCard } from "./collection-card";
import { AddCollectionCard } from "./add-collection-card";
import type { Collection } from "../types/collection.types";

interface CollectionGridViewProps {
  collections: Collection[];
  onCollectionClick: (collection: Collection) => void;
  onAddCollection: () => void;
}

export function CollectionGridView({
  collections,
  onCollectionClick,
  onAddCollection
}: CollectionGridViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {/* Add Collection Card - always first */}
      <AddCollectionCard onClick={onAddCollection} />

      {/* Collection Cards */}
      {collections.map((collection) => (
        <CollectionCard
          key={collection.id}
          collection={collection}
          onClick={onCollectionClick}
        />
      ))}
    </div>
  );
}
