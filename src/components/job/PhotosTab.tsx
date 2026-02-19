import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PhotoEntry } from "@/data/dummyJobDetails";

interface PhotosTabProps {
  photos: PhotoEntry[];
}

export function PhotosTab({ photos }: PhotosTabProps) {
  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base">Photos</CardTitle>
        <Button size="sm" className="h-9 gap-1.5">
          <Upload className="w-4 h-4" /> Upload Photo
        </Button>
      </CardHeader>
      <CardContent>
        {photos.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">No photos yet</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {photos.map((photo) => (
              <button
                key={photo.id}
                className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
                style={{ backgroundColor: photo.color }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="w-10 h-10 text-white/30 group-hover:text-white/50 transition-colors" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/40 px-2 py-1.5">
                  <p className="text-xs text-white font-medium truncate">{photo.caption}</p>
                  <p className="text-[10px] text-white/60">{photo.timestamp}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
