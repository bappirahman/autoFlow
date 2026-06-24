#!/bin/bash
set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log()  { echo -e "${GREEN}[✓]${NC} $1"; }
info() { echo -e "${BLUE}[→]${NC} $1"; }

APP_DIR="/var/www/autoFlow"
API_ENV="$APP_DIR/apps/api/.env"

info "Pulling latest code..."
cd $APP_DIR
git pull origin main

info "Installing dependencies..."
pnpm install --frozen-lockfile

info "Building shared library..."
pnpm build:packages

info "Building API..."
export SENTRY_AUTH_TOKEN=$(grep '^SENTRY_AUTH_TOKEN=' $API_ENV | cut -d '=' -f2 | tr -d '"')
pnpm --filter ./apps/api run build

info "Building frontend..."
pnpm --filter ./apps/frontend run build

info "Running database migrations..."
pnpm --filter ./apps/api run db:migrate

info "Reloading services..."
pm2 reload /var/www/ecosystem.config.js --update-env

log "Deploy complete!"
pm2 status