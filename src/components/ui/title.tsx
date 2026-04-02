import {cn} from "@/lib/utils";

const levelStyles = {
  1: "text-3xl font-black",
  2: "text-2xl font-extrabold",
  3: "text-xl font-bold",
  4: "text-lg font-semibold",
  5: "text-base font-medium",
} as const;

interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level: 1 | 2 | 3 | 4 | 5;
  title: string;
}

export default function Title({
  level = 1,
  className,
  title,
  ...props
}: TitleProps) {
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5";
  return (
    <Tag
      className={cn(
        "font-heading text-foreground",
        levelStyles[level],
        className,
      )}
      {...props}
    >
      {title}
    </Tag>
  );
}
