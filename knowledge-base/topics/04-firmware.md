# 刷机与固件

本主题包含 8 条整理后的知识；事实日期见各条目，2026-10-03 为内容审阅日期。

## C8-660 开放刷机信息的适用范围

已有公开视频资料曾介绍 C8-660 的开放刷机及社区适配。该信息限于 C8-660 和当时策略；不能推广为所有 NRadio 型号都可刷机。实际安装前核对对应硬件版本、当前固件来源、镜像类型和设备恢复方法。

- InfoID：upload-20260803-51091c0fcc-01
- 原资料核对日期：2026-08-03
- 审阅状态：已整理来源快照
- 标签：刷机与固件、C8-660、开放刷机、第三方固件
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/89617f5d-a85b-4a2f-a3b2-af8a5a8b5189-nradio-legacy-part-03-of-04.md
- 来源：https://jingxuan.douyin.com/m/video/7298330506465119551

## 马野 C2000 Max SD 固件包：身份、镜像与适用对象

本条仅适用于马野整理的“C2000MAX - 刷最新OP教程加挂载TF卡空间”包及 nradio_c2000-max-SD_0305.img，不代表厂商或 OpenWrt 官方镜像。包内有 TXT 教程、Rufus、DiskGenius、操作图及视频；依据是本地文件和镜像只读分析，不是每台设备的运行验证。

镜像身份为 xshark by ImmortalWrt 24.10-SNAPSHOT r33422+3-bf62ca2211，mediatek/filogic、aarch64_cortex-a53，Linux 6.6.94；SquashFS 4.0/XZ 元数据构建时间为 2026-03-03。镜像 SHA-256：f20a5011856d163233dd3b3fc4f1c30a59b544841ff09a09ffc7fff5fc208efd。哈希确认同一文件，不证明第三方文件安全。

GPT 分区为 bl2、u-boot-env、factory、fip、kernel、rootfs；设备树为 nradio,c2000-max，启动按 PARTLABEL=rootfs 查找根分区。不要改引导/校准分区或 rootfs 标签，也不要把这一版的驱动、软件源及升级规则套到其他镜像。旧详细分区数字和工具 EXE 哈希保留在原始来源中。

- InfoID：upload-20260803-9949756e88-01
- 原资料核对日期：2026-08-03
- 审阅状态：已整理来源快照
- 标签：刷机与固件、C2000 Max、马野、第三方固件、ImmortalWrt、SD镜像
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/278219b3-bb14-43db-a73c-a1c6c82dfd1c-c2000max-maye-part-01-of-03.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/26050dfe-e00b-4055-820a-5266b9a9d9c9-c2000max-maye-part-02-of-03.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/043fe34d-ee51-49eb-aec0-abc970566032-c2000max-maye-part-03-of-03.md

## 马野 C2000 Max SD 镜像：刷卡、首次启动与升级顺序

只适用于 nradio_c2000-max-SD_0305.img 这套第三方教程：先在原厂系统保存 SD/TF 优先启动；确认目标卡后用镜像工具整盘写入 img（会覆盖目标卡数据，不是复制文件）；按教程将尾部未分配空间建成 ext4；插回设备上电，等待模组与主机的首次自动重启完成。

教程管理地址为 192.168.7.1，Wi-Fi 及镜像 root 默认密码记录为 admin，首次登录即修改。首次进入后按教程在“系统→备份/升级”执行重置并等待重启，重置会清除设置，应先备份已有配置。不要在自动重启或初始化期间频繁断电。

同套教程的升级要求重新写完整 TF 镜像、处理尾部空间并重复首次启动过程；不能因镜像中存在 sysupgrade 脚本就推断任意 LuCI 上传可安全升级。新版本以作者对应说明为准。

- InfoID：upload-20260803-9949756e88-02
- 原资料核对日期：2026-08-03
- 审阅状态：已整理来源快照
- 标签：刷机与固件、C2000 Max、马野、SD镜像、固件升级、TF卡
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/278219b3-bb14-43db-a73c-a1c6c82dfd1c-c2000max-maye-part-01-of-03.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/26050dfe-e00b-4055-820a-5266b9a9d9c9-c2000max-maye-part-02-of-03.md

## 马野 C2000 Max 固件：TF 挂载与系统扩容的区别

该 SD 镜像预装 block-mount，fstab 开启 anon_mount/auto_mount；教程把尾部空间格式化为 ext4，是额外数据存储。现有 fstab 未把新分区指定为 /overlay，因此不能保证自动扩大软件安装空间。系统扩容还需单独验证 extroot 配置。

镜像带 USB/UAS 与多种文件系统支持；长期日志、代理数据库或 extroot 会持续写卡，应选耐久介质、按 UUID 配置并备份。自动挂载和驱动存在是镜像分析结果，实际挂载用 block info、mount、df 核对。

- InfoID：upload-20260803-f7dbd2ee59-06
- 原资料核对日期：2026-08-03
- 审阅状态：已整理来源快照
- 标签：刷机与固件、C2000 Max、马野、TF卡、extroot、扩展存储
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/26050dfe-e00b-4055-820a-5266b9a9d9c9-c2000max-maye-part-02-of-03.md

## 马野 C2000 Max 固件：网络、加速与软件兼容

镜像设备脚本默认把 eth1 与 hnat 放到 LAN，没有在该分支创建标准 WAN；排障先看 ubus 接口运行态与实际拨号出口，不假设 eth0/wan 的角色。配置为 firewall4，fullcone=1，通用软件/硬件 flow offloading 默认为 0，同时有厂商 HNAT/WED/TurboACC 组件。SQM、代理、统计及加速并用时逐项验证。

蜂窝组件有 qmodem-next、quectel-CM、AT 服务及 QMI/MBIM/MHI 等驱动，代理有 HomeProxy/sing-box；同一模组只使用一个主控拨号流程。该镜像使用 opkg，不能套用其他发行版的 apk 教程。

软件源来自 ImmortalWrt 24.10-SNAPSHOT，默认脚本还会替换到镜像站；滚动源与固定 Linux 6.6.94 的 kmod ABI 可能不匹配。使用同批源/缓存或作者完整新镜像，不强装内核依赖。

- InfoID：upload-20260803-7682e618b4-01
- 原资料核对日期：2026-08-03
- 审阅状态：已整理来源快照
- 标签：刷机与固件、C2000 Max、马野、OpenWrt、软件安装、网络排障
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/043fe34d-ee51-49eb-aec0-abc970566032-c2000max-maye-part-03-of-03.md
- 来源：https://mirrors.vsean.net/openwrt

## 马野 C2000 Max 固件：无线默认值与管理服务检查

只读镜像含 mt7993、mt_wifi7 与厂商无线配置层，初始生成逻辑的国家码/SSID/加密和教程实机说明不完全一致。以实际 /etc/config/wireless 和驱动为准；国家码匹配使用地区，不把脚本中的 6GHz 配置视为硬件或当地可用频段承诺。

镜像默认启用 Dropbear、uhttpd、ttyd、SFTP 和 AT Web/RPC 等服务；root 默认密码记录为 admin，uhttpd 未默认强制 HTTPS。更改密码，确认管理只在可信 LAN/VPN，关闭不用的服务；上联误并入 LAN 或改防火墙区域可能暴露管理入口。

- InfoID：upload-20260803-7682e618b4-03
- 原资料核对日期：2026-08-03
- 审阅状态：已整理来源快照
- 标签：刷机与固件、C2000 Max、马野、Wi-Fi、管理安全
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/043fe34d-ee51-49eb-aec0-abc970566032-c2000max-maye-part-03-of-03.md

## OpenWrt 固件升级：镜像校验、备份与失败定位

先按设备页确认 profile、target/subtarget、硬件版本、镜像类型及 SHA-256。factory、sysupgrade、SD 整盘 img 不能按扩展名互换；LuCI 不识别文件时核对是否误上传 ZIP、错误网页、factory 或整盘镜像，可用 file、sha256sum、sysupgrade -T 检查。

sysupgrade 通常恢复备份清单中的配置，不自动保留后装包及所有业务数据。升级前查看 sysupgrade -l、导出配置、包清单和额外数据，准备可回退镜像及物理恢复路径。跨分支/大版本或 DSA/fw4/schema 变化不能盲搬旧配置；不保留设置会清除配置。

空间失败先区分 /tmp RAM、/overlay 和 inode；进程终止或写入报错时保留完整日志，确认是否仍在写闪存，不立即断电。平台校验失败先修正镜像或版本，不强刷掩盖型号错误。社区脚本先审查来源、改源/引导分区/开机任务等动作，不直接运行未经审阅的一键脚本。

- InfoID：upload-20260803-1dae6cba1c-01
- 原资料核对日期：2026-08-03
- 审阅状态：已整理来源快照
- 标签：刷机与固件、OpenWrt、固件升级、镜像校验、备份、第三方固件
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/048f8d73-8c0f-4068-9590-9d512f6d12c0-openwrt-errors-part-01-of-06.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/d133c999-a057-40fd-b4b0-0b2d3dc98bbc-openwrt-geek-part-01-of-09.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/4d42ebad-7120-4079-84d7-1e195a8356ea-openwrt-ecosystem-part-05-of-05.md
- 来源：https://openwrt.org/docs/guide-user/installation/generic.sysupgrade
- 来源：https://openwrt.org/docs/guide-user/network/dsa/upgrading-to-2102
- 来源：https://openwrt.org/docs/guide-user/installation/installation_methods/start
- 来源：https://openwrt.org/docs/guide-user/additional-software/managing_packages
- 来源：https://www.right.com.cn/

## OpenWrt failsafe、恢复出厂与 recovery 的区别

failsafe 用最小配置启动以修复错误设置；恢复出厂清除可写层中的设置和后装包；recovery 用于重新写损坏固件。能进入哪种模式、按键时机、管理口和地址须查对应设备资料，不套用通用地址或步骤。

在支持的 failsafe 中可用 mount_root 挂载可写层后备份配置、撤销最近的 network/firewall/wireless 改动。factoryreset、firstboot/jffs2reset 属于清除操作，执行前确认当前系统是否支持并完成备份；块设备/ext4 安装不一定支持相同恢复出厂机制。

- InfoID：upload-20260803-0d309c781d-08
- 原资料核对日期：2026-08-03
- 审阅状态：已整理来源快照
- 标签：刷机与固件、OpenWrt、恢复模式、恢复出厂、备份
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/d133c999-a057-40fd-b4b0-0b2d3dc98bbc-openwrt-geek-part-01-of-09.md
- 来源：https://github.com/NRadio-test/nradio-web-platform/blob/main/knowledge-base/sources/uploads/2026-08/ebc296ab-e1ad-4eec-b0ce-8816b47f7f10-openwrt-geek-part-02-of-09.md
- 来源：https://openwrt.org/docs/guide-user/troubleshooting/failsafe_and_factory_reset
