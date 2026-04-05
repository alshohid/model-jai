"use client";
/* eslint-disable @next/next/no-img-element */

import constants from "@/constant";
import { getErrorMessage } from "@/lib/utils";
import { useGetMeDataQuery } from "@/redux/features/auth/authapi";
import {
    useCreateUserPostMutation,
    useDeleteUserPostMutation,
    useGetAllUserPostsQuery,
    useUpdateUserPostMutation,
} from "@/redux/features/user/userManagement";
import AppDialog from "@/shared/components/modal/AppDialog";
import { PrimaryButton } from "@/shared/UI/button/PrimaryButton";
import { cn } from "@/shared/lib/utils/cn";
import { getSafeImageSrc } from "@/shared/lib/utils/imagesrcvalidator";
import { getFullName } from "@/shared/lib/utils/name";
import { UserPost } from "@/types/user/usermanagement";
import {
    Camera,
    ImagePlus,
    LoaderCircle,
    PencilLine,
    Trash2,
    X,
} from "lucide-react";
import {
    ChangeEvent,
    FormEvent,
    KeyboardEvent,
    ReactNode,
    useEffect,
    useRef,
    useState,
} from "react";
import { toast } from "sonner";

const AVATAR_FALLBACK = "/images/home/pro_1.jpg";
const POST_IMAGE_FALLBACK = "/images/home/profile_img.png";
const MAX_DESCRIPTION_LENGTH = 500;

const apiOrigin = (() => {
    try {
        return new URL(constants.baseApiURL).origin;
    } catch {
        return "";
    }
})();

const parseApiDate = (value?: string | null) => {
    if (!value) return null;

    const normalized = value.includes("T") ? value : value.replace(" ", "T");
    const date = new Date(normalized);

    return Number.isNaN(date.getTime()) ? null : date;
};

const formatPostDate = (value?: string | null) => {
    const date = parseApiDate(value);

    if (!date) return "Recently";

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
};

const resolvePostImageSrc = (image?: string | null) => {
    if (typeof image !== "string") return POST_IMAGE_FALLBACK;

    const trimmedImage = image.trim();
    if (!trimmedImage) return POST_IMAGE_FALLBACK;

    if (/^https?:\/\//i.test(trimmedImage)) return trimmedImage;
    if (!apiOrigin) return POST_IMAGE_FALLBACK;

    const normalizedPath = trimmedImage.replace(/^\/+/, "");
    if (!normalizedPath) return POST_IMAGE_FALLBACK;

    const storagePath = normalizedPath.startsWith("storage/")
        ? normalizedPath
        : `storage/${normalizedPath}`;

    return `${apiOrigin}/${storagePath}`;
};

const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === "string") {
                resolve(reader.result);
                return;
            }

            reject(new Error("Image preview could not be generated."));
        };

        reader.onerror = () => {
            reject(new Error("Image preview could not be generated."));
        };

        reader.readAsDataURL(file);
    });

const buildPostFormData = (description: string, image?: File | null) => {
    const formData = new FormData();

    formData.append("description", description.trim());

    if (image instanceof File) {
        formData.append("image", image);
    }

    return formData;
};

const skeletonItems = Array.from({ length: 6 }, (_, index) => index);

const StatBadge = ({
    label,
    value,
    accent = "pink",
}: {
    label: string;
    value: string;
    accent?: "pink" | "blue";
}) => (
    <div
        className={cn(
            "rounded-[22px] border px-4 py-4 backdrop-blur-xl",
            accent === "pink"
                ? "border-[#FF00C8]/25 bg-[#FF00C8]/10"
                : "border-[#11B5FF]/25 bg-[#11B5FF]/10",
        )}
    >
        <p className="text-[11px] uppercase tracking-[0.24em] text-white/55">
            {label}
        </p>
        <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
);

const UploadPreview = ({
    preview,
    alt,
    onClear,
    onSelectImage,
}: {
    preview: string | null;
    alt: string;
    onClear?: () => void;
    onSelectImage?: () => void;
}) => {
    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (!onSelectImage) return;

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onSelectImage();
        }
    };

    if (!preview) {
        return (
            <div
                role={onSelectImage ? "button" : undefined}
                tabIndex={onSelectImage ? 0 : undefined}
                onClick={onSelectImage}
                onKeyDown={handleKeyDown}
                className={cn(
                    "flex aspect-[4/5] items-center justify-center rounded-[24px] border border-dashed border-white/15 bg-white/[0.03] transition",
                    onSelectImage
                        ? "cursor-pointer hover:border-[#11B5FF]/40 hover:bg-[#11B5FF]/[0.06] focus:outline-none focus:ring-2 focus:ring-[#11B5FF]/30"
                        : "",
                )}
                aria-label={onSelectImage ? "Choose a post image" : undefined}
            >
                <div className="px-5 text-center">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-white/8 text-[#11B5FF]">
                        <Camera className="size-7" />
                    </div>
                    <p className="mt-4 text-sm font-medium text-white">
                        Drop in your next standout moment
                    </p>
                    <p className="mt-2 text-xs leading-5 text-white/55">
                        JPG, PNG, or WEBP works great here.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            role={onSelectImage ? "button" : undefined}
            tabIndex={onSelectImage ? 0 : undefined}
            onClick={onSelectImage}
            onKeyDown={handleKeyDown}
            className={cn(
                "relative overflow-hidden rounded-[24px] border border-white/10 bg-black/20 transition",
                onSelectImage
                    ? "cursor-pointer hover:border-[#11B5FF]/35 focus:outline-none focus:ring-2 focus:ring-[#11B5FF]/30"
                    : "",
            )}
            aria-label={onSelectImage ? "Change selected post image" : undefined}
        >
            <img
                src={preview}
                alt={alt}
                className="aspect-[4/5] w-full object-cover"
                onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = POST_IMAGE_FALLBACK;
                }}
            />
            {onSelectImage ? (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-4 pb-4 pt-10">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/35 px-3 py-2 text-xs font-medium text-white/85 backdrop-blur-sm">
                        <ImagePlus className="size-4" />
                        Click to change image
                    </span>
                </div>
            ) : null}
            {onClear ? (
                <button
                    type="button"
                    onClick={(event) => {
                        event.stopPropagation();
                        onClear();
                    }}
                    className="absolute right-3 top-3 inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-black/60 text-white transition hover:bg-black/75"
                    aria-label="Remove selected image"
                >
                    <X className="size-4" />
                </button>
            ) : null}
        </div>
    );
};

const ActionButton = ({
    children,
    intent = "default",
    disabled = false,
    onClick,
}: {
    children: ReactNode;
    intent?: "default" | "danger";
    disabled?: boolean;
    onClick?: () => void;
}) => (
    <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={cn(
            "inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium transition",
            "disabled:cursor-not-allowed disabled:opacity-60",
            intent === "danger"
                ? "border-[#FF4D6D]/20 bg-[#FF4D6D]/10 text-[#FF92A7] hover:bg-[#FF4D6D]/15"
                : "border-white/10 bg-white/6 text-white/75 hover:bg-white/10 hover:text-white",
        )}
    >
        {children}
    </button>
);

export default function UserPostsSection() {
    const createImageInputRef = useRef<HTMLInputElement | null>(null);
    const editImageInputRef = useRef<HTMLInputElement | null>(null);

    const [description, setDescription] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);

    const [editingPost, setEditingPost] = useState<UserPost | null>(null);
    const [editDescription, setEditDescription] = useState("");
    const [editImage, setEditImage] = useState<File | null>(null);
    const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
    const [deletingPostId, setDeletingPostId] = useState<number | null>(null);

    const { data: meData } = useGetMeDataQuery();
    const {
        data: postsResponse,
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
    } = useGetAllUserPostsQuery();

    const [createUserPost, { isLoading: isCreating }] = useCreateUserPostMutation();
    const [updateUserPost, { isLoading: isUpdating }] = useUpdateUserPostMutation();
    const [deleteUserPost, { isLoading: isDeleting }] = useDeleteUserPostMutation();

    const user = meData?.data?.user;
    const userName = getFullName(user) || user?.name || "Your profile";
    const avatarSrc = getSafeImageSrc(user?.image, AVATAR_FALLBACK);

    const posts = [...(postsResponse?.data ?? [])].sort((left, right) => {
        const leftTime = parseApiDate(left.created_at)?.getTime() ?? 0;
        const rightTime = parseApiDate(right.created_at)?.getTime() ?? 0;

        return rightTime - leftTime;
    });

    const latestPostLabel = posts[0]?.created_at
        ? formatPostDate(posts[0].created_at)
        : "Nothing published yet";

    useEffect(() => {
        if (!editingPost) return;

        setEditDescription(editingPost.description ?? "");
        setEditImage(null);
        setEditImagePreview(resolvePostImageSrc(editingPost.image));

        if (editImageInputRef.current) {
            editImageInputRef.current.value = "";
        }
    }, [editingPost]);

    const resetCreateForm = () => {
        setDescription("");
        setSelectedImage(null);
        setSelectedImagePreview(null);

        if (createImageInputRef.current) {
            createImageInputRef.current.value = "";
        }
    };

    const closeEditDialog = () => {
        setEditingPost(null);
        setEditDescription("");
        setEditImage(null);
        setEditImagePreview(null);

        if (editImageInputRef.current) {
            editImageInputRef.current.value = "";
        }
    };

    const openCreateImagePicker = () => {
        createImageInputRef.current?.click();
    };

    const openEditImagePicker = () => {
        editImageInputRef.current?.click();
    };

    const handleImageSelection = async (
        file: File,
        onFile: (value: File) => void,
        onPreview: (value: string) => void,
    ) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Please choose a valid image file.");
            return;
        }

        try {
            const preview = await readFileAsDataUrl(file);
            onFile(file);
            onPreview(preview);
        } catch (previewError) {
            toast.error(getErrorMessage(previewError));
        }
    };

    const handleCreateImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        await handleImageSelection(file, setSelectedImage, setSelectedImagePreview);
    };

    const handleEditImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        await handleImageSelection(file, setEditImage, setEditImagePreview);
    };

    const handleCreatePost = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!description.trim()) {
            toast.error("Please write a short post description.");
            return;
        }

        if (!selectedImage) {
            toast.error("Please select an image for your post.");
            return;
        }

        try {
            const response = await createUserPost(
                buildPostFormData(description, selectedImage),
            ).unwrap();

            toast.success(response?.message || "Post created successfully");
            resetCreateForm();
        } catch (createError) {
            toast.error(getErrorMessage(createError));
        }
    };

    const handleUpdatePost = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!editingPost) return;

        if (!editDescription.trim()) {
            toast.error("Please write a short post description.");
            return;
        }

        try {
            const response = await updateUserPost({
                id: editingPost.id,
                body: buildPostFormData(editDescription, editImage),
            }).unwrap();

            toast.success(response?.message || "Post updated successfully");
            closeEditDialog();
        } catch (updateError) {
            toast.error(getErrorMessage(updateError));
        }
    };

    const handleDeletePost = async (postId: number) => {
        if (typeof window !== "undefined") {
            const shouldDelete = window.confirm(
                "Are you sure you want to delete this post?",
            );

            if (!shouldDelete) return;
        }

        try {
            setDeletingPostId(postId);
            const response = await deleteUserPost(postId).unwrap();

            toast.success(response?.message || "Post deleted successfully");

            if (editingPost?.id === postId) {
                closeEditDialog();
            }
        } catch (deleteError) {
            toast.error(getErrorMessage(deleteError));
        } finally {
            setDeletingPostId(null);
        }
    };

    return (
        <>
            <section className="container pb-6 md:pb-10">
                <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[#110B14] px-4 py-5 shadow-[0_28px_80px_rgba(0,0,0,0.45)] md:px-7 md:py-8">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,0,200,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(17,181,255,0.16),transparent_30%)]" />

                    <div className="relative z-10">
                        <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                            <div className="max-w-2xl">
                                <span className="inline-flex items-center gap-2 rounded-full border border-[#11B5FF]/25 bg-[#11B5FF]/10 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.26em] text-[#8FDBFF]">
                                    <span className="size-2 rounded-full bg-[#11B5FF]" />
                                    Post studio
                                </span>

                                <p className="mt-3 max-w-[720px] text-sm leading-6 text-white/60 md:text-[15px]">
                                    Upload fresh content, refine your captions, and keep your
                                    profile feed active without leaving this page.
                                </p>
                            </div>

                            <div className="hidden lg:grid sm:grid-cols-2 xl:min-w-[320px] gap-3">
                                <StatBadge label="Published" value={`${posts.length} posts`} />
                                <StatBadge
                                    label="Latest upload"
                                    value={latestPostLabel}
                                    accent="blue"
                                />
                            </div>
                        </div>

                        <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
                            <div className="xl:sticky xl:top-6 xl:self-start">
                                <form
                                    onSubmit={handleCreatePost}
                                    className="rounded-[30px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl md:p-5"
                                >
                                    <div className="mb-5 flex items-center gap-3">
                                        <img
                                            src={avatarSrc}
                                            alt={userName}
                                            className="size-12 rounded-full object-cover ring-2 ring-white/10"
                                            onError={(event) => {
                                                event.currentTarget.onerror = null;
                                                event.currentTarget.src = AVATAR_FALLBACK;
                                            }}
                                        />
                                        <div>
                                            <p className="text-sm font-semibold text-white">
                                                {userName}
                                            </p>
                                            <p className="text-xs text-white/50">
                                                Create a new post for your profile
                                            </p>
                                        </div>
                                    </div>

                                    <UploadPreview
                                        preview={selectedImagePreview}
                                        alt="Selected post preview"
                                        onSelectImage={openCreateImagePicker}
                                        onClear={() => {
                                            setSelectedImage(null);
                                            setSelectedImagePreview(null);

                                            if (createImageInputRef.current) {
                                                createImageInputRef.current.value = "";
                                            }
                                        }}
                                    />

                                    <div className="mt-5">
                                        <div className="mb-2 flex items-center justify-between gap-3">
                                            <label
                                                htmlFor="create-post-description"
                                                className="text-sm font-medium text-white"
                                            >
                                                Caption
                                            </label>
                                            <span className="text-xs text-white/45">
                                                {description.length}/{MAX_DESCRIPTION_LENGTH}
                                            </span>
                                        </div>

                                        <textarea
                                            id="create-post-description"
                                            value={description}
                                            onChange={(event) =>
                                                setDescription(event.target.value)
                                            }
                                            maxLength={MAX_DESCRIPTION_LENGTH}
                                            placeholder="Write something memorable about this moment..."
                                            className="min-h-[128px] w-full resize-none rounded-[20px] border border-white/10 bg-[#09060A]/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#FF00C8]/40 focus:ring-2 focus:ring-[#FF00C8]/15"
                                        />
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-3">
                                        <label
                                            htmlFor="create-post-image"
                                            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                                        >
                                            <ImagePlus className="size-4" />
                                            Choose image
                                        </label>
                                        <input
                                            ref={createImageInputRef}
                                            id="create-post-image"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleCreateImageChange}
                                            className="hidden"
                                        />

                                        {selectedImage ? (
                                            <span className="inline-flex items-center rounded-full border border-[#11B5FF]/20 bg-[#11B5FF]/10 px-4 py-3 text-xs text-[#A8E8FF]">
                                                {selectedImage.name}
                                            </span>
                                        ) : null}
                                    </div>

                                    <PrimaryButton
                                        text="Upload post"
                                        loadingText="Uploading..."
                                        isLoading={isCreating}
                                        className="mt-5"
                                    />
                                </form>
                            </div>

                            <div>
                                <div className="mb-4 flex items-center justify-between gap-3">
                                    <div>
                                        <h3 className="text-lg font-semibold text-white md:text-2xl">
                                            Your posts
                                        </h3>

                                    </div>

                                    {isFetching && !isLoading ? (
                                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs text-white/60">
                                            <LoaderCircle className="size-4 animate-spin" />
                                            Syncing
                                        </div>
                                    ) : null}
                                </div>

                                {isLoading ? (
                                    <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                                        {skeletonItems.map((item) => (
                                            <div
                                                key={item}
                                                className="animate-pulse overflow-hidden rounded-[26px] border border-white/8 bg-white/[0.035]"
                                            >
                                                <div className="aspect-[4/5] bg-white/8" />
                                                <div className="space-y-3 p-4">
                                                    <div className="h-4 w-24 rounded-full bg-white/8" />
                                                    <div className="h-4 w-full rounded-full bg-white/6" />
                                                    <div className="h-4 w-2/3 rounded-full bg-white/6" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : null}

                                {!isLoading && isError ? (
                                    <div className="rounded-[26px] border border-[#FF4D6D]/15 bg-[#FF4D6D]/7 p-6 text-white">
                                        <p className="text-lg font-semibold">
                                            Your posts could not be loaded
                                        </p>
                                        <p className="mt-2 max-w-xl text-sm leading-6 text-white/65">
                                            {getErrorMessage(
                                                error,
                                                "Please try again in a moment.",
                                            )}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => refetch()}
                                            className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/12"
                                        >
                                            Try again
                                        </button>
                                    </div>
                                ) : null}

                                {!isLoading && !isError && posts.length === 0 ? (
                                    <div className="rounded-[28px] border border-dashed border-white/12 bg-white/[0.03] px-5 py-16 text-center">
                                        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-white/8 text-[#FF00C8]">
                                            <ImagePlus className="size-7" />
                                        </div>
                                        <h4 className="mt-5 text-xl font-semibold text-white">
                                            Your post wall is ready
                                        </h4>
                                        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/55">
                                            Upload your first image and caption from the composer on the
                                            left. New posts will appear here instantly.
                                        </p>
                                    </div>
                                ) : null}

                                {!isLoading && !isError && posts.length > 0 ? (
                                    <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                                        {posts.map((post) => {
                                            const isDeletingThisPost =
                                                isDeleting && deletingPostId === post.id;

                                            return (
                                                <article
                                                    key={post.id}
                                                    className="group overflow-hidden rounded-[26px] border border-white/8 bg-[#181018]/90 shadow-[0_20px_45px_rgba(0,0,0,0.24)]"
                                                >
                                                    <div className="relative overflow-hidden">
                                                        <img
                                                            src={resolvePostImageSrc(post.image)}
                                                            alt={post.description || "User post"}
                                                            className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                                                            onError={(event) => {
                                                                event.currentTarget.onerror = null;
                                                                event.currentTarget.src = POST_IMAGE_FALLBACK;
                                                            }}
                                                        />

                                                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                                                        <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-2">
                                                            <span className="rounded-full border border-white/12 bg-black/45 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/80 backdrop-blur-md">
                                                                {formatPostDate(post.created_at)}
                                                            </span>

                                                            <div className="flex items-center gap-2">
                                                                <ActionButton
                                                                    onClick={() => setEditingPost(post)}
                                                                >
                                                                    <PencilLine className="size-4" />
                                                                    Edit
                                                                </ActionButton>
                                                                <ActionButton
                                                                    intent="danger"
                                                                    disabled={isDeletingThisPost}
                                                                    onClick={() =>
                                                                        handleDeletePost(post.id)
                                                                    }
                                                                >
                                                                    {isDeletingThisPost ? (
                                                                        <LoaderCircle className="size-4 animate-spin" />
                                                                    ) : (
                                                                        <Trash2 className="size-4" />
                                                                    )}
                                                                    Delete
                                                                </ActionButton>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="p-4">
                                                        <p
                                                            className="text-sm leading-6 break-words text-white/78"
                                                            style={{
                                                                display: "-webkit-box",
                                                                WebkitLineClamp: 4,
                                                                WebkitBoxOrient: "vertical",
                                                                overflow: "hidden",
                                                            }}
                                                        >
                                                            {post.description || "No description added."}
                                                        </p>
                                                    </div>
                                                </article>
                                            );
                                        })}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <AppDialog
                open={Boolean(editingPost)}
                onOpenChange={(open) => {
                    if (!open) {
                        closeEditDialog();
                    }
                }}
                title="Edit post"
                className="max-w-[560px]"
                bodyClassName="pb-6"
            >
                <form onSubmit={handleUpdatePost} className="space-y-5">
                    <UploadPreview
                        preview={
                            editImagePreview ||
                            (editingPost ? resolvePostImageSrc(editingPost.image) : null)
                        }
                        alt="Edit post preview"
                        onSelectImage={openEditImagePicker}
                        onClear={
                            editImage
                                ? () => {
                                    setEditImage(null);
                                    setEditImagePreview(
                                        editingPost
                                            ? resolvePostImageSrc(editingPost.image)
                                            : null,
                                    );

                                    if (editImageInputRef.current) {
                                        editImageInputRef.current.value = "";
                                    }
                                }
                                : undefined
                        }
                    />

                    <div>
                        <div className="mb-2 flex items-center justify-between gap-3">
                            <label
                                htmlFor="edit-post-description"
                                className="text-sm font-medium text-white"
                            >
                                Caption
                            </label>
                            <span className="text-xs text-white/45">
                                {editDescription.length}/{MAX_DESCRIPTION_LENGTH}
                            </span>
                        </div>

                        <textarea
                            id="edit-post-description"
                            value={editDescription}
                            onChange={(event) => setEditDescription(event.target.value)}
                            maxLength={MAX_DESCRIPTION_LENGTH}
                            placeholder="Refresh the caption for this post..."
                            className="min-h-[140px] w-full resize-none rounded-[20px] border border-white/10 bg-[#09060A]/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#11B5FF]/40 focus:ring-2 focus:ring-[#11B5FF]/15"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <label
                            htmlFor="edit-post-image"
                            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                        >
                            <ImagePlus className="size-4" />
                            Replace image
                        </label>
                        <input
                            ref={editImageInputRef}
                            id="edit-post-image"
                            type="file"
                            accept="image/*"
                            onChange={handleEditImageChange}
                            className="hidden"
                        />

                        {editImage ? (
                            <span className="inline-flex items-center rounded-full border border-[#11B5FF]/20 bg-[#11B5FF]/10 px-4 py-3 text-xs text-[#A8E8FF]">
                                {editImage.name}
                            </span>
                        ) : (
                            <span className="text-xs text-white/45">
                                Keep the current image if you do not want to replace it.
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={closeEditDialog}
                            className="inline-flex cursor-pointer items-center justify-center rounded-[14px] border border-white/10 px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/8 hover:text-white"
                        >
                            Cancel
                        </button>
                        <div className="flex-1">
                            <PrimaryButton
                                text="Save changes"
                                loadingText="Saving..."
                                isLoading={isUpdating}
                            />
                        </div>
                    </div>
                </form>
            </AppDialog>
        </>
    );
}
