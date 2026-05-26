// api/proxy.js

export const config = {
  api: {
    bodyParser: false, // IMPORTANT: prevents Next.js from consuming multipart streams
  },
};

export default async function handler(req, res) {
  try {
    // Backend URL
    const BACKEND_API =
      "http://72.61.169.226:5000" || "http://localhost:5000";

    // Remove /api or /auth from incoming path
    const path = req.url.replace(/^\/(api|auth)/, "");

    // Build backend URL
    const backendUrl = `${BACKEND_API}${
      req.url.startsWith("/auth")
        ? "/auth" + path
        : "/api" + path
    }`;

    // Clone headers
    const headers = { ...req.headers };

    // Remove problematic headers
    delete headers.host;
    delete headers.connection;
    delete headers["content-length"];

    // Prepare fetch options
    const options = {
      method: req.method,
      headers,

      // Pass raw request stream directly
      body:
        req.method !== "GET" &&
        req.method !== "HEAD"
          ? req
          : undefined,

      duplex: "half",
    };

    // Forward request to backend
    const response = await fetch(backendUrl, options);

    // Forward status
    res.status(response.status);

    // Forward headers
    response.headers.forEach((value, key) => {
      // Skip problematic headers
      if (
        key.toLowerCase() !== "content-encoding" &&
        key.toLowerCase() !== "transfer-encoding"
      ) {
        res.setHeader(key, value);
      }
    });

    // Stream response back
    const buffer = Buffer.from(
      await response.arrayBuffer()
    );

    res.send(buffer);

  } catch (error) {
    console.error("Proxy Error:", error);

    res.status(500).json({
      success: false,
      error: "Proxy Server Error",
      details: error.message,
    });
  }
}