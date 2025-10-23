## Rock–Paper–Scissors

Modern, accessible RPS game built with Vite, React 19, TypeScript, and Tailwind.

### Scripts

Run inside `app/`:

```bash
npm install
npm run dev
npm run build
npm run preview
npm run type-check
npm run lint
npx jest --config jest.config.ts
```

### Features

- Local persistence for settings
- Theme (system/light/dark)
- A11y: keyboard, aria-live, color contrast
- Responsive layout

### Deployment

#### Production Deployment with Docker

1. **Build and run with Docker Compose:**

   ```bash
   docker-compose up -d
   ```

   The app will be available at `http://localhost:8101`

2. **Manual Docker build:**

   ```bash
   docker build -t rock-paper-scissors .
   docker run -p 8101:80 rock-paper-scissors
   ```

3. **Development with Docker:**
   ```bash
   docker-compose --profile dev up -d
   ```
   Development server will be available at `http://localhost:8102`

#### Server Deployment

1. **Clone and setup:**

   ```bash
   git clone <repository-url>
   cd rock-paper-scessors-react
   ```

2. **Deploy with Docker Compose:**

   ```bash
   docker-compose up -d
   ```

3. **Configure reverse proxy (nginx example):**

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:8101;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

4. **Health check:**
   ```bash
   curl http://localhost:8101/health
   ```

#### Environment Requirements

- Docker and Docker Compose
- Port 8101 available (production)
- Port 8102 available (development)

### Structure

- `app/src/components`: UI
- `app/src/state`: contexts and reducer
- `app/src/game`: types and resolver
- `app/src/i18n`: string dictionary scaffold
-

### Sound effects

The following audio files are required and should be placed in `app/public/sounds/`:

- `countdown-tick.mp3` - Sound played during countdown
- `lose.mp3` - Sound played when player loses
- `reveal.mp3` - Sound played when choices are revealed
- `select.mp3` - Sound played when player makes a selection
- `win.mp3` - Sound played when player wins

I have build this app for my daughter and used recordings of my voice for some of the sounds, e.g. `countdown-tick`, `win`, `lose`. However if you want to use game sounds there is a rich library of sound effects for free from <a href="https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=337219">Pixabay</a>.
