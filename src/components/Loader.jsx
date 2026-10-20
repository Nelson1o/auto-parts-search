export const Loader = ({ text }) => {
  return (
    <div className="d-flex align-items-center gap-2 text-muted py-4">
      <div
        className="spinner-border spinner-border-sm"
        role="status"
        aria-hidden="true"
      />
      <span>{text}</span>
    </div>
  );
};
