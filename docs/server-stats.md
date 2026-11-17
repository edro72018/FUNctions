# server-context.md — Contexto del servidor y snapshots de consultas

> Equipo: `debian-server` (Debian 13.7, 2 vCPU AMD A6-9225, 7.2 GiB RAM, 3.8 GiB swap)
> Stack en producción: Frappe v16 + Education (`frappe-edu:v16`) vía Docker Compose,
> expuesto a internet con Tailscale Funnel: `https://debian-server.tailff0f0b.ts.net`
> Archivos relacionados: `/srv/apps/PLAN-DESPLEGUE-FRAPPE-V15.md`, `/home/debian/commands.txt`

---
## Snapshot #1 — 04 nov 2026 · `docker ps`

```
CONTAINER ID   IMAGE              COMMAND                  CREATED       STATUS                PORTS                                         NAMES
ba1dd6b77c30   frappe-edu:v16     "/usr/local/bin/entr…"   11 days ago   Up 8 days             0.0.0.0:8080->8080/tcp, [::]:8080->8080/tcp   frappe-e>
fe01125ee20c   frappe-edu:v16     "/usr/local/bin/entr…"   11 days ago   Up 8 days                                                           frappe-e>
de9e9c02031a   frappe-edu:v16     "/usr/local/bin/entr…"   11 days ago   Up 8 days                                                           frappe-e>
f3658ca1e323   frappe-edu:v16     "/usr/local/bin/entr…"   11 days ago   Up 8 days                                                           frappe-e>
41add4456c29   frappe-edu:v16     "/usr/local/bin/entr…"   11 days ago   Up 8 days                                                           frappe-e>
6f7f2d3b064e   frappe-edu:v16     "/usr/local/bin/entr…"   11 days ago   Up 8 days                                                           frappe-e>
5013770f1121   redis:8.6-alpine   "docker-entrypoint.s…"   11 days ago   Up 8 days             6379/tcp                                      frappe-e>
a34ef43e6a0d   redis:8.6-alpine   "docker-entrypoint.s…"   11 days ago   Up 8 days             6379/tcp                                      frappe-e>
bad9e83a13a1   mariadb:11.8       "docker-entrypoint.s…"   11 days ago   Up 8 days (healthy)   3306/tcp                                      frappe-e>
```
Lectura: 9 contenedores estables, sin intervenir en 8 días. Solo el
frontend publica puertos (127.0.0.1:8080 vía Funnel). La BD reporta healthy.

## Snapshot #1 — 04 nov 2026 · `free -h`

```
               total       usado       libre  compartido   búf/caché  disponible
Mem:           7.2Gi       2.9Gi       175Mi        14Mi       4.4Gi       4.3Gi
Inter:         3.8Gi       256Ki       3.8Gi
```

Lectura: **disponible 4.3 GiB** (la columna que importa, no "libre").
Swap casi intacto (256 KiB) → sin presión de memoria. El stack convive
holgado con el resto del sistema.

## Snapshot #1 — 04 nov 2026 · `docker stats --no-stream`

```
CONTAINER ID   NAME                       CPU %     MEM USAGE / LIMIT     MEM %     NET I/O           BLOCK I/O         PIDS
ba1dd6b77c30   frappe-edu-frontend-1      0.00%     21.04MiB / 7.236GiB   0.28%     517MB / 432MB     63.8MB / 3.07MB   4
fe01125ee20c   frappe-edu-scheduler-1     0.00%     80.91MiB / 7.236GiB   1.09%     184MB / 87.3MB    8.19kB / 8.19kB   2
de9e9c02031a   frappe-edu-queue-long-1    0.00%     56.89MiB / 7.236GiB   0.77%     4.82GB / 403MB    30.3MB / 1.73GB   2
f3658ca1e323   frappe-edu-websocket-1     0.00%     33.05MiB / 7.236GiB   0.45%     18.2MB / 12.7MB   1.54MB / 0B       11
41add4456c29   frappe-edu-backend-1       0.08%     1.566GiB / 7.236GiB   21.64%    8.51GB / 714MB    230MB / 730MB     68
6f7f2d3b064e   frappe-edu-queue-short-1   0.00%     52.52MiB / 7.236GiB   0.71%     4.62GB / 368MB    28MB / 3.68MB     2
5013770f1121   frappe-edu-redis-cache-1   0.41%     59.78MiB / 7.236GiB   0.81%     447MB / 17.1GB    16.4kB / 2.14GB   6
a34ef43e6a0d   frappe-edu-redis-queue-1   0.40%     10.85MiB / 7.236GiB   0.15%     463MB / 225MB     8.19kB / 89.3MB   6
bad9e83a13a1   frappe-edu-db-1            8.29%     271.7MiB / 7.236GiB   3.67%     207MB / 751MB     60MB / 116MB      21
```

Lecturas clave:
- `backend` = el mayor consumidor: **1.566 GiB (21.6%), 68 PIDs** — gunicorn con
  workers/threads. Es el margen a vigilar/ajustar si crece el uso del sitio.
- `redis-cache` ya leyó **17.1 GB** de red → caché funcionando activamente.
- Colas `long`/`short`: ~4.8 y 4.6 GB de tráfico acumulado con CPU ~0% — ritmo
  normal de Frappe en reposo.
- `db` con picos de 8% CPU — consultas moderadas.
- `frontend` (nginx): 4 PIDs, consumo mínimo — el acceso de visitantes pasa por aquí.
- Swap virgen y CPU global baja = **headroom sano** para un sitio educativo pequeño.

