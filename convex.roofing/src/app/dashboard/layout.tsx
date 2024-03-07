import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileIcon, StarIcon } from "lucide-react";
import { SideNav } from "./side-nav";

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
        <SideNav />
        <div className="w-full">
			{children}
        </div>
      </div>
    </main>
  );
}