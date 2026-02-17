"use client";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div style={{ padding: 16 }}>
      <p>Something went wrong: {error.message}</p>

      <button type="button" onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
