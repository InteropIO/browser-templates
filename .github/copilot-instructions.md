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

## Updating Dependencies

When new @interopio packages are released, all projects in this repository need to be updated. Follow these steps:

### Step 1: Update Package Dependencies
Go through all project directories and update all `@interopio/*` dependencies to the latest versions:

```bash
# For each template directory (browser-client-react, browser-client-vanilla-js, etc.)
cd <template-directory>

# Update all @interopio dependencies in package.json to latest versions
# Example: "@interopio/browser": "^4.0.2" -> "@interopio/browser": "^4.1.0"
```

**Templates with @interopio dependencies:**
- `browser-client-react`: @interopio/browser, @interopio/react-hooks
- `browser-platform-home-react-wsp`: @interopio/browser-platform, @interopio/browser-worker, @interopio/home-ui-react, @interopio/modals-api, @interopio/react-hooks, @interopio/workspaces-api, @interopio/workspaces-ui-react
- `browser-platform-wsp-frame`: @interopio/browser-platform, @interopio/modals-api, @interopio/react-hooks, @interopio/workspaces-api, @interopio/workspaces-ui-react
- `browser-platform-dev-react-seed/workspace-platform`: Check package.json for @interopio dependencies
- `browser-platform-dev-react-seed/react-client`: Check package.json for @interopio dependencies

### Step 2: Update Package Versions
Update the `version` field in each `package.json` file to match the new io.Connect Browser version:

```bash
# Example: "version": "4.0.0" -> "version": "4.1.0"
```

Update all package.json files:
- `browser-client-react/package.json`
- `browser-client-vanilla-js/package.json`
- `browser-platform-dev-react-seed/package.json`
- `browser-platform-dev-react-seed/workspace-platform/package.json`
- `browser-platform-dev-react-seed/react-client/package.json`
- `browser-platform-home-react-wsp/package.json`
- `browser-platform-vanilla-js/package.json`
- `browser-platform-wsp-frame/package.json`

### Step 3: Update package-lock.json Files
Regenerate all `package-lock.json` files with the new dependency versions:

```bash
# For each template directory
cd <template-directory>
rm -f package-lock.json
npm install                    # NEVER CANCEL - set timeout 300+ seconds

# For browser-platform-dev-react-seed, also update subdirectories
cd browser-platform-dev-react-seed/workspace-platform
rm -f package-lock.json
npm install

cd ../react-client
rm -f package-lock.json
npm install
```

### Step 4: Replace .es.js Files for Vanilla JavaScript Projects
For vanilla JavaScript projects, download and replace the corresponding .es.js library files:

**browser-client-vanilla-js:**
- Download latest `browser.es.js` and `browser.es.js.map` from npm package @interopio/browser
- Replace files in `browser-client-vanilla-js/public/libs/`

**browser-platform-vanilla-js:**
- Download latest `browser.platform.es.js` from npm package @interopio/browser-platform
- Replace file in `browser-platform-vanilla-js/public/libs/`

**React templates with public resources:**
For templates with public resources directories (browser-platform-dev-react-seed, browser-platform-home-react-wsp, browser-platform-wsp-frame):
- Update `io-browser-modals-ui.es.js` and `io-browser-modals-ui-react.es.js` in `/public/resources/modals/`
- Update `io-browser-intent-resolver-ui.es.js` in `/public/resources/intent-resolver/`

### Step 5: Update manifest.json
Update the repository `manifest.json` file with the new version information:

```json
{
    "ioCb": {
        "versions": [
            "latest",
            "3.0",
            "3.1",
            "3.2",
            "3.3",
            "3.4",
            "3.5",
            "4.0",
            "4.1"    // Add previous version to array
        ],
        "latestVersion": "4.2"  // Set to new latest version
    }
}
```

**Note**: When releasing version 4.2, add 4.1 (the previous version) to the `versions` array, and set `latestVersion` to 4.2 (the new version). The latest version should not be included in the `versions` array.

### Step 6: Validation
After updating dependencies, validate all templates:

```bash
# Test each template following the Template-Specific Instructions
# Ensure all templates build and start successfully
# Document any breaking changes or migration notes
```

**IMPORTANT**: Always run `npm install` and test builds after updating dependencies. Set timeouts of 300+ seconds and NEVER CANCEL builds.

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