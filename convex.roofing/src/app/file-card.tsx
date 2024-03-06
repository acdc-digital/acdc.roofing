import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
  } from "@/components/ui/card"
  import { Doc } from "../../convex/_generated/dataModel";
  import { Button } from "@/components/ui/button";

export function Filecard({ file }: { file: Doc<"files"> }) {
	return (
		<Card>
  <CardHeader>
    <CardTitle>{file.name}</CardTitle>
    {/* <CardDescription>Card Description</CardDescription> */} 
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
	<Button>Download</Button>
  </CardFooter>
</Card>
	);
}