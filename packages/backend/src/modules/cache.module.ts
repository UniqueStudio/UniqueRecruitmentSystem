import { CacheModule as DefaultCacheModule, Module } from '@nestjs/common';

@Module({
    imports: [DefaultCacheModule.register()],
    exports: [DefaultCacheModule],
})
export class CacheModule {
}
