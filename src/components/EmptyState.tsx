import React from "react";
import Button from "./Button";
import { HotelIcon, SearchIcon } from "./Icons";

interface EmptyStateProps {
  icon?: React.ReactNode | string;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

const iconMap: { [key: string]: React.ComponentType<any> } = {
  hotel: HotelIcon,
  search: SearchIcon,
};

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  let iconElement: React.ReactNode = null;

  if (typeof icon === "string" && iconMap[icon]) {
    const IconComponent = iconMap[icon];
    iconElement = <IconComponent size={48} color="var(--color-ocean-700)" />;
  } else {
    iconElement = icon;
  }

  return (
    <div
      className={`
        flex flex-col items-center justify-center
        py-12 px-4 text-center
        ${className}
      `}
    >
      {iconElement && (
        <div className="mb-4 flex justify-center">
          {typeof iconElement === "string" ? (
            <div className="text-5xl">{iconElement}</div>
          ) : (
            iconElement
          )}
        </div>
      )}
      <h3
        className="text-xl font-bold mb-2"
        style={{ color: "var(--color-ink)" }}
      >
        {title}
      </h3>
      <p
        className="text-sm max-w-sm mb-6"
        style={{ color: "var(--color-muted)" }}
      >
        {description}
      </p>
      {action && (
        action.href ? (
          <a href={action.href}>
            <Button size="md">{action.label}</Button>
          </a>
        ) : (
          <Button onClick={action.onClick} size="md">
            {action.label}
          </Button>
        )
      )}
    </div>
  );
}
