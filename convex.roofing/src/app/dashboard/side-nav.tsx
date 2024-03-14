'use client'

import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { FileIcon, LineChartIcon, StarIcon, Trash2Icon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SideNav() {
  const pathname = usePathname()

	return (
		<div className="w-44 mt-20 flex flex-col gap-2">
          <Link href="/dashboard/files">
            <Button variant={"link"} className={clsx("flex gap-2", {
            "text-blue-700": pathname.includes("/dashboard/files"),
            })}
          >
              <FileIcon /> All Files
            </Button>
          </Link>

          <Link href="/dashboard/favorites">
          <Button variant={"link"} className={clsx("flex gap-2", {
            "text-blue-700": pathname.includes("/dashboard/favorites"),
            })}
          >
              <StarIcon /> Favorites
            </Button>
          </Link> 

          <Link href="/dashboard/financials">
          <Button variant={"link"} className={clsx("flex gap-2", {
            "text-blue-700": pathname.includes("/dashboard/financials"),
            })}
          >
              <LineChartIcon /> Financials
            </Button>
          </Link> 

          <Link href="/dashboard/trash">
          <Button variant={"link"} className={clsx("flex gap-2", {
            "text-blue-700": pathname.includes("/dashboard/trash"),
            })}
          >
              <Trash2Icon /> Trash
            </Button>
          </Link>
          
        </div>
	  );
	}