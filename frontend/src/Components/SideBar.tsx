import { useState, useEffect } from "react";
import { SidebarItem } from "./SidebarItem";
import ArticleIcon from "../Icons/articleIcon";
import ImageIcon from "../Icons/ImageIcon";
import YoutubeIcon from "../Icons/YoutubeIcon";
import XIcon from "../Icons/XIcon";
import BrainIcon from "../Icons/BrainIcon";
import { LeftArrow } from "../Icons/leftArrow";
import type { SidebarItemData } from "./SidebarItem";

interface SidebarProps {
  onSelectType: (type?: string) => void;
}

export function Sidebar({ onSelectType }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  const SidebarItems: SidebarItemData[] = [
    {
      icon: <ArticleIcon />,
      text: "Articles",
      onClick: () => onSelectType("article"),
    },
    {
      icon: <ImageIcon />,
      text: "Images",
      onClick: () => onSelectType("image"),
    },
    {
      icon: <YoutubeIcon />,
      text: "Video",
      onClick: () => onSelectType("video"),
    },
    { icon: <XIcon />, text: "Tweets", onClick: () => onSelectType("tweets") },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <div
        className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        <div
          onClick={() => {
            onSelectType(undefined);
          }}
          className="flex items-center justify-between p-8"
        >
          {isOpen && <BrainIcon />}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-900"
            aria-label="Toggle sidebar"
          >
            {isOpen ? <LeftArrow /> : "☰"}
          </button>
        </div>

        <div>
          <nav className="p-5 space-y-2">
            {SidebarItems.map((item, index) => (
              <div key={index} title={!isOpen ? item.text : ""}>
                <SidebarItem
                  icon={item.icon}
                  text={item.text}
                  onClick={item.onClick}
                  isOpen={isOpen}
                />
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
