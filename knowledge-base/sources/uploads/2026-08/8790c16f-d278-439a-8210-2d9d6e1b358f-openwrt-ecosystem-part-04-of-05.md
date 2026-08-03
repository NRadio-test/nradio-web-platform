# OpenWrt 社区、插件与进阶用法（4/5）

社区证据等级、插件兼容边界与进阶架构；核验日期 2026-08-03。

每条知识末尾保留其独立来源。此文件是为网页结构化模型控制单次输出规模而拆分的导入分片。

## HomeProxy 与 sing-box 的版本绑定

HomeProxy 是 ImmortalWrt 面向 ARM64/AMD64 的 sing-box 管理平台。sing-box 配置格式和弃用项变化较快，HomeProxy 生成器必须匹配核心版本；订阅节点变化也可能让 selector/urltest 引用失效。升级时同时检查 HomeProxy 与 sing-box changelog，先做配置校验，再切换生产流量。

标签：插件、HomeProxy、sing-box、版本、配置
来源：https://github.com/immortalwrt/homeproxy

## 代理插件排障的最小化原则

先停透明代理确认原生 WAN/DNS 正常；然后只启一个插件、一个 DNS入口和一个默认路由接管者。记录 `ip rule`、`ip route show table all`、`nft list ruleset`、53 端口监听、插件日志与核心配置检查结果。节点连通、DNS、路由和 TProxy 是四个独立层，不要只凭“订阅更新成功”判断服务可用。

标签：插件、透明代理、排障、DNS、TProxy、fwmark
来源：https://github.com/vernesong/OpenClash

## Samba4 与 ksmbd 怎么选

Samba4 功能和兼容性更完整、资源占用较高；ksmbd 是内核 SMB3 服务，较轻但功能较少。外置盘先稳定挂载，再创建专用用户、设置目录权限和 SMB 密码；不要开放到 WAN。高并发、重要数据和 Time Machine 场景优先评估完整 Samba，低资源简单共享可考虑 ksmbd。

标签：插件、Samba、ksmbd、NAS、SMB
来源：https://openwrt.org/docs/guide-user/services/nas/cifs.server

## Docker/Podman 在 OpenWrt 上的适用边界

容器适合 x86/高内存 ARM 和可靠外置存储，不适合小闪存路由器。把容器 root、volume 与日志放到 ext4/btrfs 数据盘，限制日志和内存；容器 bridge、macvlan 和端口发布会与 firewall4、VLAN、PBR 交互。路由核心功能不宜全部塞进容器，以免容器引擎故障导致整网失联。

标签：插件、Docker、Podman、容器、存储
来源：https://openwrt.org/docs/guide-user/virtualization/docker_host

## Transmission/aria2 等下载插件的路由器负载风险

P2P 会制造大量连接、随机磁盘写入和 conntrack 压力，TF 卡和小内存设备容易出现 I/O wait、table full 与 OOM。把下载目录放到独立硬盘，限制并发/连接数/缓存和上传速度，配合 SQM 时预留带宽；不要让下载器写内部 overlay。

标签：插件、Transmission、aria2、P2P、下载、conntrack
来源：https://openwrt.org/docs/guide-user/services/start

## miniupnpd/UPnP 的安全边界

UPnP 允许可信 LAN 客户端动态创建端口映射，方便游戏和通信，但恶意或被入侵客户端也能开放服务。仅在明确的可信 zone 启用，限制外部端口和租期，绝不监听 WAN/访客网；CGNAT 下即使映射成功也未必能从互联网访问。高安全环境使用手工端口转发或 VPN。

标签：插件、UPnP、miniupnpd、端口映射、安全
来源：https://openwrt.org/docs/guide-user/services/start

## irqbalance、packet steering 和硬件卸载

irqbalance/packet steering 尝试把网络中断和软中断分散到多核，硬件卸载绕过部分 CPU 路径。收益取决于 SoC、驱动和拓扑，盲目全开可能增加延迟或与厂商 HNAT/WED 冲突。用 `top -H`、`/proc/interrupts`、软中断和 iperf3 前后对比，单独改变一个变量。

标签：进阶、irqbalance、PacketSteering、HNAT、WED、性能
来源：https://openwrt.org/docs/guide-user/services/start
