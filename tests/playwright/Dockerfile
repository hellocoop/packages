# Playwright Dockerfile
FROM mcr.microsoft.com/playwright:v1.46.0-jammy
WORKDIR /playwright
RUN npm init -y \
    && npm install playwright \
    && npm install @playwright/test
# comment out the following line when doing test development
COPY ./ ./
