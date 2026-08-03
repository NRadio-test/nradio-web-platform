# 鲲鹏无限 NRadio 知识库

本文件由 `knowledge-base/import/knowledge.jsonl` 自动生成，共 14 条知识。每条内容都保留来源、上传者、核对日期和检索标签，适合直接上传到 AstrBot 知识库。

使用时应严格依据检索到的知识回答；资料没有提供的信息不要猜测。动态内容按条目中的日期、型号和适用条件理解。

## 马野 C2000MAX 刷机包的内容与作者

这套资料由马野整理，原目录名为“C2000MAX - 刷最新OP教程加挂载TF卡空间”。包内包含刷机说明 TXT、Rufus、DiskGenius Pro、1 张 Rufus 操作图、3 段操作视频，以及 `nradio_c2000-max-SD_0305.img`。知识条目基于对这些本地文件和镜像根文件系统的只读分析，不代表 OpenWrt 或 ImmortalWrt 官方发布。

标签：C2000MAX、马野、刷机包、来源
来源：local-source://C2000MAX-MaYe-package

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/278219b3-bb14-43db-a73c-a1c6c82dfd1c-c2000max-maye-part-01-of-03.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：C2000MAX、马野、刷机包、来源

## C2000MAX 刷 TF 卡的完整顺序

马野说明的顺序是：先在 C2000MAX 官方系统中把 SD 卡启动优先级保存；用 Rufus 等镜像写入工具把 `nradio_c2000-max-SD_0305.img` 整盘写入 TF 卡；在 Windows DiskGenius 中把镜像之后的未分配空间新建并格式化为 ext4；把卡插回 C2000MAX 后上电；等待 5700 模组自动重启一次且 MAX 主机也重启一次；登录 192.168.7.1 后进入“系统→备份/升级”执行重置，并等待重置和再次重启完成。

标签：C2000MAX、刷机、TF卡、Rufus、DiskGenius、步骤
来源：local-source://C2000MAX-MaYe-package

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/278219b3-bb14-43db-a73c-a1c6c82dfd1c-c2000max-maye-part-01-of-03.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：C2000MAX、刷机、TF卡、Rufus、DiskGenius、步骤

## C2000MAX 必须先保存 SD 启动优先级

教程第一步发生在设备的官方系统：进入启动相关设置，把 SD/TF 卡设为优先启动并保存。视频显示的是 C2000 MAX 原系统的启动项界面。若未保存，设备可能仍从内部存储启动，看起来像刷卡失败；这时应先确认实际启动介质，而不是反复重写 TF 卡。

标签：C2000MAX、SD启动、官方系统、启动项
来源：local-source://C2000MAX-MaYe-package

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/278219b3-bb14-43db-a73c-a1c6c82dfd1c-c2000max-maye-part-01-of-03.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：C2000MAX、SD启动、官方系统、启动项

## Rufus 写入的是整盘镜像而不是复制文件

Rufus 中要选中正确的 TF 卡设备，再选择以 `mwrt`/本包镜像结尾的 `.img` 文件并开始写入。写盘会覆盖目标卡的 GPT 和分区，不能把 img 当普通文件复制进现有分区。操作前按容量和设备名再次确认目标卡，防止误覆盖电脑磁盘。

标签：C2000MAX、Rufus、img、整盘写入、数据清除
来源：local-source://C2000MAX-MaYe-package

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/278219b3-bb14-43db-a73c-a1c6c82dfd1c-c2000max-maye-part-01-of-03.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：C2000MAX、Rufus、img、整盘写入、数据清除

## C2000MAX 镜像的 GPT 分区布局

对镜像 GPT 只读解析得到 6 个分区：bl2（LBA 1024–8191，3.5MiB）、u-boot-env（8192–9215，512KiB）、factory（9216–17407，4MiB）、fip（17408–21503，2MiB）、kernel（21504–87039，32MiB）和 rootfs（87040–496639，200MiB）。镜像文件仅写入了 rootfs 的已用前段，因此写入大容量 TF 后会留下可再分区的尾部空间。不要修改 bl2、u-boot-env、factory 或 fip。

标签：C2000MAX、GPT、bl2、u-boot、factory、fip、kernel、rootfs
来源：local-source://C2000MAX-MaYe-package

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/278219b3-bb14-43db-a73c-a1c6c82dfd1c-c2000max-maye-part-01-of-03.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：C2000MAX、GPT、bl2、u-boot、factory、fip、kernel、rootfs

## C2000MAX rootfs 的格式和构建时间

rootfs 分区开头是 SquashFS 4.0，小端、XZ 压缩、262144 字节块，文件系统创建时间为 2026-03-03 09:17:40（时间来自镜像元数据）。根文件系统约 36.65MB、3512 个 inode；镜像 SHA-256 为 `f20a5011856d163233dd3b3fc4f1c30a59b544841ff09a09ffc7fff5fc208efd`。这些信息可用于确认用户是否拿到同一版镜像。

标签：C2000MAX、SquashFS、SHA256、固件版本
来源：local-source://C2000MAX-MaYe-package

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/278219b3-bb14-43db-a73c-a1c6c82dfd1c-c2000max-maye-part-01-of-03.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：C2000MAX、SquashFS、SHA256、固件版本

## C2000MAX 固件的真实发行版身份

镜像不是 OpenWrt 官方固件，而是 `xshark by ImmortalWrt 24.10-SNAPSHOT r33422+3-bf62ca2211`，target 为 `mediatek/filogic`，架构 `aarch64_cortex-a53`，内核 Linux 6.6.94。它带 `no-all override` taint，并含第三方/定制组件。回答软件安装与升级问题时必须按 ImmortalWrt 24.10 snapshot 和本镜像 ABI 处理，不能套用 OpenWrt 25.12 的 apk 命令。

标签：C2000MAX、ImmortalWrt、24.10、Linux6.6.94、mediatek、filogic
来源：local-source://C2000MAX-MaYe-package

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/278219b3-bb14-43db-a73c-a1c6c82dfd1c-c2000max-maye-part-01-of-03.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：C2000MAX、ImmortalWrt、24.10、Linux6.6.94、mediatek、filogic

## C2000MAX 的设备树和启动参数

kernel FIT 内含 `nradio,c2000-max` 设备树，型号字符串为 `NRadio C2000-MAX`，启动参数使用 `root=PARTLABEL=rootfs rootwait`，说明系统按 GPT 分区标签查找 rootfs 并等待块设备出现。kernel 分区是 ARM64 FIT，包含 Linux 6.6.94 和专用设备树；随意改 rootfs 分区标签可能导致无法启动。

标签：C2000MAX、设备树、FIT、PARTLABEL、rootfs
来源：local-source://C2000MAX-MaYe-package

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/26050dfe-e00b-4055-820a-5266b9a9d9c9-c2000max-maye-part-02-of-03.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：C2000MAX、设备树、FIT、PARTLABEL、rootfs

## C2000MAX 默认管理地址和密码

马野教程明确给出管理 IP 为 `192.168.7.1`、Wi‑Fi 密码为 `admin`。只读检查 `/etc/shadow` 还确认 root 密码哈希与明文 `admin` 完全匹配，因此 LuCI/SSH 默认 root 密码也是 admin。首次登录后必须立即更换管理密码和 Wi‑Fi 密码，避免在不可信网络暴露。

标签：C2000MAX、192.168.7.1、admin、默认密码、安全
来源：local-source://C2000MAX-MaYe-package

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/26050dfe-e00b-4055-820a-5266b9a9d9c9-c2000max-maye-part-02-of-03.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：C2000MAX、192.168.7.1、admin、默认密码、安全

## C2000MAX 首次启动会有额外自动重启

镜像 `/etc/rc.local` 会检查 `/etc/modules.d/66-mt7993`；若不存在，等待 30 秒、写入 `mt7993` 模块项并重启。这与教程提示的 5700 模组重启一次、MAX 主机重启一次相吻合。首次上电过程中不要过早断电，至少等设备完成自动重启、网络和无线稳定后再操作。

标签：C2000MAX、mt7993、自动重启、5700、首次启动
来源：local-source://C2000MAX-MaYe-package

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/26050dfe-e00b-4055-820a-5266b9a9d9c9-c2000max-maye-part-02-of-03.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：C2000MAX、mt7993、自动重启、5700、首次启动

## C2000MAX 首次启动后为何要求执行重置

教程要求首次成功进入系统后，在“系统→备份/升级”执行重置并等待重启。该步骤会重新初始化 overlay/UCI 默认配置，使本机硬件探测、无线配置和首次启动脚本以干净状态落盘。执行重置会清除用户刚做的设置，因此不要在此步骤前投入正式配置；如果设备已有要保留的数据，应先备份。

标签：C2000MAX、重置、overlay、首次启动
来源：local-source://C2000MAX-MaYe-package

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/26050dfe-e00b-4055-820a-5266b9a9d9c9-c2000max-maye-part-02-of-03.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：C2000MAX、重置、overlay、首次启动

## C2000MAX 升级不能只在 LuCI 上传固件

马野特别注明，升级该 OP 固件必须重复原步骤 2、3、4：重新把完整 img 写入 TF、重新处理 TF 尾部空间并按完整首次启动过程等待自动重启。虽然镜像的 platform 脚本含 `nradio,c2000-max` 的 eMMC sysupgrade 路径，但本教程分发的是整盘 SD 镜像，不能据此假定任意 LuCI sysupgrade 都安全。升级前备份配置并以作者的新版本说明为准。

标签：C2000MAX、升级、LuCI、sysupgrade、重刷TF
来源：local-source://C2000MAX-MaYe-package

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/26050dfe-e00b-4055-820a-5266b9a9d9c9-c2000max-maye-part-02-of-03.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：C2000MAX、升级、LuCI、sysupgrade、重刷TF

## TF 尾部 ext4 分区只是额外存储，不自动扩展 overlay

教程让用户用 DiskGenius 把 TF 卡剩余空间格式化为 ext4。镜像预装 `block-mount`，fstab 全局开启 `anon_mount=1` 和 `auto_mount=1`，因此新分区会被自动挂载成额外存储；但现有 fstab 没有把它指定为 `/overlay`，所以它不会自动增加安装软件包的空间。若目标是系统扩容，需要另做 extroot 配置；若只用于文件、日志或下载，普通挂载即可。

标签：C2000MAX、TF扩容、ext4、anon_mount、extroot、overlay
来源：local-source://C2000MAX-MaYe-package

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/26050dfe-e00b-4055-820a-5266b9a9d9c9-c2000max-maye-part-02-of-03.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：C2000MAX、TF扩容、ext4、anon_mount、extroot、overlay

## C2000MAX 存储支持与注意事项

镜像预装 block-mount、fdisk、parted、e2fsprogs、dosfstools、F2FS、exFAT、NTFS3、btrfs 与 USB/UAS 存储驱动，适合识别多种外置介质。TF 卡长期承载日志、代理数据库或 extroot 会产生持续写入，应选高耐久卡并保留配置备份。磁盘操作优先按 UUID 配置，避免设备名变化。

标签：C2000MAX、存储、block-mount、ext4、F2FS、NTFS、btrfs
来源：local-source://C2000MAX-MaYe-package

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/26050dfe-e00b-4055-820a-5266b9a9d9c9-c2000max-maye-part-02-of-03.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：C2000MAX、存储、block-mount、ext4、F2FS、NTFS、btrfs
