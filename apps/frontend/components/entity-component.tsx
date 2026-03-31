import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

type EntityHeaderProps = {
  title: string;
  description?: string;

  OnNewButtonLabel: string;
  disabled?: boolean;
  isCreating?: boolean;
} & (
  | { onNew: () => void; OnNewButtonHref?: never }
  | { onNew?: never; OnNewButtonHref: string }
  | { onNew?: never; OnNewButtonHref?: never }
);

type EntityContainerProps = {
  children: React.ReactNode;
  header?: React.ReactNode;
  search?: React.ReactNode;
  pagination?: React.ReactNode;
};

export const EntityHeader = ({
  title,
  description,
  onNew,
  OnNewButtonHref,
  OnNewButtonLabel,
  disabled,
  isCreating,
}: EntityHeaderProps) => {
  return (
    <div className="flex flex-row items-center justify-between gap-x-4">
      <div className="flex flex-col">
        <h1 className="text-lg md:text-xl font-semibold">{title}</h1>
        {description && (
          <p className="text-xs md:text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {onNew && !OnNewButtonHref && (
        <Button disabled={isCreating || disabled} size="sm" onClick={onNew}>
          <PlusIcon className="size-4" />
          {OnNewButtonLabel}
        </Button>
      )}
      {OnNewButtonHref && !onNew && (
        <Button asChild>
          <Link href={OnNewButtonHref} prefetch>
            <PlusIcon className="size-4" />
            {OnNewButtonLabel}
          </Link>
        </Button>
      )}
    </div>
  );
};

export const EntityContainer = ({
  header,
  search,
  pagination,
  children,
}: EntityContainerProps) => {
  return (
    <div className="p-4 md:px-10 md:py-6">
      <div className="mx-auto max-w-screen-xl w-full flex flex-col gap-y-8 h-full">
        {header}
        <div className="flex flex-col gap-y-4 h-full">
          {search}
          {children}
        </div>
        {pagination}
      </div>
    </div>
  );
};
