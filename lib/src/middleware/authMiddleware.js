export function apiKeyMiddleware(req, res, next) {
    const apiKey = req.headers["x-api-key"];
    if (!apiKey || apiKey !== "HARSH123") {
        return res
            .status(401)
            .json({ error: "Unauthorized: Invalid or missing API key" });
    }
    return next();
}
//# sourceMappingURL=authMiddleware.js.map