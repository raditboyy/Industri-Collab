"use client";

import { motion } from "framer-motion";

export default function Template({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ 
        borderRadius: "24px", 
        overflow: "hidden",     
        minHeight: "100vh",
        display: "flex",        // Tambahin ini biar konten di dalemnya tetep rapi
        flexDirection: "column"
      }}
    >
      {children}
    </motion.div>
  );
}