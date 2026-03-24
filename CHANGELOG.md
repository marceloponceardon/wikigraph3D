# Changelog

## [1.1.3](https://github.com/marsponce/wikigraph3D/compare/v1.1.2...v1.1.3) (2026-03-24)


### Bug Fixes

* **api:** add service role auth check in supabase, added secret key use to server client ([ab80a1a](https://github.com/marsponce/wikigraph3D/commit/ab80a1ad8bbc6d94b1f7cf3f604e02f3dc03d3bf))
* **articlecard:** fix redirect links not working ([a741f49](https://github.com/marsponce/wikigraph3D/commit/a741f491719215913cd2287b85420a4f917ee1a1))
* **articlecard:** remove maxage 1 left behind from development ([4a0d994](https://github.com/marsponce/wikigraph3D/commit/4a0d9947e28c3ca76fa3faf0576766767786a5c0))
* fix infinite recursion on disconnect, reword toasts ([2be5af2](https://github.com/marsponce/wikigraph3D/commit/2be5af21c73c3d41d2ada405b22948700a87cf72))
* **graph:** fix white links bug for first client to load aotd ([2a9ed4f](https://github.com/marsponce/wikigraph3D/commit/2a9ed4f729d95b7012bd9783e45d923473eb3d9b))
* **graphRealtime:** fix crashing app when realtime is unavailable ([3ffba7f](https://github.com/marsponce/wikigraph3D/commit/3ffba7fb5084a03aa3ddf4cfee5e62197abced5b))
* refactor to fix infinite loop ([ef4bc80](https://github.com/marsponce/wikigraph3D/commit/ef4bc80333efe437e299975441d9872f20c2796d))
* **sidebar:** hide sidebar mode toggle button on mobile ([1245c38](https://github.com/marsponce/wikigraph3D/commit/1245c3852cde0197111bd2b0217eaa3ec103b661))
* **supabase:** usecallback on realtimetoast, added cookieless callback ([f8d59a6](https://github.com/marsponce/wikigraph3D/commit/f8d59a60260f4128f4a2e0eb9e97170771ef783c))

## [1.1.2](https://github.com/marsponce/wikigraph3D/compare/v1.1.1...v1.1.2) (2026-03-23)


### Bug Fixes

* **layout.tsx:** fix typo in name of logo svg ([68c446a](https://github.com/marsponce/wikigraph3D/commit/68c446a47b52d8cb6dfba2d9af290ebea4cf43be))

## [1.1.1](https://github.com/marsponce/wikigraph3D/compare/v1.1.0...v1.1.1) (2026-03-23)


### Bug Fixes

* **articlecard.css:** fix image messing with header ([13610d6](https://github.com/marsponce/wikigraph3D/commit/13610d61fe5aabadf6064f2c9874754a6b9b866e))
* **articlecard.css:** fix non centering of images in infobox table ([cf58748](https://github.com/marsponce/wikigraph3D/commit/cf58748965fd5312c35d39db9dbe5a5e797861e2))
* **articlecard.tsx:** visually center loading and no node messges, clean unused styling ([f903430](https://github.com/marsponce/wikigraph3D/commit/f9034304650c8f498c65e2c96afab0940b973e9b))
* **button:** define button size in px for consistency ([641d209](https://github.com/marsponce/wikigraph3D/commit/641d20928a79f4ccf0573e959aa25d6c77ece4d6))
* **navbar:** fix home page opening up in new tab ([eef3f42](https://github.com/marsponce/wikigraph3D/commit/eef3f4230c6fc77b0b70b40d0a9b4ae6bbf1ab5b))
* **searchbar:** remove container width replace with w-full, change to text-xl ([bd8b6f3](https://github.com/marsponce/wikigraph3D/commit/bd8b6f3259d62727a29a9fef2a7ab8fe6a671020))

## [1.1.0](https://github.com/marsponce/wikigraph3D/compare/v1.0.0...v1.1.0) (2026-03-04)


### Features

* **tutorial:** implement useTutorial hook for reusable tutorial for new users ([dda9cae](https://github.com/marsponce/wikigraph3D/commit/dda9caeb1c5d9b97bdfbdcbea06bc34691314d70))


### Bug Fixes

* **tutorial:** implement pr suggestions ([14ae4fa](https://github.com/marsponce/wikigraph3D/commit/14ae4fa85c7e1fcfe37650449f2c30a112fa536e))
* **tutorial:** prevent clicking on overlay to exit tutorial, maintain close tutorial button ([28a63b6](https://github.com/marsponce/wikigraph3D/commit/28a63b6e72179c04d69a3567ab2aceadd9f3f3d8))

## 1.0.0 (2026-02-27)


### Features

* **graph:** add real-time sync via supabase subscription hook ([ef04f1e](https://github.com/marsponce/wikigraph3D/commit/ef04f1e6dfd9abefaabdc45e03f087cb09dde8fc))


### Bug Fixes

* **articlecard:** fix existing node links not showing up ([0654df8](https://github.com/marsponce/wikigraph3D/commit/0654df8b138463f89e5ace6984a6eb365ade311d))
* **articlecard:** links with a non starting '#' load properly ([e51875f](https://github.com/marsponce/wikigraph3D/commit/e51875f51b4d6542d26703bab319bfe323b44a94))
* **graph:** prevent duplicate links and select existing nodes on click ([ab03f50](https://github.com/marsponce/wikigraph3D/commit/ab03f5004a784b9a7b3436121608964d50088e2c))
* **graphRealtime:** add duplicate links check in hook ([864f417](https://github.com/marsponce/wikigraph3D/commit/864f417fb40c2d7019fb3f38da92e482bf6488cb))
