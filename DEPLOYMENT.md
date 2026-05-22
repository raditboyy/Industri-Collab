# Deployment Guide (Cetaklagi)

This guide documents the exact steps used to run and host the project on a new VPS.
All secrets are left blank on purpose. Fill them on the target VPS when needed.
Notes about ports are included because each NAT/VPS can expose different ports.

## 0) Requirements

- Ubuntu/Debian Linux VPS
- Public domain: cetaklagi.id (DNS hosted at Cloudflare)
- Node.js 20+ (this server uses Node 24)
- Git, curl, and systemd
- Cloudflare Tunnel (cloudflared)
- Open inbound port: 443 on the public domain via Cloudflare
- Local app port: choose one per VPS (example: 3000)

## 1) Clone the project

```
cd /root
# Replace the repo URL with the correct one
git clone https://github.com/<owner>/<repo>.git
cd /root/kir/cv
```

## 2) Install Node.js (example with nvm)

```
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 24
nvm use 24
node -v
npm -v
```

## 3) Install dependencies

```
cd /root/kir/cv
npm install
```

## 4) Configure Supabase env vars

Create .env.local:

```
cat > /root/kir/cv/.env.local <<'EOF'
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
CHATBOT_API_URL=http://127.0.0.1:8000
EOF
```

Fill the values from Supabase:
- Project Settings -> API
- Use the anon public key (NOT service_role)

Chatbot API base URL:
- Default is local FastAPI at http://127.0.0.1:8000
- Change if you host the chatbot on a different port or host

## 5) Build and run locally (sanity check)

```
cd /root/kir/cv
npm run build
npm run start -- --hostname 0.0.0.0 --port 3000
```

Stop the process after you confirm it works.

## 6) Create systemd service

Create: /root/kir/cv/deploy/systemd/cv.service

```
[Unit]
Description=Industri Collab Next.js App
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/kir/cv
Environment=NODE_ENV=production
EnvironmentFile=-/root/kir/cv/.env.local
Environment="PATH=/root/.nvm/versions/node/v24.15.0/bin:/usr/bin:/bin"
ExecStart=/root/.nvm/versions/node/v24.15.0/bin/npm run start -- --hostname 0.0.0.0 --port 3000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Enable and start:

```
systemctl daemon-reload
systemctl enable cv
systemctl restart cv
systemctl status cv --no-pager
```

## 7) Install and configure cloudflared tunnel

Install cloudflared:

```
# Example for Debian/Ubuntu
wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
apt install -y ./cloudflared-linux-amd64.deb
```

Authenticate cloudflared:

```
cloudflared tunnel login
```

Create a tunnel:

```
cloudflared tunnel create cetaklagi
```

Note the tunnel ID and credentials file in /root/.cloudflared.

Create config: /root/.cloudflared/config.yml

```
tunnel: <TUNNEL_ID>
credentials-file: /root/.cloudflared/<TUNNEL_ID>.json

ingress:
  - hostname: cetaklagi.id
    service: http://127.0.0.1:3000
  - hostname: www.cetaklagi.id
    service: http://127.0.0.1:3000
  - service: http_status:404
```

Install as a service:

```
cloudflared service install
systemctl restart cloudflared
systemctl status cloudflared --no-pager

## 7b) Run the chatbot API (FastAPI)

Install Python deps:

```
cd /root/kir/cv/Chatbothtml/Industri-Collab-Chatbothtml
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Run FastAPI manually (sanity check):

```
uvicorn main:app --host 127.0.0.1 --port 8000
```

Optional: systemd service for FastAPI

Create /etc/systemd/system/cain-chatbot.service:

```
[Unit]
Description=Cain Chatbot FastAPI
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/kir/cv/Chatbothtml/Industri-Collab-Chatbothtml
Environment=PYTHONUNBUFFERED=1
ExecStart=/root/kir/cv/Chatbothtml/Industri-Collab-Chatbothtml/.venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Enable and start:

```
systemctl daemon-reload
systemctl enable cain-chatbot
systemctl restart cain-chatbot
systemctl status cain-chatbot --no-pager
```
```

## 8) Cloudflare DNS (via API)

Set these env vars on the VPS (do not store secrets in repo):

```
export CF_EMAIL=""
export CF_KEY=""
export CF_ZONE_ID=""
```

Create CNAME records pointing to the tunnel:

```
export TARGET="<TUNNEL_ID>.cfargotunnel.com"

for NAME in cetaklagi.id www.cetaklagi.id; do
  curl -sS -X POST "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/dns_records" \
    -H "X-Auth-Email: ${CF_EMAIL}" \
    -H "X-Auth-Key: ${CF_KEY}" \
    -H "Content-Type: application/json" \
    --data "{\"type\":\"CNAME\",\"name\":\"${NAME}\",\"content\":\"${TARGET}\",\"proxied\":true,\"ttl\":1}"
  echo
Done
```

Validate:

```
dig +short cetaklagi.id CNAME
curl -I https://cetaklagi.id
```

## 9) Cloudflare SSL/TLS settings (via API)

```
# Full (strict)
curl -sS -X PATCH "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/settings/ssl" \
  -H "X-Auth-Email: ${CF_EMAIL}" \
  -H "X-Auth-Key: ${CF_KEY}" \
  -H "Content-Type: application/json" \
  --data '{"value":"strict"}'

# Always use HTTPS
curl -sS -X PATCH "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/settings/always_use_https" \
  -H "X-Auth-Email: ${CF_EMAIL}" \
  -H "X-Auth-Key: ${CF_KEY}" \
  -H "Content-Type: application/json" \
  --data '{"value":"on"}'

# Automatic HTTPS rewrites
curl -sS -X PATCH "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/settings/automatic_https_rewrites" \
  -H "X-Auth-Email: ${CF_EMAIL}" \
  -H "X-Auth-Key: ${CF_KEY}" \
  -H "Content-Type: application/json" \
  --data '{"value":"on"}'
```

## 10) Optional: redirect old domain

If you still control the old domain, add a Cloudflare redirect rule
or update its DNS to point to the tunnel. The app also has middleware
that redirects cetaklagi.cidz.web.id -> cetaklagi.id.

## 11) Update and redeploy

```
cd /root/kir/cv
git pull
npm install
npm run build
systemctl restart cv
```

## 12) Quick verification

## Port mapping notes (important for NAT/VPS)

Each VPS can have different open ports. You only need one local app port
for Node and one public HTTPS port for users. The default in this guide is:

- Public: 443 (Cloudflare edge)
- Local app: 3000

If your VPS only allows a different local port (example 8080), update:

- systemd service ExecStart --port
- cloudflared config.yml service URL

Example changes:

- ExecStart: use `--port 8080`
- cloudflared service: `http://127.0.0.1:8080`

If the VPS has a firewall, open the chosen local port for loopback access
only (cloudflared runs locally), and ensure outbound 443 to Cloudflare is
allowed.

## Operator checklist (per VPS)

Fill these before running the steps:

- Supabase URL and anon key
- Cloudflare email, global API key, and zone ID
- Local app port for this VPS

```
curl -I https://cetaklagi.id
curl -I https://www.cetaklagi.id
systemctl status cv --no-pager
systemctl status cloudflared --no-pager
```
