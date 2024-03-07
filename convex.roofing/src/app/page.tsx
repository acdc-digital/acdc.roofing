"use client"; 

import Image from "next/image";
import { Loader2 } from "lucide-react";

import { 
  useOrganization,
  useUser,
 } from "@clerk/nextjs"; 

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

import { UploadButton } from "./upload-button";
import { Filecard } from "./file-card";
import { SearchBar } from "./search-bar";
import { useState } from "react";

function Placeholder() {
  return (
    <div className="flex flex-col gap-8 w-full items-center mt-44">
          <Image
            alt="Facility image for empty state in Dashboard directory."
            width="400"
            height="400"
            src="empty-page.svg"
            /> 
              <div className="text-xl mt-6">
              There are currently no files in your Facility Directory.
              </div>
              <UploadButton />
          </div>
        )
      }

export default function Home() {
  const organization = useOrganization();
  const user = useUser(); 
  const [query, setQuery] = useState("");

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id; 
  }

  const files = useQuery(api.files.getFiles, orgId ? { orgId, query } : "skip"); 
  const isLoading = files === undefined;


  return (
    <main className="container mx-auto pt-12">

      { isLoading && 
        <div className="flex flex-col gap-8 w-full items-center mt-32">
          <Loader2 className="h-32 w-32 animate-spin text-gray-500" />
          <div className="text-2xl">Loading... </div>
        </div>}

      {!isLoading && (
        <>
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Your Files</h1>

            <SearchBar query={query} setQuery={setQuery} />

            <UploadButton />
            </div>

            {files.length === 0 && <Placeholder /> }

            <div className="grid grid-cols-4 gap-4">
            {files?.map((file) => {
              return <Filecard key={file._id} file={file} />
            })}
            </div>
        </>
      )}
    </main>
  );
}
