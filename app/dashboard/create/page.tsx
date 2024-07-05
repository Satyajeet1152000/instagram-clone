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
import { UploadButton } from "@/lib/uploadthing";
import { toast } from "sonner";
import Error from "@/components/Error";
import { createPost } from "@/lib/actions";

const CreatePage = () => {
    const pathname = usePathname();
    const isCretePage = pathname === "/dashboard/create";
    const router = useRouter();
    const mount = useMount();

    const form = useForm<z.infer<typeof CreatePost>>({
        resolver: zodResolver(CreatePost),
        defaultValues: {
            caption: "",
            fileUrl: undefined,
        },
    });

    const fileUrl = form.watch("fileUrl");

    if (!mount) return null;

    return (
        <div>
            <Dialog
                open={isCretePage}
                onOpenChange={(open) => !open && router.back()}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create new post</DialogTitle>
                    </DialogHeader>

                    <Form {...form}>
                        <form
                            className=" space-y-4 "
                            onSubmit={form.handleSubmit(async (values) => {
                                const res = await createPost(values);
                                if (res) {
                                    return toast.error(<Error res={res} />);
                                }
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
                                </div>
                            ) : (
                                <FormField
                                    control={form.control}
                                    name="fileUrl"
                                    render={({ field, fieldState }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="picture">
                                                Picture
                                            </FormLabel>
                                            <FormControl>
                                                <UploadButton
                                                    endpoint="imageUploader"
                                                    onClientUploadComplete={(
                                                        res
                                                    ) => {
                                                        form.setValue(
                                                            "fileUrl",
                                                            res[0].url
                                                        );
                                                        toast.success(
                                                            "Upload complete."
                                                        );
                                                    }}
                                                    onUploadError={(
                                                        error: Error
                                                    ) => {
                                                        console.log(error);
                                                        toast.error(
                                                            "Upload failed."
                                                        );
                                                    }}
                                                />
                                            </FormControl>
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
                                        <FormItem>
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
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                            >
                                Create Post
                            </Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CreatePage;
