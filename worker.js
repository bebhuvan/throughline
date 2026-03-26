const SECURITY_HEADERS = {
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: https:; connect-src 'self' https://*.stadiamaps.com https://tiles.stadiamaps.com",
};

const FONT_PRELOADS = [
  '</fonts/SourceSerif4-VariableFont.woff2>; rel=preload; as=font; type=font/woff2; crossorigin',
  '</fonts/Fraunces-Variable.ttf>; rel=preload; as=font; type=font/ttf; crossorigin',
  '</fonts/Inter-VariableFont.woff2>; rel=preload; as=font; type=font/woff2; crossorigin',
].join(', ');

function getCacheControl(pathname) {
  if (pathname.startsWith('/_astro/') || pathname.startsWith('/fonts/')) {
    return 'public, max-age=31536000, immutable';
  }
  if (pathname.startsWith('/images/')) {
    return 'public, max-age=86400';
  }
  if (pathname === '/feed.xml') {
    return 'public, max-age=3600, must-revalidate';
  }
  if (pathname === '/about' || pathname === '/about/') {
    return 'public, max-age=86400, must-revalidate';
  }
  // HTML pages
  return 'public, max-age=3600, must-revalidate';
}

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const url = new URL(request.url);
    const pathname = url.pathname;

    const headers = new Headers(response.headers);

    // Security headers on all responses
    for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
      headers.set(key, value);
    }

    // Cache control
    headers.set('Cache-Control', getCacheControl(pathname));

    // Early Hints: font preloads on HTML pages
    const ct = headers.get('content-type') || '';
    if (ct.includes('text/html')) {
      headers.set('Link', FONT_PRELOADS);
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
