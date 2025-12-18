import React from "react";
import Image from "next/image";

interface Card {
  image?: string; // (use path to /public or extern URL)
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode; // ex. Edit-button or Save/Cancel
}

export const Card: React.FC<Card> = ({ image, title, description, children, actions }) => {
  return (
    <div className="rounded-md border border-transparent shadow-sm p-4 hover:border-[#5A9690]">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {image && (
            <Image
              src={image}
              alt=""
              width={24}
              height={24}
              className="shrink-0"
            />
          )}
          <div>
            <h2 className="text-lg font-semibold ">{title}</h2>
            {description && (
              <p className="text-sm ">{description}</p>
            )}
          </div>
        </div>
        {actions && <div>{actions}</div>}
      </div>

      {/* Content */}
      <div className="mt-2">{children}</div>
    </div>
  );
};

