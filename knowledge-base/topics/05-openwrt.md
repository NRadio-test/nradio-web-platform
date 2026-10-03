# OpenWrt 技术

本主题包含 24 条整理后的知识；事实日期见各条目，2026-10-03 为内容审阅日期。

## OpenWrt 排障起点：发行版、接口运行态与日志

本条为通用 OpenWrt/ImmortalWrt 技术资料，不证明 NRadio 原厂 NROS 具备同名命令。先提供完整型号/硬件版本、ubus call system board、/etc/openwrt_release、uname -r、故障步骤和日志。包管理器按实际固件中的 opkg/apk 判断，不用旧资料中的“最新稳定版”判断当前版本。

UCI 是期望配置，ubus、ip address/link/route 是运行状态；network interface、二层 device、物理口、桥和 PPPoE 设备不是同一层。用 ubus 接口状态找 device/l3_device，再在 LAN 与 WAN 两侧抓包对比，限制 /tmp 内存抓包大小。

logread 看服务日志，dmesg 看驱动/USB/存储；记录复现时间与动作。设备页/Wiki 是安装依据，社区帖须核对日期、target 和后续回复；自定义分支的问题优先找构建者。GitHub 问题按基础系统、packages、LuCI、routing 的实际组件提交。

- InfoID：upload-20260803-358cf6d45d-01
- 原资料核对日期：2026-08-03
- 审阅状态：已整理来源快照
- 标签：OpenWrt 技术、OpenWrt、版本辨识、网络排障、日志
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/7b62bce8-4a2d-48c8-902a-a63a60c43b81-openwrt-ecosystem-part-01-of-05.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/d133c999-a057-40fd-b4b0-0b2d3dc98bbc-openwrt-geek-part-01-of-09.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/ebc296ab-e1ad-4eec-b0ce-8816b47f7f10-openwrt-geek-part-02-of-09.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/c1a862b0-7b28-4036-a4d3-07f4398772a6-openwrt-geek-part-08-of-09.md
- 来源：https://openwrt.org/support
- 来源：https://github.com/openwrt/openwrt
- 来源：https://www.reddit.com/r/openwrt/
- 来源：https://github.com/immortalwrt/immortalwrt
- 来源：https://lists.openwrt.org/pipermail/openwrt-announce/2026-March/000081.html
- 来源：https://openwrt.org/docs/guide-user/base-system/basic
- 来源：https://openwrt.org/docs/guide-user/base-system/system_configuration
- 来源：https://openwrt.org/docs/guide-user/network/routing/basics

## OpenWrt 软件安装失败：包名、软件源、ABI 与证书

安装前确认发行版/版本、架构、实际包管理器、fw3/fw4、内核 ABI、可写空间与维护者支持分支。luci-app 通常只是界面，需同源配套后台包，不能跨 OpenWrt/ImmortalWrt/厂商分支拼包。

Unknown package：更新索引并核对包名、架构和源是否真实可达。Cannot satisfy dependencies/kernel not compatible：核对运行内核与仓库构建批次，尤其 snapshot；不能用 force-depends 安装不匹配 kmod。

下载/签名/TLS 失败：按公网路由、DNS、系统日期/NTP、CA、源地址和代理逐层检查。时间未同步会伪装成证书故障；加密 DNS 与 NTP 不应循环依赖。不把禁签名、跳过证书或陌生源作为长期修复。保存当前版本、来源和配置以便回退。

- InfoID：upload-20260803-358cf6d45d-06
- 原资料核对日期：2026-08-03
- 审阅状态：已整理来源快照
- 标签：OpenWrt 技术、OpenWrt、软件安装、软件源、内核ABI、证书
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/7b62bce8-4a2d-48c8-902a-a63a60c43b81-openwrt-ecosystem-part-01-of-05.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/048f8d73-8c0f-4068-9590-9d512f6d12c0-openwrt-errors-part-01-of-06.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/f4a6a8e9-16f6-40f6-85d5-9a5fb15d3219-openwrt-errors-part-02-of-06.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/81b7a516-daef-42ff-b218-ef1da476d6c6-openwrt-geek-part-07-of-09.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/c1a862b0-7b28-4036-a4d3-07f4398772a6-openwrt-geek-part-08-of-09.md
- 来源：https://openwrt.org/docs/guide-user/additional-software/managing_packages
- 来源：https://github.com/openwrt/luci
- 来源：https://openwrt.org/faq/cannot_satisfy_dependencies
- 来源：https://openwrt.org/docs/guide-user/additional-software/opkg
- 来源：https://openwrt.org/docs/guide-user/additional-software/imagebuilder
- 来源：https://github.com/immortalwrt/immortalwrt
- 来源：https://openwrt.org/docs/guide-user/base-system/system_configuration

## OpenWrt 空间、只读文件系统与资源耗尽

典型 SquashFS 的 /rom 只读，overlay 保存变化并合成可写根目录。删除预装文件只形成 whiteout，不释放只读固件空间。No space left 先用 df -h、df -i、free -h 区分 /overlay、/tmp、inode 和 RAM；按 du 与日志定位再清理，先备份配置。

若 /etc 也只读或 overlay 未挂载，查 mount、dmesg/logread、分区布局、初始化或 extroot 状态，不强写 /rom，也不在首次初始化期间频繁断电。低 free 不等于 OOM，结合 available、进程占用与内核日志判断。

新连接失败但已有连接正常时，可比较 nf_conntrack_count/max 并查 table full 与异常连接来源；提高上限会增加内存，应先减少异常流量/服务。

- InfoID：upload-20260803-516b935e06-04
- 原资料核对日期：2026-08-03
- 审阅状态：已整理来源快照
- 标签：OpenWrt 技术、OpenWrt、overlay、存储空间、内存、网络排障
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/f4a6a8e9-16f6-40f6-85d5-9a5fb15d3219-openwrt-errors-part-02-of-06.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/ebc296ab-e1ad-4eec-b0ce-8816b47f7f10-openwrt-geek-part-02-of-09.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/c1a862b0-7b28-4036-a4d3-07f4398772a6-openwrt-geek-part-08-of-09.md
- 来源：https://openwrt.org/docs/guide-user/troubleshooting/failsafe_and_factory_reset
- 来源：https://openwrt.org/docs/techref/flash.layout
- 来源：https://openwrt.org/docs/guide-user/firewall/firewall_configuration
- 来源：https://openwrt.org/docs/guide-user/base-system/system_configuration

## OpenWrt 外置存储与 extroot：配置和失效检查

挂到 /mnt/data 只增加数据存储；在启动阶段让外部卷充当 /overlay 才是 extroot。用 block info、设备容量及序列号确认介质，fstab 按 UUID 引用，驱动须与运行内核匹配；ext4 常用于 extroot，exFAT/NTFS 数据盘不能直接当同等可写系统层。

迁移先备份/复制原 overlay，按对应版本文档设置 /overlay；重启后以 mount 和 df 确认实际设备。外盘未识别、UUID 改变或驱动缺失时可能回退内部 overlay，看起来像恢复出厂，先查日志/挂载，别立即格式化。

UUID mismatch 或 wrong fs type/bad superblock 时，先确认是原卷、文件系统和占用状态再修复；fsck 应在离线/未挂载环境。TF 持续日志、数据库或 swap 会增加写入，使用耐久介质并保留备份。

- InfoID：upload-20260803-516b935e06-06
- 原资料核对日期：2026-08-03
- 审阅状态：已整理来源快照
- 标签：OpenWrt 技术、OpenWrt、extroot、扩展存储、TF卡、备份
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/f4a6a8e9-16f6-40f6-85d5-9a5fb15d3219-openwrt-errors-part-02-of-06.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/81b7a516-daef-42ff-b218-ef1da476d6c6-openwrt-geek-part-07-of-09.md
- 来源：https://openwrt.org/docs/guide-user/additional-software/extroot_configuration
- 来源：https://openwrt.org/docs/techref/block_mount
- 来源：https://openwrt.org/docs/guide-user/storage/start
- 来源：https://openwrt.org/docs/guide-user/storage/usb-drives

## OpenWrt USB 存储掉线或无法卸载

USB disconnect/reset/UAS 错误先查供电、短线、接口、桥接兼容和介质状态，结合 dmesg 与实际 USB 拓扑；extroot 掉盘应先修硬件稳定性。

target is busy 时找占用进程，如共享、容器、下载器、日志或 shell 当前目录，停止对应服务并离开目录后正常卸载。延迟卸载不证明数据已写回；拔盘前完成 sync 并确认卸载，不在活动卷上修复文件系统。

- InfoID：upload-20260803-d9a1444ed4-01
- 原资料核对日期：2026-08-03
- 审阅状态：已整理来源快照
- 标签：OpenWrt 技术、OpenWrt、USB存储、扩展存储、网络排障
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/73cded48-47f6-4cb2-964a-b7cb9432712f-openwrt-errors-part-03-of-06.md
- 来源：https://openwrt.org/docs/techref/block_mount

## OpenWrt UCI 修改：定位 section、提交与生效

Entry not found 表示引用的 config/section/option 不存在，先用 uci show 核对默认配置、字段名和版本。匿名 @zone[1]/@wifi-iface[0] 依赖排列，脚本应优先具名或按属性定位，不能假定固定序号。

uci set/add_list/delete 修改候选配置，用 uci changes 审阅、uci commit <package> 持久化，再重载对应服务。远程改 LAN/VLAN/管理桥或防火墙前备份并准备物理回退，避免无范围提交。

- InfoID：upload-20260803-d9a1444ed4-06
- 原资料核对日期：2026-08-03
- 审阅状态：已整理来源快照
- 标签：OpenWrt 技术、OpenWrt、UCI、配置变更、备份
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/73cded48-47f6-4cb2-964a-b7cb9432712f-openwrt-errors-part-03-of-06.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/ebc296ab-e1ad-4eec-b0ce-8816b47f7f10-openwrt-geek-part-02-of-09.md
- 来源：https://github.com/openwrt/packages
- 来源：https://openwrt.org/docs/guide-user/base-system/basic

## OpenWrt LuCI/RPC 错误与应用后自动回滚

ubus 连接失败、RPCError 或 502 先检查 ubusd/procd/rpcd/uhttpd、日志、空间及对应后台包。错误数字不能单独定因；结合浏览器请求详情与对应 ubus 调用，检查 ACL、UCI schema、主题和前后端是否同源配套。

仅页面故障不应直接整机恢复出厂。保存/应用后倒计时回滚，可能是浏览器无法重新连到新 LAN 地址或 VLAN；让电脑切到正确网段/管理口。跳过连接检查只能在明确有带外回退条件时使用。

- InfoID：upload-20260803-d9a1444ed4-03
- 原资料核对日期：2026-08-03
- 审阅状态：已整理来源快照
- 标签：OpenWrt 技术、OpenWrt、LuCI、RPC、网络排障
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/73cded48-47f6-4cb2-964a-b7cb9432712f-openwrt-errors-part-03-of-06.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/442c57db-db55-41d7-acbe-6b0aa3ea8e13-openwrt-errors-part-06-of-06.md
- 来源：https://openwrt.org/docs/guide-user/troubleshooting/failsafe_and_factory_reset
- 来源：https://github.com/openwrt/luci

## OpenWrt 蜂窝拨号：模组识别、SIM 与管理器冲突

先看 lsusb -t、dmesg 和驱动绑定，区分 QMI/MBIM、ECM/NCM/RNDIS、串口或 PCIe/MHI。cdc-wdm 并非所有模式都有；ttyUSB 也可能是 AT、诊断或 GPS 口，编号随组合变化，不能照抄设备号。

SIM/PIN/注册失败先只读查询状态，确认卡方向、选中槽、APN、PDP 类型、天线及当地频段；不要反复错输 PIN。connected 仅说明会话建立，还要核对地址、路由、DNS、raw-ip、MTU 和防火墙。

端口 busy 或反复重拨时确认服务所有者；ModemManager、qmodem、quectel-CM、uqmi/umbim 等不能并行主控同一模组。此为 OpenWrt 通用流程，不代替 NROS 对应机型操作说明。

- InfoID：upload-20260803-d9a1444ed4-07
- 原资料核对日期：2026-08-03
- 审阅状态：已整理来源快照
- 标签：OpenWrt 技术、OpenWrt、5G模组、QMI、MBIM、网络排障
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/73cded48-47f6-4cb2-964a-b7cb9432712f-openwrt-errors-part-03-of-06.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/70b1e2b4-e20c-45c1-bdfc-e0555e408487-openwrt-errors-part-04-of-06.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/59bd5e52-f08e-46c0-80fa-56b929806393-openwrt-geek-part-09-of-09.md
- 来源：https://openwrt.org/docs/guide-user/network/wan/wwan/ltedongle
- 来源：https://openwrt.org/docs/guide-user/network/wan/wwan/start
- 来源：https://openwrt.org/docs/guide-user/network/wan/wwan/modemmanager

## OpenWrt PPPoE：拨号阶段、MTU 与光猫管理

PADO timeout 是尚未得到接入服务器响应，先查物理 WAN/VLAN、光猫桥接、单会话/MAC 绑定和链路；PAP/authentication failed 才重点查账号格式、密码及运营商限制，日志不要公开凭据。

小包正常而部分 HTTPS/VPN 卡住时检查实际路径 MTU、PPPoE 开销及防火墙 MSS/MTU fix，不把所有接口随意调成小 MTU。

访问桥接光猫管理页需要在实际 WAN 二层 device 上配置对应静态地址/alias，不配到 pppoe-wan 隧道上；管理网段不能与 LAN 重叠，回程可能需要源 NAT。

- InfoID：upload-20260803-0e7ae3911a-04
- 原资料核对日期：2026-08-03
- 审阅状态：已整理来源快照
- 标签：OpenWrt 技术、OpenWrt、PPPoE、MTU、网络排障
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/70b1e2b4-e20c-45c1-bdfc-e0555e408487-openwrt-errors-part-04-of-06.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/5426d657-3ff4-49dd-8836-c5fb28840004-openwrt-geek-part-04-of-09.md
- 来源：https://openwrt.org/docs/guide-user/installation/generic.sysupgrade
- 来源：https://openwrt.org/docs/guide-user/network/wan/internet.connection
- 来源：https://openwrt.org/docs/guide-user/network/wan/access.modem.through.nat

## OpenWrt 路由/PBR：不通与域名策略失效

Network unreachable/no route 先用 ip route get、ip -6 route get、ip rule 及各 table 查接口、源地址、默认路由和策略，区分路由与 DNS。普通路由先看最长前缀，前缀相同再比较 metric。

PBR 常依赖解析器更新 nft set，CDN 多地址、客户端 DoH/硬编码 DNS 会影响域名策略。启动失败查 dnsmasq 变体、fw4/set 支持、目标接口及 fwmark；先用明确 IP/CIDR 验证，再加域名便利层。避免多个策略实现争用 mark。

- InfoID：upload-20260803-0e7ae3911a-06
- 原资料核对日期：2026-08-03
- 审阅状态：已整理来源快照
- 标签：OpenWrt 技术、OpenWrt、PBR、路由、DNS、网络排障
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/70b1e2b4-e20c-45c1-bdfc-e0555e408487-openwrt-errors-part-04-of-06.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/ac8a6641-f85e-4436-9b1d-01fb952d81bc-openwrt-geek-part-03-of-09.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/9f8dcaf7-240c-4cf2-beb0-33324bc2c841-openwrt-ecosystem-part-02-of-05.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/442c57db-db55-41d7-acbe-6b0aa3ea8e13-openwrt-errors-part-06-of-06.md
- 来源：https://openwrt.org/docs/guide-user/network/routing/pbr
- 来源：https://openwrt.org/docs/guide-user/network/routing/basics

## OpenWrt 多 WAN：mwan3 主备、均衡与会话限制

PBR 负责将指定流量选到 WAN/VPN；mwan3 提供多链路健康检查、主备及按连接均衡。member 的 metric 定优先级，同 metric 的 weight 影响新连接比例，policy/rule 决定适用流量。单个 TCP/UDP flow 通常只走一条 WAN，不是单线程带宽叠加。

先保证每条 WAN 单独有网关、DNS 和有效探测目标，再看 mwan3 status、日志、路由表及 mark。接口 up 不等于 tracking online；ICMP 被拦或探测送错出口可能是假故障。

蜂窝重拨/切换可能改变公网地址、CGNAT、DNS 和 MTU；支付、游戏、VoIP/VPN 等会话应保持出口一致，切换中断旧会话并不必然是设备故障。

- InfoID：upload-20260803-05e89ba771-06
- 原资料核对日期：2026-08-03
- 审阅状态：已整理来源快照
- 标签：OpenWrt 技术、OpenWrt、mwan3、多WAN、负载均衡、网络排障
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/9f8dcaf7-240c-4cf2-beb0-33324bc2c841-openwrt-ecosystem-part-02-of-05.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/d8f08539-192c-41e6-96d4-77864d6bf51d-openwrt-errors-part-05-of-06.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/ac8a6641-f85e-4436-9b1d-01fb952d81bc-openwrt-geek-part-03-of-09.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/59bd5e52-f08e-46c0-80fa-56b929806393-openwrt-geek-part-09-of-09.md
- 来源：https://openwrt.org/docs/guide-user/network/wan/multiwan/mwan3
- 来源：https://openwrt.org/docs/guide-user/network/routing/pbr

## OpenWrt DNS：唯一入口、上游与解析异常

让 LAN 只由一个服务监听 53，dnsmasq 与 AdGuard Home/MosDNS/SmartDNS 等后端使用明确的 loopback 端口和单向转发，过滤路径也只选一个。port 53 socket 失败查监听者、地址和 UCI，避免端口争用或循环回指。

用 nslookup 对比本地与已知上游，查服务日志和 WAN/WAN6 peer DNS。给客户端改 DHCP option 6 不等于更换路由器自身上游；固定上游须检查 peerdns 与 dnsmasq server/noresolv。

合法私网域名被 rebind 保护拦截时，仅为确认的域名加例外，不全局关闭保护。部分域名偶发失败结合 UDP/TCP、路径 MTU及两侧抓包排查，不只归因缓存。

- InfoID：upload-20260803-05e89ba771-01
- 原资料核对日期：2026-08-03
- 审阅状态：已整理来源快照
- 标签：OpenWrt 技术、OpenWrt、DNS、软件安装、网络排障
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/9f8dcaf7-240c-4cf2-beb0-33324bc2c841-openwrt-ecosystem-part-02-of-05.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/70b1e2b4-e20c-45c1-bdfc-e0555e408487-openwrt-errors-part-04-of-06.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/d8f08539-192c-41e6-96d4-77864d6bf51d-openwrt-errors-part-05-of-06.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/5426d657-3ff4-49dd-8836-c5fb28840004-openwrt-geek-part-04-of-09.md
- 来源：https://openwrt.org/docs/guide-user/services/ad-blocking
- 来源：https://github.com/sbwml/luci-app-mosdns
- 来源：https://openwrt.org/docs/guide-user/base-system/dhcp_configuration

## OpenWrt DHCP 静态租约与访问控制

IPv4 静态租约通常按 MAC，IPv6 可用 DUID/hostid；随机 MAC 和不同网卡会被当作不同客户端。地址需在正确 LAN 子网且不与手工地址冲突，变更后让客户端重新获取租约。

DHCP 白名单仅管理地址，不能防手工静态 IP 或 MAC 欺骗。真正隔离依靠 Wi-Fi 认证、VLAN、AP isolation 和防火墙，而不是只关动态 DHCP。

- InfoID：upload-20260803-a841e36252-04
- 原资料核对日期：2026-08-03
- 审阅状态：已整理来源快照
- 标签：OpenWrt 技术、OpenWrt、DHCP、客户端管理
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/5426d657-3ff4-49dd-8836-c5fb28840004-openwrt-geek-part-04-of-09.md
- 来源：https://openwrt.org/docs/guide-user/base-system/dhcp_configuration

## OpenWrt DDNS 与端口转发：公网地址和回程

先比较 WAN 地址与公网查询结果；RFC1918、100.64.0.0/10 或地址不一致可能有上级 NAT/CGNAT。DDNS 只发布地址，不能创造公网入口；取地址时避免发布 VPN/ULA/私网地址，核对提供商响应和日志。

端口转发不通依次看外网包是否到 WAN、DNAT 是否命中、LAN 服务监听与主机网关、逐级 NAT 及 PBR/mwan/VPN 回程。内网访问公网域名还依赖 hairpin。UPnP 仅允许可信 LAN 按需使用，映射成功也不保证 CGNAT 下可入站；需要时确认公网条件或评估主动出站隧道。

- InfoID：upload-20260803-05e89ba771-03
- 原资料核对日期：2026-08-03
- 审阅状态：已整理来源快照
- 标签：OpenWrt 技术、OpenWrt、DDNS、CGNAT、端口转发、网络排障
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/9f8dcaf7-240c-4cf2-beb0-33324bc2c841-openwrt-ecosystem-part-02-of-05.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/41dd67bd-c746-43f4-83bb-5438b4f2ba8d-openwrt-ecosystem-part-04-of-05.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/5426d657-3ff4-49dd-8836-c5fb28840004-openwrt-geek-part-04-of-09.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/75d1e0e6-8d62-408f-907f-26ce62612d51-openwrt-geek-part-05-of-09.md
- 来源：https://openwrt.org/docs/guide-user/base-system/ddns
- 来源：https://openwrt.org/docs/guide-user/services/start
- 来源：https://openwrt.org/docs/guide-user/network/wan/access.modem.through.nat
- 来源：https://openwrt.org/docs/guide-user/firewall/firewall_configuration

## OpenWrt Wi-Fi 不出现或掉线：驱动、信道与干扰

先查看 wifi/ubus wireless 状态、hostapd/netifd 日志及实际 phy。phy 缺失查驱动/设备树；有 phy 再查 radio disabled、固件、校准、国家码、信道和带宽。国家码匹配使用地，不作为调高性能的开关。

ACS 失败可用当地合法固定非 DFS 信道及较窄带宽做对照；DFS 的 CAC 等待和雷达换信道可能是正常行为。80/160/320MHz 并不保证实测更快，终端能力、干扰、回程和重传都影响吞吐。

插 USB3 设备后 2.4GHz 变差时可对照线缆屏蔽、设备距离与 USB2/其他频段；先测局域网，再与蜂窝上网速率区分。

- InfoID：upload-20260803-e1e386e275-02
- 原资料核对日期：2026-08-03
- 审阅状态：已整理来源快照
- 标签：OpenWrt 技术、OpenWrt、Wi-Fi、信道、DFS、网络排障
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/d8f08539-192c-41e6-96d4-77864d6bf51d-openwrt-errors-part-05-of-06.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/a11429d3-4bb7-40b5-8ff6-497181c3d08f-openwrt-geek-part-06-of-09.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/81b7a516-daef-42ff-b218-ef1da476d6c6-openwrt-geek-part-07-of-09.md
- 来源：https://openwrt.org/docs/guide-user/network/wifi/start

## OpenWrt 多 AP 漫游、Mesh 与 wpad 兼容

802.11r 缩短重新认证，k/v/steering 提供建议，客户端仍决定何时漫游。保持 SSID、加密、VLAN/子网及 Mobility Domain 一致，先小范围验证老旧/IoT 兼容。802.11s 是节点无线回程，不自动等于终端无缝漫游；有线回程通常更稳。

usteer 和 DAWN 不同时启用；核对驱动与实际 wpad 是否支持所需功能。开启后无线失效时先恢复最近变更，经网线操作并使用同版本配套包。usteer 的 ubus local_info/remote_hosts/remote_info/get_clients 可查邻居、负载和客户端，邻居空先查可达性/防火墙。

- InfoID：upload-20260803-8e61fc7e9d-01
- 原资料核对日期：2026-08-03
- 审阅状态：已整理来源快照
- 标签：OpenWrt 技术、OpenWrt、多AP、漫游、Mesh、网络排障
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/98a8f713-9a54-4508-acee-89483d0eb02f-openwrt-ecosystem-part-03-of-05.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/d8f08539-192c-41e6-96d4-77864d6bf51d-openwrt-errors-part-05-of-06.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/a11429d3-4bb7-40b5-8ff6-497181c3d08f-openwrt-geek-part-06-of-09.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/81b7a516-daef-42ff-b218-ef1da476d6c6-openwrt-geek-part-07-of-09.md
- 来源：https://openwrt.org/docs/guide-user/network/wifi/roaming
- 来源：https://openwrt.org/docs/guide-user/network/wifi/usteer
- 来源：https://openwrt.org/docs/guide-user/network/wifi/start
- 来源：https://openwrt.org/docs/guide-user/network/wifi/mesh/rapiddeployment

## OpenWrt VLAN、多 SSID 与旁路 AP 的配置边界

先辨识设备使用 DSA 还是 swconfig，不能混用配置。DSA tagged 是带标签收发，untagged 是出口去标签，PVID 决定无标签入流量；接入口通常一个 untagged+PVID，trunk 承载多个 tagged VLAN。修改前列端口/VLAN 对应关系并保留本地管理口。

主路由按 VLAN 提供网关/DHCP/防火墙，交换机/AP 上联 trunk，各 SSID 映射对应 VLAN；仅二层转发不必给每个 VLAN 建三层地址。Dumb AP 关闭自身 DHCP、桥接上联与无线，使用不冲突管理地址。

访客网需独立 interface/DHCP/zone，限制访问 LAN；同 SSID 客户端隔离另用 AP isolation，多 AP 以 VLAN 贯通，不能只靠不同 SSID 名称。

- InfoID：upload-20260803-2c572fbf2c-01
- 原资料核对日期：2026-08-03
- 审阅状态：已整理来源快照
- 标签：OpenWrt 技术、OpenWrt、VLAN、多AP、访客网络、配置变更
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/4d42ebad-7120-4079-84d7-1e195a8356ea-openwrt-ecosystem-part-05-of-05.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/ebc296ab-e1ad-4eec-b0ce-8816b47f7f10-openwrt-geek-part-02-of-09.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/ac8a6641-f85e-4436-9b1d-01fb952d81bc-openwrt-geek-part-03-of-09.md
- 来源：https://openwrt.org/docs/guide-user/network/wifi/roaming
- 来源：https://openwrt.org/docs/guide-user/network/dsa/start
- 来源：https://openwrt.org/docs/guide-user/network/dsa/dsa-mini-tutorial
- 来源：https://openwrt.org/docs/guide-user/network/vlan/switch_configuration
- 来源：https://openwrt.org/docs/guide-user/network/wifi/start

## OpenWrt IPv6：前缀委派与逐层排障

WAN6 获得 ISP 的前缀委派后，LAN 通常分配 /64，通过 RA及可选 DHCPv6 配置终端。/56 可分 256 个 /64，/60 可分 16 个；仅一个 /64 不等于可给多个独立标准子网。relay/NDP proxy 更复杂，优先确认 ISP 是否可提供更短前缀。

依次查 WAN6 地址/委派前缀、LAN 子网、客户端 RA、默认路由和源地址，分别测试链路本地网关、GUA 和外部 IPv6。抓包看 RS/RA、DHCPv6、Packet Too Big；不一刀切封 ICMPv6，否则可能破坏邻居发现和 PMTU。

- InfoID：upload-20260803-79a0efdf50-01
- 原资料核对日期：2026-08-03
- 审阅状态：已整理来源快照
- 标签：OpenWrt 技术、OpenWrt、IPv6、网络排障
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/75d1e0e6-8d62-408f-907f-26ce62612d51-openwrt-geek-part-05-of-09.md
- 来源：https://openwrt.org/docs/guide-user/network/ipv6/troubleshooting

## OpenWrt fw4 与管理安全：规则验证和区域权限

fw4 用 nftables，iptables 兼容输出可能不完整。input 控制路由器自身，forward 控制过路流量，output 控制本机发出；开放管理 input 不等于给 LAN 服务允许转发。

启动失败或语法错误先用 fw4 check/print 和 nft 校验定位，撤销最近加入的 nft include/插件规则；持久规则纳入 fw4 配置，不能只临时插入后期待 reload 保留。

首次设置强密码/SSH key，管理服务限可信 LAN/VPN，LuCI 采用 HTTPS，关闭不用的 ttyd/RPC/SFTP/调试服务。不要在防火墙故障时长期暴露外网管理。

- InfoID：upload-20260803-e1e386e275-06
- 原资料核对日期：2026-08-03
- 审阅状态：已整理来源快照
- 标签：OpenWrt 技术、OpenWrt、防火墙、管理安全、网络排障
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/d8f08539-192c-41e6-96d4-77864d6bf51d-openwrt-errors-part-05-of-06.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/75d1e0e6-8d62-408f-907f-26ce62612d51-openwrt-geek-part-05-of-09.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/c1a862b0-7b28-4036-a4d3-07f4398772a6-openwrt-geek-part-08-of-09.md
- 来源：https://openwrt.org/docs/guide-user/firewall/firewall_configuration
- 来源：https://openwrt.org/docs/guide-user/security/openwrt_security

## OpenWrt SQM/CAKE：满载延迟、蜂窝波动与卸载

SQM 将速率设在可持续链路带宽以下，控制瓶颈队列以降低满载延迟；选真实瓶颈 device，核对 kbit/s 单位与 PPPoE/VLAN/蜂窝开销。先测基线，再边跑上下行负载边看延迟，逐步调速率。

flow offloading/HNAT 等可能绕过整形、统计或策略处理，启用 SQM 时先关闭相关卸载复测。蜂窝带宽快速波动，固定值过高控不住队列，过低损失吞吐；用保守可持续带宽并记录时段、信号和频段，不承诺一组参数适合所有环境。

- InfoID：upload-20260803-05e89ba771-05
- 原资料核对日期：2026-08-03
- 审阅状态：已整理来源快照
- 标签：OpenWrt 技术、OpenWrt、SQM、延迟、流量卸载、5G CPE
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/9f8dcaf7-240c-4cf2-beb0-33324bc2c841-openwrt-ecosystem-part-02-of-05.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/75d1e0e6-8d62-408f-907f-26ce62612d51-openwrt-geek-part-05-of-09.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/a11429d3-4bb7-40b5-8ff6-497181c3d08f-openwrt-geek-part-06-of-09.md
- 来源：https://openwrt.org/docs/guide-user/network/traffic-shaping/sqm_configuration
- 来源：https://openwrt.org/docs/guide-user/perf_and_log/flow_offloading

## OpenWrt 吞吐异常：网口协商与加速对照

先用 ip -s link、ethtool 和 dmesg 看 link、速率、双工及 errors/dropped。吞吐约 94Mbps 可先检查是否协商到 100M；换合格短线、端口和对端，再考虑驱动与加速。

irqbalance、packet steering、厂商 HNAT/WED 和通用卸载收益取决于 SoC/驱动/拓扑，盲目并开可能干扰 QoS/代理。一次改一个变量，对比 CPU/中断和局域网 iperf3，不把蜂窝基站波动归因到 LAN 卸载。

- InfoID：upload-20260803-9cfe347d5f-07
- 原资料核对日期：2026-08-03
- 审阅状态：已整理来源快照
- 标签：OpenWrt 技术、OpenWrt、网口、流量卸载、测速、网络排障
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/41dd67bd-c746-43f4-83bb-5438b4f2ba8d-openwrt-ecosystem-part-04-of-05.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/59bd5e52-f08e-46c0-80fa-56b929806393-openwrt-geek-part-09-of-09.md
- 来源：https://openwrt.org/docs/guide-user/services/start
- 来源：https://openwrt.org/docs/guide-user/base-system/basic

## OpenWrt WireGuard：没有握手与握手后不通

latest handshake: never 先核对公私钥对应、Endpoint DNS/UDP 端口、服务端放行及上级 NAT，用 WAN 抓包看请求与返回。NAT 后需保持入站可达的 peer 可按部署需求设置 PersistentKeepalive，来源示例为 25 秒。

握手成功只证明密钥和 UDP 路径成立；再核对 AllowedIPs、隧道网段重叠、防火墙转发、LAN 回程、PBR及 NAT。AllowedIPs 同时影响目的路由和 peer 源地址许可。依次测试对端隧道地址、路由器 LAN、LAN 主机，不把所有问题都归为密钥。

- InfoID：upload-20260803-fa308082fe-02
- 原资料核对日期：2026-08-03
- 审阅状态：已整理来源快照
- 标签：OpenWrt 技术、OpenWrt、WireGuard、VPN、网络排障
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/442c57db-db55-41d7-acbe-6b0aa3ea8e13-openwrt-errors-part-06-of-06.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/a11429d3-4bb7-40b5-8ff6-497181c3d08f-openwrt-geek-part-06-of-09.md
- 来源：https://openwrt.org/docs/guide-user/services/vpn/wireguard/server

## OpenWrt Tailscale/ZeroTier：路由宣告与版本配置

WireGuard 自建需处理入口/路由/密钥；Tailscale 提供控制面及 NAT 穿透，ZeroTier 提供集中授权的虚拟网络。加入网络后仍需单独设计 firewall zone、路由与权限。

Tailscale subnet route 需要控制面批准及到 LAN 的转发；exit node 另查默认路由、DNS、MTU，只有路由器通时检查 LAN 网关/NAT。ZeroTier 升级时按当前包自带 UCI 和对应文档配置，不机械混用旧 list join 与新 network 示例；保留身份与授权配置。

- InfoID：upload-20260803-8e61fc7e9d-03
- 原资料核对日期：2026-08-03
- 审阅状态：已整理来源快照
- 标签：OpenWrt 技术、OpenWrt、VPN、远程管理、网络排障
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/98a8f713-9a54-4508-acee-89483d0eb02f-openwrt-ecosystem-part-03-of-05.md
- 来源：https://openwrt.org/docs/guide-user/services/vpn/tailscale/start
- 来源：https://openwrt.org/docs/guide-user/services/vpn/zerotier

## OpenWrt 代理插件：版本绑定与全网断网排查

OpenClash、PassWall、HomeProxy 属不同项目，核心、LuCI、依赖、架构与 fw4/TUN/TProxy 支持需按各自版本配套；HomeProxy 的生成配置要匹配 sing-box 核心。不能跨固件分支拼装，也不让多个插件并行接管 DNS、默认路由和 fwmark。

启用后断网先停插件确认原生 WAN/DNS，再只启用一条代理路径，查日志、核心配置校验、53 端口、ip rule/route、nft 规则及内核模块。订阅更新成功不证明代理流量已通；不以跳过证书、force-depends 或 chmod 777 作通用修复。

- InfoID：upload-20260803-8e61fc7e9d-06
- 原资料核对日期：2026-08-03
- 审阅状态：已整理来源快照
- 标签：OpenWrt 技术、OpenWrt、代理插件、DNS、软件安装、网络排障
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/98a8f713-9a54-4508-acee-89483d0eb02f-openwrt-ecosystem-part-03-of-05.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/41dd67bd-c746-43f4-83bb-5438b4f2ba8d-openwrt-ecosystem-part-04-of-05.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/442c57db-db55-41d7-acbe-6b0aa3ea8e13-openwrt-errors-part-06-of-06.md
- 来源：https://github.com/vernesong/OpenClash
- 来源：https://github.com/Openwrt-Passwall/openwrt-passwall
- 来源：https://github.com/immortalwrt/homeproxy
