# ============ DEVELOPMENT STAGE ============
# Use a Debian-based node image (non-Alpine). Alpine uses musl and can
# cause native optional dependency resolution problems with some packages
# (like Rollup). Using the standard Debian-based image avoids the
# '@rollup/rollup-*-musl' missing module errors.
FROM node:20-bullseye-slim AS development

# Set working directory
WORKDIR /app

# Copy only package files first (better layer caching)
COPY package.json package-lock.json* ./

# Install dependencies. Use `npm ci` when a lockfile exists for reproducible
# installs; otherwise fall back to `npm install` so builds don't fail when a
# lockfile is missing.
RUN sh -lc 'if [ -f package-lock.json ]; then npm ci --include=dev; else npm install --include=dev; fi'

# Copy the rest of the source code
COPY . .

# Expose Vite default port
EXPOSE 5173

# Start Vite dev server with host binding (accessible from outside the container)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
