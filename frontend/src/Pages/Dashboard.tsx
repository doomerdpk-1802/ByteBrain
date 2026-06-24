import { Sidebar } from "../Components/SideBar";
import { GenericButton } from "../Components/Button";
import { CardComponent } from "../Components/Card";
import { useState, useEffect } from "react";
import ContentModal from "../Components/ContentModal";
import GenericInput from "../Components/Input";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useContent } from "../hooks/useContent";
import { useMe } from "../hooks/useMe";
import ImageIcon from "../Icons/ImageIcon";
import YoutubeIcon from "../Icons/YoutubeIcon";
import XIcon from "../Icons/XIcon";
import ArticleIcon from "../Icons/articleIcon";
import Alert from "../Components/Alert";
import { useUpdateContent } from "../hooks/useUpdateContent";
import { useTypeContents } from "../hooks/useContentsType";

interface FormData {
  link: string;
  title: string;
  tags: string;
  type: string;
  linkText: string;
}

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [editContent, setEditContent] = useState<any | null>(null);
  const [selectedType, setSelectedType] = useState<string | undefined>(
    undefined
  );
  const navigate = useNavigate();
  const { mutate, isPending } = useContent();
  const { mutate: updateContent, isPending: isUpdating } = useUpdateContent();

  const {
    data: contents,
    error: contentsError,
    isError: isContentsError,
    refetch,
  } = useTypeContents(selectedType);
  const { data: me, error: meError, isError: isMeError } = useMe();

  useEffect(() => {
    if (isContentsError && contentsError) {
      const msg =
        (contentsError as any)?.response?.data?.error ||
        "Something went wrong while fetching contents.";
      alert(msg);
    }

    if (isMeError && meError) {
      const msg =
        (meError as any)?.response?.data?.error ||
        "Something went wrong while fetching user details.";
      alert(msg);
    }
  }, [isContentsError, contentsError, isMeError, meError]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ mode: "onTouched" });

  const onSubmit = (data: FormData) => {
    if (editContent) {
      updateContent(
        { ...data, contentId: editContent.contentId },
        {
          onSuccess: () => {
            alert("Content updated successfully!");
            reset();
            setEditContent(null);
            setIsOpen(false);
            refetch();
          },
          onError: (error: any) => {
            const errorMsg =
              error.response?.data?.error ||
              "Something went wrong while updating content.";
            alert(errorMsg);
          },
        }
      );
    } else {
      mutate(data, {
        onSuccess: () => {
          alert("Content created successfully!");
          reset();
          setIsOpen(false);
          refetch();
        },
        onError: (error: any) => {
          const errorMsg =
            error.response?.data?.error ||
            "Something went wrong. Please try again later.";
          alert(errorMsg);
        },
      });
    }
  };

  if (!localStorage.getItem("token")) {
    navigate("/login");
    return;
  }

  return (
    <div className="flex">
      <div>
        <Sidebar onSelectType={(type) => setSelectedType(type)} />
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-center w-full p-9">
          <span className="text-xs sm:text-2xl">
            <b>{me}</b>
          </span>
          <div className="flex gap-4 items-center text-xs sm:text-lg">
            <GenericButton onClick={() => setIsOpen(true)}>
              Add Content
            </GenericButton>
            <GenericButton
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/");
              }}
            >
              Logout
            </GenericButton>
          </div>
        </div>

        <div className="flex flex-1 flex-wrap p-9 gap-8">
          {Array.isArray(contents) && contents.length > 0 ? (
            contents.map((item: any) => (
              <CardComponent
                key={item._id}
                share={false}
                contentId={item._id}
                title={item.title}
                titleIcon={
                  item.type === "image" ? (
                    <ImageIcon />
                  ) : item.type === "video" ? (
                    <YoutubeIcon />
                  ) : item.type === "article" ? (
                    <ArticleIcon />
                  ) : item.type === "tweets" ? (
                    <XIcon />
                  ) : null
                }
                linkUrl={item.link}
                linkText={item.linkText}
                tags={item.tags}
                onEdit={(content) => {
                  setEditContent(content);
                  setIsOpen(true);
                  setValue("link", content.linkUrl);
                  setValue("linkText", content.linkText);
                  setValue("title", content.title);
                  setValue("tags", content.tags);
                  setValue("type", content.type || "image");
                }}
              />
            ))
          ) : (
            <p className="text-gray-500 text-sm">No content added yet.</p>
          )}
        </div>
      </div>

      <ContentModal
        title={editContent ? "Update Content Details" : "Enter Content Details"}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full"
        >
          <GenericInput
            name="link"
            type="url"
            label="Link"
            placeholder="Provide the Link..."
            register={register("link", {
              required: "Link is required and should be a valid url!",
              pattern: {
                value: /^(https?:\/\/)?([\w\d-]+\.){1,}[a-zA-Z]{2,}(\/.*)?$/,
                message: "Please enter a valid URL (e.g. https://example.com)",
              },
            })}
          />

          <GenericInput
            name="linkText"
            type="text"
            label="Link Text"
            placeholder="Provide the Link Text..."
            register={register("linkText", {
              required:
                "Link Text is required and can have max. 100 characters!",
              maxLength: {
                value: 100,
                message: "Max 100 characters allowed",
              },
            })}
          />

          <GenericInput
            name="title"
            type="text"
            label="Title"
            placeholder="Provide the Title..."
            register={register("title", {
              required: "Title is required and can have max. 20 characters!",
              maxLength: {
                value: 20,
                message: "Max 20 characters allowed",
              },
            })}
          />
          <GenericInput
            name="tags"
            type="text"
            label="Tags"
            placeholder="Comma separated tags"
            register={register("tags", {
              required:
                "Tags must be comma separated and individually can have maximum 20 characters!",
            })}
          />
          <div className="flex gap-2">
            <GenericButton onClick={() => setValue("type", "image")}>
              Image
            </GenericButton>
            <GenericButton onClick={() => setValue("type", "video")}>
              Video
            </GenericButton>
            <GenericButton onClick={() => setValue("type", "article")}>
              Article
            </GenericButton>
            <GenericButton onClick={() => setValue("type", "tweets")}>
              Tweet
            </GenericButton>
          </div>

          {Object.keys(errors).length > 0 && (
            <Alert>
              <ul className="list-disc list-inside space-y-1 text-red-500 text-sm">
                {errors.link && <li>{errors.link.message}</li>}
                {errors.linkText && <li>{errors.linkText.message}</li>}
                {errors.title && <li>{errors.title.message}</li>}
                {errors.tags && <li>{errors.tags.message}</li>}
              </ul>
            </Alert>
          )}

          <GenericButton type="submit" disabled={isPending || isUpdating}>
            {isPending || isUpdating
              ? editContent
                ? "Updating..."
                : "Submitting..."
              : editContent
              ? "Update"
              : "Submit"}
          </GenericButton>
        </form>
      </ContentModal>
    </div>
  );
}
