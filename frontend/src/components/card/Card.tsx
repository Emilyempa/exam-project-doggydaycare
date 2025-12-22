import React from "react";
import { LucideIcon } from "lucide-react";

interface Card {
  id?: string;
  icon?: LucideIcon,
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode; // ex. Edit-button or Save/Cancel
  className?: string;
}

export const Card: React.FC<Card> = ({
                                       id,
                                       icon: Icon,
                                       title,
                                       description,
                                       children,
                                       actions,
                                       className
}) => {
  return (
    <article id={id} className={`card ${className ?? ""}`}>
      {/* Icon */}
      {Icon && (
        <div className="flex justify-center mb-4">
          <Icon
            className="w-12 h-12"
            style={{color: '#5A9690'}}
            aria-hidden="true"
            focusable="false"
          />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-center">{title}</h2>
          {description && (
            <p className="text-sm text-center">{description}</p>
          )}
        </div>
        {actions && <div aria-label="card actions">{actions}</div>}
      </div>

      {/* Content */}
      <div className="mt-2">{children}</div>
    </article>
  );
};
