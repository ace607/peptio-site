// Serves the static site from ./public, sends http and www.getpeptio.com to https://getpeptio.com.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const local = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    if ((url.protocol === 'http:' && !local) || url.hostname === 'www.getpeptio.com') {
      url.protocol = 'https:';
      url.hostname = 'getpeptio.com';
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};
