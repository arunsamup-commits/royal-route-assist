import { motion } from "framer-motion";

export function MeshBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <motion.div
        className="mesh-orb h-[500px] w-[500px] bg-royal/20"
        style={{ top: "-10%", left: "-10%" }}
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="mesh-orb h-[400px] w-[400px] bg-purple-glow/15"
        style={{ top: "30%", right: "-15%" }}
        animate={{ x: [0, -25, 0], y: [0, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="mesh-orb h-[350px] w-[350px] bg-royal-light/10"
        style={{ bottom: "0%", left: "20%" }}
        animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
