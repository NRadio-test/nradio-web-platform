# OpenWrt 安装与运行报错解决字典（1/6）

按报错原文组织的原因、验证、处理与风险说明；核验日期 2026-08-03。

每条知识末尾保留其独立来源。此文件是为网页结构化模型控制单次输出规模而拆分的导入分片。

## 报错：Image check failed / Invalid image type

该报错表示平台校验拒绝镜像，常见原因是 factory/sysupgrade 类型错、设备 profile 或硬件版本错、镜像损坏、从 swconfig 迁移 DSA 时配置不兼容。先运行 `ubus call system board`、核对下载页 target/profile 和 SHA-256，再执行 `sysupgrade -T /tmp/firmware` 查看完整前置日志。只有设备官方说明明确要求时才考虑 force；不能用强刷掩盖型号错误。

标签：报错、ImageCheckFailed、InvalidImage、sysupgrade、固件
来源：https://openwrt.org/docs/guide-user/installation/generic.sysupgrade

## 报错：Image version mismatch / Config cannot be migrated

这通常不是文件损坏，而是 image compat version 或网络模型发生变化，例如端口命名、DSA 迁移。应导出配置和包清单，下载正确镜像，使用不保留设置的升级方式并手工重建。`sysupgrade -n` 会清除配置，执行前必须确保有本地网线、默认地址和恢复路径；不要把旧 `/etc/config/network` 整体复制回去。

标签：报错、VersionMismatch、DSA、配置迁移、sysupgrade
来源：https://openwrt.org/docs/guide-user/network/dsa/upgrading-to-2102

## 报错：The uploaded image file does not contain a supported format

LuCI 无法识别上传文件时，先确认没有把 `.zip`、网页下载错误页、factory 镜像或磁盘整盘 img 当作 sysupgrade 镜像。用 `file`、`sha256sum` 和 `sysupgrade -T` 检查；浏览器下载文件尺寸异常小往往是登录页或 404。设备若要求 U-Boot、TFTP、SD 整盘写入，应按设备安装方法操作，不能从 LuCI 上传。

标签：报错、LuCI、UnsupportedFormat、固件、上传
来源：https://openwrt.org/docs/guide-user/installation/generic.sysupgrade

## 报错：not enough space in /tmp / No space left on device 上传固件失败

LuCI 和 sysupgrade 通常先把镜像放到 RAM-backed `/tmp`。检查 `df -h /tmp /overlay`、`free -h`、`ls -lh /tmp`；停止占内存服务并删除临时文件。低内存设备可从 URL 流式升级或用设备文档给出的低内存方案，但升级时不要靠 swap 掩盖严重内存不足，也不要把固件放到不受平台脚本支持的路径。

标签：报错、tmp、空间不足、sysupgrade、RAM
来源：https://openwrt.org/docs/guide-user/installation/generic.sysupgrade

## 报错：Failed to kill all processes / Command failed during sysupgrade

升级切换到 ramfs 后会终止服务并卸载文件系统；进程无法结束、外置盘忙或平台脚本 I/O 错误都可能中断。不要立刻断电，保留串口输出和完整 sysupgrade 日志，确认设备是否仍在写闪存。再次尝试前停止容器、下载、挂载和代理服务，并校验镜像；若已经无法启动，使用设备专用 recovery/TFTP/串口方案。

标签：报错、sysupgrade、FailedToKill、processes、I/O
来源：https://openwrt.org/docs/guide-user/installation/generic.sysupgrade

## 报错：Cannot satisfy dependencies / kernel is not compatible

安装 kmod 时该报错几乎总是正在运行的内核 ABI 与仓库包不一致，snapshot 和第三方固件最常见。记录 `uname -r`、`opkg status kernel`、release/target 和 distfeeds；使用同一构建批次的软件源，或重刷当前仓库对应镜像。不要对内核模块使用 `--force-depends`，即使文件装进去也可能无法加载、崩溃或无法重启。

标签：报错、kmod、KernelNotCompatible、依赖、ABI
来源：https://openwrt.org/faq/cannot_satisfy_dependencies

## 报错：Unknown package / package not found

先更新索引并确认包名、版本和架构：24.10 及更早运行 `opkg update`，25.12 及以后运行 `apk update`；查看源是否启用、URL 是否返回真实仓库、包是否为该架构构建。某些 LuCI 页面需要 `luci-app-名称`，协议还需要 `luci-proto-名称`。第三方教程里的包可能不在官方源，应去项目仓库核对支持分支，而不是随便添加陌生 feed。

标签：报错、UnknownPackage、opkg、apk、软件包
来源：https://openwrt.org/docs/guide-user/additional-software/managing_packages
