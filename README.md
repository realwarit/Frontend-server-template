# Frontend Server Template

Services:
- Portainer
- Caddy
- PostgreSQL
- pgAdmin
- Node-RED

Run:
docker compose up -d
ตรวจสอบแล้ว:
docker compose config --quiet ผ่าน
้webserver
    http://localhost/ 
API
    http://localhost/api/ 
Database
    PGSQL
        TZ: Asia/Bangkok
        POSTGRES_DB: appdb
        POSTGRES_USER: admin
        POSTGRES_PASSWORD: admin123
PGADMIN
    http://localhost:5050/
    PGADMIN_DEFAULT_EMAIL: admin@example.com
    PGADMIN_DEFAULT_PASSWORD: admin123
