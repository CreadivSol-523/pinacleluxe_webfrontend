import { Toggle } from "@/components/Modal/AddCategoryModal";
import { Category } from "@/Types/Category/Category";
import Image from "next/image";
import { CategoryRow } from "./CategoryRow";

// ── Tree renderer ─────────────────────────────────────────────────────────────
export function CategoryTree({
   nodes,
   depth = 0,
   expanded,
   onToggleExpand,
   onEdit,
   onDelete,
   onToggleActive,
   onAddSub,
}: {
   nodes: Category[];
   depth?: number;
   expanded: Set<string>;
   onToggleExpand: (id: string) => void;
   onEdit: (cat: Category) => void;
   onDelete: (id: string) => void;
   onToggleActive: (id: string) => void;
   onAddSub: (parentId: string) => void;
}) {
   return (
      <>
         {nodes.map((cat) => (
            <div key={cat.id}>
               <CategoryRow
                  cat={cat}
                  depth={depth}
                  isExpanded={expanded.has(cat.id)}
                  hasChildren={(cat.children?.length ?? 0) > 0}
                  onToggleExpand={() => onToggleExpand(cat.id)}
                  onEdit={() => onEdit(cat)}
                  onDelete={() => onDelete(cat.id)}
                  onToggleActive={() => onToggleActive(cat.id)}
                  onAddSub={() => onAddSub(cat.id)}
               />
               {expanded.has(cat.id) && (cat.children?.length ?? 0) > 0 && <CategoryTree nodes={cat.children!} depth={depth + 1} expanded={expanded} onToggleExpand={onToggleExpand} onEdit={onEdit} onDelete={onDelete} onToggleActive={onToggleActive} onAddSub={onAddSub} />}
            </div>
         ))}
      </>
   );
}
