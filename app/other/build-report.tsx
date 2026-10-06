"use client";

// A client component, so /other's payload references a chunk of its own
// build (`/_next/static/chunks/…js?dpl=<deployment id>`).
export function BuildReport() {
  return (
    <p>
      Client component built by: <b>{process.env.BUILD_LABEL}</b>
    </p>
  );
}
