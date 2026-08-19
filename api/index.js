import server from "../dist/server/server.js";

function getRequestPath(req) {
  const headerPath = req.headers["x-forwarded-uri"] || req.headers["x-matched-path"];
  let path = typeof headerPath === "string" && headerPath && headerPath !== "/api" ? headerPath : req.url;

  if (!path) return "/";

  if (path === "/api" || path.startsWith("/api/")) {
    path = path.replace(/^\/api/, "") || "/";
  } else if (path.startsWith("/api?")) {
    path = path.replace(/^\/api\?/, "/?");
  }

  return path;
}

export default async function handler(req, res) {
  try {
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost";
    const requestPath = getRequestPath(req);
    const fullUrl = `${protocol}://${host}${requestPath}`;

    let body = undefined;
    if (req.method !== "GET" && req.method !== "HEAD") {
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      body = Buffer.concat(chunks);
    }

    const webRequest = new Request(fullUrl, {
      method: req.method,
      headers: req.headers,
      body,
    });

    const webResponse = await server.fetch(webRequest, process.env, {});

    res.statusCode = webResponse.status;
    webResponse.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    const arrayBuffer = await webResponse.arrayBuffer();
    res.end(Buffer.from(arrayBuffer));
  } catch (error) {
    console.error("[Vercel Handler Error]:", error);
    res.statusCode = 500;
    res.setHeader("content-type", "text/html; charset=utf-8");
    res.end("<h1>500 Internal Server Error</h1>");
  }
}

