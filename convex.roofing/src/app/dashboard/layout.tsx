import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileIcon, StarIcon } from "lucide-react";

//  export const metadata: Metadata = {
//  title: "ACDC.Roofing",
//  description: "The next revolution in Performance Design.",
//  };

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="container mx-auto pt-12">

      <div className="flex gap-8"> 
        <div className="w-44 mt-20 flex flex-col gap-2">
          <Link href="/dashboard/files">
            <Button variant={"link"} className="flex gap-2">
              <FileIcon /> All Files
            </Button>
          </Link>

          <Link href="/dashboard/favorites">
            <Button variant={"link"} className="flex gap-2">
              <StarIcon /> Favorites
            </Button>
          </Link> 
        </div>

        <div className="w-full">
			{children}
        </div>
      </div>
    </main>
  );
}