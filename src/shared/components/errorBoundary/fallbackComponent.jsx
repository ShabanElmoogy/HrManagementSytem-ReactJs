/* eslint-disable react/prop-types */

export function FallbackComponent({ error, resetErrorBoundary }) {
  return (
    <div role="alert" className="p-4 border border-red-500 text-red-500">
      <p>⚠️ Something went wrong:</p>
      <pre>{error.message}</pre>
      <button
        onClick={resetErrorBoundary}
        className="bg-red-500 text-white p-2 mt-2"
      >
        Try Again
      </button>
    </div>
  );
}
