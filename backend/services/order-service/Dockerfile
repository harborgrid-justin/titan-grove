FROM rust:1.75 AS builder

WORKDIR /app

# Copy dependency files
COPY Cargo.toml Cargo.lock ./

# Create a dummy source file to cache dependencies
RUN mkdir src && echo "fn main() {}" > src/main.rs

# Build dependencies
RUN cargo build --release

# Remove dummy source
RUN rm -rf src/

# Copy real source code
COPY src ./src

# Build the application
RUN touch src/main.rs && cargo build --release

FROM debian:bookworm-slim AS runner

# Install runtime dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ca-certificates \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Create a non-root user
RUN useradd --uid 1001 --system --create-home rustuser

# Copy built application
COPY --from=builder /app/target/release/order-service /usr/local/bin/order-service

# Change ownership
RUN chown rustuser:rustuser /usr/local/bin/order-service
USER rustuser

EXPOSE 3002

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3002/health || exit 1

CMD ["order-service"]