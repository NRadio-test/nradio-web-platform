# OpenWrt 社区、插件与进阶用法（3/5）

社区证据等级、插件兼容边界与进阶架构；核验日期 2026-08-03。

每条知识末尾保留其独立来源。此文件是为网页结构化模型控制单次输出规模而拆分的导入分片。

## usteer 与 DAWN 只能选择一个

两者都根据 802.11k/v 信息和信号/负载向客户端提出漫游建议，同时启用会产生相互矛盾的 steering。OpenWrt 24.10 常需完整 wpad 才支持 k/r/v。先统一 SSID、加密、VLAN和 802.11r，再用默认或温和阈值部署 steering；客户端最终仍可忽略建议。

标签：插件、usteer、DAWN、80211k、80211v、漫游
来源：https://openwrt.org/docs/guide-user/network/wifi/roaming

## usteer 的诊断接口

用 `ubus call usteer local_info`、`remote_hosts`、`remote_info`、`get_clients` 查看本地/远端 AP、负载、噪声和客户端能力。若 remote_hosts 为空，检查各 AP 的 network 配置、二层/三层可达性和防火墙；若有邻居但不漫游，检查客户端是否支持 BSS Transition、信号差阈值与目标 AP 是否确实更好。

标签：插件、usteer、ubus、漫游、诊断
来源：https://openwrt.org/docs/guide-user/network/wifi/usteer

## WireGuard、Tailscale、ZeroTier 的选择

WireGuard 自建最轻量、拓扑和密钥完全可控，但需自己处理公网入口、路由与密钥；Tailscale 基于 WireGuard，控制面和 NAT 穿透更易用，可做 subnet router/exit node；ZeroTier 提供虚拟二层/三层网络和集中授权。无论哪种，加入虚拟网后都要单独设计 firewall zone、路由宣告和管理权限。

标签：插件、WireGuard、Tailscale、ZeroTier、VPN
来源：https://openwrt.org/docs/guide-user/services/vpn/tailscale/start

## Tailscale subnet router/exit node 的进阶检查

OpenWrt 宣告 LAN 网段后，需要在控制面批准 route，并允许 tailscale zone 到 LAN forwarding；使用 exit node 还要处理默认路由、DNS 和 MTU。若只有路由器自身能通而 LAN 客户端不通，检查 forwarding、NAT 和 LAN 客户端默认网关。不要把管理网段无差别暴露给 tailnet 全体成员。

标签：插件、Tailscale、SubnetRouter、ExitNode
来源：https://openwrt.org/docs/guide-user/services/vpn/tailscale/start

## ZeroTier 版本升级后的 UCI schema 差异

ZeroTier 1.14.1 前后 OpenWrt UCI 示例结构发生变化，旧教程的 `list join` 与新 `config network` 写法不能机械混用。以当前包自带 `/etc/config/zerotier` 和官方文档为准，升级前保存 network ID、identity 和授权状态；虚拟接口要加入单独 firewall zone。

标签：插件、ZeroTier、UCI、网络
来源：https://openwrt.org/docs/guide-user/services/vpn/zerotier

## OpenClash 的定位与兼容风险

OpenClash 是基于 Mihomo/Clash 的第三方 OpenWrt 客户端，功能丰富，依赖 dnsmasq-full、TUN/TProxy、iptables/nft 兼容组件和自身核心。它不属于 OpenWrt 官方 feed；安装必须按项目 release 匹配 fw4、CPU 架构与内核模块。升级前导出配置，不能与其他透明代理同时接管 DNS、默认路由和 fwmark。

标签：插件、OpenClash、Mihomo、TProxy、第三方
来源：https://github.com/vernesong/OpenClash

## PassWall 的定位与依赖管理

PassWall 是第三方代理管理插件，主仓库和 packages feed 分开，协议核心与 LuCI 版本需要成套。安装前确认所用 OpenWrt/ImmortalWrt 分支、架构、iptables/nftables 路径和核心来源；遇到依赖缺失应按项目 feed 编译/安装，不能从不同固件仓库拼包。与 OpenClash/HomeProxy/PBR 并用极易冲突。

标签：插件、PassWall、代理、第三方、feed
来源：https://github.com/Openwrt-Passwall/openwrt-passwall
