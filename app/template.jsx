export default function Template({ children }) {
  return (
    <div
      style={{
        borderRadius: "24px",
        overflow: "hidden",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        opacity: 1,
      }}
    >
      {children}
    </div>
  );
}