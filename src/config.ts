export interface ServerConfig {
    port: number
    bcryptHashSalt: number
    serverSecret: string
}

export interface DatabaseConfig {
    host?: string
    port?: number
    dbname?: string
    username?: string
    password?: string
}

export interface RedisConfig {
    host?: string
    port?: number
    password?: string
}

let cachedConfig: ServerConfig | undefined = undefined;

/**
 * Returns the server configuration settings
 * @returns The server configuration settings
 */
export function getConfig(): ServerConfig {
    if (!cachedConfig) {
        throw new Error('config not loaded')
    }

    return cachedConfig
}

export function loadConfig(): ServerConfig {
    const config: Record<string, any> = {}

    for (const [name, value] of Object.entries(process.env)) {
        let key = name
        let currConfig = config

        if (key.startsWith('DATABASE_')) {
            key = key.substring('DATABASE_'.length)
            currConfig = config.database = config.database ?? {}
        } else if (key.startsWith('REDIS_')) {
            key = key.substring('REDIS_'.length)
            currConfig = config.redis = config.redis ?? {}
        }

        //covert key from CAPITAL_CASE to camelCase
        key = key.toLowerCase().replace(/_([a-z])/g, (g) => g[1].toUpperCase());

        if (isIntegerConfig(key)) {
            currConfig[key] = parseInt(value ?? '', 10)
        } else {
            currConfig[key] = value
        }
    }

    cachedConfig = config as ServerConfig

    return config as ServerConfig
}

function isIntegerConfig(key: string): boolean {
    return key === 'port'
}