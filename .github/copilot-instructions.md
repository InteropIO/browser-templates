# io.Connect Browser Templates Repository

io.Connect Browser Templates is a collection of 6 production-ready templates for building io.Connect Browser applications. This repository contains React and Vanilla JavaScript templates for both Browser Client apps and Browser Platform apps (Main apps).

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Prerequisites
All templates require Node.js 18+ and npm 8+. Check Node.js version with `node --version` and npm with `npm --version`.

### Quick Setup and Validation
To quickly validate all templates are working:
```bash
# Test each template directory individually as shown in Template-Specific Instructions
```

**NEVER CANCEL build or start commands.** Most builds complete in under 30 seconds, but set timeouts to 5+ minutes to be safe.

## Template-Specific Instructions

### browser-client-react (React Browser Client)
**Location**: `/browser-client-react`
**Purpose**: React template (Vite) for io.Connect Browser Client apps
**Development server**: `http://localhost:3000`

```bash
cd browser-client-react
npm install                    # ~10 seconds
npm run build                  # ~4 seconds - NEVER CANCEL, set timeout 300+ seconds
npm start                      # Starts dev server - NEVER CANCEL
```

**Test command**: `npm test` (placeholder - returns success)
**Notes**: 
- Uses Vite for fast development
- Expected to show connection errors when run standalone (needs Browser Platform to connect to)
- Build produces optimized production bundle in `/dist`

### browser-client-vanilla-js (Vanilla JS Browser Client)
**Location**: `/browser-client-vanilla-js`
**Purpose**: Pure JavaScript template for io.Connect Browser Client apps
**Development server**: `http://localhost:4243`

```bash
cd browser-client-vanilla-js
npm install                    # ~2 seconds
npm start                      # Starts http-server - NEVER CANCEL
```

**Notes**:
- Simple http-server setup
- No build step required
- Source code in `/public` directory
- io.Connect library included in `/public/libs`

### browser-platform-dev-react-seed (Development Seed Project)
**Location**: `/browser-platform-dev-react-seed`
**Purpose**: Complete multi-app development environment with workspace platform + React client
**Development servers**: 
- Workspace Platform: `http://localhost:3002`
- React Client: `http://localhost:3001`

```bash
cd browser-platform-dev-react-seed
npm install                    # ~15 seconds
npm run bootstrap              # ~6 seconds - installs deps for all sub-apps - NEVER CANCEL, set timeout 600+ seconds
npm start                      # Starts all apps concurrently - NEVER CANCEL
npm run build                  # Builds all apps for production
```

**Notes**:
- Uses Gulp for orchestration
- Contains `/workspace-platform` and `/react-client` subdirectories
- Each subdirectory is self-sufficient with own package.json
- Most comprehensive template - includes Context Viewer, Interop Viewer tools
- **Requires license key** in workspace-platform/src/config.json to work fully

### browser-platform-home-react-wsp (Home + Workspaces Platform)
**Location**: `/browser-platform-home-react-wsp`
**Purpose**: React template for io.Connect Home App + Workspace App (PWA-enabled)
**Development server**: `http://localhost:4242`

```bash
cd browser-platform-home-react-wsp
npm install                    # ~3 seconds
npm run build                  # ~10 seconds - NEVER CANCEL, set timeout 300+ seconds
npm start                      # Starts dev server - NEVER CANCEL
```

**Test command**: `npm test` (placeholder - returns success)
**Notes**: 
- Progressive Web App (PWA) template
- **Requires license key** in src/config.json
- Includes Auth0 authentication components
- Uses .env file for configuration

### browser-platform-vanilla-js (Vanilla JS Browser Platform)
**Location**: `/browser-platform-vanilla-js`
**Purpose**: Pure JavaScript template for io.Connect Browser Platform apps
**Development server**: `http://localhost:4242`

```bash
cd browser-platform-vanilla-js
npm install                    # ~1 second
npm start                      # Starts http-server - NEVER CANCEL
```

**Notes**:
- Simple http-server setup
- No build step required
- Source code in `/public` directory

### browser-platform-wsp-frame (Workspace Frame Platform)
**Location**: `/browser-platform-wsp-frame`
**Purpose**: React template for io.Connect Browser Platform with Workspace functionality
**Development server**: `http://localhost:4243` (auto-switches if 4242 is occupied)

```bash
cd browser-platform-wsp-frame
npm install                    # ~5 seconds
npm run build                  # ~8 seconds - NEVER CANCEL, set timeout 300+ seconds
npm run lint                   # <1 second - runs ESLint
npm start                      # Starts dev server - NEVER CANCEL
```

**Notes**: 
- Includes comprehensive linting with ESLint
- Auto-detects port conflicts and switches ports
- **Requires license key** in src/config.json for full functionality

## Common Patterns and Validation

### Build Timeouts and Timing
- **npm install**: 1-15 seconds depending on template
- **npm run build**: 4-10 seconds for most templates
- **npm run bootstrap** (seed project): ~6 seconds
- **CRITICAL**: Set minimum timeout of 300 seconds for all build commands
- **NEVER CANCEL** any build or start command - they may appear to hang but are processing

### Expected Behavior When Running
- All templates start successfully and serve on their respective ports
- Browser Client templates show connection errors when run standalone (expected - they need a Browser Platform to connect to)
- Browser Platform templates require license keys for full functionality
- Templates may show licensing warnings or decoder errors without proper configuration

### Validation Scenarios
After making changes to any template:

1. **Build validation**: Run `npm run build` and verify it completes without errors
2. **Start validation**: Run `npm start` and verify the development server starts
3. **Browser validation**: Open the localhost URL and verify the app loads (errors about licensing/connection are expected)
4. **Lint validation** (for React templates): Run `npm run lint` if available

### Common File Locations
```
# Repository structure (all templates follow similar patterns)
browser-[type]-[framework]/
├── package.json           # Dependencies and scripts
├── README.md             # Template-specific documentation  
├── src/                  # Source code (React templates)
├── public/               # Static assets / source (Vanilla JS)
├── config.json           # io.Connect configuration (Platform templates)
└── dist/                 # Build output (after npm run build)
```

### License Key Requirements
Templates requiring license keys:
- browser-platform-dev-react-seed (workspace-platform/src/config.json)
- browser-platform-home-react-wsp (src/config.json)
- browser-platform-wsp-frame (src/config.json)

**NOTE**: Without valid license keys, these templates will show decoder errors but still demonstrate basic functionality.

### Repository Maintenance
- No CI/CD workflows configured
- Templates use various versions of dependencies with some deprecation warnings (expected)
- Security vulnerabilities in dependencies are present but don't affect template functionality
- Run `npm audit` in any template directory to see security status

## Development Workflow
1. Choose appropriate template based on your needs:
   - **Browser Client**: Use browser-client-react or browser-client-vanilla-js
   - **Browser Platform**: Use browser-platform-* templates
   - **Full Development Environment**: Use browser-platform-dev-react-seed
2. Follow template-specific setup instructions above
3. For Platform templates, add license key to config.json for full functionality
4. Modify template source code as needed
5. Test changes using validation scenarios above
6. Build for production using `npm run build`

## Troubleshooting
- **Port conflicts**: Templates auto-switch ports when default ports are occupied
- **Connection errors**: Expected for Browser Clients when run without Browser Platform
- **License errors**: Expected for Platform templates without valid license keys
- **Build hangs**: Normal behavior - wait for completion, don't cancel
- **Deprecation warnings**: Expected - templates use stable dependency versions

## Key Files to Check When Debugging
- `package.json` - Scripts and dependencies
- `config.json` - io.Connect platform configuration
- `README.md` - Template-specific documentation
- `.env` - Environment variables (where present)
- `vite.config.ts` - Vite configuration (React templates)