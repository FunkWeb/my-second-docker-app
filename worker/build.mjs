import {build} from 'esbuild';

await build({
    entryPoints: [
        'src/index.ts',
        'src/healthcheck.ts'
    ],
    outdir: 'dist',
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'node22',
    minify: true,
    sourcemap: false,
    external: ['bullmq', 'ioredis', 'pg', 'pino']
});