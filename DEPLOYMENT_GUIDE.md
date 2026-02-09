# Deployment Guide

## 📦 Preparing for Production

This guide explains how to deploy the E-Commerce application to production servers.

---

## 🔒 Security Checklist

Before deploying, ensure:

- [ ] Change `JWT_SECRET` to a strong, random value
- [ ] Set `NODE_ENV=production` in backend .env
- [ ] Use HTTPS/SSL certificate (required for tokens in production)
- [ ] Update MongoDB connection string to production database
- [ ] Update frontend API URL to production backend
- [ ] Remove `.env` file from git (use `.env.example` instead)
- [ ] Set strong database passwords
- [ ] Enable MongoDB authentication
- [ ] Configure firewall rules
- [ ] Enable CORS for your production domain only

---

## Backend Deployment

### Option 1: Deploy to Heroku

#### 1. Install Heroku CLI
```bash
# Windows
choco install heroku-cli

# macOS
brew install heroku
```

#### 2. Login to Heroku
```bash
heroku login
```

#### 3. Create Heroku App
```bash
cd backend
heroku create your-app-name
```

#### 4. Set Environment Variables
```bash
heroku config:set MONGO_URI="your_mongodb_url"
heroku config:set JWT_SECRET="your_strong_secret"
heroku config:set NODE_ENV="production"
```

#### 5. Add Procfile
Create `backend/Procfile`:
```
web: node server.js
```

#### 6. Deploy
```bash
git push heroku main
```

#### 7. View Logs
```bash
heroku logs --tail
```

### Option 2: Deploy to AWS EC2

#### 1. Launch EC2 Instance
- Choose Ubuntu 22.04 LTS AMI
- Configure security group for ports 22, 80, 5000
- Create key pair for SSH access

#### 2. Connect via SSH
```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

#### 3. Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 4. Install MongoDB (or use MongoDB Atlas)
```bash
# Skip if using MongoDB Atlas cloud
```

#### 5. Clone Repository
```bash
git clone your-repo-url
cd your-repo/backend
npm install
```

#### 6. Create .env
```bash
nano .env
# Add your production values
```

#### 7. Install PM2
```bash
npm install -g pm2
pm2 start server.js --name "ecommerce-api"
pm2 startup
pm2 save
```

#### 8. Setup Nginx Reverse Proxy
```bash
sudo apt-get install nginx
sudo nano /etc/nginx/sites-available/default
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Restart Nginx:
```bash
sudo systemctl restart nginx
```

#### 9. Setup SSL with Let's Encrypt
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Option 3: Deploy to DigitalOcean

#### 1. Create Droplet
- Choose Node.js pre-configured droplet
- Select Ubuntu 22.04

#### 2. SSH into Droplet
```bash
ssh root@your-droplet-ip
```

#### 3. Clone and Setup
```bash
git clone your-repo-url
cd your-repo/backend
npm install
```

#### 4. Create .env and configure

#### 5. Use PM2 for process management
```bash
npm install -g pm2
pm2 start server.js
pm2 startup
pm2 save
```

#### 6. Setup with App Platform
- Use DigitalOcean App Platform for easier management
- Connect GitHub repo
- Auto-deploy on push
- Managed SSL certificates

---

## Frontend Deployment

### Option 1: Deploy to Vercel

#### 1. Install Vercel CLI
```bash
npm i -g vercel
```

#### 2. Login
```bash
vercel login
```

#### 3. Deploy
```bash
cd frontend
vercel
```

#### 4. Configure Environment
In Vercel dashboard:
- Set `VITE_API_URL` to your backend production URL

Update `vite.config.js`:
```javascript
export default {
  define: {
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://localhost:5000/api')
  }
}
```

### Option 2: Deploy to Netlify

#### 1. Build Frontend
```bash
cd frontend
npm run build
```

#### 2. Deploy via Netlify CLI
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

#### 3. Or Connect GitHub
- Push to GitHub
- Connect repo in Netlify dashboard
- Set build command: `npm run build`
- Set publish directory: `dist`

#### 4. Set Environment Variables
In Netlify UI:
- Settings → Build & Deploy → Environment
- Add `VITE_API_URL` with your backend URL

### Option 3: Deploy to AWS S3 + CloudFront

#### 1. Build
```bash
cd frontend
npm run build
```

#### 2. Create S3 Bucket
```bash
aws s3 mb s3://your-bucket-name
```

#### 3. Upload Build Files
```bash
aws s3 sync dist/ s3://your-bucket-name --delete
```

#### 4. Create CloudFront Distribution
- Point to S3 bucket
- Enable SSL certificate
- Set root object to index.html

#### 5. Configure CORS
In S3 bucket CORS policy:
```json
[
  {
    "AllowedOrigins": ["https://your-domain.com"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"]
  }
]
```

---

## Environment Variables for Production

### Backend .env (Production)
```env
# Database
MONGO_URI=mongodb+srv://username:password@production-cluster.mongodb.net/ecommerce_prod

# Server
PORT=5000
NODE_ENV=production

# JWT
JWT_SECRET=your-super-secret-key-min-32-characters-long

# Frontend URL
CLIENT_URL=https://your-frontend-domain.com
```

### Frontend Environment (via deployment platform)
```
VITE_API_URL=https://your-backend-domain.com/api
```

---

## Database Backups

### MongoDB Atlas (Cloud)
- Automatic backups included
- Manual backup in settings
- Point-in-time recovery available

### Local MongoDB
```bash
# Backup
mongodump --uri "mongodb://localhost:27017/ecommerce" --out /backup/location

# Restore
mongorestore --uri "mongodb://localhost:27017/ecommerce" /backup/location
```

---

## Monitoring & Logging

### Backend Monitoring

**PM2 Plus (for EC2/DigitalOcean)**
```bash
pm2 plus
```

**CloudWatch (for AWS)**
```bash
# Already integrated with AWS deployment
```

### Application Logging
Update `server.js` to log to file:
```javascript
const fs = require('fs');
const logStream = fs.createWriteStream('app.log', { flags: 'a' });

// Log errors to file
process.on('uncaughtException', (err) => {
  logStream.write(`${new Date().toISOString()} - ${err.message}\n`);
  console.error(err);
});
```

### Frontend Error Tracking
Add Sentry for frontend errors:
```bash
npm install @sentry/react
```

Configure in `main.jsx`:
```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
});
```

---

## Performance Optimization

### Backend
1. **Database Indexes**: Already configured in models
2. **Compression**: Add middleware
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```
3. **Rate Limiting**: Prevent abuse
   ```javascript
   const rateLimit = require('express-rate-limit');
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 100
   });
   app.use('/api/', limiter);
   ```

### Frontend
1. **Code Splitting**: Done by Vite automatically
2. **Image Optimization**: Use proper formats
3. **Caching**: Configure in deployment platform
4. **CDN**: Use CloudFront/Cloudflare

---

## SSL/TLS Certificates

### Let's Encrypt (Free)
```bash
sudo certbot certonly --standalone -d your-domain.com
```

### AWS Certificate Manager
- Free certificates for AWS services
- Auto-renewal

### Cloudflare
- Free SSL/TLS for all plans
- Automatic renewal

---

## Post-Deployment Checklist

- [ ] Backend running and accessible
- [ ] Frontend can connect to backend API
- [ ] Login/logout working
- [ ] Cart functionality working
- [ ] Orders can be placed
- [ ] Single-device login enforced
- [ ] SSL/HTTPS working
- [ ] Database backups configured
- [ ] Logging enabled
- [ ] Monitoring setup
- [ ] Error tracking setup
- [ ] Performance acceptable
- [ ] All 404 errors handled
- [ ] Graceful error messages

---

## Scaling Considerations

### Database
- Use MongoDB Atlas for auto-scaling
- Configure sharding for large datasets
- Monitor connection pools

### Backend
- Use load balancing (AWS ALB, Nginx)
- Deploy multiple instances
- Use Redis for caching
- Implement queue system for heavy tasks

### Frontend
- Use CDN for static files
- Enable caching headers
- Minimize bundle size

---

## Cost Estimation

| Service | Free Tier | Typical Monthly |
|---------|-----------|-----------------|
| MongoDB Atlas | 512MB | $57-$200 |
| Heroku | Ended | $7-$50 |
| Vercel | 100GB bandwidth | Free-$20 |
| AWS EC2 | 12 months free | $10-$30 |
| DigitalOcean | - | $5-$40 |

---

## Troubleshooting Deployment

### Backend won't start
```bash
# Check logs
heroku logs --tail
pm2 logs

# Verify environment variables
heroku config
pm2 env
```

### Frontend can't reach backend
- Check CORS origin in backend
- Verify API URL in frontend
- Check network tab in browser DevTools
- Ensure backend is publicly accessible

### SSL/Certificate errors
- Run `certbot renew` to update
- Check certificate expiration
- Verify domain DNS records

### Database connection timeout
- Check MongoDB connection string
- Verify IP whitelist in MongoDB Atlas
- Check network connectivity
- Monitor connection pool

---

## Rollback Procedure

### Heroku
```bash
heroku rollback
```

### DigitalOcean App Platform
- Click previous deployment in dashboard
- Click "Revert to this deployment"

### Manual (Git)
```bash
git revert <commit-hash>
git push production main
```

---

## Support & Maintenance

1. **Regular Updates**: Update dependencies monthly
2. **Security Patches**: Apply as soon as available
3. **Performance Monitoring**: Check monthly metrics
4. **Database Maintenance**: Optimize indexes, clean old data
5. **Log Rotation**: Manage disk space on servers

---

Happy deployment! 🚀
