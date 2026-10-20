export const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="alert alert-danger mb-0" role="alert">
      <div className="d-flex justify-content-between align-items-center gap-2">
        <div>{message || "Произошла ошибка"}</div>
        {onRetry && (
          <button
            type="button"
            className="btn btn-sm btn-outline-danger mt-2"
            onClick={onRetry}
          >
            Повторить
          </button>
        )}
      </div>
    </div>
  );
};
