import type React from "react";
import { ExternalLink } from "lucide-react";
import ShareIcon from "../Icons/ShareIcon";
import DeleteIcon from "../Icons/deleteIcon";
import EditIcon from "../Icons/EditIcon";
import { useDeleteContent } from "../hooks/useDeleteContent";
import { useQueryClient } from "@tanstack/react-query";
import { Icon } from "./Icons";
import { useShare } from "../hooks/useShare";
import UnShareIcon from "../Icons/unShareIcon";
import { useState } from "react";
import { toast } from "sonner";
import ConfirmDialog from "./ConfirmDialog";

interface CardComponentProps {
  contentId?: string;
  share?: boolean;
  title: string;
  titleIcon: React.ReactNode;
  linkUrl: string;
  linkText: string;
  tags: string[];
  onEdit?: (content: any) => void;
}

export function CardComponent({
  contentId,
  share,
  title,
  titleIcon,
  linkUrl,
  linkText,
  tags,
  onEdit,
}: CardComponentProps) {
  const queryClient = useQueryClient();

  const [isShared, setIsShared] = useState(share ?? false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { mutate: deleteContent, isPending } = useDeleteContent();
  const { mutate: shareContent, isPending: isPendingShare } = useShare();

  const handleShare = () => {
    if (!contentId) return toast.error("Missing content ID!");

    shareContent(
      { contentId, share: !isShared },
      {
        onSuccess: (res) => {
          if (res.hash) {
            const link = `${window.location.origin}/brain/${res.hash}`;
            navigator.clipboard.writeText(link);
            toast.success(`Link copied!\n${link}`);
          } else {
            toast.success("Content unshared successfully!");
          }
          setIsShared(!isShared);
          queryClient.invalidateQueries({ queryKey: ["contents"] });
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.error || "Error sharing content!");
        },
      }
    );
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit({
        contentId,
        title,
        linkUrl,
        linkText,
        tags: tags.join(","),
      });
    }
  };

  const handleDelete = () => {
    if (!contentId) return toast.error("Missing content ID!");
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    setShowConfirm(false);
    if (!contentId) return;

    deleteContent(
      { contentId },
      {
        onSuccess: (res) => {
          toast.success(res.message || "Content deleted successfully!");
          queryClient.invalidateQueries({ queryKey: ["contents"] });
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.error || "Error deleting content!");
        },
      }
    );
  };

  return (
    <div className="w-full max-w-sm border rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/50">
      <div className="flex justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="text-blue-600 text-xl dark:text-blue-400">{titleIcon}</div>
          <h3 className="text-gray-900 text-lg font-semibold dark:text-gray-100">{title}</h3>
        </div>

        <div className="flex gap-3">
          <Icon onClick={handleShare} disabled={isPendingShare}>
            {isShared ? <UnShareIcon /> : <ShareIcon />}
          </Icon>

          <Icon onClick={handleEdit} disabled={isPending}>
            <EditIcon />
          </Icon>
          <Icon onClick={handleDelete} disabled={isPending}>
            <DeleteIcon />
          </Icon>
        </div>
      </div>

      <div className="mb-6 pb-10 pt-6 flex justify-center">
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium dark:text-gray-400 dark:hover:text-gray-100"
        >
          {linkText}
          <ExternalLink size={16} />
        </a>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded-full hover:bg-blue-100 hover:text-blue-800 transition-colors cursor-pointer dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-blue-900 dark:hover:text-blue-200"
          >
            {tag}
          </span>
        ))}
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Delete Content"
        message="Are you sure you want to delete this content?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
