"use client";
import useMount from "@/app/hooks/useMount";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { CreatePost } from "@/lib/schemas";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "sonner";
import Error from "@/components/Error";
import { createPost } from "@/lib/actions";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { MapPin, MapPinOff } from "lucide-react";

const CreatePage = () => {
    const pathname = usePathname();
    const isCreatePage = pathname === "/dashboard/create";
    const router = useRouter();
    const mount = useMount();

    const [upload, setupload] = useState(false);
    const [uploadProgress, setuploadProgress] = useState(0);

    const [location, setLocation] = useState(true);

    const { startUpload } = useUploadThing("imageUploader", {
        onUploadProgress(p) {
            setuploadProgress(p);
        },
    });

    const form = useForm<z.infer<typeof CreatePost>>({
        resolver: zodResolver(CreatePost),
        defaultValues: {
            caption: "",
            fileUrl: undefined,
            fileName: undefined,
            fileType: undefined,
            location: "", 
        },
    });

    async function blobToFile({
        fileUrl,
        fileName,
        fileType,
    }: {
        fileUrl: string;
        fileName: string;
        fileType: string;
    }): Promise<File> {
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        return new File([blob], fileName, { type: fileType });
    }

    const fileUrl = form.watch("fileUrl");

    if (!mount) return null;

    return (
        <div>
            <Dialog
                open={isCreatePage}
                onOpenChange={(open) => !open && !upload && router.back()}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create new post</DialogTitle>
                    </DialogHeader>

                    <Form {...form}>
                        <form
                            className=" space-y-4"
                            onSubmit={form.handleSubmit(async (values) => {
                                setupload(true);

                                const file = await blobToFile(values);

                                const {ip} = location && await (await fetch('https://api.ipify.org?format=json')).json()
                                values.location =  ip ? ip : "";

                                // console.log(ip)


                                values.fileUrl = await startUpload([file]).then(
                                    (uploadedFiles: any) => {
                                        if (
                                            uploadedFiles.length > 0 &&
                                            uploadedFiles[0].url
                                        ) {
                                            return uploadedFiles[0].url;
                                        }
                                    }
                                );

                                const res = await createPost(values);
                                if (res) {
                                    return toast.error(<Error res={res} />);
                                }

                                setupload(false);
                                toast.success("Post created successfully.");
                            })}
                        >
                            {!!fileUrl ? (
                                <div className=" h-96 md:h-[450px] overflow-hidden rounded-md">
                                    <AspectRatio
                                        ratio={1 / 1}
                                        className=" relative object-cover"
                                    >
                                        <Image
                                            src={fileUrl}
                                            alt="Post preview"
                                            fill
                                            className=" rounded-md object-cover"
                                        />
                                    </AspectRatio>
                                    <input type="text" />
                                </div>
                            ) : (
                                <FormField
                                    control={form.control}
                                    name="fileUrl"
                                    render={({ field, fieldState }) => (
                                        <FormItem>
                                            <FormDescription>
                                                Upload a picture to post.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            {!!fileUrl && (
                                <FormField
                                    control={form.control}
                                    name="caption"
                                    render={({ field }) => (
                                        <FormItem className="flex justify-between items-end gap-2">
                                            <div className="w-full">
                                                <FormLabel htmlFor="caption">
                                                    Caption
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="caption"
                                                        id="caption"
                                                        placeholder="Write a caption..."
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </div>
                                            <Button
                                                variant={"outline"}
                                                size={"icon"}
                                                className="text-black dark:text-white"
                                                onClick={(e) => {e.preventDefault(); setLocation(!location); }}
                                                name="location"
                                            >
                                                { location ? <MapPin /> : <MapPinOff/> } 
                                            </Button>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            <div className="pt-2 space-x-4">
                                <label className="px-4 py-2 bg-blue-600 rounded-lg shadow-lg tracking-wide text-white border border-white cursor-pointer hover:bg-blue-700">
                                    <span className="">Select a file</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={(event) => {
                                            const { files } = event.target;
                                            if (files && files[0]) {
                                                form.setValue(
                                                    "fileUrl",
                                                    URL.createObjectURL(
                                                        files[0]
                                                    )
                                                );
                                                form.setValue(
                                                    "fileName",
                                                    files[0].name
                                                );
                                                form.setValue(
                                                    "fileType",
                                                    files[0].type
                                                );
                                            }
                                        }}
                                    />
                                </label>
                                <Button
                                    type="submit"
                                    disabled={form.formState.isSubmitting}
                                >
                                    Create Post
                                </Button>
                            </div>
                        </form>
                    </Form>

                    {/*upload progress bar */}
                    <div
                        className={cn(
                            "w-full h-2 rounded-full bg-neutral-800 hidden",
                            { "block mt-2": uploadProgress > 0 }
                        )}
                    >
                        <div
                            className="h-full rounded-full bg-green-600 transition-width duration-500 ease-in-out"
                            style={{ width: `${uploadProgress}%` }}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CreatePage;
