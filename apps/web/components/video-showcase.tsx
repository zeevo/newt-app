interface VideoShowcaseProps {
  src?: string;
  poster?: string;
}

export function VideoShowcase({ src, poster }: VideoShowcaseProps) {
  return (
    <div className="rounded-lg border overflow-hidden bg-muted aspect-video flex items-center justify-center">
      {src ? (
        <video
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          className="w-full block"
        />
      ) : (
        <div className="flex flex-col items-center gap-3 text-muted-foreground select-none">
          <div className="size-12 rounded-full border-2 border-current flex items-center justify-center">
            <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[14px] border-l-current ml-1" />
          </div>
          <span className="text-sm">demo coming soon</span>
        </div>
      )}
    </div>
  );
}
