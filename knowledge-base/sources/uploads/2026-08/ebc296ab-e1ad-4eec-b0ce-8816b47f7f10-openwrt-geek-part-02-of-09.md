# OpenWrt Geek 用户专业知识库（2/9）

面向 NRadio 的高阶 OpenWrt/ImmortalWrt 问答；核验日期 2026-08-03。

每条知识末尾保留其独立来源。此文件是为网页结构化模型控制单次输出规模而拆分的导入分片。

## 进入 failsafe 后的基本修复流程

进入 failsafe 后先确认链路，执行 `mount_root` 挂载可写 overlay，再检查 `/etc/config/network`、`firewall`、`wireless` 或撤销最近改动。需要彻底清除设置时可用当前版本提供的 `factoryreset`（旧文档常写 `firstboot`/`jffs2reset`），但该操作不可逆。修复前能复制配置就先复制。

标签：failsafe、mount_root、factoryreset
来源：https://openwrt.org/docs/guide-user/troubleshooting/failsafe_and_factory_reset

## SquashFS、overlay 与 /rom 的关系

典型 SquashFS 固件把只读系统放在 `/rom`，把用户变化放在 `/overlay`，两者通过 OverlayFS 合成为可写的 `/`。删除只读系统文件只会在 overlay 创建 whiteout，并不会释放 SquashFS 空间；恢复出厂本质上清空 overlay。排查空间时同时看 `df -h`、`mount`、`du -x` 和 `/overlay/upper`。

标签：SquashFS、OverlayFS、rom、overlay、空间
来源：https://openwrt.org/docs/techref/flash.layout

## UCI 修改要经过 commit 和服务重载

`uci set`、`add_list`、`delete` 只修改候选配置；`uci changes` 可审查，`uci commit <package>` 才持久化。随后应对具体服务执行 reload/restart，网络配置可用 `service network reload`，但远程改 LAN、VLAN、桥或防火墙前应备份并准备串口/物理回退。避免脚本中无范围地 `uci commit`，便于审计和回滚。

标签：UCI、commit、配置、服务
来源：https://openwrt.org/docs/guide-user/base-system/basic

## UCI 匿名 section 的索引风险

`@zone[1]`、`@wifi-iface[0]` 等匿名索引依赖当前排列，安装包或用户新增 section 后索引可能改变。自动化脚本优先使用具名 section，或先通过 `uci show`/脚本按属性定位，再修改；否则一句复制粘贴命令可能改错防火墙区域。

标签：UCI、匿名section、脚本、风险
来源：https://openwrt.org/docs/guide-user/base-system/basic

## ubus 是运行态事实的重要入口

UCI 描述期望配置，ubus 更接近 netifd/procd 当前运行态。常用 `ubus list`、`ubus call system board`、`ubus call network.interface dump`、`ubus call network.device status '{"name":"br-lan"}'`。诊断“配置看着对但不工作”时，应同时比较 UCI、ubus、`ip address/route/link` 与日志。

标签：ubus、netifd、运行态、诊断
来源：https://openwrt.org/docs/guide-user/base-system/basic

## 日志先分内核与用户空间

`logread -e 关键词` 查看 procd/logd 管理的系统日志，`dmesg -w` 关注内核、驱动、USB、存储和网卡事件。复现问题前可记录 `logread -f`，并同时采集时间、接口状态和触发动作。默认环形缓冲区会覆盖旧消息，长期问题需要远程 syslog 或提高 `/etc/config/system` 的日志缓冲。

标签：logread、dmesg、日志、排障
来源：https://openwrt.org/docs/guide-user/base-system/system_configuration

## 不要把 interface、device 和物理端口混为一谈

OpenWrt 中 network interface 是三层逻辑配置，device 是二层对象，物理端口、桥、VLAN 子接口、PPPoE 设备又是不同层。防火墙 zone 绑定 network interface，而抓包和流量整形常要求实际 L2/L3 device。先用 `ubus call network.interface.<name> status` 找 `l3_device` 和 `device`，避免在错误接口上抓包或做 SQM。

标签：interface、device、l3_device、网络
来源：https://openwrt.org/docs/guide-user/network/routing/basics

## 识别 DSA 还是 swconfig

OpenWrt 21.02 起大量平台迁移到 DSA，但并非所有设备同时完成。可检查 `/sys/class/net/*/uevent` 中 `DEVTYPE=dsa`、查看 LuCI 的 Bridge VLAN filtering，以及是否存在 `switch0`/`swconfig` 配置。DSA 与 swconfig 的配置模型不兼容，教程必须匹配设备和版本。

标签：DSA、swconfig、交换机、VLAN
来源：https://openwrt.org/docs/guide-user/network/dsa/start
