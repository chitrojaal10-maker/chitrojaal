const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

const FALLBACK_THUMBNAIL_URL = "/why_us.jpg";

const metaPatterns = [
  /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["'][^>]*>/i,
  /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["'][^>]*>/i,
  /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["'][^>]*>/i,
  /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["'][^>]*>/i,
];

function decodeHtmlEntities(value: string) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
}

function resolveFacebookTargetUrl(sourceUrl: string) {
  const parsedUrl = new URL(sourceUrl);

  if (
    parsedUrl.hostname === "www.facebook.com" ||
    parsedUrl.hostname === "facebook.com"
  ) {
    const embeddedHref = parsedUrl.searchParams.get("href");
    if (embeddedHref) {
      return decodeURIComponent(embeddedHref);
    }
  }

  return sourceUrl;
}

function extractPreviewImageUrl(html: string, baseUrl: string) {
  for (const pattern of metaPatterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return new URL(decodeHtmlEntities(match[1]), baseUrl).toString();
    }
  }

  return null;
}

async function fetchImageResponse(imageUrl: string) {
  const response = await fetch(imageUrl, {
    headers: {
      "user-agent": USER_AGENT,
      accept: "image/*,*/*;q=0.8",
    },
  });

  if (!response.ok || !response.body) {
    return null;
  }

  return response;
}

async function fetchFallbackImage(request: Request) {
  return fetch(new URL(FALLBACK_THUMBNAIL_URL, request.url));
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const sourceUrl = requestUrl.searchParams.get("url");

  if (!sourceUrl) {
    return fetchFallbackImage(request);
  }

  let targetUrl: string;

  try {
    targetUrl = resolveFacebookTargetUrl(decodeURIComponent(sourceUrl));
  } catch {
    return fetchFallbackImage(request);
  }

  try {
    const pageResponse = await fetch(targetUrl, {
      headers: {
        "user-agent": USER_AGENT,
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!pageResponse.ok) {
      return fetchFallbackImage(request);
    }

    const html = await pageResponse.text();
    const previewImageUrl = extractPreviewImageUrl(html, targetUrl);

    if (!previewImageUrl) {
      return fetchFallbackImage(request);
    }

    const imageResponse = await fetchImageResponse(previewImageUrl);

    if (!imageResponse) {
      return fetchFallbackImage(request);
    }

    return new Response(imageResponse.body, {
      headers: {
        "content-type":
          imageResponse.headers.get("content-type") ?? "image/jpeg",
        "cache-control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return fetchFallbackImage(request);
  }
}
