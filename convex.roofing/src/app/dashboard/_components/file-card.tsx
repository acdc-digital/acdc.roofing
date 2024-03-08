import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
  } from "@/components/ui/card"
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"

import { GanttChartIcon, ImageIcon, MoreVertical, FileTextIcon, Trash2Icon, TablePropertiesIcon, StarIcon, StarHalf } from "lucide-react";
import { ReactNode, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { Protect } from "@clerk/nextjs";

function FilecardActions({ 
		file, 
		isFavorited 
	}: { 
		file: Doc<"files">;
		isFavorited: boolean; 
	}) {
	const deleteFile = useMutation(api.files.deleteFile);
	const toggleFavorite = useMutation(api.files.toggleFavorite);
	const { toast } = useToast();

	const [isConfirmOpen, setIsConfirmOpen] = useState(false);

	return (
		<>
		<AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen} >
			<AlertDialogContent>
				<AlertDialogHeader>
				<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
				<AlertDialogDescription>
					This action cannot be undone. This will permanently delete your files and remove your data from our servers.
				</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
				<AlertDialogCancel>Cancel</AlertDialogCancel>
				<AlertDialogAction 
					onClick={async () => {
					await deleteFile({
						fileId: file._id,
					});
					toast({
						variant: "default",
						title: "File deleted successfully.",
						description: "This file is now no longer accessible to your organzation."
					  });
					}}
			   	  >
				  Continue</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
			</AlertDialog>

		<DropdownMenu>
			<DropdownMenuTrigger><MoreVertical />
			</DropdownMenuTrigger>
			<DropdownMenuContent>
			<DropdownMenuItem 
				onClick={() => {
					toggleFavorite ({
						fileId: file._id,
					})
				}}
				className="flex gap-1 items-center cursor-pointer">

					{isFavorited ? (
					<div className="flex gap-1 items-center">
					<StarHalf className="w-4 h-4" /> Unfavorite
					</div> 
					) : (
					<div className="flex gap-1 items-center">
					<StarIcon className="w-4 h-4" /> Favorite 
					</div> 
					)}

				</DropdownMenuItem>
				<Protect role="org:admin" fallback={<></>}>
				<DropdownMenuSeparator />
				<DropdownMenuItem 
				onClick={() => setIsConfirmOpen(true)}
				className="flex gap-1 text-red-600 items-center cursor-pointer">
					<Trash2Icon className="w-4 h-4"/> Delete
				</DropdownMenuItem>
				</Protect>
			</DropdownMenuContent>
		</DropdownMenu>
		</>
	);
}

function getFileUrl(fileId: Id<"_storage">): string {
	return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`;
}

export function Filecard({ 
	file, 
	favorites 
  }: { 
	file: Doc<"files">;
	favorites: Doc<"favorites">[]; 
  }) {
	const typeIcons = {
		"image": <ImageIcon />,
		"pdf": <FileTextIcon />,
		"csv": <TablePropertiesIcon />,
	  } as Record<Doc<"files">["type"], ReactNode>;

	  const isFavorited = favorites.some(
		(favorite) => favorite.fileId === file._id  
		);

	return (
		<Card>
  <CardHeader className="relative">
    <CardTitle className="flex gap-2">
		<div className="flex justify-center">{typeIcons[file.type]}</div>
		{file.name} 
	</CardTitle>
	<div className="absolute top-4 right-2">
	<FilecardActions isFavorited={isFavorited} file={file} />
	</div>
    {/* <CardDescription>Card Description</CardDescription> */} 
  </CardHeader>
  <CardContent className="flex">
    {file.type === "image" && (
		<Image 
		alt={file.name}
		width="200"
		height="100"
		src={getFileUrl(file.fileId)}
		/>
	)}

	{file.type === "csv" && <GanttChartIcon className="w-20 h-20" />}
	{file.type === "pdf" && <FileTextIcon className="w-20 h-20" />}
  </CardContent>
  <CardFooter className="flex">
	<Button
	onClick={() => {
	// open a new tab to the file location on Convex 
	window.open(getFileUrl(file.fileId), "_blank");
	}}
	>
		Download
	</Button>
  </CardFooter>
</Card>
	);
}