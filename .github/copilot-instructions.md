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

### Step 1: Create New Branch

Before making any changes, create a new branch from origin:

```bash
# User must specify the version number (e.g., 4.3)
git checkout -b cb-next-<version> origin/master

# Example: git checkout -b cb-next-4.3 origin/master
```

**IMPORTANT**: Always ask the user for the version number if not provided. The branch name format is `cb-next-<version>` where `<version>` is the new io.Connect Browser version being released (e.g., 4.2, 4.3, 5.0).

### Step 2: Update Package Dependencies
**CRITICAL**: Update ALL `@interopio/*` dependencies to their latest versions, regardless of major version number. Always verify actual latest versions using `npm view <package> version` before updating.

**All @interopio packages used across templates:**
- `@interopio/browser` - Used in browser-client-react
- `@interopio/browser-platform` - Used in workspace-platform, home-react-wsp, wsp-frame
- `@interopio/browser-worker` - Used in home-react-wsp
- `@interopio/desktop` - Used in workspace-platform (different major version)
- `@interopio/home-ui-react` - Used in home-react-wsp (different major version)
- `@interopio/modals-api` - Used in workspace-platform, react-client, home-react-wsp, wsp-frame (different major version)
- `@interopio/react-hooks` - Used in all React templates
- `@interopio/workspaces-api` - Used in workspace-platform, react-client, home-react-wsp, wsp-frame
- `@interopio/workspaces-ui-react` - Used in workspace-platform, home-react-wsp, wsp-frame

**Process:**
1. For each package, check latest version: `npm view @interopio/<package> version`
2. Update package.json files with the latest versions found
3. Don't assume version numbers - always verify with npm

### Step 3: Update Package Versions
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

### Step 4: Update package-lock.json Files
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

### Step 5: Replace .es.js Files for Vanilla JavaScript Projects
For vanilla JavaScript projects, download and replace the corresponding .es.js library files **including .map files**:

**browser-client-vanilla-js:**
- Download `browser.es.js` and `browser.es.js.map` from npm package @interopio/browser
- Replace both files in `browser-client-vanilla-js/public/libs/`

**browser-platform-vanilla-js:**
- Download `browser.platform.es.js` and `browser.platform.es.js.map` from npm package @interopio/browser-platform
- Replace both files in `browser-platform-vanilla-js/public/libs/`

**React templates with public resources:**
`

### Step 6: Update public resources for React templates

`browser-platform-dev-react-seed/workspace-platform`, `browser-platform-home-react-wsp` and `browser-platform-wsp-frame` use shared public resources for Intent Resolver and Modals. These need to be updated to the latest versions from the respective `@interopio/*` npm packages. 

**CRITICAL**: Always DELETE all existing files in the resource directories before copying new ones to avoid mixed versions.

**Process:**
```bash
# Create temp directory for downloads
cd browser-templates
mkdir temp-ui-update
cd temp-ui-update

# Download and extract intent-resolver-ui
npm pack @interopio/intent-resolver-ui@latest
tar -xzf interopio-intent-resolver-ui-*.tgz

# Update each template (repeat for all 3 templates)
Remove-Item "path/to/template/public/resources/intent-resolver/*" -Force
Copy-Item -Recurse "package/dist/*" "path/to/template/public/resources/intent-resolver/" -Force

# Download and extract modals-ui
rm -rf package
npm pack @interopio/modals-ui@latest
tar -xzf interopio-modals-ui-*.tgz

# Update each template (repeat for all 3 templates)
Remove-Item "path/to/template/public/resources/modals/*" -Force
Copy-Item -Recurse "package/dist/*" "path/to/template/public/resources/modals/" -Force

# Clean up
cd ..
Remove-Item -Recurse -Force temp-ui-update
```

**Templates to update:**
- `browser-platform-dev-react-seed/workspace-platform/public/resources/`
- `browser-platform-home-react-wsp/public/resources/`
- `browser-platform-wsp-frame/public/resources/`

**Note**: Package structures may change between versions (e.g., files may be added/removed). Always use the `-Recurse` flag to copy all files from dist folders. Verify files after copying to ensure no old files remain.

### Step 7: Update manifest.json
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

### Step 8: Validation
After updating dependencies, validate all templates:

```bash
# Test each template following the Template-Specific Instructions
# Ensure all templates build and start successfully
# Verify all @interopio packages are updated (check with grep or file search)
# Document any breaking changes or migration notes
```

**Validation Checklist:**
- [ ] All package.json version fields updated to new version
- [ ] All @interopio/* dependencies updated (including different major versions like @interopio/desktop, @interopio/home-ui-react, @interopio/modals-api)
- [ ] All package-lock.json files regenerated
- [ ] Vanilla JS .es.js and .es.js.map files replaced
- [ ] Old files removed from resources directories before copying new ones
- [ ] Intent Resolver and Modals resources updated in all 3 React platform templates
- [ ] Verify files in resources directories are current (check file counts match package dist contents)
- [ ] manifest.json updated with new version
- [ ] All templates build successfully

**IMPORTANT**: Always run `npm install` and test builds after updating dependencies. Set timeouts of 300+ seconds and NEVER CANCEL builds.

**Common Issues:**
- Mixed versions: If old and new files exist together, remove all files first before copying
- Package structure changes: UI packages may change between versions (files added/removed/renamed)
- File timestamps: npm packages may have unusual timestamps; verify by checking file names match dist contents

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