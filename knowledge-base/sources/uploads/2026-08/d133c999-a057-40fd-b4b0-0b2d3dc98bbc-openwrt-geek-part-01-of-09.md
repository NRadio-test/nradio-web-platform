# OpenWrt Geek 用户专业知识库（1/9）

面向 NRadio 的高阶 OpenWrt/ImmortalWrt 问答；核验日期 2026-08-03。

每条知识末尾保留其独立来源。此文件是为网页结构化模型控制单次输出规模而拆分的导入分片。

## 先确认版本、发行版和硬件目标

处理任何专业问题前先收集 `ubus call system board`、`cat /etc/openwrt_release`、`uname -a`、`opkg print-architecture`（OpenWrt 25.12 及以后相应检查 apk 架构）以及设备完整型号和硬件版本。OpenWrt、ImmortalWrt、厂商 SDK 固件即使界面相似，内核 ABI、补丁、软件源和升级镜像也可能不兼容；不要仅凭“都是 OP”混用教程或软件包。

标签：OpenWrt、版本、发行版、硬件、诊断
来源：https://lists.openwrt.org/pipermail/openwrt-announce/2026-March/000081.html

## OpenWrt 25.12 的包管理器变化

截至 2026-08，官方稳定线已经发布 OpenWrt 25.12。该版本从 opkg 迁移到 apk，常用命令和仓库元数据格式不同；回答安装问题必须先看实际版本，不能机械给所有用户 `opkg update && opkg install`。旧的 24.10、23.05 系统仍使用 opkg，第三方分支也可能维持自己的方案。

标签：OpenWrt、25.12、apk、opkg、软件包
来源：https://lists.openwrt.org/pipermail/openwrt-announce/2026-March/000081.html

## factory 镜像与 sysupgrade 镜像不能混用

factory 镜像通常用于从原厂系统首次刷入，sysupgrade 镜像用于已经运行 OpenWrt 的设备升级。具体设备还可能使用 `.itb`、`.bin`、`.img.gz` 或磁盘镜像，必须查对应设备页和安装方法。不要根据扩展名猜用途，也不要把另一硬件版本的镜像强刷。

标签：刷机、factory、sysupgrade、固件
来源：https://openwrt.org/docs/guide-user/installation/installation_methods/start

## 升级前校验镜像身份与校验和

升级前要核对设备 profile、target/subtarget、硬件版本、镜像类型和官方 SHA-256；保留当前可回退镜像与恢复方法。`sysupgrade -T /tmp/image` 可做平台兼容性检查，但它不能替代来源和签名验证。第三方固件还应记录构建者、源码版本、构建日期和哈希。

标签：升级、SHA256、校验、固件、安全
来源：https://openwrt.org/docs/guide-user/installation/generic.sysupgrade

## sysupgrade 实际保留什么

sysupgrade 会重写固件和根文件系统，然后按备份清单恢复配置；通常保留 `/etc/config` 等配置，但手工安装的软件包本体不会自动保留，额外服务的数据目录也未必在备份范围。先运行 `sysupgrade -l` 查看清单，用 `sysupgrade -b /tmp/backup.tar.gz` 导出，再单独备份关键业务数据。

标签：sysupgrade、备份、配置、软件包
来源：https://openwrt.org/docs/guide-user/installation/generic.sysupgrade

## 跨大版本不要盲目保留配置

DSA 迁移、防火墙 fw3 到 fw4、无线驱动或 UCI schema 变化时，旧配置可能让新系统失联。大版本、不同分支或不同 target 间升级，优先阅读发行说明并准备不保留配置的重建方案。若选择保留，应先保存文本化配置和拓扑，升级后逐项验证，而不是看到 LuCI 能打开就认为成功。

标签：升级、保留配置、DSA、fw4、兼容
来源：https://openwrt.org/docs/guide-user/installation/generic.sysupgrade

## 保存用户安装包清单

普通 sysupgrade 不会保留后来安装的软件包。可以用 `sysupgrade -k -b -` 从备份中提取 `installed_packages.txt`，也可保存 `opkg list-installed` 作为参考；恢复时应在新版本仓库重新安装，而不是把旧版 `.ipk` 或旧内核模块直接复制回来。OpenWrt 25.12 的 attended sysupgrade/owut 能把已安装包整合进重建镜像，但仍要检查兼容性。

标签：软件包、备份、恢复、owut
来源：https://openwrt.org/docs/guide-user/additional-software/managing_packages

## failsafe、恢复模式与恢复出厂不是一回事

failsafe 用最小硬编码配置启动，适合修复错误配置；factory reset 清除 overlay 中的设置和后装包；recovery mode 用于重新写入损坏固件。failsafe 常用 192.168.1.1、无 DHCP、关闭无线，需要电脑静态地址并网线连接，但按键窗口和端口因设备而异。ext4 根文件系统的 x86/块设备安装也不一定支持基于 overlay 的恢复出厂。

标签：failsafe、恢复、出厂重置、救砖
来源：https://openwrt.org/docs/guide-user/troubleshooting/failsafe_and_factory_reset
