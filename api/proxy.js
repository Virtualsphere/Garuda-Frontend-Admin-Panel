// api/proxy.js
export default async function handler(req, res) {
  try {
    // Determine backend base URL
    const BACKEND_API = "http://72.61.169.226:5000" || "http://localhost:5000";

    // Remove /api or /auth prefix from request URL
    const path = req.url.replace(/^\/(api|auth)/, "");

    // Full backend URL
    const backendUrl = `${BACKEND_API}${req.url.startsWith("/auth") ? "/auth" + path : "/api" + path}`;

    // Prepare fetch options
    const options = {
      method: req.method,
      headers: {
        ...req.headers,
        host: "" // remove host header for backend compatibility
      },
    };

    // Only send body for non-GET/HEAD requests
    if (req.method !== "GET" && req.method !== "HEAD") {
      options.body = JSON.stringify(req.body);
    }

    // Call backend
    const response = await fetch(backendUrl, options);

    // Get content type
    const contentType = response.headers.get("content-type");

    // Return JSON response
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      res.status(response.status).json(data);
    } else {
      // Return files (PDF, text, etc.)
      const contentDisposition = response.headers.get("content-disposition") || "inline; filename=file.pdf";
      res.setHeader("Content-Type", contentType || "application/octet-stream");
      res.setHeader("Content-Disposition", contentDisposition);

      const buffer = await response.arrayBuffer();
      res.status(response.status).send(Buffer.from(buffer));
    }
  } catch (error) {
    console.error("Proxy Error:", error);
    res.status(500).json({ error: "Proxy Server Error", details: error.message });
  }
}
