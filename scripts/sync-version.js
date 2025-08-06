#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Read package.json
const packageJsonPath = join(__dirname, '..', 'package.json')
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
const version = packageJson.version

// Read nuxt.config.ts
const nuxtConfigPath = join(__dirname, '..', 'nuxt.config.ts')
let nuxtConfig = readFileSync(nuxtConfigPath, 'utf8')

// Update the appVersion in nuxt.config.ts
const versionRegex = /appVersion:\s*['"`][^'"`]*['"`]/g
nuxtConfig = nuxtConfig.replace(versionRegex, `appVersion: '${version}'`)

// Write back to nuxt.config.ts
writeFileSync(nuxtConfigPath, nuxtConfig)

console.log(`✅ Synced version ${version} from package.json to nuxt.config.ts`) 