# RSC payloads from a previous deployment replayed from the browser cache

Minimal reproduction on `next@canary`: an ISR page's RSC payload is sent with
`Cache-Control: s-maxage=…, stale-while-revalidate=…`. A browser has no
`max-age` to go by, so the response is stale on arrival and the
`stale-while-revalidate` window (about a year here) lets the browser answer the
next fetch of the same URL from its HTTP cache. The `_rsc` cache-busting key
does not include the deployment id, and `Vary` does not name
`x-deployment-id`, so after a redeploy the client router of the new deployment
receives the previous deployment's payload.

## Run it

Needs one free port (3000) and Chrome.

```bash
npm install

# Terminal 1: deploy "build-a"
./scripts/deploy.sh build-a
```

1. Open `http://localhost:3000/` in Chrome with DevTools → Network open.
   Leave **Disable cache** unticked.
2. Click **Go to /other**. The page shows `RSC payload rendered by: build-a`.
3. Stop the server (Ctrl+C) and deploy the second build on the same port:

   ```bash
   ./scripts/deploy.sh build-b
   ```

4. Open a **new tab** at `http://localhost:3000/`. The page shows
   `Document HTML rendered by: build-b`.
5. Click **Go to /other** and look at the Network panel.

`scripts/deploy.sh` only runs `next build` and `next start` with
`DEPLOYMENT_ID` set, which `next.config.ts` passes to `deploymentId`.

## What happens

After step 5, in the build-b tab:

| Request | What the browser got |
| --- | --- |
| `GET /other?_rsc=…` (fetch) | Request header `x-deployment-id: build-b`. Response from the disk cache: `x-nextjs-deployment-id: build-a`, the `Date` of the build-a visit, `cache-control: s-maxage=3600, stale-while-revalidate=31532400`. Same `_rsc` value as under build-a. |
| `GET /_next/static/chunks/…js?dpl=build-a` | build-a's client chunks for `/other`, loaded into the build-b document. They come from the browser cache; the build-b server no longer has them. |
| `GET /other?_rsc=…` | The background revalidation, now answered by build-b. |
| `GET /other` (document) | The router then falls back to a full page load. |

So every client navigation to a URL the browser cached under an earlier
deployment loads that deployment's chunks into the current document and then
hard-reloads, for as long as the cached entry sits in the
`stale-while-revalidate` window.

## Expected

The browser never reuses an RSC payload from another deployment without asking
the server. Any of these would do it: the deployment id in the `_rsc` key,
`x-deployment-id` in `Vary`, or no `stale-while-revalidate` in the
`Cache-Control` a browser sees (as vercel/next.js#86554 did before its revert in
#88457).
