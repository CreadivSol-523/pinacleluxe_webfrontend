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
   onToggleExpand: (_id: string) => void;
   onEdit: (cat: Category) => void;
   onDelete: (_id: string) => void;
   onToggleActive: (_id: string) => void;
   onAddSub: (parentId: string) => void;
}) {
   return (
      <>
         {nodes.map((cat) => (
            <div key={cat._id}>
               <CategoryRow
                  cat={cat}
                  depth={depth}
                  isExpanded={expanded.has(cat._id)}
                  hasChildren={(cat.children?.length ?? 0) > 0}
                  onToggleExpand={() => onToggleExpand(cat._id)}
                  onEdit={() => onEdit(cat)}
                  onDelete={() => onDelete(cat._id)}
                  onToggleActive={() => onToggleActive(cat._id)}
                  onAddSub={() => onAddSub(cat._id)}
               />
               {expanded.has(cat._id) && (cat.children?.length ?? 0) > 0 && <CategoryTree nodes={cat.children!} depth={depth + 1} expanded={expanded} onToggleExpand={onToggleExpand} onEdit={onEdit} onDelete={onDelete} onToggleActive={onToggleActive} onAddSub={onAddSub} />}
            </div>
         ))}
      </>
   );
}
