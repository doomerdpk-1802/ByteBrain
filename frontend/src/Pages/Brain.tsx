import { useBrainHash } from "../hooks/useBrainHash";
import { ExternalLink } from "lucide-react";
import ImageIcon from "../Icons/ImageIcon";
import XIcon from "../Icons/XIcon";
import YoutubeIcon from "../Icons/YoutubeIcon";
import ArticleIcon from "../Icons/articleIcon";
import ErrorBrain from "./ErrorBrain";

export default function SharedBrain() {
  const { data, isLoading, error } = useBrainHash();

  if (isLoading)
    return (
      <div className="h-screen flex justify-center items-center text-3xl text-center text-gray-500">
        Loading...
      </div>
    );
  if (error || !data?.contentId) {
    return <ErrorBrain />;
  }

  const item = data.contentId;
  const titleIcon =
    item.type === "image" ? (
      <ImageIcon />
    ) : item.type === "video" ? (
      <YoutubeIcon />
    ) : item.type === "article" ? (
      <ArticleIcon />
    ) : item.type === "tweets" ? (
      <XIcon />
    ) : null;

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-shadow flex flex-col gap-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4 justify-center">
          <div className="text-blue-600">{titleIcon}</div>
          <h3 className="text-gray-900 text-lg font-semibold">{item.title}</h3>
        </div>

        <div className="mb-4 flex justify-center">
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:underline"
          >
            {item.linkText}
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
