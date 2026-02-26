import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Customer } from "@/data/dummyCustomers";

interface CustomerPhotosTabProps {
  customer: Customer;
}

const COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#ec4899"];

export function CustomerPhotosTab({ customer }: CustomerPhotosTabProps) {
  const photos = customer.jobHistory.flatMap((j, ji) => [
    { id: `${j.id}-1`, caption: `${j.name} — Before`, job: j.id, color: COLORS[ji % COLORS.length] },
    { id: `${j.id}-2`, caption: `${j.name} — After`, job: j.id, color: COLORS[(ji + 1) % COLORS.length] },
  ]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-card-foreground">Photos ({photos.length})</h2>
        <Button size="sm" className="gap-1.5"><Upload className="w-4 h-4" /> Upload</Button>
      </div>
      {photos.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">No photos yet</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {photos.map((p) => (
            <button key={p.id} className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer" style={{ backgroundColor: p.color }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="w-10 h-10 text-white/30 group-hover:text-white/50 transition-colors" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/40 px-2 py-1.5">
                <p className="text-xs text-white font-medium truncate">{p.caption}</p>
                <p className="text-[10px] text-white/60">{p.job}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
