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
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { GanttChartIcon, ImageIcon, MoreVertical, FileTextIcon, Trash2Icon, TablePropertiesIcon, StarIcon, StarHalf, UndoIcon, FileIcon, FilesIcon } from "lucide-react";

import { ReactNode, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { Protect } from "@clerk/nextjs";
import { format, formatDistance, formatRelative, subDays } from 'date-fns'

function FilecardActions({ 
		file, 
		isFavorited 
	}: { 
		file: Doc<"files">;
		isFavorited: boolean; 
	}) {
	const deleteFile = useMutation(api.files.deleteFile);
	const restoreFile = useMutation(api.files.restoreFile);
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
					This action has marked the file for deletion. This file will permanently delete and remove your data from our servers on the 30th, every month.
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
						title: "File marked for Deletion",
						description: "This file is now only accessible in the Trashcan Folder for deletion in the near future."
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

				<DropdownMenuItem 
				onClick={() => {
					// open a new tab to the file location on Convex 
					window.open(getFileUrl(file.fileId), "_blank");
					}}
				className="flex gap-1 items-center cursor-pointer">
					<FileIcon className="w-4 h-4"/> Download 
				</DropdownMenuItem>

				<Protect role="org:admin" fallback={<></>}>
				<DropdownMenuSeparator />
				<DropdownMenuItem 
				onClick={() => {
					if (file.shouldDelete) {
						restoreFile({
							fileId: file._id,
						})
					} else {
					setIsConfirmOpen(true)
					}
				}}
				className="flex gap-1 items-center cursor-pointer"
				>
					{file.shouldDelete ? (
					<div className="flex gap-1 text-green-600 items-center cursor-pointer">
					  <UndoIcon className="w-4 h-4" /> Restore
					</div>
					) : (
					<div className="flex gap-1 text-red-600 items-center cursor-pointer">
					  <Trash2Icon className="w-4 h-4" /> Delete
					  </div>
					)}
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

	const userProfile = useQuery(api.users.getUserProfile, {
		userId: file.userId,
	});

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
  <CardFooter className="flex justify-between">
	<div className="flex gap-2 text-xs text-gray-600 w-48 items-center"> 
	<Avatar className="w-6 h-6 border border-black">
		<AvatarImage src={userProfile?.image} />
		<AvatarFallback>CN</AvatarFallback>
	</Avatar>
	{userProfile?.name}
	</div>
	<div className="text-xs text-gray-600">
	    Uploaded {formatRelative(new Date(file._creationTime), new Date())}
	</div> 
  </CardFooter>
</Card>
	);
}