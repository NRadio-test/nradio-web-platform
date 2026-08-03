# OpenWrt Geek 用户专业知识库（7/9）

面向 NRadio 的高阶 OpenWrt/ImmortalWrt 问答；核验日期 2026-08-03。

每条知识末尾保留其独立来源。此文件是为网页结构化模型控制单次输出规模而拆分的导入分片。

## 802.11s Mesh 与多 AP 漫游是两件事

802.11s 描述 AP/节点间无线 mesh backhaul，802.11r/k/v 帮助终端在接入点之间漫游。Mesh 不天然等于无缝漫游，也不会消除无线回程的半双工和同频复用损失。能拉网线时有线回程通常更稳；使用 Mesh 时要单独设计 backhaul 频段、VLAN 承载和 portal 故障恢复。

标签：802.11s、Mesh、802.11r、回程
来源：https://openwrt.org/docs/guide-user/network/wifi/mesh/rapiddeployment

## USB 3.0 可能干扰 2.4GHz

USB 3.x 设备、线缆和接口的宽带噪声可能落在 2.4GHz 附近，表现为插入硬盘或 5G 模组后 2.4G 吞吐下降、丢包或覆盖变差。可通过改用屏蔽更好的短线、拉开天线与 USB 设备距离、换 USB2 模式或优先使用 5/6GHz 验证。

标签：USB3、WiFi、2.4GHz、干扰
来源：https://openwrt.org/docs/guide-user/network/wifi/start

## 额外挂载与 extroot 的区别

把磁盘分区挂到 `/mnt/data` 只增加数据存储，不会增加 `/overlay` 的软件安装空间。extroot 是在 preinit 阶段把外部分区作为 overlay，才会扩大可写根文件系统。先明确需求：存日志/文件用普通挂载；要安装更多包才配置 extroot。

标签：extroot、挂载、overlay、扩容
来源：https://openwrt.org/docs/guide-user/storage/start

## 识别块设备和文件系统

安装 `block-mount` 与对应 USB/文件系统驱动后，用 `block info` 获取 UUID、LABEL、TYPE，`lsblk -f`/`dmesg` 查看设备名和枚举。fstab 优先按 UUID 引用，避免 `/dev/sda1` 因插拔顺序变化。修改分区前确认目标设备容量和序列号，防止把系统盘格式化。

标签：block-mount、UUID、lsblk、存储
来源：https://openwrt.org/docs/techref/block_mount

## extroot 的准备与验证

extroot 分区一般使用 ext4 等 Linux 文件系统，安装 `block-mount` 和相应 kmod，复制当前 overlay 内容，再在 `/etc/config/fstab` 配置目标为 `/overlay`。重启前运行 `block info` 和 `mount` 校验 UUID；重启后用 `mount`、`df -h`、`ubus call system board` 确认实际 overlay 设备，不能只看 LuCI 容量。

标签：extroot、fstab、ext4、block-mount
来源：https://openwrt.org/docs/guide-user/storage/start

## extroot 失效时为什么系统像恢复出厂

外部盘未识别、UUID 改变、驱动不在只读固件或文件系统损坏时，系统会回退到内部 overlay，看起来像配置和软件包全部消失，但外部数据通常仍在。不要立即重新格式化；先查 dmesg、block info、fstab 和挂载日志，修好后重新挂载即可找回原 extroot 内容。

标签：extroot、失效、回退、数据恢复
来源：https://openwrt.org/docs/guide-user/storage/start

## 文件系统选择要考虑断电和写放大

ext4 是 OpenWrt 外置存储的常见稳妥选择；F2FS 面向闪存，btrfs 功能丰富但资源和恢复复杂度更高；exFAT/NTFS 适合跨平台数据盘，不适合作为要求 Unix 权限和符号链接的 extroot。频繁日志、数据库和 swap 会增加 TF/闪存写入，应使用高耐久介质并做好备份。

标签：ext4、F2FS、btrfs、TF卡、文件系统
来源：https://openwrt.org/docs/guide-user/storage/usb-drives

## 内核模块必须精确匹配 ABI

kmod 包依赖构建时的内核版本和 ABI 哈希。即使 CPU 架构相同，另一个 release/snapshot 的 kmod 也常因 `kernel (= …)` 依赖拒绝安装；强制安装可能无法加载甚至导致崩溃。snapshot 仓库滚动后尤其容易出现镜像与在线 kmod 不同步，应保存匹配仓库或重刷同批镜像。

标签：kmod、内核ABI、snapshot、软件源
来源：https://openwrt.org/docs/guide-user/additional-software/imagebuilder
