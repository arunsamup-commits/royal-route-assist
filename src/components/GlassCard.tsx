import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  hover?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ hover = false, children, className, ...props }: GlassCardProps) {
  return (
    <motion.div
      className={cn(hover ? "glass-card-hover" : "glass-card", "p-5", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
