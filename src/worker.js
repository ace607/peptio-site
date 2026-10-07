// Serves the static site from ./public, sends http and www.getpeptio.com to https://getpeptio.com.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.protocol === 'http:' || url.hostname === 'www.getpeptio.com') {
      url.protocol = 'https:';
      url.hostname = 'getpeptio.com';
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};
