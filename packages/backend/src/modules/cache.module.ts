import { CacheModule as DefaultCacheModule, Global, Module } from '@nestjs/common';

@Global()
@Module({
    imports: [DefaultCacheModule.register()],
    exports: [DefaultCacheModule],
})
export class CacheModule {
}
