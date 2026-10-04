# YourU Cinema — Product Roadmap & Engineering Issues Backlog

Dokumen ini berisi backlog fitur prioritas tinggi hasil *Product Gap Analysis* untuk membawa YourU Cinema dari prototipe fungsional ke platform *enterprise-grade / production-ready*.

---

## 1. [FEAT] Persistent User Authentication & Cloud Profile Sync via Supabase/PostgreSQL

- **Labels**: `enhancement`, `backend`, `security`, `p0-critical`
- **Priority**: High (P0)
- **Assignees**: Backend Team

### User Story
Sebagai pengguna YourU Cinema, saya ingin mendaftar dan masuk ke akun saya di perangkat apa pun sehingga daftar tontonan (*My List*), riwayat tontonan (*Continue Watching*), dan pengaturan profil saya tersinkronisasi secara aman di cloud dan tidak hilang saat cache peramban dibersihkan.

### Problem Background
Saat ini autentikasi di `/login`, pendaftaran di `/register`, dan pemilihan profil di `/profiles` hanya disimpan di browser `localStorage`. Jika pengguna membersihkan cookie/cache atau berpindah dari desktop ke smartphone, semua data profil dan progress tontonan terhapus total.

### Technical Specification
- Integrasikan **Prisma ORM** atau **Drizzle** dengan database **PostgreSQL / Supabase**.
- Implementasikan sistem autentikasi **Auth.js (NextAuth v5)** dengan provider:
  - Credentials (Email & Argon2/Bcrypt hashed password).
  - OAuth2 Providers (Google & Discord login).
- Rancang skema database:
  - `User` (id, email, passwordHash, createdAt, updatedAt)
  - `Profile` (id, userId, name, avatarUrl, isKid, pinCode)
  - `WatchHistory` (id, profileId, animeId, episodeNumber, progressSeconds, durationSeconds, updatedAt)
  - `Watchlist` (id, profileId, animeId, title, coverUrl, addedAt)
- Buat Server Actions / Route Handlers untuk sinkronisasi state client ke database.

### Implementation Checklist
- [ ] Inisialisasi client Prisma/Drizzle dan buat berkas migrasi schema DB.
- [ ] Konfigurasi Auth.js / NextAuth v5 session handler di App Router.
- [ ] Buat API rute `/api/user/sync-progress` untuk autosave progres video.
- [ ] Migrasikan komponen `favorites.ts` dan `watchHistory.ts` untuk memanggil API backend dengan fallback lokal jika offline.
- [ ] Tambahkan middleware Next.js untuk memproteksi rute `/admin` dan `/profiles`.

### Acceptance Criteria
- Pengguna dapat register, login, dan logout dengan session JWT/cookie aman (`httpOnly`, `sameSite=lax`).
- Progres video yang ditonton di satu perangkat langsung tercermin di perangkat lain dalam status *Continue Watching*.
- Setiap akun dapat memiliki hingga 4 profil terpisah dengan daftar tontonan independen.

---

## 2. [FEAT] Resilient Multi-Provider Video Scraper & Distributed Redis Caching

- **Labels**: `enhancement`, `backend`, `performance`, `p0-critical`
- **Priority**: High (P0)
- **Assignees**: Streaming Engine Team

### User Story
Sebagai penonton, saya ingin video episode anime selalu dapat diputar dengan cepat tanpa kendala link rusak (*broken stream*) atau rate-limit dari server pihak ketiga.

### Problem Background
Saat ini rute `/api/video` hanya mengandalkan scraper Consumet AniList dengan in-memory cache sederhana. Apabila public endpoint Consumet terkena pembatasan rate limit (HTTP 429) atau down, player sering kali jatuh ke fallback dummy video Mux.

### Technical Specification
- Pasang layer caching terdistribusi menggunakan **Upstash Redis / Redis Cloud** dengan TTL 24 jam untuk link manifest HLS (`.m3u8`).
- Kembangkan arsitektur scraper multi-provider bertingkat (*circuit-breaker pattern*):
  1. *Provider A*: Consumet AniList (Primary)
  2. *Provider B*: Gogoanime Scraper (Secondary)
  3. *Provider C*: Pahe / AnimePahe API (Tertiary)
  4. *Provider D*: Custom CDN Server (Admin configured sources)
- Buat background worker yang memverifikasi ketersediaan segmen `.ts` secara berkala sebelum disajikan ke client.

### Implementation Checklist
- [ ] Setup koneksi Upstash Redis via `@upstash/redis`.
- [ ] Implementasikan helper cache wrapper `getCachedStream(animeTitle, episode)` dengan Redis TTL.
- [ ] Buat fallback resolver berantai dengan batas timeout 3500ms per provider.
- [ ] Buat diagnostic error telemetry jika seluruh scraper eksternal gagal merespons.

### Acceptance Criteria
- Waktu respons `/api/video` berkurang di bawah 150ms pada cache hit.
- Angka kegagalan pemutaran video berkurang hingga < 2% berkat mekanisme failover otomatis 3 tingkat.
- Data link streaming tidak hilang meskipun container web direstart.

---

## 3. [FEAT] Interactive Danmaku (Bullet Comments) & Time-Synced Episode Discussions

- **Labels**: `enhancement`, `frontend`, `community`, `p1-high`
- **Priority**: Medium-High (P1)
- **Assignees**: Frontend Team

### User Story
Sebagai penonton anime, saya ingin melihat dan mengirim komentar terbang (*danmaku*) tepat pada momen adegan tertentu seperti di Bilibili/Niconico untuk berbagi reaksi seru dengan komunitas penonton lainnya.

### Problem Background
Pengalaman menonton saat ini bersifat soliter tanpa adanya interaksi sosial antar pengguna, mengurangi tingkat retensi dan keterlibatan komunitas (*community stickiness*).

### Technical Specification
- Bangun layer overlay canvas HTML5 di atas elemen `<video>` pada `StreamingPlayer.tsx`.
- Hubungkan client ke WebSocket / Supabase Realtime channel `danmaku:{animeId}:{episodeNumber}`.
- Payload komentar: `{ timestamp: float, text: string, color: hex, mode: "scroll" | "top" | "bottom" }`.
- Tambahkan panel samping (*collapsible sidebar*) untuk diskusi episode dengan spoiler tag generator (`[spoiler]...[/spoiler]`).

### Implementation Checklist
- [ ] Buat komponen canvas rendering danmaku dengan requestAnimationFrame untuk performa 60fps.
- [ ] Tambahkan kontrol UI di player: Toggle On/Off Danmaku, Opacity Slider, dan Input Box komentar.
- [ ] Integrasikan backend endpoint `/api/danmaku` (GET episode danmaku & POST komentar baru).
- [ ] Implementasikan filter kata kasar (*profanity filter*) dan rate limiter pengiriman pesan per pengguna.

### Acceptance Criteria
- Komentar terbang melintasi layar video tepat pada detik tontonan tanpa menimbulkan drop frame (stuttering).
- Penonton dapat mematikan atau mengatur transparansi danmaku dengan satu klik.
- Komentar berbau spoiler disamarkan dengan efek blur hingga diklik oleh pengguna.

---

## 4. [FEAT] Progressive Web App (PWA) & Offline Episode Download via IndexedDB

- **Labels**: `enhancement`, `mobile`, `performance`, `p1-high`
- **Priority**: Medium-High (P1)
- **Assignees**: Mobile & PWA Team

### User Story
Sebagai pengguna mobile, saya ingin menginstal YourU Cinema sebagai aplikasi web di homescreen saya dan mengunduh episode anime favorit untuk ditonton saat bepergian tanpa koneksi internet.

### Problem Background
Website saat ini hanya bisa diakses via browser dengan koneksi internet aktif. Tidak ada dukungan offline mode maupun tampilan layar penuh app-like di smartphone.

### Technical Specification
- Konfigurasi **Serwist** atau **@ducanh2912/next-pwa** untuk App Router.
- Sediakan `manifest.json` lengkap dengan icon maskable 192x192, 512x512, tema gelap, dan display mode `standalone`.
- Gunakan **IndexedDB** (via `idb` / Dexie.js) untuk menyimpan chunk file video MP4/HLS secara lokal di browser client.
- Tambahkan menu navigasi "Downloads" untuk memutar video dari storage lokal saat status offline terdeteksi (`navigator.onLine === false`).

### Implementation Checklist
- [ ] Buat aset icon PWA dan konfigurasi `public/manifest.json`.
- [ ] Daftarkan service worker untuk caching aset statis, font, dan cover poster anime.
- [ ] Rancang modul download manager dengan progress bar persentase unduhan.
- [ ] Implementasikan playback driver lokal yang membaca blob URL dari IndexedDB.

### Acceptance Criteria
- Prompt instalasi aplikasi muncul otomatis di Google Chrome & Safari iOS.
- Aplikasi dapat dibuka dalam mode airplane/offline dan tetap memutar episode yang sudah diunduh.
- Pengguna dapat menghapus cache unduhan untuk menghemat memori perangkat.

---

## 5. [FEAT] Personalized Recommendation Engine & AI Semantic Discovery

- **Labels**: `enhancement`, `ai`, `ux`, `p2-medium`
- **Priority**: Medium (P2)
- **Assignees**: Data & AI Team

### User Story
Sebagai penonton, saya ingin mendapatkan rekomendasi anime yang sangat relevan dengan genre dan anime favorit yang baru saja saya tonton, bukan sekadar urutan statis.

### Problem Background
Daftar baris beranda pada `app/page.tsx` saat ini hanya memotong (*slice*) daftar Top Anime secara manual (`actionAnime = combined.slice(0, 12)`). Rekomendasi belum dipersonalisasi berdasarkan preferensi riwayat tontonan masing-masing pengguna.

### Technical Specification
- Buat engine rekomendasi berbasis Collaborative Filtering dan Content-Based Filtering.
- Ekstrak vektor embedding sinopsis anime menggunakan model embedding teks (misal: Gemini Text Embeddings atau Jina Embeddings).
- Simpan embeddings di database vektor (pgvector pada PostgreSQL atau Qdrant).
- Tambahkan fitur pencarian semantik natural language pada `/search` (contoh pencarian: "anime tentang pertarungan pedang masa feodal dengan plot gelap").

### Implementation Checklist
- [ ] Generate metadata embeddings untuk 500 anime populer dari Jikan API.
- [ ] Buat API rute `/api/recommendations?profileId=...` yang menghitung skor kesamaan kosinus (*cosine similarity*).
- [ ] Gantikan slice statis di `page.tsx` dengan feed dinamis per profil pengguna.
- [ ] Tambahkan baris khusus beranda: "Because you watched [Anime Title]".

### Acceptance Criteria
- Rekomendasi di beranda berubah secara dinamis setelah pengguna menyelesaikan serial anime tertentu.
- Query pencarian deskriptif non-judul pada halaman `/search` menghasilkan anime yang relevan secara akurat.

---

## 6. [FEAT] Watch2Gether: Real-Time Synchronized Room Playback with Text Chat

- **Labels**: `enhancement`, `realtime`, `social`, `p2-medium`
- **Priority**: Medium (P2)
- **Assignees**: Fullstack Team

### User Story
Sebagai sekelompok teman, kami ingin menonton episode anime bersama-sama secara virtual di mana jeda (*pause*), putar (*play*), dan loncat waktu (*seek*) tersinkronisasi otomatis di semua layar kami.

### Problem Background
Pengguna yang ingin menonton bareng bersama teman saat ini harus menghitung manual ("1, 2, 3 klik play") melalui telepon pihak ketiga (seperti Discord) yang sering kali mengalami ketidaksinkronan waktu pemutaran.

### Technical Specification
- Rancang rute `/room/[roomId]` berbasis WebSockets (Socket.io atau PartyKit).
- State mesin ruangan tersentralisasi:
  - `hostId`: User yang mengontrol playback.
  - `playbackState`: `{ isPlaying: boolean, currentTime: number, lastSyncTime: timestamp }`.
- Sistem drift-correction: Jika selisih waktu antar penonton > 1.5 detik, client follower otomatis melompat (*seek*) ke waktu host.
- Sidebar live chat terintegrasi dengan emotikon kustom dan badge host.

### Implementation Checklist
- [ ] Setup socket server atau serverless WebSockets handler.
- [ ] Tambahkan tombol "Host Watch Party" pada halaman pemutar video `/watch/[slug]`.
- [ ] Buat sinkronisasi event video (`play`, `pause`, `seeking`) antar penonton.
- [ ] Buat chatroom real-time dengan daftar anggota yang sedang aktif di ruangan.

### Acceptance Criteria
- Video di semua perangkat follower otomatis melakukan play/pause ketika host menekan tombol kontrol.
- Latensi sinkronisasi playback terjaga di bawah 500ms pada koneksi broadband normal.
- Link undangan ruangan dapat dibagikan dengan mudah melalui tombol *Copy Invite Link*.

---

## 7. [FEAT] Production Observability, Real-Time Stream Health & Admin Telemetry

- **Labels**: `devops`, `monitoring`, `admin`, `p1-high`
- **Priority**: Medium-High (P1)
- **Assignees**: DevOps Team

### User Story
Sebagai administrator sistem, saya ingin memantau kesehatan streaming server, error rate dari scraper pihak ketiga, dan metrik latensi buffer secara real-time dari dashboard admin.

### Problem Background
Dashboard `/admin` saat ini hanya berisi angka-angka tiruan statis (*mock metrics*: "12,450+", "8,920 streams"). Tidak ada visibilitas operasional nyata untuk mengetahui jika ada link video yang mati atau jika server upstream sedang diblokir.

### Technical Specification
- Integrasikan **OpenTelemetry / Sentry** untuk pelacakan error frontend dan crash player.
- Tangkap event player `hls.js`:
  - `Hls.Events.ERROR` (network error, media error, buffer stall).
  - Waktu mulai putar pertama (*Time to First Frame / TTFF*).
- Laporkan agregasi metrik ke backend rute `/api/telemetry/report`.
- Perbarui halaman `/admin` dengan visualisasi grafik interaktif (menggunakan Recharts / Chart.js) yang menampilkan:
  - Peringkat video yang paling sering error / broken link.
  - Status uptime real-time masing-masing provider Consumet/Gogoanime.
  - Grafik jumlah penonton aktif per jam.

### Implementation Checklist
- [ ] Pasang listener event error pada `StreamingPlayer.tsx` untuk mengirim beacon pelaporan.
- [ ] Bangun endpoint agregasi analitik internal di Next.js App Router.
- [ ] Ganti kartu statis di `/admin/page.tsx` dengan komponen grafik metrik nyata.
- [ ] Tambahkan tombol aksi "Re-check & Refresh Cache" pada stream yang dilaporkan rusak oleh penonton.

### Acceptance Criteria
- Admin dapat melihat daftar anime yang mengalami broken stream secara akurat beserta kode error spesifiknya.
- Laporan dari tombol "Report Video Issue" pada player langsung tercatat di tabel log admin.
- Grafik trafik admin menampilkan data nyata penonton aktif.

---

## 8. [FEAT] Automated Simulcast Airing Schedule & Browser Push Notifications

- **Labels**: `enhancement`, `frontend`, `automation`, `p2-medium`
- **Priority**: Medium (P2)
- **Assignees**: Fullstack Team

### User Story
Sebagai pecinta anime yang mengikuti serial yang sedang tayang (*on-going*), saya ingin melihat jadwal tayang mingguan (Senin–Minggu) dan menerima notifikasi browser ketika episode terbaru anime favorit saya sudah tersedia untuk ditonton.

### Problem Background
Komponen notifikasi pada `Navbar.tsx` saat ini hanya menampilkan teks hardcoded statis. Pengguna tidak mengetahui kapan episode berikutnya dari anime musiman akan tayang.

### Technical Specification
- Buat halaman khusus `/schedule` yang mengonsumsi endpoint Jikan API `/v4/schedules?filter=...`.
- Tampilkan jadwal anime dalam format kalender grid per hari (Senin s/d Minggu) dengan konversi waktu lokal penonton (WIB/UTC+7).
- Pasang penghitung mundur interaktif (*Countdown Timer*) menuju waktu rilis episode baru.
- Implementasikan Web Push Notification API menggunakan Web Push library dan VAPID keys untuk memberi tahu penonton saat anime di *My List* mereka merilis episode baru.

### Implementation Checklist
- [ ] Buat halaman `/schedule` dengan tab hari dalam sepekan (Senin s/d Minggu).
- [ ] Sinkronkan jadwal tayang otomatis setiap 12 jam melalui cron job atau Next.js revalidation.
- [ ] Hubungkan tombol "Remind Me" / "Lonceng Notifikasi" ke Web Push API browser.
- [ ] Hubungkan notifikasi dropdown di `Navbar.tsx` ke daftar pembaruan rilis episode riil.

### Acceptance Criteria
- Halaman jadwal menampilkan anime yang tayang hari ini sesuai zona waktu pengguna secara otomatis.
- Pengguna yang mengizinkan notifikasi menerima push notification di desktop/ponsel sesaat setelah episode baru terdeteksi.
