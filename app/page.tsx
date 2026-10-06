import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <p>
        Document HTML rendered by: <b>{process.env.BUILD_LABEL}</b>
      </p>
      {/* No prefetch, so the click is the only request for /other's payload. */}
      <Link href="/other" prefetch={false}>
        Go to /other (client-side navigation)
      </Link>
    </main>
  );
}
