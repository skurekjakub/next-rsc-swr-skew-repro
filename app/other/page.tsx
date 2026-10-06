import Link from "next/link";

import { BuildReport } from "./build-report";

// Any ISR page: Next serves it with `s-maxage=3600, stale-while-revalidate=…`.
export const revalidate = 3600;

export default function Other() {
  return (
    <main>
      <h1>Other</h1>
      <p>
        RSC payload rendered by: <b>{process.env.BUILD_LABEL}</b>
      </p>
      <BuildReport />
      <Link href="/" prefetch={false}>
        Back home
      </Link>
    </main>
  );
}
