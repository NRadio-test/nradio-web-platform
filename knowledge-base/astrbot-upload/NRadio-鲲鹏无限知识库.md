# 鲲鹏无限 NRadio 知识库

本文件由 `knowledge-base/import/knowledge.jsonl` 自动生成，共 113 条知识。每条内容都保留来源、上传者、核对日期和检索标签，适合直接上传到 AstrBot 知识库。

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

## C2000MAX 默认网络把 eth1 和 hnat 放在 LAN

设备专用 /etc/board.d/02_network 对 nradio,c2000-max 执行 ucidef_set_interface_lan "eth1 hnat"，没有在该分支创建标准 WAN。说明这份镜像的默认端口/硬件 NAT 拓扑与普通多口路由器不同，可能由蜂窝模组或后续脚本创建上联。排障时先看 ubus call network.interface dump 和实际拨号接口，不要假设 eth0/wan 就是互联网出口。来源：local-source://C2000MAX-MaYe-package；作者：马野。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/043fe34d-ee51-49eb-aec0-abc970566032-c2000max-maye-part-03-of-03.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：C2000MAX、eth1、hnat、LAN、网络、拨号

## C2000MAX 防火墙和加速默认值

固件基于 firewall4：lan zone 的 input/output/forward 均 ACCEPT，wan zone input/forward REJECT、output ACCEPT，并启用 IPv4 masquerade 与 mtu_fix。配置中 fullcone=1，软件和硬件 flow offloading 默认均为 0；同时预装 MediaTek HNAT、WED、TurboACC、MTK HQoS/eQoS。加速、代理、统计和 SQM/限速可能互相影响，性能排障时应一次只启用一种路径并记录 nft/route 状态。来源：local-source://C2000MAX-MaYe-package；作者：马野。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/043fe34d-ee51-49eb-aec0-abc970566032-c2000max-maye-part-03-of-03.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：C2000MAX、firewall4、fullcone、HNAT、WED、TurboACC

## C2000MAX 无线驱动与默认生成逻辑

镜像同时含 kmod-mt7993、kmod-mt_wifi7 和厂商 mtwifi 配置层。mtwifi 默认生成脚本会为 2.4G/5G/6G 设置 ImmortalWrt SSID、US 国家码、100% txpower，5G/6G 使用 EHT160，初始生成逻辑的 encryption 为 none；但马野教程称实机 Wi-Fi 密码为 admin，说明首次启动或设备环境还有覆盖。以实机 /etc/config/wireless 为准，并把 country 改为实际使用国家/地区。来源：local-source://C2000MAX-MaYe-package；作者：马野。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/043fe34d-ee51-49eb-aec0-abc970566032-c2000max-maye-part-03-of-03.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：C2000MAX、mt7993、WiFi7、EHT160、无线、配置

## C2000MAX 预装的蜂窝与代理组件

镜像预装 qmodem-next、ubus-at-daemon、at-webserver、quectel-CM-5G-M、QMI/MBIM/NCM/RNDIS/串口驱动、MHI/PCIe 驱动、短信转发；也预装 sing-box 与 HomeProxy。它适合蜂窝模组管理和代理分流，但 qmodem、quectel-CM、ModemManager 类工具不应同时抢占同一模组；HomeProxy/sing-box、PBR、mwan 与硬件加速并用时要检查 mark 和路由表。来源：local-source://C2000MAX-MaYe-package；作者：马野。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/043fe34d-ee51-49eb-aec0-abc970566032-c2000max-maye-part-03-of-03.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：C2000MAX、5G、qmodem、QMI、MBIM、MHI、HomeProxy、sing-box

## C2000MAX 默认启用的管理服务风险

镜像默认启用 Dropbear、uhttpd、ttyd、SFTP、at-webserver、ubus-at-daemon 等服务。Dropbear 绑定 lan，允许密码和 root 密码登录；uhttpd 同时监听 80/443，但 redirect_https=0；root 默认密码是 admin。虽然标准防火墙不允许 WAN input，若用户把蜂窝/上联误并入 lan 或修改 zone，管理服务可能暴露。建议改强密码、关闭不用的 ttyd/AT Web/SFTP，并启用 HTTPS 管理。来源：local-source://C2000MAX-MaYe-package；作者：马野。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/043fe34d-ee51-49eb-aec0-abc970566032-c2000max-maye-part-03-of-03.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：C2000MAX、Dropbear、ttyd、uhttpd、默认服务、安全

## C2000MAX 软件源与内核模块版本风险

固件的 distfeeds 原始地址指向 ImmortalWrt 24.10-SNAPSHOT，首次启动的中文默认脚本会把域名替换为 https://mirrors.vsean.net/openwrt。snapshot 仓库会滚动，而本镜像内核固定为 6.6.94；较新的仓库已经出现不同内核 ABI，因此后续安装 kmod 很可能报 kernel dependency mismatch。不要强装，应使用与镜像同批的软件源/包缓存，或重刷作者提供的完整新镜像。来源：local-source://C2000MAX-MaYe-package；作者：马野。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/043fe34d-ee51-49eb-aec0-abc970566032-c2000max-maye-part-03-of-03.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：C2000MAX、opkg、软件源、snapshot、kmod、ABI

## C2000MAX 镜像内可验证的文件哈希

本地包关键 SHA-256：镜像 f20a5011856d163233dd3b3fc4f1c30a59b544841ff09a09ffc7fff5fc208efd；刷机说明 dd2f987bca38faaed87d55bf6b5edc822f3c653f25978f5dd3362970774d5251；Rufus.exe abbf04d50a44a9612c027fc8072f6da67f5bcda2b826f1f852c9c24d7a1fcdff；DiskGenius EXE 736cda5b2775ef1e9b3c1aca74c6bb2adfe737d001dcd935bcbe8ee62958ebbb。哈希只能确认文件一致，不能替代对第三方可执行文件的信任与安全扫描。来源：local-source://C2000MAX-MaYe-package；作者：马野。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/043fe34d-ee51-49eb-aec0-abc970566032-c2000max-maye-part-03-of-03.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：C2000MAX、SHA256、Rufus、DiskGenius、完整性

## 鲲鹏无限公司与品牌

鲲鹏无限的公司主体为深圳鲲鹏无限科技有限公司，品牌英文名为 NRadio。官方帮助中心称公司创立于 2016 年，是国家高新技术企业和深圳专精特新企业，定位为 5G 无线宽带产品专业厂商。

原条目 ID：company-001
来源：https://help.nradiowifi.com/
来源类型：official_help
原上传者：FallaxAura
核验日期：2026-07-30
可信度：high
标签：公司、品牌、NRadio、鲲鹏无限

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/d0b56767-711e-4de2-b934-1035c578a401-nradio-legacy-part-01-of-04.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：公司、品牌、NRadio、鲲鹏无限

## 鲲鹏无限团队与创始人介绍

官方帮助中心称，鲲鹏无限核心团队成员来自 TP-LINK、华为、中兴、极路由等通信品牌厂商；创始人张利鹏毕业于清华大学计算机系，并在通信行业深耕十年以上。

原条目 ID：company-002
来源：https://help.nradiowifi.com/
来源类型：official_help
原上传者：FallaxAura
核验日期：2026-07-30
可信度：high
标签：创始人、张利鹏、团队、公司介绍

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/d0b56767-711e-4de2-b934-1035c578a401-nradio-legacy-part-01-of-04.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：创始人、张利鹏、团队、公司介绍

## 鲲鹏无限主要业务

鲲鹏无限主要提供 4G 和 5G 无线宽带产品，覆盖便携旅行和固定上网两类形态，强调无需铺设传统有线宽带、部署灵活和随用随开。

原条目 ID：company-003
来源：https://help.nradiowifi.com/
来源类型：official_help
原上传者：FallaxAura
核验日期：2026-07-30
可信度：high
标签：业务、无线宽带、5G CPE、免拉线

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/d0b56767-711e-4de2-b934-1035c578a401-nradio-legacy-part-01-of-04.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：业务、无线宽带、5G CPE、免拉线

## 鲲鹏无限官网产品分类

官网产品中心在 2026 年 7 月 30 日可见的产品类别包括 5G CPE、5G RedCap、全球漫游和高密度 WiFi。选型时应结合完整型号、使用地区、运营商、移动或固定场景、终端数量、网口及供电需求。

原条目 ID：product-001
来源：https://www.nradiowifi.com/chanpin/
来源类型：official_web
原上传者：FallaxAura
核验日期：2026-07-30
可信度：high
标签：产品中心、产品分类、选型

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/d0b56767-711e-4de2-b934-1035c578a401-nradio-legacy-part-01-of-04.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：产品中心、产品分类、选型

## C8 系列代表型号

官网在 2026 年 7 月 30 日可见的 C8 系列代表型号包括 C8-788、C8-618、C8-668GL 和 C8-688。相近名称可能对应不同芯片、地区版本、卡槽、频段或接口，回答参数时必须使用完整型号后缀。

原条目 ID：product-002
来源：https://www.nradiowifi.com/chanpin/fengwozuwang/
来源类型：official_web
原上传者：FallaxAura
核验日期：2026-07-30
可信度：high
标签：5G CPE、C8-788、C8-618、C8-668GL、C8-688

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/d0b56767-711e-4de2-b934-1035c578a401-nradio-legacy-part-01-of-04.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：5G CPE、C8-788、C8-618、C8-668GL、C8-688

## C2000 与 C5800 系列代表型号

官网在 2026 年 7 月 30 日可见 C2000 MAX、C2000-518、C2000-500、C5800-668GL、C5800-688 和 C5800-650。C2000 系列包含 Mini 5G CPE，C5800 系列包含企业级四卡槽 5G CPE；不同后缀的芯片和配置不可混用。

原条目 ID：product-003
来源：https://www.nradiowifi.com/chanpin/fengwozuwang/
来源类型：official_web
原上传者：FallaxAura
核验日期：2026-07-30
可信度：high
标签：5G CPE、C2000 MAX、C2000、C5800、企业网络

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/d0b56767-711e-4de2-b934-1035c578a401-nradio-legacy-part-01-of-04.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：5G CPE、C2000 MAX、C2000、C5800、企业网络

## NBCPE、NBPCE 与户外版代表型号

官网在 2026 年 7 月 30 日可见 NBCPE-668GL、NBPCE-688、NBPCE-650 等 NB68 与 AK68 组合形态，以及 AK68-788 户外版。不同组合和后缀对应的地区、芯片或配置不同，不能视为同一型号。原条目 ID：product-004；来源：https://www.nradiowifi.com/chanpin/fengwozuwang/；来源类型：official_web；原上传者：FallaxAura；核验日期：2026-07-30；可信度：high；标签：NBCPE、NBPCE、NB68、AK68、户外CPE。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/a98a89a2-27e4-41ff-9a8f-8efb81cf8042-nradio-legacy-part-02-of-04.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：NBCPE、NBPCE、NB68、AK68、户外CPE、型号区别、官网产品

## RedCap、Nano CPE 与随身 WiFi 型号

官网在 2026 年 7 月 30 日可见 A8-510 RedCap 5G 移动路由器 CPE、DD-510 Nano 5G CPE、CC-500 与 CC-500 Pro 随身 WiFi，以及 TT-500、TK-500 随身快充 WiFi。原条目 ID：product-005；来源：https://www.nradiowifi.com/chanpin/qiyezuwang/1/；来源类型：official_web；原上传者：FallaxAura；核验日期：2026-07-30；可信度：high；标签：RedCap、A8-510、DD-510、随身WiFi、便携。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/a98a89a2-27e4-41ff-9a8f-8efb81cf8042-nradio-legacy-part-02-of-04.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：RedCap、A8-510、DD-510、随身WiFi、便携、CC-500、TT-500、TK-500、官网产品

## 全球漫游与高密度 WiFi 产品

官网在 2026 年 7 月 30 日可见 CC-100GL、TT-100GL、TK-100GL 等全球漫游便携产品，以及 E2000-R 高密度无线接入点和 N6700 AX6000 Wi-Fi 6 四频缓存路由器。全球漫游的实际国家、频段、运营商、套餐和资费应按具体型号及当前服务说明确认。原条目 ID：product-006；来源：https://www.nradiowifi.com/chanpin/；来源类型：official_web；原上传者：FallaxAura；核验日期：2026-07-30；可信度：high；标签：全球漫游、高密度WiFi、CC-100GL、E2000-R、N6700。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/a98a89a2-27e4-41ff-9a8f-8efb81cf8042-nradio-legacy-part-02-of-04.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：全球漫游、高密度WiFi、CC-100GL、E2000-R、N6700、AX6000、Wi-Fi 6、官网产品

## 张导严选小店抖音账号

用户提供的短链接解析为“张导严选小店”，抖音号为 70326957594，页面标注为店铺账号，IP 属地广东。该账号可作为选品与交易入口；价格、库存、优惠、发货和售后以当前商品页及订单页面显示为准。原条目 ID：account-001；来源：https://v.douyin.com/IPb2vXHhDqs/；来源类型：douyin_profile；原上传者：FallaxAura；核验日期：2026-07-30；可信度：medium_high；标签：抖音、张导严选小店、店铺、购买渠道。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/a98a89a2-27e4-41ff-9a8f-8efb81cf8042-nradio-legacy-part-02-of-04.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：抖音、张导严选小店、店铺、购买渠道、抖音号70326957594、IP属地广东

## 鲲鹏张导抖音账号

用户提供的短链接解析为“鲲鹏张导”，抖音号为 kpzd，IP 属地广东。核对时的公开简介为“鲲鹏CEO张导：清华本硕｜新疆放羊娃”，账号内容围绕 5G 免拉线网络、产品和使用场景展开。原条目 ID：account-002；来源：https://v.douyin.com/SkNGZ72_cAs/；来源类型：douyin_profile；原上传者：FallaxAura；核验日期：2026-07-30；可信度：medium_high；标签：抖音、鲲鹏张导、张导、kpzd。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/a98a89a2-27e4-41ff-9a8f-8efb81cf8042-nradio-legacy-part-02-of-04.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：抖音、鲲鹏张导、张导、kpzd、CEO、5G免拉线

## 鲲鹏张导公开视频内容主题

公开可检索作品涉及 NBCPE、C2000 MAX、DD 等产品在车辆、房车、偏远作业区、展会直播、人群密集场所和租房场景中的应用，也包括信号寻找、设备对比、产品拆解、刷机和用户共创。具体视频中的测速、信号或场景效果对应当时的设备、位置和网络条件。原条目 ID：content-001；来源：https://jingxuan.douyin.com/m/video/7632271688436043059；来源类型：douyin_video；原上传者：FallaxAura；核验日期：2026-07-30；可信度：medium；标签：使用场景、NBCPE、C2000 MAX、DD、公开视频。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/a98a89a2-27e4-41ff-9a8f-8efb81cf8042-nradio-legacy-part-02-of-04.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：使用场景、NBCPE、C2000 MAX、DD、公开视频、抖音、车辆、房车、偏远作业区、展会直播、人群密集、租房

## C8-660 开放刷机信息

鲲鹏张导的公开视频曾介绍 C8-660 的开放刷机和社区共创策略，并邀请开源社区参与适配。这项信息针对 C8-660 及视频发布时的策略；其他型号是否支持刷机，应根据对应硬件版本和当前固件资料确认。原条目 ID：policy-001；来源：https://jingxuan.douyin.com/m/video/7298330506465119551；来源类型：douyin_video；原上传者：FallaxAura；核验日期：2026-07-30；可信度：medium。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/89617f5d-a85b-4a2f-a3b2-af8a5a8b5189-nradio-legacy-part-03-of-04.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：C8-660、开放刷机、开源、社区共创

## 什么是 5G CPE

5G CPE 接收运营商的 5G 或 4G 蜂窝网络，再通过 WiFi 或网口为手机、电脑、摄像头等终端提供网络。它适合不方便安装有线宽带、需要临时网络、经常移动或希望快速部署网络的场景。原条目 ID：faq-001；来源：https://help.nradiowifi.com/；来源类型：official_help；原上传者：FallaxAura；核验日期：2026-07-30；可信度：high。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/89617f5d-a85b-4a2f-a3b2-af8a5a8b5189-nradio-legacy-part-03-of-04.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：FAQ、5G CPE、原理、无线宽带

## 5G CPE 选型前需要确认的信息

推荐 5G CPE 前，应确认使用国家、城市和具体区域，运营商与 SIM 卡套餐，固定或移动使用，室内或户外，同时接入设备数，以及是否需要 2.5G 网口、双卡或多卡、全球漫游、电池、快充、外置天线、户外安装或开放刷机，并了解预算范围。原条目 ID：faq-002；来源：https://www.nradiowifi.com/chanpin/；来源类型：official_web；原上传者：FallaxAura；核验日期：2026-07-30；可信度：high。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/89617f5d-a85b-4a2f-a3b2-af8a5a8b5189-nradio-legacy-part-03-of-04.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：FAQ、选型、需求收集、导购

## 鲲鹏产品可能适用的场景

官网与鲲鹏张导的公开视频涉及家庭或出租屋免拉线宽带、车辆和房车网络、展会或户外直播、偏远作业区、旅行随身网络和企业多终端接入。实际选型需要结合所在地信号、运营商、终端数、移动性、接口、天线和供电条件。原条目 ID：faq-003；来源：https://www.nradiowifi.com/chanpin/；来源类型：official_web；原上传者：FallaxAura；核验日期：2026-07-30；可信度：medium_high。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/89617f5d-a85b-4a2f-a3b2-af8a5a8b5189-nradio-legacy-part-03-of-04.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：FAQ、使用场景、家庭网络、房车、直播、企业网络

## 同一地点不同设备速度不同的原因

同一地点的不同设备可能因蜂窝频段和载波聚合能力、芯片与天线设计、SIM 卡套餐或限速策略、连接基站、设备摆放遮挡以及测试时网络拥塞程度不同而出现速度差异。公平比较应尽量使用同一 SIM 卡、同一位置、相近时间和同一测速服务器。原条目 ID：faq-004；来源：https://help.nradiowifi.com/；来源类型：official_help；原上传者：FallaxAura；核验日期：2026-07-30；可信度：medium_high。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/89617f5d-a85b-4a2f-a3b2-af8a5a8b5189-nradio-legacy-part-03-of-04.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：FAQ、测速、信号、速度差异、排障

## 免拉线宽带与有线宽带的区别

免拉线宽带的主要优势是部署灵活，实际速度和稳定性会随信号、基站容量、蜂窝频段、套餐和环境变化。有线宽带通常更稳定；选择哪种方案应结合安装条件、移动需求、成本和当地网络质量。原条目 ID：faq-005；来源：https://help.nradiowifi.com/；来源类型：official_help；原上传者：FallaxAura；核验日期：2026-07-30；可信度：high。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/89617f5d-a85b-4a2f-a3b2-af8a5a8b5189-nradio-legacy-part-03-of-04.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：FAQ、免拉线、有线宽带、稳定性

## 全球旅行多达 165 个国家的含义

官方帮助中心使用过“海外旅行商务多达 165 个国家可以做到开机就上网”的宣传表述。具体可用国家、蜂窝频段、合作运营商、漫游套餐、资费和公平使用规则会随产品及服务变化，出行前应按目的地和完整型号查看最新说明。
原条目 ID：faq-006
来源：https://help.nradiowifi.com/
来源类型：official_help
原上传者：FallaxAura
核验日期：2026-07-30
可信度：high

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/311a1b7b-2de7-4281-b24d-e1bfa350b5ee-nradio-legacy-part-04-of-04.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：FAQ、全球漫游、165个国家、旅行网络

## 价格、库存和活动信息怎么确认

产品价格、库存、优惠、发货时间和活动规则应以查询当时的官网商城、官方店铺、直播间或订单页面为准。历史视频中的粉丝价、首发价和限时活动只代表当时信息。
原条目 ID：faq-007
来源：https://v.douyin.com/IPb2vXHhDqs/
来源类型：douyin_profile
原上传者：FallaxAura
核验日期：2026-07-30
可信度：medium_high

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/311a1b7b-2de7-4281-b24d-e1bfa350b5ee-nradio-legacy-part-04-of-04.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：FAQ、价格、库存、活动、发货

## 产品参数、图片和测试数据的适用条件

官网说明产品图片、软件界面和实验室数据可能因产品版本、批次、生产供应、软件版本、使用条件和环境不同而变化，最终以实物和实际使用情况为准。回答具体参数时应使用完整型号和对应资料，不能用相近型号的数据代替。
原条目 ID：risk-001
来源：https://www.nradiowifi.com/article/207.html
来源类型：official_web
原上传者：FallaxAura
核验日期：2026-07-30
可信度：high

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/311a1b7b-2de7-4281-b24d-e1bfa350b5ee-nradio-legacy-part-04-of-04.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：参数、产品图片、实验室数据、型号、适用条件

## 小助理企业微信被封临时联系方式

2026年7月29日，小助理企业微信被封，临时可通过QQ联系。恢复后恢复微信交流。QQ号：猫猫：1403713828，林林：242150291，好好：3293869279。
原条目 ID：upload-20260730-27d9403f68-01
来源：https://github.com/NRadio-Bot/nradio-platform/blob/main/knowledge-base/sources/uploads/2026-07/6d5727f8-5810-4397-9898-98c9f6991beb-未命名.txt
来源类型：user_upload
原上传者：FallaxAura
核验日期：2026-07-30
可信度：high

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/311a1b7b-2de7-4281-b24d-e1bfa350b5ee-nradio-legacy-part-04-of-04.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：企业微信、QQ、联系方式、临时、2026-07-29

## OpenWrt 官方支持渠道如何选择

设备安装与用户配置优先查 OpenWrt Wiki、Table of Hardware/设备页和官方论坛；可复现的软件缺陷提交到对应 GitHub 仓库，开发讨论和补丁走邮件列表。提问时提供设备完整型号/版本、发行版、`ubus call system board`、复现步骤、期望与实际结果、日志和已做测试，删除密码/私钥但不要删除关键错误上下文。（核验时间：2026-08-03；来源：https://openwrt.org/support）

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/7b62bce8-4a2d-48c8-902a-a63a60c43b81-openwrt-ecosystem-part-01-of-05.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：社区、OpenWrt官方论坛、GitHub、支持、提问

## OpenWrt GitHub 仓库的职责划分

`openwrt/openwrt` 负责基础系统、target、内核与构建；`openwrt/packages` 负责大量用户软件；`openwrt/luci` 负责 Web 界面；`openwrt/routing` 负责 mwan3、路由协议等。插件页面坏不一定是 LuCI 核心问题，kmod 不加载也不该报给插件作者。先找到包 Makefile 中的 PKG_SOURCE 和 maintainer，再去正确仓库。（核验时间：2026-08-03；来源：https://github.com/openwrt/openwrt）

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/7b62bce8-4a2d-48c8-902a-a63a60c43b81-openwrt-ecosystem-part-01-of-05.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：社区、GitHub、openwrt、packages、luci、routing

## 官方 Forum 与 Reddit 的证据等级

OpenWrt Forum 是官方社区，常有维护者参与，但帖子仍可能过时或针对特定 snapshot；`r/openwrt` 是非官方 subreddit，适合发现思路和用户体验，开发者不会保证看到。任何复制命令都要核对发布日期、版本、target 和后续回复，最终以设备页、当前源码和本机日志验证。（核验时间：2026-08-03；来源：https://www.reddit.com/r/openwrt/）

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/7b62bce8-4a2d-48c8-902a-a63a60c43b81-openwrt-ecosystem-part-01-of-05.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：社区、OpenWrtForum、Reddit、证据

## 恩山无线论坛适合查什么

恩山无线论坛对中国市场路由器拆机、TTL 点位、Breed/U-Boot、运营商光猫、国产 SoC 和第三方固件经验非常丰富，适合发现设备线索。但附件、网盘固件和一键工具的源码、版本、哈希与安全性常不透明；应先找原作者主题、交叉验证硬件版本，备份 bootloader/factory/calibration，再决定是否使用。（核验时间：2026-08-03；来源：https://www.right.com.cn/）

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/7b62bce8-4a2d-48c8-902a-a63a60c43b81-openwrt-ecosystem-part-01-of-05.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：社区、恩山、right、第三方固件、刷机

## ImmortalWrt 社区与 OpenWrt 上游的关系

ImmortalWrt 是面向中国用户的 OpenWrt 分支，增加设备、包、本地化和部分不易上游的优化。问题若只在 ImmortalWrt 或其 MTK/代理组件出现，应查 ImmortalWrt GitHub Discussions/Issues、Matrix/Telegram 支持渠道；上游 OpenWrt 文档仍适用于大量基础机制，但不能假设固件、kmod、feed 或 sysupgrade 与上游互换。（核验时间：2026-08-03；来源：https://github.com/immortalwrt/immortalwrt）

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/7b62bce8-4a2d-48c8-902a-a63a60c43b81-openwrt-ecosystem-part-01-of-05.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：社区、ImmortalWrt、OpenWrt、分支、支持

## 选择插件前的六项兼容检查

安装前确认发行版与版本、CPU 架构、包管理器 opkg/apk、firewall3/4、内核 ABI、维护者支持分支；再核对依赖、可写空间、RAM 和是否与现有 DNS/PBR/代理冲突。优先官方 feed，其次项目作者签名 release，最后才是论坛附件。保存插件版本、来源 URL、配置目录和回滚命令。（核验时间：2026-08-03；来源：https://openwrt.org/docs/guide-user/additional-software/managing_packages）

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/7b62bce8-4a2d-48c8-902a-a63a60c43b81-openwrt-ecosystem-part-01-of-05.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：插件、兼容性、opkg、apk、fw4、kmod

## luci-app-* 与后台服务的关系

多数 `luci-app-foo` 只是配置界面，真正功能来自 `foo`、内核模块或脚本；有些包还需 `luci-i18n-foo-zh-cn`。只装 UI 会出现 RPC/文件不存在，只装后台则不会出现菜单。必须从同一分支/仓库成套安装，升级时避免 LuCI 前端比 UCI schema 或 rpcd 后端更新得更快。（核验时间：2026-08-03；来源：https://github.com/openwrt/luci）

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/7b62bce8-4a2d-48c8-902a-a63a60c43b81-openwrt-ecosystem-part-01-of-05.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：插件、LuCI、luci-app、后台、rpcd

## adblock、adblock-fast 与 AdGuard Home 怎么选

adblock/adblock-fast 更贴近 OpenWrt，可与 dnsmasq/Unbound/SmartDNS 协作，资源开销通常较低；AdGuard Home 提供独立 Web UI、统计和过滤能力，但占内存更高且会竞争 53 端口。只选一个主过滤路径，合理控制列表规模并维护 allowlist；DNS 过滤不能代替浏览器内容过滤。来源：https://openwrt.org/docs/guide-user/services/ad-blocking 核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/9f8dcaf7-240c-4cf2-beb0-33324bc2c841-openwrt-ecosystem-part-02-of-05.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：插件、adblock、AdGuardHome、DNS过滤

## MosDNS、SmartDNS、dnsmasq 与加密 DNS 的组合原则

dnsmasq 适合 DHCP、本地域名和缓存入口；MosDNS/SmartDNS/Unbound/https-dns-proxy 可承担分流、测速或加密上游。稳定组合只有一个 LAN:53 入口，后端监听 loopback 非 53 端口，并明确 bootstrap DNS，防止循环依赖。代理插件若也劫持 DNS，应把整条调用链画出来再配置。来源：https://github.com/sbwml/luci-app-mosdns 核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/9f8dcaf7-240c-4cf2-beb0-33324bc2c841-openwrt-ecosystem-part-02-of-05.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：插件、MosDNS、SmartDNS、dnsmasq、DoH、DNS

## DDNS 插件的正确使用边界

ddns-scripts 每个 section 通常维护一个主机名和一种地址族。先确认 WAN 获取的是可入站公网 IPv4 或有效 IPv6；CGNAT 下 DDNS 只能发布不可直连的地址，不能创造端口映射。使用 interface、web 或 script 取地址时要防止发布 VPN/ULA/私网地址，并查 `logread -e ddns` 与提供商返回码。来源：https://openwrt.org/docs/guide-user/base-system/ddns 核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/9f8dcaf7-240c-4cf2-beb0-33324bc2c841-openwrt-ecosystem-part-02-of-05.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：插件、DDNS、公网IP、CGNAT、IPv6

## banIP 与普通防火墙的分工

banIP 把地址列表加载到 nft set 并生成规则，适合地区/威胁源批量拦截；基础 zone、端口和服务访问控制仍应写在 firewall4。大列表会占 RAM、延长 reload，误封 DNS/CDN/云服务也很常见。先以 report/log 模式验证，并给管理地址、VPN peer 和必要服务设置 allowlist。来源：https://openwrt.org/docs/guide-user/services/start 核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/9f8dcaf7-240c-4cf2-beb0-33324bc2c841-openwrt-ecosystem-part-02-of-05.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：插件、banIP、nftables、防火墙、黑名单

## SQM/CAKE 的进阶玩法

先关闭 flow offload，在真实瓶颈接口设置略低于可持续带宽的上下行；PPPoE/VLAN/蜂窝链路要配置开销。CAKE 的 besteffort、diffserv4、dual-srchost/dsthost 等选项影响公平性和分类，只有在基线稳定后再调。用满载上下行同时测延迟，而不是只看空载测速。来源：https://openwrt.org/docs/guide-user/network/traffic-shaping/sqm_configuration 核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/9f8dcaf7-240c-4cf2-beb0-33324bc2c841-openwrt-ecosystem-part-02-of-05.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：插件、SQM、CAKE、DiffServ、Bufferbloat

## mwan3 的进阶策略设计

member 的 metric 决定优先级、weight 决定同 metric 新连接分配比例；policy 决定组合，rule 决定哪些流量使用 policy。给支付、游戏、VoIP、VPN 和入站回程配置线路粘滞，给大流量下载做均衡。探测目标、DNS 和路由器自身流量也必须能够绑定正确 WAN。来源：https://openwrt.org/docs/guide-user/network/wan/multiwan/mwan3 核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/9f8dcaf7-240c-4cf2-beb0-33324bc2c841-openwrt-ecosystem-part-02-of-05.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：插件、mwan3、多WAN、策略、负载均衡

## PBR 的域名策略为什么会漂移

域名会解析到 CDN 多地址并随时间改变，PBR 需要 dnsmasq nft set/ipset 或解析器把结果动态加入集合。客户端若使用 DoH、硬编码 DNS 或 QUIC，路由器可能看不到域名；同 IP 也可能承载多个域名。重要策略优先使用源设备/网段和明确 IP/CIDR，域名规则作为便利层。来源：https://openwrt.org/docs/guide-user/network/routing/pbr 核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/9f8dcaf7-240c-4cf2-beb0-33324bc2c841-openwrt-ecosystem-part-02-of-05.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：插件、PBR、域名、nftset、DoH、CDN

## usteer 与 DAWN 只能选择一个

usteer 与 DAWN 不能同时启用。两者都根据 802.11k/v 信息和信号/负载向客户端提出漫游建议，同时启用会产生相互矛盾的 steering。OpenWrt 24.10 常需完整 wpad 才支持 k/r/v。部署时应先统一 SSID、加密、VLAN 和 802.11r，再用默认或温和阈值部署 steering；客户端最终仍可忽略建议。来源：https://openwrt.org/docs/guide-user/network/wifi/roaming 核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/98a8f713-9a54-4508-acee-89483d0eb02f-openwrt-ecosystem-part-03-of-05.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：OpenWrt、插件、usteer、DAWN、80211k、80211v、漫游

## usteer 的诊断接口

usteer 的诊断接口：使用 `ubus call usteer local_info`、`remote_hosts`、`remote_info`、`get_clients` 查看本地/远端 AP、负载、噪声和客户端能力。若 remote_hosts 为空，检查各 AP 的 network 配置、二层/三层可达性和防火墙；若有邻居但不漫游，检查客户端是否支持 BSS Transition、信号差阈值与目标 AP 是否确实更好。来源：https://openwrt.org/docs/guide-user/network/wifi/usteer 核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/98a8f713-9a54-4508-acee-89483d0eb02f-openwrt-ecosystem-part-03-of-05.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：OpenWrt、插件、usteer、ubus、漫游、诊断

## WireGuard、Tailscale、ZeroTier 的选择

WireGuard、Tailscale、ZeroTier 的选择：WireGuard 自建最轻量，拓扑和密钥完全可控，但需自己处理公网入口、路由与密钥；Tailscale 基于 WireGuard，控制面和 NAT 穿透更易用，可做 subnet router/exit node；ZeroTier 提供虚拟二层/三层网络和集中授权。无论哪种，加入虚拟网后都要单独设计 firewall zone、路由宣告和管理权限。来源：https://openwrt.org/docs/guide-user/services/vpn/tailscale/start 核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/98a8f713-9a54-4508-acee-89483d0eb02f-openwrt-ecosystem-part-03-of-05.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：OpenWrt、插件、WireGuard、Tailscale、ZeroTier、VPN

## Tailscale subnet router/exit node 的进阶检查

Tailscale subnet router/exit node 的进阶检查：OpenWrt 宣告 LAN 网段后，需要在控制面批准 route，并允许 tailscale zone 到 LAN forwarding；使用 exit node 还要处理默认路由、DNS 和 MTU。若只有路由器自身能通而 LAN 客户端不通，检查 forwarding、NAT 和 LAN 客户端默认网关。不要把管理网段无差别暴露给 tailnet 全体成员。来源：https://openwrt.org/docs/guide-user/services/vpn/tailscale/start 核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/98a8f713-9a54-4508-acee-89483d0eb02f-openwrt-ecosystem-part-03-of-05.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：OpenWrt、插件、Tailscale、SubnetRouter、ExitNode

## ZeroTier 版本升级后的 UCI schema 差异

ZeroTier 版本升级后的 UCI schema 差异：ZeroTier 1.14.1 前后 OpenWrt UCI 示例结构发生变化，旧教程的 `list join` 与新 `config network` 写法不能机械混用。以当前包自带 `/etc/config/zerotier` 和官方文档为准，升级前保存 network ID、identity 和授权状态；虚拟接口要加入单独 firewall zone。来源：https://openwrt.org/docs/guide-user/services/vpn/zerotier 核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/98a8f713-9a54-4508-acee-89483d0eb02f-openwrt-ecosystem-part-03-of-05.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：OpenWrt、插件、ZeroTier、UCI、网络

## OpenClash 的定位与兼容风险

OpenClash 的定位与兼容风险：OpenClash 是基于 Mihomo/Clash 的第三方 OpenWrt 客户端，功能丰富，依赖 dnsmasq-full、TUN/TProxy、iptables/nft 兼容组件和自身核心。它不属于 OpenWrt 官方 feed；安装必须按项目 release 匹配 fw4、CPU 架构与内核模块。升级前导出配置，不能与其他透明代理同时接管 DNS、默认路由和 fwmark。来源：https://github.com/vernesong/OpenClash 核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/98a8f713-9a54-4508-acee-89483d0eb02f-openwrt-ecosystem-part-03-of-05.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：OpenWrt、插件、OpenClash、Mihomo、TProxy、第三方

## PassWall 的定位与依赖管理

PassWall 的定位与依赖管理：PassWall 是第三方代理管理插件，主仓库和 packages feed 分开，协议核心与 LuCI 版本需要成套。安装前确认所用 OpenWrt/ImmortalWrt 分支、架构、iptables/nftables 路径和核心来源；遇到依赖缺失应按项目 feed 编译/安装，不能从不同固件仓库拼包。与 OpenClash/HomeProxy/PBR 并用极易冲突。来源：https://github.com/Openwrt-Passwall/openwrt-passwall 核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/98a8f713-9a54-4508-acee-89483d0eb02f-openwrt-ecosystem-part-03-of-05.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：OpenWrt、插件、PassWall、代理、第三方、feed

## HomeProxy 与 sing-box 的版本绑定

HomeProxy 是 ImmortalWrt 面向 ARM64/AMD64 的 sing-box 管理平台。sing-box 配置格式和弃用项变化较快，HomeProxy 生成器必须匹配核心版本；订阅节点变化也可能让 selector/urltest 引用失效。升级时同时检查 HomeProxy 与 sing-box changelog，先做配置校验，再切换生产流量。核验日期：2026-08-03。来源：https://github.com/immortalwrt/homeproxy

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/41dd67bd-c746-43f4-83bb-5438b4f2ba8d-openwrt-ecosystem-part-04-of-05.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：插件、HomeProxy、sing-box、版本、配置

## 代理插件排障的最小化原则

代理插件排障时，先停透明代理确认原生 WAN/DNS 正常；然后只启用一个插件、一个 DNS 入口和一个默认路由接管者。记录 `ip rule`、`ip route show table all`、`nft list ruleset`、53 端口监听、插件日志与核心配置检查结果。节点连通、DNS、路由和 TProxy 是四个独立层，不要只凭“订阅更新成功”判断服务可用。核验日期：2026-08-03。来源：https://github.com/vernesong/OpenClash

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/41dd67bd-c746-43f4-83bb-5438b4f2ba8d-openwrt-ecosystem-part-04-of-05.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：插件、透明代理、排障、DNS、TProxy、fwmark

## Samba4 与 ksmbd 怎么选

Samba4 功能和兼容性更完整、资源占用较高；ksmbd 是内核 SMB3 服务，较轻但功能较少。外置盘先稳定挂载，再创建专用用户、设置目录权限和 SMB 密码；不要开放到 WAN。高并发、重要数据和 Time Machine 场景优先评估完整 Samba，低资源简单共享可考虑 ksmbd。核验日期：2026-08-03。来源：https://openwrt.org/docs/guide-user/services/nas/cifs.server

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/41dd67bd-c746-43f4-83bb-5438b4f2ba8d-openwrt-ecosystem-part-04-of-05.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：插件、Samba、ksmbd、NAS、SMB

## Docker/Podman 在 OpenWrt 上的适用边界

容器适合 x86/高内存 ARM 和可靠外置存储，不适合小闪存路由器。把容器 root、volume 与日志放到 ext4/btrfs 数据盘，限制日志和内存；容器 bridge、macvlan 和端口发布会与 firewall4、VLAN、PBR 交互。路由核心功能不宜全部塞进容器，以免容器引擎故障导致整网失联。核验日期：2026-08-03。来源：https://openwrt.org/docs/guide-user/virtualization/docker_host

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/41dd67bd-c746-43f4-83bb-5438b4f2ba8d-openwrt-ecosystem-part-04-of-05.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：插件、Docker、Podman、容器、存储

## Transmission/aria2 等下载插件的路由器负载风险

P2P 会制造大量连接、随机磁盘写入和 conntrack 压力，TF 卡和小内存设备容易出现 I/O wait、table full 与 OOM。把下载目录放到独立硬盘，限制并发/连接数/缓存和上传速度，配合 SQM 时预留带宽；不要让下载器写内部 overlay。核验日期：2026-08-03。来源：https://openwrt.org/docs/guide-user/services/start

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/41dd67bd-c746-43f4-83bb-5438b4f2ba8d-openwrt-ecosystem-part-04-of-05.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：插件、Transmission、aria2、P2P、下载、conntrack

## miniupnpd/UPnP 的安全边界

UPnP 允许可信 LAN 客户端动态创建端口映射，方便游戏和通信，但恶意或被入侵客户端也能开放服务。仅在明确的可信 zone 启用，限制外部端口和租期，绝不监听 WAN/访客网；CGNAT 下即使映射成功也未必能从互联网访问。高安全环境使用手工端口转发或 VPN。核验日期：2026-08-03。来源：https://openwrt.org/docs/guide-user/services/start

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/41dd67bd-c746-43f4-83bb-5438b4f2ba8d-openwrt-ecosystem-part-04-of-05.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：插件、UPnP、miniupnpd、端口映射、安全

## irqbalance、packet steering 和硬件卸载

irqbalance/packet steering 尝试把网络中断和软中断分散到多核，硬件卸载绕过部分 CPU 路径。收益取决于 SoC、驱动和拓扑，盲目全开可能增加延迟或与厂商 HNAT/WED 冲突。用 `top -H`、`/proc/interrupts`、软中断和 iperf3 前后对比，单独改变一个变量。核验日期：2026-08-03。来源：https://openwrt.org/docs/guide-user/services/start

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/41dd67bd-c746-43f4-83bb-5438b4f2ba8d-openwrt-ecosystem-part-04-of-05.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：进阶、irqbalance、PacketSteering、HNAT、WED、性能

## VLAN + 多 AP + 多 SSID 的进阶架构

主路由负责每个 VLAN 的网关、DHCP 和 firewall，交换机/AP 上联使用 tagged trunk，各 SSID 映射到对应 VLAN，管理 VLAN 单独限制。DSA bridge-vlan 中明确每个接入口的 PVID/untagged 和 trunk 的 tagged；部署前保留一个本地 untagged 管理口，逐 VLAN 验证 DHCP、DNS、隔离和漫游。核验日期：2026-08-03。来源：https://openwrt.org/docs/guide-user/network/wifi/roaming

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/4d42ebad-7120-4079-84d7-1e195a8356ea-openwrt-ecosystem-part-05-of-05.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：进阶、VLAN、多AP、多SSID、Trunk、DSA、OpenWrt

## VRRP/keepalived 双路由高可用的限制

两台 OpenWrt 可用 keepalived/VRRP 漂移 LAN 虚拟网关，但状态防火墙、NAT、DHCP、IPv6 PD 和连接跟踪默认不会完整同步，主备切换仍可能中断会话。先解决配置同步、WAN 独立性和 split-brain，再考虑 conntrackd；家庭环境常用双机冷备和可恢复配置更简单。核验日期：2026-08-03。来源：https://openwrt.org/docs/guide-user/services/start

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/4d42ebad-7120-4079-84d7-1e195a8356ea-openwrt-ecosystem-part-05-of-05.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：进阶、VRRP、keepalived、高可用、双路由、OpenWrt

## FRR/Babel/OLSR 等动态路由的使用场景

多路由、多站点或 mesh 可使用 FRR 的 OSPF/BGP、Babel 或 OLSR 自动交换前缀；单路由家庭网络通常不需要。动态路由必须限制邻居、认证和可发布前缀，避免把默认路由或管理网误传播。和 mwan3/PBR 同时使用时要规划 table、metric 和策略优先级。核验日期：2026-08-03。来源：https://github.com/openwrt/routing

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/4d42ebad-7120-4079-84d7-1e195a8356ea-openwrt-ecosystem-part-05-of-05.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：进阶、FRR、BGP、OSPF、Babel、OLSR、动态路由、OpenWrt

## collectd、vnStat、Prometheus/Telegraf 监控

轻量长期流量可用 vnStat，设备和接口时序指标可用 collectd/rrdtool 或 Telegraf 输出到外部数据库。路由器内部闪存不适合高频写时序数据，应写 tmpfs 后批量上传或直接远端存储；监控接口不要暴露 WAN，并限制标签基数和采样频率。核验日期：2026-08-03。来源：https://openwrt.org/docs/guide-user/services/start

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/4d42ebad-7120-4079-84d7-1e195a8356ea-openwrt-ecosystem-part-05-of-05.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：进阶、监控、collectd、vnStat、Telegraf、Prometheus、OpenWrt

## 自定义热插拔与 procd 服务

设备事件脚本放在 `/etc/hotplug.d/<subsystem>/`，长期进程应写 procd init 脚本，声明 command、respawn、file/netdev/interface trigger，而不是堆进 `rc.local`。脚本必须幂等、记录日志并对缺失设备超时；热插拔环境变量和 PATH 有限，先在日志中打印必要上下文。核验日期：2026-08-03。来源：https://github.com/openwrt/openwrt

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/4d42ebad-7120-4079-84d7-1e195a8356ea-openwrt-ecosystem-part-05-of-05.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：进阶、hotplug、procd、init、脚本、自动化、OpenWrt

## Image Builder 预装插件比在线安装更可靠

小闪存、snapshot、批量设备或依赖 kmod 的插件，应在 Image Builder/源码构建时集成，使内核模块、依赖和 SquashFS 同批生成。保存 package list、feeds revision、FILES、首次启动脚本和 SHA-256。不要把含密码/订阅/私钥的配置直接烘进公开镜像。核验日期：2026-08-03。来源：https://openwrt.org/downloads

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/4d42ebad-7120-4079-84d7-1e195a8356ea-openwrt-ecosystem-part-05-of-05.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：进阶、ImageBuilder、插件、kmod、批量、固件、OpenWrt

## 社区脚本和一键包的审查清单

执行前下载到本地阅读，检查是否修改 distfeeds、关闭签名/TLS、使用 curl|sh、写 bootloader/factory、添加 cron/开机自启、上传遥测、保存明文凭据或执行 `rm/dd`。记录哈希和来源 commit，在测试机/备份后运行。无法审查的闭源 EXE 和网盘固件只能视为高风险第三方材料。核验日期：2026-08-03。来源：https://www.right.com.cn/

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/4d42ebad-7120-4079-84d7-1e195a8356ea-openwrt-ecosystem-part-05-of-05.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：社区、一键脚本、安全、审查、固件、OpenWrt

## 报错：Image check failed / Invalid image type

该报错表示平台校验拒绝镜像，常见原因是 factory/sysupgrade 类型错、设备 profile 或硬件版本错、镜像损坏、从 swconfig 迁移 DSA 时配置不兼容。先运行 `ubus call system board`、核对下载页 target/profile 和 SHA-256，再执行 `sysupgrade -T /tmp/firmware` 查看完整前置日志。只有设备官方说明明确要求时才考虑 force；不能用强刷掩盖型号错误。（来源：https://openwrt.org/docs/guide-user/installation/generic.sysupgrade；核验日期：2026-08-03）

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/048f8d73-8c0f-4068-9590-9d512f6d12c0-openwrt-errors-part-01-of-06.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：报错、ImageCheckFailed、InvalidImage、sysupgrade、固件

## 报错：Image version mismatch / Config cannot be migrated

这通常不是文件损坏，而是 image compat version 或网络模型发生变化，例如端口命名、DSA 迁移。应导出配置和包清单，下载正确镜像，使用不保留设置的升级方式并手工重建。`sysupgrade -n` 会清除配置，执行前必须确保有本地网线、默认地址和恢复路径；不要把旧 `/etc/config/network` 整体复制回去。（来源：https://openwrt.org/docs/guide-user/network/dsa/upgrading-to-2102；核验日期：2026-08-03）

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/048f8d73-8c0f-4068-9590-9d512f6d12c0-openwrt-errors-part-01-of-06.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：报错、VersionMismatch、DSA、配置迁移、sysupgrade

## 报错：The uploaded image file does not contain a supported format

LuCI 无法识别上传文件时，先确认没有把 `.zip`、网页下载错误页、factory 镜像或磁盘整盘 img 当作 sysupgrade 镜像。用 `file`、`sha256sum` 和 `sysupgrade -T` 检查；浏览器下载文件尺寸异常小往往是登录页或 404。设备若要求 U-Boot、TFTP、SD 整盘写入，应按设备安装方法操作，不能从 LuCI 上传。（来源：https://openwrt.org/docs/guide-user/installation/generic.sysupgrade；核验日期：2026-08-03）

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/048f8d73-8c0f-4068-9590-9d512f6d12c0-openwrt-errors-part-01-of-06.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：报错、LuCI、UnsupportedFormat、固件、上传

## 报错：not enough space in /tmp / No space left on device 上传固件失败

LuCI 和 sysupgrade 通常先把镜像放到 RAM-backed `/tmp`。检查 `df -h /tmp /overlay`、`free -h`、`ls -lh /tmp`；停止占内存服务并删除临时文件。低内存设备可从 URL 流式升级或用设备文档给出的低内存方案，但升级时不要靠 swap 掩盖严重内存不足，也不要把固件放到不受平台脚本支持的路径。（来源：https://openwrt.org/docs/guide-user/installation/generic.sysupgrade；核验日期：2026-08-03）

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/048f8d73-8c0f-4068-9590-9d512f6d12c0-openwrt-errors-part-01-of-06.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：报错、tmp、空间不足、sysupgrade、RAM

## 报错：Failed to kill all processes / Command failed during sysupgrade

升级切换到 ramfs 后会终止服务并卸载文件系统；进程无法结束、外置盘忙或平台脚本 I/O 错误都可能中断。不要立刻断电，保留串口输出和完整 sysupgrade 日志，确认设备是否仍在写闪存。再次尝试前停止容器、下载、挂载和代理服务，并校验镜像；若已经无法启动，使用设备专用 recovery/TFTP/串口方案。（来源：https://openwrt.org/docs/guide-user/installation/generic.sysupgrade；核验日期：2026-08-03）

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/048f8d73-8c0f-4068-9590-9d512f6d12c0-openwrt-errors-part-01-of-06.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：报错、sysupgrade、FailedToKill、processes、I/O

## 报错：Cannot satisfy dependencies / kernel is not compatible

安装 kmod 时该报错几乎总是正在运行的内核 ABI 与仓库包不一致，snapshot 和第三方固件最常见。记录 `uname -r`、`opkg status kernel`、release/target 和 distfeeds；使用同一构建批次的软件源，或重刷当前仓库对应镜像。不要对内核模块使用 `--force-depends`，即使文件装进去也可能无法加载、崩溃或无法重启。（来源：https://openwrt.org/faq/cannot_satisfy_dependencies；核验日期：2026-08-03）

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/048f8d73-8c0f-4068-9590-9d512f6d12c0-openwrt-errors-part-01-of-06.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：报错、kmod、KernelNotCompatible、依赖、ABI

## 报错：Unknown package / package not found

先更新索引并确认包名、版本和架构：24.10 及更早运行 `opkg update`，25.12 及以后运行 `apk update`；查看源是否启用、URL 是否返回真实仓库、包是否为该架构构建。某些 LuCI 页面需要 `luci-app-名称`，协议还需要 `luci-proto-名称`。第三方教程里的包可能不在官方源，应去项目仓库核对支持分支，而不是随便添加陌生 feed。（来源：https://openwrt.org/docs/guide-user/additional-software/managing_packages；核验日期：2026-08-03）

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/048f8d73-8c0f-4068-9590-9d512f6d12c0-openwrt-errors-part-01-of-06.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：报错、UnknownPackage、opkg、apk、软件包

## 报错：Signature check failed / Packages.gz signature invalid

先检查系统日期、时区和 NTP，再确认 distfeeds 指向正确发行版且网络没有被透明代理替换内容。清理 `/tmp/opkg-lists` 后重新更新，并对比官方仓库 URL。不要长期关闭签名校验或安装 `--force-checksum` 得到的包；第三方 feed 必须导入其公开签名密钥并确认来源。核验日期：2026-08-03。来源：https://openwrt.org/docs/guide-user/additional-software/opkg

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/f4a6a8e9-16f6-40f6-85d5-9a5fb15d3219-openwrt-errors-part-02-of-06.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：报错、SignatureCheckFailed、软件源、签名

## 报错：wget returned 4 / Connection failed 下载软件源失败

wget/uclient-fetch 返回网络失败时，分别检查 `ip route`、`ping` 公网 IP、`nslookup` 仓库域名、系统时间和 HTTPS。能 ping IP 不能解析是 DNS；解析正常但 TLS 失败多为时间、证书或代理；IPv6 黑洞可用 `wget -4` 验证但应修复 WAN6/PMTU。不要把镜像站域名随意替换成目录结构不兼容的源。核验日期：2026-08-03。来源：https://openwrt.org/docs/guide-user/additional-software/opkg

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/f4a6a8e9-16f6-40f6-85d5-9a5fb15d3219-openwrt-errors-part-02-of-06.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：报错、wgetReturned4、opkg、网络、DNS、TLS

## 报错：SSL certificate verify failed / certificate is not yet valid

首先运行 `date` 检查时间；路由器无 RTC 时首次启动可能停留在固件构建日期。确保 NTP 能绕过尚未启动的加密 DNS/代理完成同步，并安装正确 CA bundle。证书域名不匹配则检查 DNS 劫持、透明代理和下载 URL。`--no-check-certificate` 只能用于定位问题，不应成为长期安装方案。核验日期：2026-08-03。来源：https://openwrt.org/docs/guide-user/additional-software/managing_packages

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/f4a6a8e9-16f6-40f6-85d5-9a5fb15d3219-openwrt-errors-part-02-of-06.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：报错、TLS、Certificate、时间、NTP

## 报错：Read-only file system

典型 SquashFS 的 `/rom` 本来只读，但 `/` 应由 overlay 提供可写层。若写 `/etc` 也报只读，检查 `mount`、`df -h`、`dmesg` 和 `logread`，可能是 overlay 尚未初始化、文件系统损坏、extroot 掉线或进入 failsafe 未执行 `mount_root`。不要用 remount 强行写 `/rom`；先恢复 overlay 或从 failsafe 修复。核验日期：2026-08-03。来源：https://openwrt.org/docs/guide-user/troubleshooting/failsafe_and_factory_reset

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/f4a6a8e9-16f6-40f6-85d5-9a5fb15d3219-openwrt-errors-part-02-of-06.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：报错、ReadOnlyFilesystem、overlay、mount_root

## 报错：jffs2 not ready / overlay not mounted

首次启动需要格式化 rootfs_data，低速闪存可能等待数分钟；持续失败则检查 mtd/UBI 分区、内核日志和镜像布局。运行 `mount`、`df -h`、`cat /proc/mtd` 或 `ubinfo -a`，确认没有刷错 NAND/NOR 镜像。不要在 overlay 初始化期间频繁断电；必要时进 failsafe 备份后 factoryreset。核验日期：2026-08-03。来源：https://openwrt.org/docs/guide-user/troubleshooting/failsafe_and_factory_reset

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/f4a6a8e9-16f6-40f6-85d5-9a5fb15d3219-openwrt-errors-part-02-of-06.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：报错、JFFS2、overlay、UBI、首次启动

## 报错：block: extroot: UUID mismatch

升级后 extroot 日志出现 UUID mismatch 时，先用 `block info` 和 `uci show fstab` 确认目标分区。官方 extroot 文档建议在确认外置卷确实是原 extroot 后移除卷上的 `.extroot-uuid` 再重试。不要删除未知磁盘文件或重新格式化；先挂到临时目录备份配置并记录 UUID。核验日期：2026-08-03。来源：https://openwrt.org/docs/guide-user/additional-software/extroot_configuration

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/f4a6a8e9-16f6-40f6-85d5-9a5fb15d3219-openwrt-errors-part-02-of-06.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：报错、extroot、UUIDMismatch、block-mount

## 报错：mount: wrong fs type / bad superblock

表示内核无法按指定类型挂载，原因可能是缺少 `kmod-fs-*`、文件系统损坏、类型写错、分区仍被占用或实际是 LUKS/LVM。用 `block info`、`blkid`、`file -s` 和 dmesg 确认类型；在电脑或离线环境运行对应 fsck。不要在已挂载或正在写入的卷上直接修复文件系统。核验日期：2026-08-03。来源：https://openwrt.org/docs/techref/block_mount

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/f4a6a8e9-16f6-40f6-85d5-9a5fb15d3219-openwrt-errors-part-02-of-06.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：报错、WrongFsType、BadSuperblock、mount、存储

## mount target is busy / umount: target is busy

针对报错 'mount target is busy / umount: target is busy'，处理方法是：用 `mount`、`fuser -m` 或 `/proc/*/mountinfo` 查找占用进程，常见占用者有 Samba、Docker、下载器、日志或当前 shell 工作目录；先停止对应服务并离开挂载目录，再正常卸载。注意 `umount -l` 只是延迟分离，不能保证数据已经安全写回；拔盘前应运行 `sync` 并确认卸载完成。来源：https://openwrt.org/docs/techref/block_mount。核验日期：2026-08-03。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/73cded48-47f6-4cb2-964a-b7cb9432712f-openwrt-errors-part-03-of-06.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：报错、TargetBusy、umount、存储

## USB disconnect / reset SuperSpeed USB device / uas_eh_abort_handler

针对报错 'USB disconnect / reset SuperSpeed USB device / uas_eh_abort_handler'，这是 USB 链路、电源、UAS 兼容或介质错误的典型日志。处理方法是：换短线、独立供电和接口，观察 `dmesg -w`、SMART 和 USB 拓扑；对特定桥接芯片可测试禁用 UAS，但会损失性能。若 extroot 或容器盘出现该日志，应优先处理硬件稳定性，因为反复掉盘会让 overlay/数据库损坏。来源：https://openwrt.org/docs/techref/block_mount。核验日期：2026-08-03。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/73cded48-47f6-4cb2-964a-b7cb9432712f-openwrt-errors-part-03-of-06.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：报错、USBDisconnect、UAS、reset、存储、电源

## Failed to connect to ubus / Connection failed

针对报错 'Failed to connect to ubus / Connection failed'，ubus socket 不可用通常表示 ubusd/procd 尚未起来、`/var/run/ubus` 丢失、系统处于早期 preinit，或根文件系统/内存严重异常。检查命令：`ps w | grep ubus`、`ls -l /var/run/ubus`、`logread` 与 `dmesg`。LuCI 大量 RPC 错误只是结果，不要先重装 LuCI；若仅某对象不存在，检查提供对象的服务是否启动。来源：https://openwrt.org/docs/guide-user/troubleshooting/failsafe_and_factory_reset。核验日期：2026-08-03。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/73cded48-47f6-4cb2-964a-b7cb9432712f-openwrt-errors-part-03-of-06.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：报错、ubus、ConnectionFailed、procd、LuCI

## RPCError / ubus code 4、6、7

针对报错 'RPCError / ubus code 4、6、7'，LuCI RPCError 是前端对 ubus 调用失败的包装，数字本身信息有限。处理方法是：打开浏览器请求详情，同时在 SSH 运行对应 `ubus call`、`logread -f` 和 `service rpcd status`。常见原因是插件后端未安装、ACL JSON 缺失、UCI section 结构旧、服务启动失败或前后端版本不一致；应成套安装同一仓库版本的 `luci-app-*` 与后台包。来源：https://github.com/openwrt/luci。核验日期：2026-08-03。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/73cded48-47f6-4cb2-964a-b7cb9432712f-openwrt-errors-part-03-of-06.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：报错、RPCError、ubus、LuCI、插件

## Bad Gateway / 502 after installing LuCI

针对报错 'Bad Gateway / 502 after installing LuCI'，uhttpd 能响应但 LuCI CGI/ucode/Lua 后端崩溃时会出现 502。检查 `logread -e uhttpd -e luci -e rpcd`、`service uhttpd restart` 和磁盘空间；第三方主题、旧 luci-compat、混源包最常见。先切回 bootstrap 主题或移除刚装插件，清理 LuCI index/cache，再重启 rpcd/uhttpd；不要为了修页面整机恢复出厂。来源：https://github.com/openwrt/luci。核验日期：2026-08-03。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/73cded48-47f6-4cb2-964a-b7cb9432712f-openwrt-errors-part-03-of-06.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：报错、BadGateway、502、LuCI、uhttpd

## uci: Entry not found

针对报错 'uci: Entry not found'，说明脚本引用的 config/section/option 不存在，可能是匿名索引变化、包尚未生成默认配置、版本字段改名或引号错误。处理方法是：先运行 `uci show <config>`，不要直接给命令加 `-q` 隐藏错误。自动化应创建缺失 section 或按名称/类型定位，避免假定 `@zone[1]` 永远是 WAN。来源：https://github.com/openwrt/packages。核验日期：2026-08-03。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/73cded48-47f6-4cb2-964a-b7cb9432712f-openwrt-errors-part-03-of-06.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：报错、UCI、EntryNotFound、配置、脚本

## Device or resource busy / cdc-wdm0 busy

针对报错 'Device or resource busy / cdc-wdm0 busy'，蜂窝控制口被占用时，先用 `fuser /dev/cdc-wdm0`、`ps` 和服务列表确认所有者。ModemManager、uqmi/umbim、quectel-CM、qmodem 和厂商 AT 服务只能有一个主控流程；停用冲突服务，再重新插拔或复位模组。不要同时在 LuCI 点拨号又手工运行连接管理器。来源：https://openwrt.org/docs/guide-user/network/wan/wwan/ltedongle。核验日期：2026-08-03。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/73cded48-47f6-4cb2-964a-b7cb9432712f-openwrt-errors-part-03-of-06.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：报错、cdc-wdm、Busy、QMI、MBIM、5G

## 报错：No device found / No such file /dev/cdc-wdm0

先从 `lsusb -t` 和 dmesg 判断模组是否枚举、工作在何种 USB composition，再看驱动是否绑定。QMI/MBIM 才通常产生 cdc-wdm，ECM/NCM/RNDIS 可能只有网卡，PCIe MHI 则路径不同。安装与内核精确匹配的 USB serial/net、qmi_wwan 或 cdc_mbim 驱动；不能凭教程固定设备号。核验日期 2026-08-03。来源：https://openwrt.org/docs/guide-user/network/wan/wwan/start

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/70b1e2b4-e20c-45c1-bdfc-e0555e408487-openwrt-errors-part-04-of-06.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：报错、cdc-wdm、NoDevice、5G模组、驱动

## 报错：SIM not inserted / SIM PIN required / registration denied

先用只读 AT 或管理器查询 CPIN、SIM 状态、注册状态和运营商。确认 SIM 方向、卡槽切换 GPIO、PIN、天线和当地频段；registration denied 还可能是套餐、IMEI 或运营商限制。不要反复错误输入 PIN，可能触发 PUK；双卡设备要确认软件选中的槽与物理卡一致。核验日期 2026-08-03。来源：https://openwrt.org/docs/guide-user/network/wan/wwan/start

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/70b1e2b4-e20c-45c1-bdfc-e0555e408487-openwrt-errors-part-04-of-06.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：报错、SIM、PIN、RegistrationDenied、5G

## 报错：uqmi connected 但无法上网

connected 只表示数据会话建立。继续检查 wwan device 是否 raw-ip 模式、接口是否获得地址/网关/DNS、PDP 类型是否与运营商匹配、MTU 和防火墙 zone。采集 `uqmi --get-current-settings`、`ubus call network.interface.<name> status`、`ip route` 和 wwan 抓包；若地址由 DHCP 获取，确认 netifd 子接口确实运行 DHCP。核验日期 2026-08-03。来源：https://openwrt.org/docs/guide-user/network/wan/wwan/ltedongle

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/70b1e2b4-e20c-45c1-bdfc-e0555e408487-openwrt-errors-part-04-of-06.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：报错、uqmi、ConnectedNoInternet、QMI、APN

## 报错：PPPoE PADO timeout / Timeout waiting for PADO packets

路由器发出 PADI 但收不到 PADO，常见是 WAN 物理口/VLAN ID 错、光猫未桥接、线路绑定旧 MAC、运营商只允许单会话或链路未通。先抓实际 WAN L2 device 的 `pppoed` 报文，核对 VLAN tag 和 link；不要先反复改账号密码，因为认证还没有开始。核验日期 2026-08-03。来源：https://openwrt.org/docs/guide-user/installation/generic.sysupgrade

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/70b1e2b4-e20c-45c1-bdfc-e0555e408487-openwrt-errors-part-04-of-06.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：报错、PPPoE、PADOTimeout、VLAN、光猫

## 报错：PPPoE authentication failed / PAP authentication failed

已经收到接入服务器响应但认证失败，重点核对账号格式、密码、运营商绑定和是否存在另一拨号会话。打开 pppd 日志但避免公开完整凭据；有些运营商需要特定 service name、VLAN 或从原设备克隆 MAC。连续失败可能触发临时限制，修改后间隔重试。核验日期 2026-08-03。来源：https://openwrt.org/docs/guide-user/installation/generic.sysupgrade

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/70b1e2b4-e20c-45c1-bdfc-e0555e408487-openwrt-errors-part-04-of-06.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：报错、PPPoE、AuthenticationFailed、PAP

## 报错：Network is unreachable / no route to host

区分本机没有路由与远端拒绝。运行 `ip route get <目的>`/`ip -6 route get`，检查接口运行态、默认路由、源地址和策略规则；多 WAN/VPN 还要看相应 table 与 fwmark。能 ping 网关但无默认路由是 netifd/协议问题，域名命令报错但 IP 可通则是 DNS，不要混为一谈。核验日期 2026-08-03。来源：https://openwrt.org/docs/guide-user/network/routing/pbr

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/70b1e2b4-e20c-45c1-bdfc-e0555e408487-openwrt-errors-part-04-of-06.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：报错、NetworkUnreachable、NoRoute、路由

## 报错：DNS bad address / Temporary failure in name resolution

先执行 `nslookup openwrt.org 127.0.0.1` 和直接查询已知上游，检查 dnsmasq 是否监听 53、`/tmp/resolv.conf.d/resolv.conf.auto` 是否有上游、时间和防火墙是否正常。安装 AdGuardHome、MosDNS、SmartDNS、HomeProxy 后最容易出现端口 53 抢占或循环转发；画清客户端→本地入口→上游的唯一链路。核验日期 2026-08-03。来源：https://openwrt.org/docs/guide-user/base-system/dhcp_configuration

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/70b1e2b4-e20c-45c1-bdfc-e0555e408487-openwrt-errors-part-04-of-06.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：报错、DNS、BadAddress、NameResolution、53端口

## 报错：dnsmasq failed to create listening socket for port 53

端口 53 已被其他 DNS 服务占用，或 dnsmasq 被配置到不存在地址。用 `ss -lnup | grep ':53'`、`ps` 和 `uci show dhcp` 查占用者。AdGuardHome/MosDNS/SmartDNS 与 dnsmasq 并用时，应让一个监听 LAN:53，另一个监听 127.0.0.1 的非 53 端口，禁止相互回指形成循环。来源：https://openwrt.org/docs/guide-user/base-system/dhcp_configuration 核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/d8f08539-192c-41e6-96d4-77864d6bf51d-openwrt-errors-part-05-of-06.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：报错、dnsmasq、Port53、AddressInUse、DNS

## 报错：Wireless is not associated / radio is disabled

先看 `wifi status`、`ubus call network.wireless status`、`logread -e hostapd -e netifd` 和 `iw phy`。原因包括国家码/信道非法、缺少固件、wpad 功能不够、radio disabled、校准数据缺失或 AP+STA 并发限制。恢复默认无线配置前先备份；若 phy 都不存在，应查驱动和设备树而不是继续改 SSID。来源：https://openwrt.org/docs/guide-user/network/wifi/start 核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/d8f08539-192c-41e6-96d4-77864d6bf51d-openwrt-errors-part-05-of-06.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：报错、WirelessDisabled、NoPhy、hostapd

## 报错：ACS failed / could not select channel

自动选信道无法完成时，可能没有可用信道、国家码错误、所有 DFS 信道处于禁用期、扫描失败或驱动不支持所选带宽。查看 hostapd 的 ACS/DFS 日志，临时选择当地合法的固定非 DFS 信道和较窄带宽验证。不要把 country 设为他国来绕开限制。来源：https://openwrt.org/docs/guide-user/network/wifi/start 核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/d8f08539-192c-41e6-96d4-77864d6bf51d-openwrt-errors-part-05-of-06.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：报错、ACSFailed、Channel、WiFi、DFS

## 报错：DFS-CAC-START 后 Wi‑Fi 很久才出现或突然消失

DFS 信道启动前需要 CAC，检测雷达后必须换信道并进入 non-occupancy period，这是法规行为。日志若出现 radar detected 并非硬件必然故障。需要快速上线或极高稳定性时选择当地允许的非 DFS 信道；否则等待 CAC 完成并避免频繁重启 AP。来源：https://openwrt.org/docs/guide-user/network/wifi/start 核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/d8f08539-192c-41e6-96d4-77864d6bf51d-openwrt-errors-part-05-of-06.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：报错、DFS、CAC、RadarDetected、WiFi

## 报错：wireless setup failed，启用 802.11k/v 后无线全灭

OpenWrt 24.10 中 `wpad-basic-mbedtls` 等精简变体可能不含完整 802.11k/r/v 功能。核对已安装 wpad 变体，先移除冲突的 basic 包，再安装匹配版本的完整 wpad；切换过程会短暂中断无线，必须通过网线操作。usteer 与 DAWN 只能选一个，参数过激也会让客户端频繁被踢。来源：https://openwrt.org/docs/guide-user/network/wifi/roaming 核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/d8f08539-192c-41e6-96d4-77864d6bf51d-openwrt-errors-part-05-of-06.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：报错、WirelessSetupFailed、wpad、80211k、80211v

## 报错：Failed to start firewall / nft syntax error

运行 `fw4 check`、`fw4 print` 和 `nft -c -f` 对生成规则做语法检查，日志通常会给出文件、行列或缺失 symbol。暂时移走最近加入的 `/usr/share/nftables.d/*.nft` 或禁用相关插件，再重启 firewall。旧 iptables 脚本、ipset 语法和第三方透明代理规则是常见来源；不要在防火墙失败状态长期联网。来源：https://openwrt.org/docs/guide-user/firewall/firewall_configuration 核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/d8f08539-192c-41e6-96d4-77864d6bf51d-openwrt-errors-part-05-of-06.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：报错、FirewallStartFailed、nft、SyntaxError、fw4

## 报错：mwan3 interface offline despite interface is online

mwan3 的 online 取决于 tracking 探测，不等同于 netifd 接口 up。检查探测目标是否允许 ICMP、DNS 是否依赖同一故障链路、路由表是否把探测包送对出口，以及 metric/mark 是否冲突。为每条 WAN 选多个分散目标，并在独立工作正常后再纳入 mwan3。来源：https://openwrt.org/docs/guide-user/network/wan/multiwan/mwan3 核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/d8f08539-192c-41e6-96d4-77864d6bf51d-openwrt-errors-part-05-of-06.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：报错、mwan3、Offline、Tracking、多WAN
