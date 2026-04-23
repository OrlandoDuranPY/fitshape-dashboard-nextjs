import {Button} from "@/components/ui/button";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {type LucideIcon} from "lucide-react";

// ──────────────── Props ────────────────
interface ButtonActionProps {
  tooltipText: string;
  icon: LucideIcon;
  onClick?: () => void;
}

export default function ButtonAction({
  tooltipText,
  icon: Icon,
  onClick,
}: ButtonActionProps) {
  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button className='size-8' onClick={onClick}>
            <Icon className='size-4' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </>
  );
}
