#!/bin/bash

# ============================================
# DEPLOYMENT QUICK START SCRIPT
# ============================================
# This script helps you prepare for deployment
# Run: bash deploy.sh

set -e  # Exit on error

echo "🚀 Dental Clinic System - Deployment Checker"
echo "============================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2"
    fi
}

# Check 1: Environment files
echo "Checking environment files..."
[ -f ".env.example" ] && check_status 0 ".env.example exists" || check_status 1 ".env.example missing"
[ -f "backend/.env.example" ] && check_status 0 "backend/.env.example exists" || check_status 1 "backend/.env.example missing"
echo ""

# Check 2: Packages installed
echo "Checking dependencies..."
[ -d "node_modules" ] && check_status 0 "Frontend dependencies installed" || echo -e "${YELLOW}!${NC} Run: npm install"
[ -d "backend/node_modules" ] && check_status 0 "Backend dependencies installed" || echo -e "${YELLOW}!${NC} Run: cd backend && npm install"
echo ""

# Check 3: Git repository
echo "Checking git setup..."
[ -d ".git" ] && check_status 0 "Git repository initialized" || echo -e "${YELLOW}!${NC} Run: git init && git remote add origin <URL>"
echo ""

# Check 4: Key files
echo "Checking production files..."
[ -f "DEPLOYMENT.md" ] && check_status 0 "DEPLOYMENT.md exists" || check_status 1 "DEPLOYMENT.md missing"
[ -f "LOGGING_GUIDE.md" ] && check_status 0 "LOGGING_GUIDE.md exists" || check_status 1 "LOGGING_GUIDE.md missing"
[ -f "FRONTEND_ERROR_HANDLING.md" ] && check_status 0 "FRONTEND_ERROR_HANDLING.md exists" || check_status 1 "FRONTEND_ERROR_HANDLING.md missing"
[ -f "src/components/ErrorBoundary.tsx" ] && check_status 0 "Error boundaries configured" || check_status 1 "Error boundaries missing"
[ -f "backend/utils/logger.js" ] && check_status 0 "Logging configured" || check_status 1 "Logging missing"
echo ""

# Check 5: Port configuration
echo "Checking configuration..."
grep -q "FRONTEND_URL" backend/.env.example && check_status 0 "CORS configured" || check_status 1 "CORS missing"
grep -q "HEALTHCHECK" backend/Dockerfile 2>/dev/null && check_status 0 "Health check in Dockerfile" || check_status 1 "Add health check to Dockerfile"
echo ""

# Production checklist
echo "Production Deployment Checklist:"
echo "================================"
echo ""
echo "Backend (.env on production server):"
echo "  [ ] MONGO_URI - MongoDB connection string"
echo "  [ ] JWT_SECRET - Generated using: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
echo "  [ ] FRONTEND_URL - Your frontend domain"
echo "  [ ] NODE_ENV=production"
echo "  [ ] SMTP credentials - For email reminders"
echo ""

echo "Frontend (.env.local on production server):"
echo "  [ ] NEXT_PUBLIC_API_URL - Your backend domain"
echo ""

echo "Production Services:"
echo "  [ ] MongoDB Atlas cluster created"
echo "  [ ] Backend deployed (Railway/Heroku/Docker)"
echo "  [ ] Frontend deployed (Vercel/Netlify)"
echo "  [ ] Custom domain purchased"
echo "  [ ] DNS records configured"
echo "  [ ] SSL certificate active"
echo ""

echo "Security:"
echo "  [ ] .env files NOT committed to Git"
echo "  [ ] JWT_SECRET is strong (>32 characters)"
echo "  [ ] HTTPS/SSL enabled"
echo "  [ ] CORS restricted to your domain"
echo "  [ ] Rate limiting enabled"
echo "  [ ] Error details hidden from users"
echo ""

echo "Monitoring:"
echo "  [ ] Health check endpoint working"
echo "  [ ] Error tracking configured (Sentry)"
echo "  [ ] Logs viewable in dashboard"
echo "  [ ] Uptime monitoring enabled"
echo ""

echo "Ready to deploy? Follow these steps:"
echo "  1. Choose deployment platform (Railway/Vercel recommended)"
echo "  2. Create .env files with production values"
echo "  3. Push to GitHub: git push origin main"
echo "  4. Auto-deployment starts"
echo "  5. Verify: curl https://api.yourdomain.com/health"
echo ""
echo "See DEPLOYMENT.md for detailed instructions."
