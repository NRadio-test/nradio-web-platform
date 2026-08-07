# 鲲鹏无限 NRadio 知识库

本文件由 `knowledge-base/import/knowledge.jsonl` 自动生成，共 227 条知识。每条内容都保留来源、上传者、核对日期和检索标签，适合直接上传到 AstrBot 知识库。

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

## 报错：pbr service failed / resolver set not supported

PBR 启动失败常见于 firewall4/ipset 模式不匹配、dnsmasq 不是 full 变体、目标 interface 不存在、策略解析域名失败或与代理插件抢 fwmark。查看 `service pbr status`、日志、nft set 和 `ip rule`，先用 IP/CIDR 规则验证，再启用域名策略。不要并行启用多个 PBR 实现。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/442c57db-db55-41d7-acbe-6b0aa3ea8e13-openwrt-errors-part-06-of-06.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：报错、PBR、ServiceFailed、dnsmasq-full、fwmark

## 报错：WireGuard latest handshake: never

确认接口有私钥、peer 公钥没有贴反、Endpoint DNS/端口可达、服务端 UDP 端口已放行并逐级转发。两端时间不会影响 WireGuard 密钥认证，但错误 AllowedIPs、NAT 和路由会影响握手后的数据。用 WAN 抓包看 UDP 是否发出/返回；完全无返回通常是地址、端口、防火墙或上级 NAT。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/442c57db-db55-41d7-acbe-6b0aa3ea8e13-openwrt-errors-part-06-of-06.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：报错、WireGuard、HandshakeNever、UDP、NAT

## 报错：WireGuard 有握手但 ping 不通

握手成功证明密钥与 UDP 路径成立，不证明路由正确。检查两端 AllowedIPs、隧道地址是否重叠、OpenWrt firewall zone forwarding、LAN 回程路由、rp_filter/PBR 和是否需要 NAT。分别 ping 对端隧道地址、对端路由器 LAN 地址、LAN 主机，逐层定位。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/442c57db-db55-41d7-acbe-6b0aa3ea8e13-openwrt-errors-part-06-of-06.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：报错、WireGuard、HandshakeNoTraffic、AllowedIPs

## 报错：OpenClash/HomeProxy 启动失败或透明代理后全网断网

先停用插件恢复原始路由和 DNS，再查插件自身日志、核心版本、配置校验、53 端口、TUN/TProxy 内核模块、fw4 nft 规则和策略路由。OpenClash、HomeProxy、PassWall、PBR、mwan3 不应同时接管默认路由/DNS；固件升级后还要核对插件与核心版本。不要用跳过证书、force depends 或 chmod 777 作为通用修复。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/442c57db-db55-41d7-acbe-6b0aa3ea8e13-openwrt-errors-part-06-of-06.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：报错、OpenClash、HomeProxy、全网断网、TProxy

## 报错：Docker overlay2 invalid argument / no space left

容器数据目录若位于不支持 overlay2 特性的文件系统、TF 普通小 overlay 或只读挂载，会启动失败。把 Docker root 移到可靠的 ext4/btrfs 外置盘，确认 inode、空间、内核模块和 mount propagation；OpenWrt 自身 overlay 与 Docker overlay2 是不同层。容器网络还会增加 bridge、nft 和 MTU 复杂度。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/442c57db-db55-41d7-acbe-6b0aa3ea8e13-openwrt-errors-part-06-of-06.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：报错、Docker、Overlay2、NoSpace、容器

## 报错：保存并应用后 LuCI 倒计时回滚

LuCI 发现浏览器无法重新连接新地址时会回滚网络配置，这是保护机制。改 LAN IP、VLAN、桥和管理口后，电脑可能需要重新获取地址或切到新 VLAN。远程操作应使用“应用未检查”仅在你明确有带外恢复时，并提前保存 `/etc/config/network`、准备第二管理口或串口。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/442c57db-db55-41d7-acbe-6b0aa3ea8e13-openwrt-errors-part-06-of-06.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：报错、LuCI、ApplyRollback、网络、失联

## 先确认版本、发行版和硬件目标

处理任何专业问题前先收集 `ubus call system board`、`cat /etc/openwrt_release`、`uname -a`、`opkg print-architecture`（OpenWrt 25.12 及以后相应检查 apk 架构）以及设备完整型号和硬件版本。OpenWrt、ImmortalWrt、厂商 SDK 固件即使界面相似，内核 ABI、补丁、软件源和升级镜像也可能不兼容；不要仅凭“都是 OP”混用教程或软件包。

来源：https://lists.openwrt.org/pipermail/openwrt-announce/2026-March/000081.html 核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/d133c999-a057-40fd-b4b0-0b2d3dc98bbc-openwrt-geek-part-01-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：OpenWrt、版本、发行版、硬件、诊断

## OpenWrt 25.12 的包管理器变化

截至 2026-08，官方稳定线已经发布 OpenWrt 25.12。该版本从 opkg 迁移到 apk，常用命令和仓库元数据格式不同；回答安装问题必须先看实际版本，不能机械给所有用户 `opkg update && opkg install`。旧的 24.10、23.05 系统仍使用 opkg，第三方分支也可能维持自己的方案。

来源：https://lists.openwrt.org/pipermail/openwrt-announce/2026-March/000081.html 核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/d133c999-a057-40fd-b4b0-0b2d3dc98bbc-openwrt-geek-part-01-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：OpenWrt、25.12、apk、opkg、软件包

## factory 镜像与 sysupgrade 镜像不能混用

factory 镜像通常用于从原厂系统首次刷入，sysupgrade 镜像用于已经运行 OpenWrt 的设备升级。具体设备还可能使用 `.itb`、`.bin`、`.img.gz` 或磁盘镜像，必须查对应设备页和安装方法。不要根据扩展名猜用途，也不要把另一硬件版本的镜像强刷。

来源：https://openwrt.org/docs/guide-user/installation/installation_methods/start 核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/d133c999-a057-40fd-b4b0-0b2d3dc98bbc-openwrt-geek-part-01-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：刷机、factory、sysupgrade、固件

## 升级前校验镜像身份与校验和

升级前要核对设备 profile、target/subtarget、硬件版本、镜像类型和官方 SHA-256；保留当前可回退镜像与恢复方法。`sysupgrade -T /tmp/image` 可做平台兼容性检查，但它不能替代来源和签名验证。第三方固件还应记录构建者、源码版本、构建日期和哈希。

来源：https://openwrt.org/docs/guide-user/installation/generic.sysupgrade 核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/d133c999-a057-40fd-b4b0-0b2d3dc98bbc-openwrt-geek-part-01-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：升级、SHA256、校验、固件、安全

## sysupgrade 实际保留什么

sysupgrade 会重写固件和根文件系统，然后按备份清单恢复配置；通常保留 `/etc/config` 等配置，但手工安装的软件包本体不会自动保留，额外服务的数据目录也未必在备份范围。先运行 `sysupgrade -l` 查看清单，用 `sysupgrade -b /tmp/backup.tar.gz` 导出，再单独备份关键业务数据。

来源：https://openwrt.org/docs/guide-user/installation/generic.sysupgrade 核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/d133c999-a057-40fd-b4b0-0b2d3dc98bbc-openwrt-geek-part-01-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：sysupgrade、备份、配置、软件包

## 跨大版本不要盲目保留配置

DSA 迁移、防火墙 fw3 到 fw4、无线驱动或 UCI schema 变化时，旧配置可能让新系统失联。大版本、不同分支或不同 target 间升级，优先阅读发行说明并准备不保留配置的重建方案。若选择保留，应先保存文本化配置和拓扑，升级后逐项验证，而不是看到 LuCI 能打开就认为成功。

来源：https://openwrt.org/docs/guide-user/installation/generic.sysupgrade 核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/d133c999-a057-40fd-b4b0-0b2d3dc98bbc-openwrt-geek-part-01-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：升级、保留配置、DSA、fw4、兼容

## 保存用户安装包清单

普通 sysupgrade 不会保留后来安装的软件包。可以用 `sysupgrade -k -b -` 从备份中提取 `installed_packages.txt`，也可保存 `opkg list-installed` 作为参考；恢复时应在新版本仓库重新安装，而不是把旧版 `.ipk` 或旧内核模块直接复制回来。OpenWrt 25.12 的 attended sysupgrade/owut 能把已安装包整合进重建镜像，但仍要检查兼容性。

来源：https://openwrt.org/docs/guide-user/additional-software/managing_packages 核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/d133c999-a057-40fd-b4b0-0b2d3dc98bbc-openwrt-geek-part-01-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：软件包、备份、恢复、owut

## failsafe、恢复模式与恢复出厂不是一回事

failsafe 用最小硬编码配置启动，适合修复错误配置；factory reset 清除 overlay 中的设置和后装包；recovery mode 用于重新写入损坏固件。failsafe 常用 192.168.1.1、无 DHCP、关闭无线，需要电脑静态地址并网线连接，但按键窗口和端口因设备而异。ext4 根文件系统的 x86/块设备安装也不一定支持基于 overlay 的恢复出厂。

来源：https://openwrt.org/docs/guide-user/troubleshooting/failsafe_and_factory_reset 核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/d133c999-a057-40fd-b4b0-0b2d3dc98bbc-openwrt-geek-part-01-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：failsafe、恢复、出厂重置、救砖

## 进入 failsafe 后的基本修复流程

进入 failsafe 后先确认链路，执行 `mount_root` 挂载可写 overlay，再检查 `/etc/config/network`、`firewall`、`wireless` 或撤销最近改动。需要彻底清除设置时可用当前版本提供的 `factoryreset`（旧文档常写 `firstboot`/`jffs2reset`），但该操作不可逆。修复前能复制配置就先复制。来源：https://openwrt.org/docs/guide-user/troubleshooting/failsafe_and_factory_reset 核验日期：2026-08-03。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/ebc296ab-e1ad-4eec-b0ce-8816b47f7f10-openwrt-geek-part-02-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：failsafe、mount_root、factoryreset、OpenWrt、恢复

## SquashFS、overlay 与 /rom 的关系

典型 SquashFS 固件把只读系统放在 `/rom`，把用户变化放在 `/overlay`，两者通过 OverlayFS 合成为可写的 `/`。删除只读系统文件只会在 overlay 创建 whiteout，并不会释放 SquashFS 空间；恢复出厂本质上清空 overlay。排查空间时同时看 `df -h`、`mount`、`du -x` 和 `/overlay/upper`。来源：https://openwrt.org/docs/techref/flash.layout 核验日期：2026-08-03。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/ebc296ab-e1ad-4eec-b0ce-8816b47f7f10-openwrt-geek-part-02-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：SquashFS、OverlayFS、rom、overlay、空间

## UCI 修改要经过 commit 和服务重载

`uci set`、`add_list`、`delete` 只修改候选配置；`uci changes` 可审查，`uci commit <package>` 才持久化。随后应对具体服务执行 reload/restart，网络配置可用 `service network reload`，但远程改 LAN、VLAN、桥或防火墙前应备份并准备串口/物理回退。避免脚本中无范围地 `uci commit`，便于审计和回滚。来源：https://openwrt.org/docs/guide-user/base-system/basic 核验日期：2026-08-03。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/ebc296ab-e1ad-4eec-b0ce-8816b47f7f10-openwrt-geek-part-02-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：UCI、commit、配置、服务

## UCI 匿名 section 的索引风险

`@zone[1]`、`@wifi-iface[0]` 等匿名索引依赖当前排列，安装包或用户新增 section 后索引可能改变。自动化脚本优先使用具名 section，或先通过 `uci show`/脚本按属性定位，再修改；否则一句复制粘贴命令可能改错防火墙区域。来源：https://openwrt.org/docs/guide-user/base-system/basic 核验日期：2026-08-03。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/ebc296ab-e1ad-4eec-b0ce-8816b47f7f10-openwrt-geek-part-02-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：UCI、匿名section、脚本、风险

## ubus 是运行态事实的重要入口

UCI 描述期望配置，ubus 更接近 netifd/procd 当前运行态。常用 `ubus list`、`ubus call system board`、`ubus call network.interface dump`、`ubus call network.device status '{"name":"br-lan"}'`。诊断“配置看着对但不工作”时，应同时比较 UCI、ubus、`ip address/route/link` 与日志。来源：https://openwrt.org/docs/guide-user/base-system/basic 核验日期：2026-08-03。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/ebc296ab-e1ad-4eec-b0ce-8816b47f7f10-openwrt-geek-part-02-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：ubus、netifd、运行态、诊断

## 日志先分内核与用户空间

`logread -e 关键词` 查看 procd/logd 管理的系统日志，`dmesg -w` 关注内核、驱动、USB、存储和网卡事件。复现问题前可记录 `logread -f`，并同时采集时间、接口状态和触发动作。默认环形缓冲区会覆盖旧消息，长期问题需要远程 syslog 或提高 `/etc/config/system` 的日志缓冲。来源：https://openwrt.org/docs/guide-user/base-system/system_configuration 核验日期：2026-08-03。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/ebc296ab-e1ad-4eec-b0ce-8816b47f7f10-openwrt-geek-part-02-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：logread、dmesg、日志、排障

## 不要把 interface、device 和物理端口混为一谈

OpenWrt 中 network interface 是三层逻辑配置，device 是二层对象，物理端口、桥、VLAN 子接口、PPPoE 设备又是不同层。防火墙 zone 绑定 network interface，而抓包和流量整形常要求实际 L2/L3 device。先用 `ubus call network.interface.<name> status` 找 `l3_device` 和 `device`，避免在错误接口上抓包或做 SQM。来源：https://openwrt.org/docs/guide-user/network/routing/basics 核验日期：2026-08-03。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/ebc296ab-e1ad-4eec-b0ce-8816b47f7f10-openwrt-geek-part-02-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：interface、device、l3_device、网络

## 识别 DSA 还是 swconfig

OpenWrt 21.02 起大量平台迁移到 DSA，但并非所有设备同时完成。可检查 `/sys/class/net/*/uevent` 中 `DEVTYPE=dsa`、查看 LuCI 的 Bridge VLAN filtering，以及是否存在 `switch0`/`swconfig` 配置。DSA 与 swconfig 的配置模型不兼容，教程必须匹配设备和版本。来源：https://openwrt.org/docs/guide-user/network/dsa/start 核验日期：2026-08-03。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/ebc296ab-e1ad-4eec-b0ce-8816b47f7f10-openwrt-geek-part-02-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：DSA、swconfig、交换机、VLAN

## DSA VLAN 中 tagged、untagged、PVID 的含义

tagged 表示该端口收发携带 VLAN tag；untagged 表示出端口去标签；PVID 决定无标签入流量归入哪个 VLAN。一个接入口通常在一个 VLAN 中标为 untagged+PVID，trunk 口在多个 VLAN 中 tagged。错误地给多个 VLAN 配 PVID 或遗漏 CPU/bridge local 参与，常导致管理面失联。修改前画端口—VLAN矩阵并保留回退口。核验日期：2026-08-03。来源：https://openwrt.org/docs/guide-user/network/dsa/dsa-mini-tutorial

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/ac8a6641-f85e-4436-9b1d-01fb952d81bc-openwrt-geek-part-03-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：DSA、VLAN、tagged、untagged、PVID、trunk

## DSA bridge-vlan 的本机参与

桥 VLAN filtering 不只控制外部端口，也决定 Linux 主机栈是否能通过 `br-lan.<vid>` 参与该 VLAN。若某 VLAN 仅做二层交换，可不创建三层 interface；若路由器要提供 DHCP、网关或防火墙，则应有相应 VLAN device 和 interface。不要为了“看得到”给每个 VLAN 都创建地址，这会扩大攻击面。核验日期：2026-08-03。来源：https://openwrt.org/docs/guide-user/network/vlan/switch_configuration

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/ac8a6641-f85e-4436-9b1d-01fb952d81bc-openwrt-geek-part-03-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：DSA、bridge-vlan、本机、CPU端口

## 配置 Dumb AP 的核心

旁路 AP 通常只保留一个管理 LAN，关闭自身 DHCP 服务器，把上联口与无线 SSID 加入 LAN 桥，并给设备一个不冲突的静态管理地址或 DHCP client 地址。不要把 LAN 接到默认 WAN zone，也不要在上下游同时提供同一网段 DHCP。需要多 SSID 隔离时用 VLAN trunk 把各网络交给主路由。核验日期：2026-08-03。来源：https://openwrt.org/docs/guide-user/network/wifi/start

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/ac8a6641-f85e-4436-9b1d-01fb952d81bc-openwrt-geek-part-03-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：DumbAP、AP、DHCP、桥接

## 访客 Wi‑Fi 隔离要同时做三层和二层

独立 guest interface、DHCP 池和 firewall zone 解决三层策略；禁止 guest→lan forwarding 并只允许 DNS、DHCP 和必要的 guest→wan。若同一 SSID 客户端也需互相隔离，还要启用 AP isolation。多 AP 场景用 VLAN 把 guest 端到端承载，不能只靠不同 SSID 名称。核验日期：2026-08-03。来源：https://openwrt.org/docs/guide-user/network/wifi/start

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/ac8a6641-f85e-4436-9b1d-01fb952d81bc-openwrt-geek-part-03-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：访客WiFi、隔离、防火墙、VLAN

## 静态路由优先级看最长前缀再看 metric

Linux 路由先选最长前缀，前缀相同再比较 metric；多个默认路由只改 metric 可做简单主备，但不能提供可靠健康检查、连接粘滞和复杂策略。排查用 `ip route show table all`、`ip rule`、`ip route get <目的地址> from <源地址>`，IPv6 使用对应 `-6` 参数。核验日期：2026-08-03。来源：https://openwrt.org/docs/guide-user/network/routing/basics

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/ac8a6641-f85e-4436-9b1d-01fb952d81bc-openwrt-geek-part-03-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：路由、metric、ip、rule、诊断

## PBR 与 mwan3 的边界

PBR 根据源/目的地址、端口、入接口或 mark 选择路由表，适合分流到特定 WAN/VPN；mwan3 在此基础上提供多 WAN 健康检查、故障转移和按连接负载均衡。只需固定设备走某 VPN 时优先 PBR；需要多链路探测和主备时使用 mwan3，避免多个策略路由插件同时争用 mark。核验日期：2026-08-03。来源：https://openwrt.org/docs/guide-user/network/routing/pbr

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/ac8a6641-f85e-4436-9b1d-01fb952d81bc-openwrt-geek-part-03-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：PBR、mwan3、分流、VPN、多WAN

## mwan3 负载均衡不是单连接带宽叠加

mwan3 依据策略把不同连接分配到多个出口，同一个 TCP/UDP flow 通常只走一个 WAN，所以单线程测速不会叠加带宽。相同 metric 的 member 按 weight 分配，新连接才体现比例；低 metric 优先，高 metric 用作备份。会话跨出口会改变公网源地址，因此银行、游戏、VoIP、VPN 等常需粘定线路。核验日期：2026-08-03。来源：https://openwrt.org/docs/guide-user/network/wan/multiwan/mwan3

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/ac8a6641-f85e-4436-9b1d-01fb952d81bc-openwrt-geek-part-03-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：mwan3、负载均衡、单连接、权重

## mwan3 排障顺序

先让每条 WAN 单独工作并拥有独立网关、DNS 和可达探测目标，再启用 mwan3。检查 `mwan3 status`、`logread -e mwan3`、`ip rule`、各策略路由表和 nft/iptables mark；探测目标应分散且真正代表互联网连通性。若接口有地址但无网关，或运营商拦 ICMP，会产生假故障。核验日期：2026-08-03。来源：https://openwrt.org/docs/guide-user/network/wan/multiwan/mwan3

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/ac8a6641-f85e-4436-9b1d-01fb952d81bc-openwrt-geek-part-03-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：mwan3、故障转移、排障

## PPPoE 常见 MTU 与 MSS 问题

以太网上 PPPoE 通常引入 8 字节开销，常见 MTU 为 1492；若上游还有 VLAN、隧道或运营商特殊封装，实际可用 MTU 可能更小。症状是小包正常、部分 HTTPS/VPN 卡住。先用禁止分片的 ping 探测路径 MTU，核对 WAN device 与 PPPoE l3_device，并使用防火墙 MTU fix/MSS clamping；不要随意把所有接口都降到很小。核验日期：2026-08-03。来源：https://openwrt.org/docs/guide-user/network/wan/internet.connection

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/5426d657-3ff4-49dd-8836-c5fb28840004-openwrt-geek-part-04-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：PPPoE、MTU、MSS、HTTPS

## 双重 NAT 与 CGNAT 的识别

比较 OpenWrt WAN 地址和公网查询地址。WAN 若为 RFC1918、100.64.0.0/10 或与公网地址不一致，可能存在上级路由 NAT 或运营商 CGNAT。双 NAT 对普通上网影响有限，但端口转发、入站 VPN、某些游戏和 NAT loopback 会复杂化；需要上级桥接、逐级端口转发、获取公网地址或改用主动出站隧道。核验日期：2026-08-03。来源：https://openwrt.org/docs/guide-user/network/wan/access.modem.through.nat

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/5426d657-3ff4-49dd-8836-c5fb28840004-openwrt-geek-part-04-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：双NAT、CGNAT、端口转发

## 访问桥接光猫或调制解调器管理页

可在 WAN 的二层 device 上增加与光猫管理网段同网段的静态 alias，并把该 interface 放入 wan zone；PPPoE 情况不能把地址配到 pppoe-wan 的三层隧道上，应找到实际物理 device。确保光猫管理网段不与 LAN 重叠，必要时给返回流量做源 NAT。核验日期：2026-08-03。来源：https://openwrt.org/docs/guide-user/network/wan/access.modem.through.nat

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/5426d657-3ff4-49dd-8836-c5fb28840004-openwrt-geek-part-04-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：光猫、管理页、PPPoE、alias

## DHCP 静态租约的正确定位

IPv4 静态租约通常按 MAC 绑定地址；IPv6 可按 DUID/hostid。设备启用随机 MAC 后会被视为新客户端，双网卡也应分别定义。租约地址应在 LAN 子网内，并避免和手工静态地址冲突；修改后重启 dnsmasq 并让客户端重新获取租约。核验日期：2026-08-03。来源：https://openwrt.org/docs/guide-user/base-system/dhcp_configuration

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/5426d657-3ff4-49dd-8836-c5fb28840004-openwrt-geek-part-04-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：DHCP、静态租约、MAC、DUID

## DHCP 白名单不是安全隔离

关闭动态 DHCP 或只给已知 MAC 分配地址，不能阻止用户手工配置静态 IP，也不能防止 MAC 欺骗。真正的访问控制应使用 WPA2/WPA3、802.1X、VLAN、AP isolation 和防火墙策略；DHCP 限制只适合地址管理。核验日期：2026-08-03。来源：https://openwrt.org/docs/guide-user/base-system/dhcp_configuration

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/5426d657-3ff4-49dd-8836-c5fb28840004-openwrt-geek-part-04-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：DHCP、白名单、安全、MAC

## 上游 DNS 的实际选择

dnsmasq 默认读取 WAN/WAN6 从运营商获得的 peer DNS，并通过 /tmp/resolv.conf.d/resolv.conf.auto 使用。若要固定上游，应在 WAN/WAN6 关闭 peerdns 并配置 DNS，或在 dnsmasq 明确 server/noresolv。只改客户端 DHCP option 6 会让客户端绕过路由器 DNS，不等于更换 dnsmasq 的上游。核验日期：2026-08-03。来源：https://openwrt.org/docs/guide-user/base-system/dhcp_configuration

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/5426d657-3ff4-49dd-8836-c5fb28840004-openwrt-geek-part-04-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：DNS、dnsmasq、peerdns、resolv.conf

## DNS rebind protection 导致私网域名失败

dnsmasq 的 rebind protection 会拒绝公网 DNS 返回 RFC1918/本地地址，以防 DNS rebinding。内网服务、CDN 回源或运营商域名若合法返回私网地址，应只对白名单域名添加 rebind exception；不要全局关闭保护。用 logread -e dnsmasq 和 nslookup 域名 127.0.0.1 确认是否被拦截。核验日期：2026-08-03。来源：https://openwrt.org/docs/guide-user/base-system/dhcp_configuration

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/5426d657-3ff4-49dd-8836-c5fb28840004-openwrt-geek-part-04-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：DNS、rebind、dnsmasq、私网

## EDNS 包大小与疑难 DNS

路径 MTU、PPPoE、VPN 或错误的 ICMPv6 过滤可能导致较大的 DNS UDP 响应丢失。OpenWrt 常把 ednspacket_max 设为 1232 以降低分片风险。若出现部分域名偶发失败，比较路由器和上游直查结果，分别测试 UDP/TCP 53，并抓取 br-lan 与 WAN 两侧数据包，不要先把问题归因于缓存。核验日期：2026-08-03。来源：https://openwrt.org/docs/guide-user/base-system/dhcp_configuration

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/5426d657-3ff4-49dd-8836-c5fb28840004-openwrt-geek-part-04-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：DNS、EDNS、1232、MTU、抓包

## IPv6 Prefix Delegation 的基本模型

WAN6 从 ISP 获得 GUA prefix delegation，OpenWrt 再按 `ip6assign`/assignment hint 向各 LAN 分配通常为 /64 的子网；LAN 通过 RA 和可选 DHCPv6 获得地址与默认路由。/56 可划分 256 个 /64，/60 可划分 16 个 /64，而 ISP 只给 /64 时不能正常再切多个标准 /64。

来源：https://openwrt.org/docs/guide-user/network/ipv6/troubleshooting
核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/75d1e0e6-8d62-408f-907f-26ce62612d51-openwrt-geek-part-05-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：IPv6、PD、RA、DHCPv6、前缀委派

## ISP 只给一个 /64 时的选择

如果上游只委派 /64，又要让多个下游二层网络共享该前缀，可考虑 odhcpd relay/NDP proxy，但这些网络并不获得真正独立的可路由 /64，隔离和可靠性更复杂。优先向 ISP 获取更短前缀（如 /56 或 /60）。NAT66 能绕开前缀不足，但不是首选的原生 IPv6 设计。

来源：https://openwrt.org/docs/guide-user/network/ipv6/troubleshooting
核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/75d1e0e6-8d62-408f-907f-26ce62612d51-openwrt-geek-part-05-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：IPv6、/64、relay、NDP、proxy、NAT66

## IPv6 排障必须检查默认路由和源地址

先看 WAN6 是否获得地址和 delegated prefix，再看 LAN 是否有 /64、客户端是否收到 RA、`ip -6 route` 是否存在默认路由。分别 ping 链路本地网关、路由器 GUA、外部 IPv6，并用 `ip -6 route get` 检查选源；抓包观察 RS/RA、DHCPv6 和 ICMPv6 Packet Too Big。不要粗暴封禁所有 ICMPv6，它是邻居发现和 PMTU 的基础。

来源：https://openwrt.org/docs/guide-user/network/ipv6/troubleshooting
核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/75d1e0e6-8d62-408f-907f-26ce62612d51-openwrt-geek-part-05-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：IPv6、排障、RA、ICMPv6、路由

## firewall4 使用 nftables

OpenWrt 22.03 及以后默认 firewall4/fw4，以 nftables 为后端。`iptables -L` 可能只看到兼容层的一部分，权威运行规则应看 `fw4 print` 与 `nft list ruleset`。旧的 `/etc/firewall.user`、iptables 扩展和依赖 ipset 的教程可能不兼容，迁移时应选原生 nft set/规则或明确安装兼容包。

来源：https://openwrt.org/docs/guide-user/firewall/firewall_configuration
核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/75d1e0e6-8d62-408f-907f-26ce62612d51-openwrt-geek-part-05-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：firewall4、nftables、fw4、iptables

## 防火墙 input、forward、output 的区别

input 控制发往路由器自身的流量，例如 LuCI、SSH、DNS；forward 控制穿过路由器去其他主机/区域的流量；output 控制路由器本机发出的流量。端口转发既涉及 DNAT，也需要相应 forward 许可。只开放 WAN→router 的 input 不会自动允许访问 LAN 主机，反之亦然。

来源：https://openwrt.org/docs/guide-user/firewall/firewall_configuration
核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/75d1e0e6-8d62-408f-907f-26ce62612d51-openwrt-geek-part-05-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：防火墙、input、forward、output、zone

## 自定义 nftables 规则的推荐入口

fw4 支持 `/usr/share/nftables.d/` 下按位置加载、扩展 chain 或 ruleset 的 `.nft` 片段。自定义规则应使用 fw4 提供的 include 机制并运行 `fw4 check`/`nft -c` 验证，避免在服务启动后临时插规则，因为 firewall reload 会清掉未纳入配置的内容。

来源：https://openwrt.org/docs/guide-user/firewall/firewall_configuration
核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/75d1e0e6-8d62-408f-907f-26ce62612d51-openwrt-geek-part-05-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：nftables、自定义规则、fw4、include

## 端口转发不通的系统化检查

确认 WAN 是否真有可入站公网地址、上级是否还有 NAT、服务是否监听正确 LAN 地址/端口、DNAT 命中计数是否增长、LAN 主机默认网关是否指向 OpenWrt，以及回程是否被 PBR/mwan/VPN 导走。用 WAN 侧抓包判断包有没有到，用 LAN 侧抓包判断 DNAT 后是否发出；从内网用公网域名测试还额外依赖 NAT loopback/hairpin。

来源：https://openwrt.org/docs/guide-user/firewall/firewall_configuration
核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/75d1e0e6-8d62-408f-907f-26ce62612d51-openwrt-geek-part-05-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：端口转发、DNAT、hairpin、抓包

## 流量卸载与 SQM 的冲突

software/hardware flow offloading 让已建立流绕过部分 Netfilter 处理以提高吞吐；hardware offload 还可能绕过 QoS。SQM/CAKE 需要看到并调度全部相关流量，因此启用 SQM 时通常应关闭 flow offloading，尤其是 hardware offload。若策略路由、流量统计、限速或过滤异常，也应先关闭卸载复测。

来源：https://openwrt.org/docs/guide-user/perf_and_log/flow_offloading
核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/75d1e0e6-8d62-408f-907f-26ce62612d51-openwrt-geek-part-05-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：flow、offload、SQM、CAKE、硬件加速

## SQM 的目标是控制瓶颈队列

SQM 通过把整形速率设为实际链路可持续速率的略低值，让队列留在路由器可控位置，并用 CAKE/fq_codel 降低 bufferbloat。上行和下行单位是 kbit/s，接口要选真实瓶颈 device；PPPoE、VLAN、DOCSIS、蜂窝网络还要考虑开销。先从实测速率约 85%–95% 起调，再在满载下看延迟。
标签：SQM、CAKE、bufferbloat、延迟
来源：https://openwrt.org/docs/guide-user/network/traffic-shaping/sqm_configuration
核验日期 2026-08-03。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/a11429d3-4bb7-40b5-8ff6-497181c3d08f-openwrt-geek-part-06-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：SQM、CAKE、bufferbloat、延迟

## 蜂窝链路做 SQM 的难点

4G/5G 可用带宽随小区负载、频段、信号和调度快速变化，固定 SQM 速率若高于瞬时链路就无法控队列，设得太低又浪费峰值。应使用保守可持续速率、按时段/信号动态调整，或接受吞吐与低延迟的取舍；测速时记录 RSRP/RSRQ/SINR、频段和基站负载条件。
标签：5G、4G、SQM、蜂窝、bufferbloat
来源：https://openwrt.org/docs/guide-user/network/traffic-shaping/sqm_configuration
核验日期 2026-08-03。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/a11429d3-4bb7-40b5-8ff6-497181c3d08f-openwrt-geek-part-06-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：5G、4G、SQM、蜂窝、bufferbloat

## WireGuard AllowedIPs 同时影响路由与身份

客户端 peer 的 AllowedIPs 决定哪些目的流量进入隧道；服务端 peer 的 AllowedIPs 还声明该 peer 被允许使用的隧道源地址，并参与 peer 选择。多个 peer 的网段不应意外重叠。全隧道通常使用 `0.0.0.0/0`、`::/0`，分流则列具体网段，并同步检查防火墙 zone 和返回路由。
标签：WireGuard、AllowedIPs、路由、peer
来源：https://openwrt.org/docs/guide-user/services/vpn/wireguard/server
核验日期 2026-08-03。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/a11429d3-4bb7-40b5-8ff6-497181c3d08f-openwrt-geek-part-06-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：WireGuard、AllowedIPs、路由、peer

## WireGuard 在 NAT 后的保活与端口

位于 NAT 后且需要随时接收流量的 peer 通常设置 `PersistentKeepalive=25`；公网服务端需允许 UDP listen port，若前面还有上级路由还要逐级转发。握手成功但不能访问 LAN 时，重点检查 peer AllowedIPs、OpenWrt zone forwarding、LAN 返回路由和是否发生地址重叠。
标签：WireGuard、NAT、keepalive、端口
来源：https://openwrt.org/docs/guide-user/services/vpn/wireguard/server
核验日期 2026-08-03。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/a11429d3-4bb7-40b5-8ff6-497181c3d08f-openwrt-geek-part-06-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：WireGuard、NAT、keepalive、端口

## Wi‑Fi 国家码不是性能开关

country code 决定允许信道、功率、DFS 和 6GHz 规则，必须匹配设备实际使用地；错误设置可能违法、导致客户端不兼容或雷达避让异常。发射功率最终受法规、校准数据、驱动和硬件共同限制，把 txpower 数值调高不代表实际 EIRP 一定增加。
标签：WiFi、国家码、功率、DFS、法规
来源：https://openwrt.org/docs/guide-user/network/wifi/start
核验日期 2026-08-03。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/a11429d3-4bb7-40b5-8ff6-497181c3d08f-openwrt-geek-part-06-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：WiFi、国家码、功率、DFS、法规

## DFS 信道掉线可能是正常雷达避让

5GHz DFS 信道启用前需要 CAC 监听，检测到雷达后 AP 必须停用或换信道，并在 non-occupancy period 内避免使用原信道。日志中查 hostapd/驱动的 radar/CAC 事件。对稳定性优先的场景可选当地允许的非 DFS 信道，但可用带宽和干扰环境会变化。
标签：WiFi、DFS、雷达、CAC、掉线
来源：https://openwrt.org/docs/guide-user/network/wifi/start
核验日期 2026-08-03。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/a11429d3-4bb7-40b5-8ff6-497181c3d08f-openwrt-geek-part-06-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：WiFi、DFS、雷达、CAC、掉线

## 更宽信道不一定更快

80/160/320MHz 能提高峰值 PHY rate，但占用更多频谱、受干扰和 DFS 影响更大，客户端也未必支持。实际吞吐由信号、空间流、MCS、重传、回程和 CPU共同决定。密集环境中较窄信道可能得到更高稳定吞吐；应结合 `iwinfo`/驱动统计和 iperf3 局域网测试。
标签：WiFi、80MHz、160MHz、320MHz、吞吐
来源：https://openwrt.org/docs/guide-user/network/wifi/start
核验日期 2026-08-03。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/a11429d3-4bb7-40b5-8ff6-497181c3d08f-openwrt-geek-part-06-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：WiFi、80MHz、160MHz、320MHz、吞吐

## 802.11r 只优化漫游认证，不替客户端做决定

802.11r Fast Transition 缩短 AP 间重新认证时间；客户端何时漫游仍由客户端算法决定。多个 AP 应保持一致 SSID、加密和 Mobility Domain，并确保 VLAN/子网一致。老旧或 IoT 客户端可能不兼容 FT，宜先用 `ft_over_ds`/`ft_psk_generate_local` 等匹配方案小范围验证。
标签：802.11r、FT、漫游、WiFi
来源：https://openwrt.org/docs/guide-user/network/wifi/start
核验日期 2026-08-03。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/a11429d3-4bb7-40b5-8ff6-497181c3d08f-openwrt-geek-part-06-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：802.11r、FT、漫游、WiFi

## 802.11s Mesh 与多 AP 漫游是两件事

802.11s 描述 AP/节点间无线 mesh backhaul，802.11r/k/v 帮助终端在接入点之间漫游。Mesh 不天然等于无缝漫游，也不会消除无线回程的半双工和同频复用损失。能拉网线时有线回程通常更稳；使用 Mesh 时要单独设计 backhaul 频段、VLAN 承载和 portal 故障恢复。来源：https://openwrt.org/docs/guide-user/network/wifi/mesh/rapiddeployment （核验日期：2026-08-03）

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/81b7a516-daef-42ff-b218-ef1da476d6c6-openwrt-geek-part-07-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：802.11s、Mesh、802.11r、回程

## USB 3.0 可能干扰 2.4GHz

USB 3.x 设备、线缆和接口的宽带噪声可能落在 2.4GHz 附近，表现为插入硬盘或 5G 模组后 2.4G 吞吐下降、丢包或覆盖变差。可通过改用屏蔽更好的短线、拉开天线与 USB 设备距离、换 USB2 模式或优先使用 5/6GHz 验证。来源：https://openwrt.org/docs/guide-user/network/wifi/start （核验日期：2026-08-03）

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/81b7a516-daef-42ff-b218-ef1da476d6c6-openwrt-geek-part-07-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：USB3、WiFi、2.4GHz、干扰

## 额外挂载与 extroot 的区别

把磁盘分区挂到 `/mnt/data` 只增加数据存储，不会增加 `/overlay` 的软件安装空间。extroot 是在 preinit 阶段把外部分区作为 overlay，才会扩大可写根文件系统。先明确需求：存日志/文件用普通挂载；要安装更多包才配置 extroot。来源：https://openwrt.org/docs/guide-user/storage/start （核验日期：2026-08-03）

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/81b7a516-daef-42ff-b218-ef1da476d6c6-openwrt-geek-part-07-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：extroot、挂载、overlay、扩容

## 识别块设备和文件系统

安装 `block-mount` 与对应 USB/文件系统驱动后，用 `block info` 获取 UUID、LABEL、TYPE，`lsblk -f`/`dmesg` 查看设备名和枚举。fstab 优先按 UUID 引用，避免 `/dev/sda1` 因插拔顺序变化。修改分区前确认目标设备容量和序列号，防止把系统盘格式化。来源：https://openwrt.org/docs/techref/block_mount （核验日期：2026-08-03）

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/81b7a516-daef-42ff-b218-ef1da476d6c6-openwrt-geek-part-07-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：block-mount、UUID、lsblk、存储

## extroot 的准备与验证

extroot 分区一般使用 ext4 等 Linux 文件系统，安装 `block-mount` 和相应 kmod，复制当前 overlay 内容，再在 `/etc/config/fstab` 配置目标为 `/overlay`。重启前运行 `block info` 和 `mount` 校验 UUID；重启后用 `mount`、`df -h`、`ubus call system board` 确认实际 overlay 设备，不能只看 LuCI 容量。来源：https://openwrt.org/docs/guide-user/storage/start （核验日期：2026-08-03）

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/81b7a516-daef-42ff-b218-ef1da476d6c6-openwrt-geek-part-07-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：extroot、fstab、ext4、block-mount

## extroot 失效时为什么系统像恢复出厂

外部盘未识别、UUID 改变、驱动不在只读固件或文件系统损坏时，系统会回退到内部 overlay，看起来像配置和软件包全部消失，但外部数据通常仍在。不要立即重新格式化；先查 dmesg、block info、fstab 和挂载日志，修好后重新挂载即可找回原 extroot 内容。来源：https://openwrt.org/docs/guide-user/storage/start （核验日期：2026-08-03）

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/81b7a516-daef-42ff-b218-ef1da476d6c6-openwrt-geek-part-07-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：extroot、失效、回退、数据恢复

## 文件系统选择要考虑断电和写放大

ext4 是 OpenWrt 外置存储的常见稳妥选择；F2FS 面向闪存，btrfs 功能丰富但资源和恢复复杂度更高；exFAT/NTFS 适合跨平台数据盘，不适合作为要求 Unix 权限和符号链接的 extroot。频繁日志、数据库和 swap 会增加 TF/闪存写入，应使用高耐久介质并做好备份。来源：https://openwrt.org/docs/guide-user/storage/usb-drives （核验日期：2026-08-03）

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/81b7a516-daef-42ff-b218-ef1da476d6c6-openwrt-geek-part-07-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：ext4、F2FS、btrfs、TF卡、文件系统

## 内核模块必须精确匹配 ABI

kmod 包依赖构建时的内核版本和 ABI 哈希。即使 CPU 架构相同，另一个 release/snapshot 的 kmod 也常因 `kernel (= …)` 依赖拒绝安装；强制安装可能无法加载甚至导致崩溃。snapshot 仓库滚动后尤其容易出现镜像与在线 kmod 不同步，应保存匹配仓库或重刷同批镜像。来源：https://openwrt.org/docs/guide-user/additional-software/imagebuilder （核验日期：2026-08-03）

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/81b7a516-daef-42ff-b218-ef1da476d6c6-openwrt-geek-part-07-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：kmod、内核ABI、snapshot、软件源

## 不要混用不同发行版的软件源

OpenWrt、ImmortalWrt 和其他第三方分支可能采用不同补丁、包签名、C 库选项与内核 ABI。修改 distfeeds 只改变下载地址，不会使软件包兼容。镜像显示哪个 DISTRIB_ID/target/arch，就应使用该构建对应的签名仓库；第三方镜像的维护者应提供可复现的 feeds 和哈希。（核验日期：2026-08-03；来源：https://github.com/immortalwrt/immortalwrt）

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/c1a862b0-7b28-4036-a4d3-07f4398772a6-openwrt-geek-part-08-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：软件源、ImmortalWrt、OpenWrt、兼容

## Image Builder 适合批量和小闪存定制

Image Builder 使用预编译包生成定制镜像，可预装驱动、LuCI 和首次启动配置，比刷机后逐包安装更节省 SquashFS 空间，也适合批量一致部署。它不是完整源码编译环境，必须选择正确 target/subtarget 和版本；构建前保存 package list、FILES 覆盖内容和生成镜像的 SHA-256。（核验日期：2026-08-03；来源：https://openwrt.org/docs/guide-user/additional-software/imagebuilder）

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/c1a862b0-7b28-4036-a4d3-07f4398772a6-openwrt-geek-part-08-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：ImageBuilder、定制固件、批量

## LuCI 与 SSH 的最低安全基线

首次启动立即设置唯一强密码或 SSH key；Dropbear 仅绑定可信 LAN/VPN，禁止从 WAN 直接开放管理口。LuCI 使用 HTTPS，必要时把 HTTP 重定向到 HTTPS，并限制管理 VLAN。不要把 ttyd、ubus RPC、SFTP、调试 Web 服务暴露到不可信网络；远程管理首选 WireGuard。（核验日期：2026-08-03；来源：https://openwrt.org/docs/guide-user/security/openwrt_security）

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/c1a862b0-7b28-4036-a4d3-07f4398772a6-openwrt-geek-part-08-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：安全、LuCI、SSH、Dropbear、HTTPS

## 时间错误会伪装成网络或证书故障

设备无 RTC 或首次启动尚未联网时，系统时间可能错误，造成 HTTPS 证书、软件包签名、DNS over TLS、VPN 证书和日志时间异常。先用 `date`、`logread -e ntp`、`ubus call system board` 检查时间与时区，再判断 TLS 服务本身。自定义加密 DNS 时要给 NTP 留出不依赖该 DNS 的引导路径。（核验日期：2026-08-03；来源：https://openwrt.org/docs/guide-user/base-system/system_configuration）

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/c1a862b0-7b28-4036-a4d3-07f4398772a6-openwrt-geek-part-08-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：NTP、时间、TLS、证书、软件包

## 抓包要选对层和双侧对照

先通过 ubus 确定 LAN bridge、WAN L2 device 和协议 l3_device。用 `tcpdump -ni br-lan host <客户端>` 看进入路由器的包，再在 WAN/l3_device 看是否出去；加 `-e` 可观察 VLAN tag，`-s0 -w /tmp/capture.pcap` 保留完整包。路由器 `/tmp` 在内存中，长时间抓包要限制大小或写到外置盘。（核验日期：2026-08-03；来源：https://openwrt.org/docs/guide-user/base-system/basic）

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/c1a862b0-7b28-4036-a4d3-07f4398772a6-openwrt-geek-part-08-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：tcpdump、抓包、br-lan、WAN、VLAN

## 连接跟踪问题的识别

NAT 和状态防火墙依赖 conntrack。大量短连接、P2P 或攻击可能耗尽表，表现为新连接失败而已有连接仍通。检查 `cat /proc/sys/net/netfilter/nf_conntrack_count` 与 `nf_conntrack_max`、日志中的 table full，并找连接来源。提高上限会增加内存占用，根治应限制异常客户端、优化超时或减少无意义连接。（核验日期：2026-08-03；来源：https://openwrt.org/docs/guide-user/firewall/firewall_configuration）

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/c1a862b0-7b28-4036-a4d3-07f4398772a6-openwrt-geek-part-08-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：conntrack、NAT、table、full、内存

## 内存不足与闪存不足要分开

`free -h`/`/proc/meminfo` 反映 RAM，`df -h` 反映文件系统，`df -i` 反映 inode；三者耗尽症状不同。Linux 会用空闲 RAM 做缓存，低 free 不等于 OOM，应看 available、swap、进程 RSS 和内核 OOM 日志。路由器上盲目 drop_caches 不是长期优化。（核验日期：2026-08-03；来源：https://openwrt.org/docs/guide-user/base-system/system_configuration）

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/c1a862b0-7b28-4036-a4d3-07f4398772a6-openwrt-geek-part-08-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：内存、OOM、闪存、df、free

## No space left on device 的排查

先确定报错来自 `/overlay`、`/tmp` 还是 inode。SquashFS 中的预装包不可通过 opkg 真正释放只读空间，删除只生成 whiteout；后装包和日志才占 overlay。清理前用 `du -x -h /overlay/upper` 定位，保留配置备份；若固件本身太大，应使用 Image Builder 重做精简镜像或配置 extroot。（核验日期：2026-08-03；来源：https://openwrt.org/docs/techref/flash.layout）

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/c1a862b0-7b28-4036-a4d3-07f4398772a6-openwrt-geek-part-08-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：空间不足、overlay、tmp、inode

## 以太网链路问题先看物理协商

用 `ip -s link` 看 errors/dropped，`ethtool <device>` 看速率、双工、link detected 和协商能力，dmesg 看 PHY reset。2.5G/5G/10G 对线材、模块、温度和对端兼容更敏感；吞吐只有约 94Mbps 时常是协商到 100M。先换短的合格线和端口，再调驱动或 flow offload。
标签：Ethernet、ethtool、2.5G、协商
来源：https://openwrt.org/docs/guide-user/base-system/basic
核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/59bd5e52-f08e-46c0-80fa-56b929806393-openwrt-geek-part-09-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：Ethernet、ethtool、2.5G、协商

## 4G/5G 模组先识别工作模式

蜂窝模组可能呈现 QMI、MBIM、ECM、NCM、RNDIS、串口 PPP 或厂商 PCIe/MHI 接口。用 `lsusb -t`、`dmesg`、`ls /dev/cdc-wdm* /dev/ttyUSB*` 和驱动绑定判断，不能看到 ttyUSB 就假定数据走串口。选与固件模式匹配的 proto 和驱动，避免同时启动多个拨号管理器抢占模组。
标签：5G模组、QMI、MBIM、ECM、NCM、RNDIS
来源：https://openwrt.org/docs/guide-user/network/wan/wwan/start
核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/59bd5e52-f08e-46c0-80fa-56b929806393-openwrt-geek-part-09-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：5G模组、QMI、MBIM、ECM、NCM、RNDIS

## QMI 与 MBIM 的基本排障

QMI 常由 qmi_wwan + uqmi/厂商工具管理，MBIM 常由 cdc_mbim + umbim/ModemManager 管理；两者通常通过 `/dev/cdc-wdmX` 控制并由 wwanX 等网卡承载数据。检查 SIM PIN、APN、PDP 类型、注册状态、raw-ip 设置、MTU、默认路由和 DNS。拨号显示 connected 但无流量时要同时抓控制日志与数据接口。
标签：QMI、MBIM、cdc-wdm、wwan、APN
来源：https://openwrt.org/docs/guide-user/network/wan/wwan/ltedongle
核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/59bd5e52-f08e-46c0-80fa-56b929806393-openwrt-geek-part-09-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：QMI、MBIM、cdc-wdm、wwan、APN

## AT 口与数据口的角色不同

一个模组可能暴露多个 ttyUSB/ttyACM：AT、诊断、GPS/NMEA、modem 等端口用途不同且编号会随固件/USB 组合变化。通过 `ATI`、`AT+CPIN?`、`AT+CEREG?` 等只读命令验证 AT 口，避免向诊断口乱发命令。QMI/MBIM 数据会话通常不通过 AT 串口承载。
标签：AT命令、ttyUSB、5G模组、诊断
来源：https://openwrt.org/docs/guide-user/network/wan/wwan/start
核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/59bd5e52-f08e-46c0-80fa-56b929806393-openwrt-geek-part-09-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：AT命令、ttyUSB、5G模组、诊断

## ModemManager 与专用拨号脚本不要并行

ModemManager 会探测并管理支持的 QMI/MBIM/串口模组，厂商 qmodem、quectel-CM、uqmi 或自定义 hotplug 也可能做同样工作。多个管理器同时启用会出现反复断线、端口 busy、配置互相覆盖。确认系统到底由哪个服务拥有模组，停用其余服务后再排障。
标签：ModemManager、qmodem、quectel-CM、冲突
来源：https://openwrt.org/docs/guide-user/network/wan/wwan/modemmanager
核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/59bd5e52-f08e-46c0-80fa-56b929806393-openwrt-geek-part-09-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：ModemManager、qmodem、quectel-CM、冲突

## 蜂窝链路多 WAN 要保持会话出口一致

5G 与有线 WAN 做 mwan3 时，健康检查应选模组实际 data interface，策略要保证同一连接及相关协议流走同一出口。公网地址、CGNAT、DNS 和 MTU可能在重拨后改变；入站服务不应假定蜂窝公网可达。故障切换会中断依赖源地址的现有会话，这是正常现象。
标签：5G、mwan3、多WAN、会话、CGNAT
来源：https://openwrt.org/docs/guide-user/network/wan/multiwan/mwan3
核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/59bd5e52-f08e-46c0-80fa-56b929806393-openwrt-geek-part-09-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：5G、mwan3、多WAN、会话、CGNAT

## 串口救砖必须确认电平

路由器板载 UART 常为 3.3V TTL，不能直接接 RS-232，也不应未经确认连接 USB-TTL 的 VCC。通常只接 GND、TX、RX并交叉，先确认电平和波特率；写入 bootloader、factory/calibration 分区前必须备份，因为这些分区可能包含 MAC、Wi‑Fi 校准和设备唯一数据。
标签：UART、串口、救砖、3.3V、factory
来源：https://openwrt.org/docs/guide-user/troubleshooting/failsafe_and_factory_reset
核验日期：2026-08-03

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/59bd5e52-f08e-46c0-80fa-56b929806393-openwrt-geek-part-09-of-09.md
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：UART、串口、救砖、3.3V、factory

## NRadio 鲲鹏无限产品型号索引（截至2026-08-03）

根据NRadio官网产品中心（https://www.nradiowifi.com/chanpin/）和文档中心（https://www.nradiowifi.com/fuwu/wendang/），截至2026-08-03，官网四个产品分类页共列出25个唯一型号。5G CPE（15款）：C8-788、C2000 MAX、AM5、C8-688、C8-668GL、C8-618、C5800-688、C5800-650、C5800-668GL、C2000-500、C2000-518、NBCPE-688、NBCPE-650、NBCPE-668GL、AK68-788。RedCap 5G（6款）：A8-510、DD-510、CC-500 Pro、CC-500、TK-500、TT-500。全球漫游（3款）：CC-100GL、TT-100GL、TK-100GL。其他（1款）：N6700 AX6000 Wi-Fi 6 四频缓存路由器。另有一款历史官方产品：N8 AX1800 Wi-Fi 6 路由器，仍保留官方说明页，但不在当前四个分类页中。

- 来源：https://www.nradiowifi.com/chanpin/
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：NRadio、鲲鹏无限、产品索引、型号目录、5G CPE、RedCap 5G、全球漫游、N6700、N8、C8-788、C2000 MAX、AM5

## NRadio 鲲鹏无限硬件参数使用边界

NRadio产品硬件参数记录遵循以下边界：1. 本批文件优先记录官网产品页和官方说明书明确公开的硬件参数，未公开字段标记为“官网未公开”，不根据同系产品猜测；2. 同一型号可能因销售地区、批次、供应链、软件版本或套餐而变化，实际回答应以机身铭牌、购买页面、当批包装和官方售后确认为准；3. “最高速率”和Wi-Fi速率为官方参数表中的理论值，不代表实际业务必然达到的速率，信号、频段、运营商、网络负载、终端和环境都会影响实测；4. C2000-500当前产品目录标称为AX900，但产品页现有参数图显示AX1500，存在官方页面信息不一致，对外回答时必须说明差异并请用户确认批次；5. 官网产品页的功能图、测试数据和应用场景不等同于硬件承诺，知识库会尽量将“硬件规格”与“功能或实验室测试”分开。

- 来源：https://www.nradiowifi.com/chanpin/
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：NRadio、鲲鹏无限、参数使用边界、官网未公开、理论速率、批次差异、C2000-500、AX900、AX1500

## NRadio 鲲鹏无限硬件参数文件导航

NRadio硬件参数知识库按系列分为四份文件：01-5G-CPE-详细硬件参数.md 覆盖C8、C5800、C2000、NBCPE、AK68、AM5；02-RedCap-5G-详细硬件参数.md 覆盖A8、DD、CC-500、TK-500、TT-500；03-全球漫游-详细硬件参数.md 覆盖CC-100GL、TT-100GL、TK-100GL；04-其他与历史产品-详细硬件参数.md 覆盖N6700和N8。

- 来源：https://www.nradiowifi.com/chanpin/
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：NRadio、鲲鹏无限、参数文件、文档导航、详细硬件参数

## C2000 MAX

C2000 MAX（C2000 Max）是 NRadio 的一款 BE3600 Wi-Fi 7 Mini 5G CPE。核对日期：2026-08-03。产品定位：BE3600 Wi-Fi 7 Mini 5G CPE。5G 平台：海思巴龙，MT5700 模组；支持 3CC 载波聚合、N79 和 SUL 上行增强。CPU：ARM Cortex-A53 双核 2GHz。内存与存储：512MB 内存，32MB 闪存；支持 TF 存储卡，说明书标注支持 1GB–2TB。Wi-Fi：Wi-Fi 7 BE3600；2.4GHz 理论 688Mbps，5GHz 理论 2882Mbps，双频并发标称 3570Mbps。蜂窝频段：5G NR N1/N3/N5/N8/N28/N41/N78/N79；LTE-FDD B1/B3/B5/B8；LTE-TDD B34/B38/B39/B40/B41；WCDMA B1/B8。理论蜂窝速率：5G 下行 4Gbps、上行 1.5Gbps；LTE 下行 900Mbps、上行 200Mbps。网口：1 个 2.5Gbps WAN/LAN 自适应网口。SIM：2 个外置 Nano-SIM 卡槽，支持智能切卡；官方页面同时提到内置套餐/eSIM 选项，具体是否提供需确认批次和套餐。天线：5 根内置 Wi-Fi 天线，4 根高增益 5G 天线。供电：USB-C PD，支持 5V/3A、9V/2.22A、12V/1.67A。尺寸与重量：120×120×22mm，约 220g。系统：NROS 2.0 和 OpenWrt，官方资料称可切换后台。散热：官方称八层散热结构。性能说明：官方页面实验室测试出现约 1.6–1.8Gbps，该数值不应作为用户环境的保证。注意：以上速率为官方参数表中的理论最高值，不是实际网速承诺；不同地区、批次和套餐的模组、频段、SIM 形态可能不同，实机信息优先。官方来源：https://www.nradiowifi.com/article/265.html、https://www.nradiowifi.com/article/C2000%E8%AF%B4%E6%98%8E%E4%B9%A6.html。

- 来源：https://www.nradiowifi.com/chanpin/
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：C2000 MAX、C2000 Max、BE3600、Wi-Fi 7、Mini 5G CPE、海思巴龙、MT5700、3CC、N79、SUL、2.5G网口、USB-C PD

## C8-788

C8-788 是 NRadio 的一款旗舰级 BE3600 Wi-Fi 7 5G CPE。核对日期：2026-08-03。产品定位：旗舰级 BE3600 Wi-Fi 7 5G CPE。CPU：MediaTek MT7987B 双核 2GHz。5G 模组：海思新巴龙；支持 3CC 载波聚合和 N79。内存与存储：512MB DDR3，128MB NAND。Wi-Fi：Wi-Fi 7 BE3600；2.4GHz 688Mbps + 5GHz 2882Mbps。蜂窝频段：5G NR N1/N3/N5/N8/N28/N41/N78/N79；LTE-FDD B1/B3/B5/B8；LTE-TDD B34/B38/B39/B40/B41；WCDMA B1/B8。理论蜂窝速率：5G 下行 4Gbps（3CC 8:2）、上行 1.5Gbps（2CC 2:3）；LTE 下行 900Mbps、上行 200Mbps。网口：1 个 2.5G LAN/WAN + 3 个千兆 LAN。SIM：双外置 SIM 卡槽，支持智能切换。供电：DC 12V/1.5A。尺寸：100×100×200mm。其他官方功能：内置 AC 控制器、风扇散热、插件/应用能力与两种运行模式；这些属于功能特性，不是额外的硬件接口。注意：以上速率为官方参数表中的理论最高值，不是实际网速承诺；不同地区、批次和套餐的模组、频段、SIM 形态可能不同，实机信息优先。官方来源：https://www.nradiowifi.com/article/270.html。

- 来源：https://www.nradiowifi.com/chanpin/
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：C8-788、C8、BE3600、Wi-Fi 7、5G CPE、MediaTek MT7987B、海思新巴龙、3CC、N79、2.5G、AC控制器

## C8-688

C8-688 是 NRadio 的一款 Wi-Fi 6 5G CPE。核对日期：2026-08-03。CPU：MediaTek MT7981B 双核 1.3GHz。5G 平台：海思巴龙。内存与存储：1GB DDR4，8GB eMMC。Wi-Fi：Wi-Fi 6 AX3000；2.4GHz 574Mbps + 5GHz 2402Mbps。频段：5G NR N1/N3/N5/N8/N28/N41/N78/N79；LTE-FDD B1/B3/B5/B8；LTE-TDD B34/B38/B39/B40/B41；WCDMA B1/B8。理论速率：5G 4Gbps/1.5Gbps；LTE 900Mbps/200Mbps。网口：1 个 2.5G WAN + 3 个千兆 LAN。SIM：双 Nano-SIM。供电：DC 12V/1.5A。尺寸：100×100×200mm。注意：以上速率为官方参数表中的理论最高值，不是实际网速承诺；不同地区、批次和套餐的模组、频段、SIM 形态可能不同，实机信息优先。官方来源：https://www.nradiowifi.com/article/230.html。

- 来源：https://www.nradiowifi.com/chanpin/
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：C8-688、C8、AX3000、Wi-Fi 6、5G CPE、MediaTek MT7981B、海思巴龙、2.5G、1GB DDR4、8GB eMMC

## C8-668GL

C8-668GL 是 NRadio 的一款全球版 Wi-Fi 6 5G CPE。核对日期：2026-08-03。CPU：ARM Cortex-A53 双核 1.3GHz。5G 平台：高通 X62 级，官方参数页列出 Quectel RM520N-GL。内存与存储：1GB DDR4，8GB eMMC。Wi-Fi：Wi-Fi 6 AX3000；2.4GHz 574Mbps + 5GHz 2402Mbps。5G NR：N1/N2/N3/N5/N7/N8/N12/N13/N14/N18/N20/N25/N26/N28/N29/N30/N38/N40/N41/N48/N66/N70/N71/N75/N76/N77/N78/N79，页面分别列有 SA/NSA 能力。LTE-FDD：B1/B2/B3/B4/B5/B7/B8/B12/B13/B14/B17/B18/B19/B20/B25/B26/B28/B29/B30/B32/B66/B71。LTE-TDD：B34/B38/B39/B40/B41/B42/B43/B48；LAA B46；WCDMA B1/B2/B4/B5/B8/B19。理论速率：SA 2.4Gbps/900Mbps，NSA 3.4Gbps/550Mbps，LTE 1.6Gbps/200Mbps，WCDMA 42Mbps/5.76Mbps。网口：1 个 2.5G LAN/WAN + 3 个千兆 LAN。按键与供电：电源键、WPS；DC 12V/1.5A。尺寸与环境：100×100×200mm；工作温度 0–40℃。注意：以上速率为官方参数表中的理论最高值，不是实际网速承诺；不同地区、批次和套餐的模组、频段、SIM 形态可能不同，实机信息优先。官方来源：https://www.nradiowifi.com/article/202.html。

- 来源：https://www.nradiowifi.com/chanpin/
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：C8-668GL、C8、AX3000、Wi-Fi 6、5G CPE、高通 X62、Quectel RM520N-GL、全球频段、SA、NSA、2.5G

## C8-618

C8-618 是 NRadio 的一款 Wi-Fi 6 5G CPE。核对日期：2026-08-03。CPU：MediaTek MT7981B 双核 1.3GHz。5G 模组：紫光展锐 V510。内存与存储：256MB 内存，16MB 闪存。Wi-Fi：Wi-Fi 6 AX3000；2.4GHz 574Mbps + 5GHz 2402Mbps。频段：5G NR N1/N8/N28/N41/N78；LTE B1/B3/B5/B8/B34/B38/B39/B40/B41。理论速率：5G 下行 2Gbps、上行 450Mbps；LTE 下行 400Mbps、上行 75Mbps。网口：1 个千兆 WAN/LAN + 3 个千兆 LAN。SIM：双 Nano-SIM。供电：DC 12V/1.5A。尺寸：100×100×200mm。注意：以上速率为官方参数表中的理论最高值，不是实际网速承诺；不同地区、批次和套餐的模组、频段、SIM 形态可能不同，实机信息优先。官方来源：https://www.nradiowifi.com/article/249.html。

- 来源：https://www.nradiowifi.com/chanpin/
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：C8-618、C8、AX3000、Wi-Fi 6、5G CPE、MediaTek MT7981B、紫光展锐 V510、千兆、双Nano-SIM

## C5800-688

C5800-688 是 NRadio 的一款企业级 AX3000 Wi-Fi 6 多 SIM 5G CPE。核对日期：2026-08-03。定位：企业级 AX3000 Wi-Fi 6 多 SIM 5G CPE。CPU：MediaTek MT7981B 双核 1.3GHz；5G 平台为海思巴龙。内存与存储：1GB DDR4，8GB eMMC。Wi-Fi：AX3000，2.4GHz 574Mbps + 5GHz 2402Mbps。频段与速率：同官方巴龙版参数，5G NR N1/N3/N5/N8/N28/N41/N78/N79；LTE-FDD B1/B3/B5/B8；LTE-TDD B34/B38/B39/B40/B41；WCDMA B1/B8；5G 4Gbps/1.5Gbps，LTE 900Mbps/200Mbps。SIM：2 个内置 5G SIM + 4 个外置标准 SIM 卡槽。网口：1 个千兆 WAN + 2 个千兆 LAN + 1 个 2.5G PoE NBCPE 口。天线：2 根可折叠双频 Wi-Fi 天线、2 根可折叠 5G NR 天线、2 根 SMA 可拆 5G NR 天线。指示灯：系统、5G、4G、WAN/Wi-Fi 以及 3 级信号强度灯。供电：DC 12V/2A。尺寸与重量：230×148×28mm，约 1.26kg。环境：工作 0–40℃、10%–90%RH 无凝结；存储 -40–70℃、5%–90%RH 无凝结。注意：以上速率为官方参数表中的理论最高值，不是实际网速承诺；不同地区、批次和套餐的模组、频段、SIM 形态可能不同，实机信息优先。官方来源：https://www.nradiowifi.com/article/231.html。

- 来源：https://www.nradiowifi.com/chanpin/
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：C5800-688、AX3000、Wi-Fi 6、企业级、多SIM、5G CPE、海思巴龙、MediaTek MT7981B、2.5G PoE、NBCPE、SMA天线

## C5800-650

C5800-650 是 NRadio 的一款企业级 AX3000 Wi-Fi 6 多 SIM 5G CPE。核对日期：2026-08-03。CPU：MediaTek MT7981B 双核 1.3GHz；5G 平台为紫光展锐。内存与存储：1GB DDR4，8GB eMMC。Wi-Fi：Wi-Fi 6 AX3000，2.4GHz 574Mbps + 5GHz 2402Mbps。SIM：2 个内置 5G SIM + 4 个外置标准 SIM。网口：1 个千兆 WAN + 2 个千兆 LAN + 1 个 2.5G PoE NBCPE 口。天线、指示灯、尺寸与环境：与 C5800-688 的官方机身参数相同；230×148×28mm，约 1.26kg。供电：DC 12V/2A。蜂窝频段：官网当前页面未在可读文字区域完整列出，不应直接套用其他展锐型号，需以当批模组铭牌确认。注意：以上速率为官方参数表中的理论最高值，不是实际网速承诺；不同地区、批次和套餐的模组、频段、SIM 形态可能不同，实机信息优先。官方来源：https://www.nradiowifi.com/article/232.html。

- 来源：https://www.nradiowifi.com/chanpin/
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：C5800-650、AX3000、Wi-Fi 6、企业级、多SIM、5G CPE、紫光展锐、MediaTek MT7981B、2.5G PoE、NBCPE

## C5800-668GL

C5800-668GL 是 NRadio 的一款企业级全球版 Wi-Fi 6 5G CPE。核对日期：2026-08-03。CPU：ARM Cortex-A53 双核 1.3GHz；高通全球版 5G 平台。内存与存储：1GB DDR4，8GB eMMC。Wi-Fi：Wi-Fi 6 AX3000，2.4GHz 574Mbps + 5GHz 2402Mbps。频段：与 C8-668GL 官方表中的全球 NR/LTE/WCDMA 频段组合一致。理论速率：SA 2.4Gbps/900Mbps，NSA 3.4Gbps/550Mbps，LTE 1.6Gbps/200Mbps，WCDMA 42Mbps/5.76Mbps。网口：1 个 2.5G 口 + 3 个千兆口。SIM：4 个外置 SIM 卡槽。天线：4 根不可拆可折叠天线 + 2 根可拆天线。供电：DC 12V/2A。尺寸与环境：230×148×28mm；工作温度 0–40℃。注意：以上速率为官方参数表中的理论最高值，不是实际网速承诺；不同地区、批次和套餐的模组、频段、SIM 形态可能不同，实机信息优先。官方来源：https://www.nradiowifi.com/article/208.html。

- 来源：https://www.nradiowifi.com/chanpin/
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：C5800-668GL、AX3000、Wi-Fi 6、企业级、5G CPE、高通全球版、全球频段、2.5G、外置SIM

## C2000-500

C2000-500 是 NRadio 的一款 Wi-Fi 6 Mini 5G CPE。核对日期：2026-08-03。产品定位：官网目录标称 AX900 Wi-Fi 6 Mini 5G CPE。5G 模组：紫光展锐 V510。内存与存储：512MB 内存，256MB 存储。Wi-Fi：目录标称 AX900；但现有产品页参数图标注 AX1500（2.4GHz 287Mbps + 5GHz 1201Mbps）和 32 个客户端。该不一致须向用户明示。频段：5G NR N1/N8/N28/N41/N78；LTE B1/B3/B5/B8/B34/B38/B39/B40/B41。SIM：内置套餐卡为选配，另有 1 个外置 Nano-SIM。网口：1 个千兆 WAN/LAN。供电：USB-C 5V/2A。尺寸与环境：120×120×22mm；工作 0–40℃，存储 -40–70℃。注意：以上速率为官方参数表中的理论最高值，不是实际网速承诺；不同地区、批次和套餐的模组、频段、SIM 形态可能不同，实机信息优先。官方来源：https://www.nradiowifi.com/article/206.html。

- 来源：https://www.nradiowifi.com/chanpin/
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：C2000-500、AX900、AX1500、Wi-Fi 6、Mini 5G CPE、紫光展锐 V510、USB-C、Nano-SIM

## C2000-518

C2000-518 是 NRadio 的一款 AX1500 Wi-Fi 6 Mini 5G CPE。核对日期：2026-08-03。产品定位：AX1500 Wi-Fi 6 Mini 5G CPE。5G 模组：紫光展锐 V510。内存与存储：512MB 内存，256MB 存储。Wi-Fi：AX1500，2.4GHz 287Mbps + 5GHz 1201Mbps，最多 32 客户端。频段：5G NR N1/N8/N28/N41/N78；LTE B1/B3/B5/B8/B34/B38/B39/B40/B41。SIM：内置套餐卡选配 + 1 个外置 Nano-SIM。网口：1 个千兆 WAN/LAN。供电：USB-C 5V/2A。尺寸与环境：120×120×22mm；工作 0–40℃，存储 -40–70℃。注意：以上速率为官方参数表中的理论最高值，不是实际网速承诺；不同地区、批次和套餐的模组、频段、SIM 形态可能不同，实机信息优先。官方来源：https://www.nradiowifi.com/article/248.html。

- 来源：https://www.nradiowifi.com/chanpin/
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：C2000-518、AX1500、Wi-Fi 6、Mini 5G CPE、紫光展锐 V510、USB-C、Nano-SIM

## NBCPE-688（NB68 + AK68）

NBCPE-688 是 NRadio 的一款由 NB68 室内路由器和 AK68 室外 5G CPE 组成的套装。核对日期：2026-08-03。组成：NB68 室内路由器 + AK68 室外 5G CPE。NB68 CPU：MediaTek MT7981，ARM Cortex-A53 双核 1.3GHz。AK68 5G 平台：海思巴龙 MT5700。内存与存储：1GB DDR4，8GB eMMC。Wi-Fi：Wi-Fi 6 AX3000，2.4GHz 574Mbps + 5GHz 2402Mbps。频段：5G NR N1/N3/N5/N8/N28/N41/N78/N79；LTE-FDD B1/B3/B5/B8；LTE-TDD B34/B38/B39/B40/B41；WCDMA B1/B8。理论速率：5G 4Gbps/1.5Gbps；LTE 900Mbps/200Mbps。NB68 接口：1 个 2.5G NBCPE 口 + 3 个千兆 LAN，另有电源、多功能、复位控件。AK68 接口：1 个 2.5G PoE、重启/复位、1 个 Nano-SIM。供电：DC 12V/2A。尺寸：NB68 100×100×200mm；AK68 220×220×35mm。环境：工作 0–40℃，存储 -40–70℃。注意：以上速率为官方参数表中的理论最高值，不是实际网速承诺；不同地区、批次和套餐的模组、频段、SIM 形态可能不同，实机信息优先。官方来源：https://www.nradiowifi.com/article/235.html。

- 来源：https://www.nradiowifi.com/chanpin/
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：NBCPE-688、NB68、AK68、AX3000、Wi-Fi 6、5G CPE、海思巴龙、MT5700、2.5G PoE、NBCPE

## NBCPE-650（NB68 + AK68）

NBCPE-650 是 NRadio 的一款由 NB68 室内路由器和 AK68 室外 5G CPE 组成的套装。核对日期：2026-08-03。NB68 CPU：MediaTek MT7981 双核 1.3GHz；AK68 采用紫光展锐 V510。内存与存储：1GB DDR4，8GB eMMC。Wi-Fi：Wi-Fi 6 AX3000，2.4GHz 574Mbps + 5GHz 2402Mbps。频段：5G NR N1/N8/N28/N41/N78；LTE B1/B3/B5/B8/B34/B38/B39/B40/B41。理论速率：5G 2Gbps/450Mbps；LTE 400Mbps/75Mbps。接口、供电、尺寸和环境：与 NBCPE-688 的 NB68/AK68 机身组合一致。NB68 接口：1 个 2.5G NBCPE 口 + 3 个千兆 LAN，另有电源、多功能、复位控件；AK68 接口：1 个 2.5G PoE、重启/复位、1 个 Nano-SIM；供电：DC 12V/2A；尺寸：NB68 100×100×200mm，AK68 220×220×35mm；环境：工作 0–40℃，存储 -40–70℃。注意：以上速率为官方参数表中的理论最高值，不是实际网速承诺；不同地区、批次和套餐的模组、频段、SIM 形态可能不同，实机信息优先。官方来源：https://www.nradiowifi.com/article/236.html。

- 来源：https://www.nradiowifi.com/chanpin/
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：NBCPE-650、NB68、AK68、AX3000、Wi-Fi 6、5G CPE、紫光展锐 V510、2.5G PoE、NBCPE

## NBCPE-668GL（NB68 + AK68）

NBCPE-668GL 是 NRadio 的一款全球频段版 NB68 室内路由器 + AK68 室外 5G CPE 套装。核对日期：2026-08-03。定位：全球频段版 NB68 室内路由器 + AK68 室外 5G CPE。NB68：MediaTek MT7981 双核 1.3GHz，1GB DDR4，8GB eMMC，Wi-Fi 6 AX3000。蜂窝频段与速率：官方表为 668GL 全球 NR/LTE/WCDMA 组合，理论速率为 SA 2.4Gbps/900Mbps，NSA 3.4Gbps/550Mbps，LTE 1.6Gbps/200Mbps，WCDMA 42Mbps/5.76Mbps。NB68 网口：1 个 2.5G NBCPE + 3 个千兆 LAN。AK68：1 个 2.5G PoE，重启/复位，2 个 Nano-SIM。供电：DC 12V/2A。尺寸：NB68 100×100×200mm；AK68 220×220×35mm。批次说明：官网当前参数长图的全部频段字段显示不完整，具体出货区域频段应由实机模组铭牌确认。注意：以上速率为官方参数表中的理论最高值，不是实际网速承诺；不同地区、批次和套餐的模组、频段、SIM 形态可能不同，实机信息优先。官方来源：https://www.nradiowifi.com/article/213.html。

- 来源：https://www.nradiowifi.com/chanpin/
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：NBCPE-668GL、NB68、AK68、AX3000、Wi-Fi 6、5G CPE、全球频段、高通、2.5G PoE、NBCPE

## AK68-788

AK68-788 是 NRadio 的一款室外型巴龙 5G CPE。核对日期：2026-08-03。产品定位：室外型巴龙 5G CPE。CPU：MediaTek MT7981B 双核 1.3GHz。5G 模组：MT5700。内存与存储：256MB 内存，16MB 闪存。Wi-Fi：2.4GHz Wi-Fi 6，主要用于配置。频段：5G NR N1/N3/N5/N8/N28/N41/N78/N79；LTE-FDD B1/B3/B5/B8；LTE-TDD B34/B38/B39/B40/B41；WCDMA B1/B8。理论速率：5G 4Gbps/1.5Gbps；LTE 900Mbps/200Mbps。接口：1 个千兆 PoE，USB-C 调试口，复位，2 个 Nano-SIM。天线：4 根高增益 5G 天线 + 1 根 Wi-Fi 天线。供电：PoE 802.3af。防护与安装：IP54；支持抱杆、壁挂、吸顶和三脚架安装。尺寸与重量：220×220×35mm，约 780g。环境：无太阳辐射时工作 -40–55℃，存储 -40–70℃。管理能力：双 SIM 手动/自动切换，可锁定 5G/4G 频段与小区，可设置 APN。注意：以上速率为官方参数表中的理论最高值，不是实际网速承诺；不同地区、批次和套餐的模组、频段、SIM 形态可能不同，实机信息优先。官方来源：https://www.nradiowifi.com/article/233.html、https://www.nradiowifi.com/article/269.html。

- 来源：https://www.nradiowifi.com/chanpin/
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：AK68-788、AK68、室外5G CPE、巴龙、MT5700、PoE、IP54、Wi-Fi 6、双SIM、APN

## AM5 5G AI 鼠标

AM5 5G AI 鼠标是 NRadio 推出的一款集成 5G 数据、Wi-Fi 热点、AI 与鼠标功能的终端。核对日期：2026-08-03。产品定位：集成 5G 数据、Wi-Fi 热点、AI 与鼠标功能的终端。5G 模组：MT5716-CN，华为巴龙平台，中国区域版。频段：5G NR N1/N3/N5/N8/N28/N41/N78；LTE B1/B3/B5/B8/B34/B38/B39/B40/B41。理论速率：5G 下行 226Mbps、上行 120Mbps；LTE 下行 200Mbps、上行 100Mbps。Wi-Fi 芯片：AIC8800D40L。Wi-Fi：Wi-Fi 6 AX600，2.4GHz 286.5Mbps + 5GHz 286.5Mbps，20/40MHz，1T1R，最多 16 个客户端。内存与存储：128MB + 128MB。SIM：1 个外置 Nano-SIM；官方称支持双 DNN/5G LAN。无线连接：2.4G USB 接收器或蓝牙，通过 OFF/ON/MS 开关选择。鼠标控件：左右键、滚轮、语音键、M 键、AI 键和复位键；DPI 1600–4800。电池：3.8V 1400mAh 锂电池，官方页面标注具有 3C 认证和印刷标识。充电与功耗：USB-C 5V/1A；待机约 0.7W，典型约 2.6W。尺寸：123.69×64.41×39.48mm。环境：工作 0–35℃，存储 -20–45℃。系统兼容：有线/USB 接收器支持 Windows 7/8/10/11 或 macOS 10.15+；蓝牙支持 Windows 10 1809 Build 17763+ 或 macOS 10.15+。注意：以上速率为官方参数表中的理论最高值，不是实际网速承诺；不同地区、批次和套餐的模组、频段、SIM 形态可能不同，实机信息优先。官方来源：https://www.nradiowifi.com/article/257.html、https://www.nradiowifi.com/article/264.html。

- 来源：https://www.nradiowifi.com/chanpin/
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：AM5、5G AI 鼠标、Wi-Fi 6、AX600、华为巴龙、MT5716-CN、鼠标、5G CPE、热点、USB-C

## NRadio A8-510 RedCap 5G 家用/企业路由器

知识分类：产品中心 / RedCap 5G / 硬件参数；核对日期：2026-08-03；分类来源：https://www.nradiowifi.com/chanpin/qiyezuwang/。产品定位：RedCap 5G 家用/企业路由器。5G 平台：海思 RedCap 方案。内存与存储：128MB 内存，128MB 闪存。Wi-Fi：Wi-Fi 6 AX600。频段：5G NR N1/N3/N5/N8/N28/N41/N78；LTE B1/B3/B5/B8/B34/B38/B39/B40/B41。理论速率：RedCap 5G 下行 226Mbps、上行 120Mbps；LTE 下行 200Mbps、上行 100Mbps。注意：以上为理论速率，非实际速度保证，实际速度与运营商、频段和环境有关。SIM：1 个 Nano-SIM。网口：1 个千兆 WAN + 3 个千兆 LAN。供电：DC 12V/1A。尺寸：官方图标注宽度约 103mm、高度约 203mm。环境：工作 0–40℃，存储 -40–70℃。官方来源：https://www.nradiowifi.com/article/207.html。

- 来源：https://www.nradiowifi.com/chanpin/
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：NRadio、RedCap、A8-510、5G路由器、Wi-Fi 6、AX600、家用路由器、企业路由器、海思方案

## NRadio DD-510 便携式 RedCap 5G 终端

知识分类：产品中心 / RedCap 5G / 硬件参数；核对日期：2026-08-03；分类来源：https://www.nradiowifi.com/chanpin/qiyezuwang/。产品定位：便携式 RedCap 5G 终端。5G 平台：海思 RedCap 方案。内存与存储：128MB 内存，128MB 闪存。Wi-Fi：Wi-Fi 6 AX600。频段：5G NR N1/N3/N5/N8/N28/N41/N78；LTE B1/B3/B5/B8/B34/B38/B39/B40/B41。理论速率：RedCap 5G 下行 226Mbps、上行 120Mbps；LTE 下行 200Mbps、上行 100Mbps。注意：以上为理论速率，非实际速度保证，实际速度与运营商、频段和环境有关。SIM：1 个外置 Nano-SIM。接口：1 个千兆 WAN/LAN，1 个 USB-C，复位键，5G 指示灯。供电：USB-C 5V/1A。尺寸与重量：56×56×17mm，约 42g。环境：工作 0–40℃，存储 -40–70℃。官方来源：https://www.nradiowifi.com/article/229.html。

- 来源：https://www.nradiowifi.com/chanpin/
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：NRadio、RedCap、DD-510、5G终端、便携式、Wi-Fi 6、AX600、随身Wi-Fi、海思方案

## NRadio CC-500 Pro 5G 智能口袋路由器 Pro 版

知识分类：产品中心 / RedCap 5G / 硬件参数；核对日期：2026-08-03；分类来源：https://www.nradiowifi.com/chanpin/qiyezuwang/。产品定位：CC 系列 5G 智能口袋路由器 Pro 版。电池：3300mAh。Wi-Fi：Wi-Fi 6。频段：5G NR N1/N3/N5/N8/N28A/N41/N78；LTE B1/B3/B5/B8/B34/B38/B39/B40/B41。理论速率：5G 下行 226Mbps、上行 120Mbps；LTE-FDD 下行 200Mbps、上行 100Mbps；LTE-TDD 下行 150Mbps、上行 20Mbps。注意：以上为理论速率，非实际速度保证，实际速度与运营商、频段和环境有关。尺寸：81.6×81.6×37mm。内存、闪存、客户端上限、接口数：官网当前参数表未公开。版本边界：CC-500 Pro 和 CC-500 的官方当前参数表基本相同，Pro 的硬件差异未在表中明确列出，需按实机批次确认。官方来源：https://www.nradiowifi.com/article/237.html。

- 来源：https://www.nradiowifi.com/chanpin/
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：NRadio、RedCap、CC-500 Pro、CC500Pro、5G路由器、口袋路由器、Wi-Fi 6、智能路由器

## NRadio CC-500 5G 智能口袋路由器

知识分类：产品中心 / RedCap 5G / 硬件参数；核对日期：2026-08-03；分类来源：https://www.nradiowifi.com/chanpin/qiyezuwang/。产品定位：CC 系列 5G 智能口袋路由器。电池：3300mAh。Wi-Fi：Wi-Fi 6。频段：5G NR N1/N3/N5/N8/N28A/N41/N78；LTE B1/B3/B5/B8/B34/B38/B39/B40/B41。理论速率：5G 下行 226Mbps、上行 120Mbps；LTE-FDD 下行 200Mbps、上行 100Mbps；LTE-TDD 下行 150Mbps、上行 20Mbps。注意：以上为理论速率，非实际速度保证，实际速度与运营商、频段和环境有关。尺寸：81.6×81.6×37mm。内存、闪存、客户端上限、接口数：官网当前参数表未公开。官方来源：https://www.nradiowifi.com/article/199.html。

- 来源：https://www.nradiowifi.com/chanpin/
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：NRadio、RedCap、CC-500、CC500、5G路由器、口袋路由器、Wi-Fi 6、智能路由器

## NRadio TK-500 5G RedCap 随身 Wi-Fi + 大容量充电宝

知识分类：产品中心 / RedCap 5G / 硬件参数；核对日期：2026-08-03；分类来源：https://www.nradiowifi.com/chanpin/qiyezuwang/。产品定位：5G RedCap 随身 Wi-Fi + 大容量充电宝。电池：10000mAh，3.8V/38Wh 钴聚合物电芯；额定容量 6800mAh。Wi-Fi：Wi-Fi 6 2.4GHz，802.11b/g/n/ax，最多 16 个客户端。频段：5G NR N1/N3/N5/N8/N28/N41/N78；LTE B1/B3/B5/B8/B34/B38/B39/B40/B41。官方表中的蜂窝速率：下行 150Mbps，上行 50Mbps。注意：以上为官方蜂窝速率，非实际速度保证，实际速度与运营商、频段和环境有关。充电输入：5V/2A，支持 Type-C/Lightning 输入。输出：Type-C 最高 22.5W；Type-C + Lightning 同时输出时总输出 5V/3A。尺寸与重量：75×158.5×18.8mm，约 258g。内存与闪存：官网当前参数表未公开。官方来源：https://www.nradiowifi.com/article/238.html。

- 来源：https://www.nradiowifi.com/chanpin/
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：NRadio、RedCap、TK-500、TK500、随身Wi-Fi、充电宝、10000mAh、Wi-Fi 6

## NRadio TT-500 5G RedCap 双频随身 Wi-Fi + 快充充电宝

知识分类：产品中心 / RedCap 5G / 硬件参数；核对日期：2026-08-03；分类来源：https://www.nradiowifi.com/chanpin/qiyezuwang/。产品定位：5G RedCap 双频随身 Wi-Fi + 快充充电宝。电池：10000mAh，3.8V/38Wh 钴聚合物电芯；额定容量 6800mAh。内存与存储：128MB 内存，128MB 闪存。Wi-Fi：Wi-Fi 6 双频 2.4GHz/5GHz，802.11a/b/g/n/ac/ax，最多 16 个客户端。理论速率：5G 下行 226Mbps、上行 120Mbps；4G 下行 200Mbps、上行 100Mbps。注意：以上为理论速率，非实际速度保证，实际速度与运营商、频段和环境有关。频段：官网当前参数表的可读区域未列出完整频段，不直接套用其他 RedCap 型号。输入：Type-C 支持 5V/3A、9V/2A、12V/1.5A，最高 18W；Lightning 最高 5V/2A（10W）。多口输出：Type-C + Type-C + Lightning 同时输出时总输出 5V/3A。尺寸与重量：160×75×20mm，约 259g。官方来源：https://www.nradiowifi.com/article/200.html。

- 来源：https://www.nradiowifi.com/chanpin/
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：NRadio、RedCap、TT-500、TT500、随身Wi-Fi、充电宝、双频、10000mAh、Wi-Fi 6

## CC-100GL 全球漫游口袋 Wi-Fi 硬件参数

NRadio CC-100GL 为全球漫游口袋 Wi-Fi，定位“GL”全球漫游型号，实际能否在特定国家/地区/运营商入网仍受频段、认证、SIM 套餐和当地政策影响，不能仅凭“全球版”字样保证。资料核对日期：2026-08-03。硬件参数：蜂窝等级 LTE Cat4；Wi-Fi 为 Wi-Fi 4（客户端上限官网未公开）；电池 3300mAh。LTE-FDD 频段：B1/B2/B3/B4/B5/B7/B8/B9/B12/B13/B17/B18/B19/B20/B25/B26/B28A/B66。LTE-TDD 频段：B34/B38/B39/B40/B41。WCDMA：B1。GSM/GPRS/EDGE 官方表列出 B1/B2/B4/B5/B8，频段命名以官方原表为准。理论速率：FDD 下行 150Mbps、上行 50Mbps；TDD 下行 130Mbps、上行 35Mbps（理论值，非实际速度保证）。尺寸：81.6×81.6×37mm。内存、闪存、客户端上限和充电参数：官网当前参数表未公开。官方来源：https://www.nradiowifi.com/article/239.html

- 来源：https://www.nradiowifi.com/chanpin/
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：NRadio、CC-100GL、全球漫游、口袋Wi-Fi、LTE Cat4、Wi-Fi 4、3300mAh、Cellular频段、理论速率

## TK-100GL 全球漫游随身 Wi-Fi + 快充充电宝硬件参数

NRadio TK-100GL 为全球漫游随身 Wi-Fi + 快充充电宝一体机，定位“GL”全球漫游型号，实际入网受频段、认证、SIM 套餐和当地政策影响，不能仅凭“全球版”字样保证。资料核对日期：2026-08-03。硬件参数：电池 10000mAh，3.8V/38Wh，额定容量 6800mAh；内存与存储：官方参数表标注 2GB 内存、512MB 闪存，数值相对少见，如用于采购决策建议再以实机确认；Wi-Fi：Wi-Fi 4 2.4GHz，最多 8 个客户端。LTE-FDD 频段：B1/B2/B3/B4/B5/B7/B8/B9/B12/B13/B17/B18/B19/B20/B25/B26/B28A/B66。LTE-TDD 频段：B34/B38/B39/B40/B41。WCDMA：B1。GSM/GPRS/EDGE 按官方表为 B1/B2/B4/B5/B8。理论速率：FDD 下行 150Mbps、上行 50Mbps；TDD 下行 130Mbps、上行 35Mbps（理论值，非实际速度保证）。尺寸与重量：160×75×20mm，约 259g。输入/输出：具体 Type-C、Lightning 和多口快充组合以当批机身丝印为准，官方展示为充电宝与随身 Wi-Fi 一体机。官方来源：https://www.nradiowifi.com/article/241.html

- 来源：https://www.nradiowifi.com/chanpin/
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：NRadio、TK-100GL、全球漫游、随身Wi-Fi、充电宝、快充、10000mAh、LTE Cat4、Wi-Fi 4、2GB内存、512MB闪存

## TT-100GL 全球漫游随身 Wi-Fi + 快充充电宝硬件参数

NRadio TT-100GL 为全球漫游随身 Wi-Fi + 快充充电宝一体机，定位“GL”全球漫游型号，实际入网受频段、认证、SIM 套餐和当地政策影响，不能仅凭“全球版”字样保证。资料核对日期：2026-08-03。硬件参数：电池 10000mAh，3.8V/38Wh，额定容量 6800mAh；内存与存储：官方参数表标注 2GB 内存、512MB 闪存，采购时建议再以实机铭牌确认；Wi-Fi：Wi-Fi 4 2.4GHz，最多 8 个客户端。LTE-FDD 频段：B1/B2/B3/B4/B5/B7/B8/B9/B12/B13/B17/B18/B19/B20/B25/B26/B28A/B66。LTE-TDD 频段：B34/B38/B39/B40/B41。WCDMA：B1。GSM/GPRS/EDGE 按官方表为 B1/B2/B4/B5/B8。理论速率：FDD 下行 150Mbps、上行 50Mbps；TDD 下行 130Mbps、上行 35Mbps（理论值，非实际速度保证）。尺寸与重量：160×75×20mm，约 259g。输入/输出：官方展示为 Type-C、Lightning 与多口快充组合，具体功率应按机身标注确认。官方来源：https://www.nradiowifi.com/article/240.html

- 来源：https://www.nradiowifi.com/chanpin/
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：NRadio、TT-100GL、全球漫游、随身Wi-Fi、充电宝、快充、10000mAh、LTE Cat4、Wi-Fi 4、2GB内存、512MB闪存

## N6700 AX6000 Wi-Fi 6 四频缓存路由器硬件参数

N6700 是 NRadio 官网“其他”分类中的 AX6000 Wi-Fi 6 四频缓存路由器。CPU 为 MediaTek MT7981B 双核 1.3GHz；内存与存储为 1GB DDR4、8GB eMMC，另保留 mSATA 扩展接口。Wi-Fi 规格：Wi-Fi 6，产品目录标称 AX6000 和四频，官网当前可读参数区域未完整列出各频段单独速率，不根据总速率反推。网口：1 个 2.5G WAN/PoE 口 + 1 个千兆 LAN 口。按键与指示：复位键和设备指示灯。天线：4 根内置 2.4GHz 天线 + 6 根内置 5GHz 天线。供电：802.3at PoE 或 DC 12V。防护：官方标注 2kV 浪涌/防雷能力。安装方式：壁挂、吸顶、三脚架或抱杆。尺寸与重量：220×220×35mm，约 992g。工作环境：工作 0–40℃、10%–90%RH；存储 -40–70℃、5%–95%RH。官方来源：N6700 产品页 https://www.nradiowifi.com/article/55.html 。

- 来源：https://www.nradiowifi.com/chanpin/
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：N6700、AX6000、Wi-Fi 6、四频、缓存路由器、MT7981B、2.5G PoE、mSATA、高密度 Wi-Fi、NRadio 其他产品

## N8 AX1800 Wi-Fi 6 家用路由器硬件参数

N8 是 NRadio 历史官方产品，AX1800 Wi-Fi 6 家用路由器。目录状态：仍有官方产品和配置说明页，但不在 2026-08-03 官网当前四个产品分类页中，因此标记为历史产品，不代表官方仍在售。Wi-Fi 标准：IEEE 802.11a/b/g/n/ac/ax。Wi-Fi 速率：2.4GHz 573Mbps，5GHz 1201Mbps，双频合计标称 1774Mbps（理论速率，非实际速度保证）。无线规格：2×2 MIMO、2 空间流，官方标注最多 256 个客户端。国内频率范围：2.412–2.483GHz；5.15–5.35GHz 和 5.72–5.84GHz。网口：4 个千兆 WAN/LAN 自适应网口。天线：4 根内置全向高增益天线。供电与功耗：DC 12V/1.5A；最大功耗 18W，待机约 7.3W。尺寸：100×100×200mm。环境：工作 0–40℃、10%–90%RH；存储 -40–70℃、5%–90%RH。无线管理能力：官方页面列出频道、功率、客户端数、带宽限制，定时开关射频，负载均衡，Open/WPA2，终端隔离，防粘滞终端，高密优化和云管理。官方来源：N8 产品页 https://www.nradiowifi.com/article/158.html 、N8 配置说明书列表 https://www.nradiowifi.com/fuwu/wendang/ 。

- 来源：https://www.nradiowifi.com/chanpin/
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：N8、AX1800、Wi-Fi 6、家用路由器、573Mbps、1201Mbps、1774Mbps、2×2 MIMO、千兆网口、历史产品、NRadio

## C8-788型号对应C2000 Max

C8-788就是C2000 Max，为同一产品的不同型号标识。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/3d057f92-50a5-4e89-96b9-36e75674fbd7-未命名.txt
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：C8-788、C2000 Max、型号对应

## C8-798型号对应C2000 Ultra及发布计划

C8-798就是C2000 Ultra，目前尚未正式发布，预计在8～9月进行内测。预售链接现已上架微信“鲲鹏小店”小程序。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/3d057f92-50a5-4e89-96b9-36e75674fbd7-未命名.txt
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：C8-798、C2000 Ultra、内测、预售、鲲鹏小店

## C2000 Max金属散热壳发布时间及通知

C2000 Max的金属壳（金属散热壳）预计在8月份推出。已在微信小程序“张导的店”购买的鹏友请耐心等待小助理的通知。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/3d057f92-50a5-4e89-96b9-36e75674fbd7-未命名.txt
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：C2000 Max、金属散热壳、配件、8月、张导的店

## 天火卡活动结束通知

目前天火卡的相关活动已经结束，其他优质流量卡敬请期待后续通知。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/3d057f92-50a5-4e89-96b9-36e75674fbd7-未命名.txt
- 上传者：FallaxAura
- 核对日期：2026-08-03
- 标签：天火卡、活动结束、流量卡

## C8-788 对应 C2000 Max

C8-788 对应 C2000 Max。用户使用 C8-788、788、C2000 Max 等名称询问时，应将其识别为同一款产品。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/a1712a9f-0a00-411b-be7c-0f220a4876ea-产品型号别名与发布状态.md
- 上传者：FallaxAura
- 核对日期：2026-08-07
- 标签：C8-788、788、C2000 Max、型号别名、产品识别

## C8-798 对应 C2000 Ultra

C8-798 对应 C2000 Ultra。用户使用 C8-798、798、C2000 Ultra、Ultra 或 U 等名称询问时，应结合上下文识别为 C2000 Ultra。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/a1712a9f-0a00-411b-be7c-0f220a4876ea-产品型号别名与发布状态.md
- 上传者：FallaxAura
- 核对日期：2026-08-07
- 标签：C8-798、798、C2000 Ultra、Ultra、U、型号别名、产品识别

## C2000 Ultra 发布状态

C2000 Ultra 目前尚未正式推出，预计在 8 月进行内测，第一批内测的人员目前为部分虚空会员和紫金会员。该状态为截至整理日期 2026-08-07 的资料信息。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/a1712a9f-0a00-411b-be7c-0f220a4876ea-产品型号别名与发布状态.md
- 上传者：FallaxAura
- 核对日期：2026-08-07
- 标签：C2000 Ultra、发布状态、内测、虚空会员、紫金会员、2026-08-07

## C2000 Ultra 动态信息提醒

C2000 Ultra 的内测时间、正式发售时间、库存和预售状态均属于动态信息。客服回答时应说明这是截至资料整理日期的状态，并引导用户以微信“鲲鹏小店”小程序当前页面或最新公告为准，不能把预计时间表述为已经确定的承诺。整理日期为 2026-08-07。

- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/a1712a9f-0a00-411b-be7c-0f220a4876ea-产品型号别名与发布状态.md
- 上传者：FallaxAura
- 核对日期：2026-08-07
- 标签：C2000 Ultra、动态信息、客服话术、鲲鹏小店、公告、时间边界
