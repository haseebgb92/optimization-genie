import Image from "next/image";

export function WebsiteThumbnail({ src }: { src: string | null }) {
  return (
    <div className="relative h-32 w-full overflow-hidden rounded-lg border bg-slate-100">
      <Image src={src || "/icons/genie-icon-256.png"} alt="Site thumbnail" fill className="object-cover" />
    </div>
  );
}
