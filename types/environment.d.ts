declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'none'
    readonly MYAPP_GITHUB_TOKEN: string
  }
}
