# OpenWrt Geek 用户专业知识库（3/9）

面向 NRadio 的高阶 OpenWrt/ImmortalWrt 问答；核验日期 2026-08-03。

每条知识末尾保留其独立来源。此文件是为网页结构化模型控制单次输出规模而拆分的导入分片。

## DSA VLAN 中 tagged、untagged、PVID 的含义

tagged 表示该端口收发携带 VLAN tag；untagged 表示出端口去标签；PVID 决定无标签入流量归入哪个 VLAN。一个接入口通常在一个 VLAN 中标为 untagged+PVID，trunk 口在多个 VLAN 中 tagged。错误地给多个 VLAN 配 PVID 或遗漏 CPU/bridge local 参与，常导致管理面失联。修改前画端口—VLAN矩阵并保留回退口。

标签：DSA、VLAN、tagged、untagged、PVID、trunk
来源：https://openwrt.org/docs/guide-user/network/dsa/dsa-mini-tutorial

## DSA bridge-vlan 的本机参与

桥 VLAN filtering 不只控制外部端口，也决定 Linux 主机栈是否能通过 `br-lan.<vid>` 参与该 VLAN。若某 VLAN 仅做二层交换，可不创建三层 interface；若路由器要提供 DHCP、网关或防火墙，则应有相应 VLAN device 和 interface。不要为了“看得到”给每个 VLAN 都创建地址，这会扩大攻击面。

标签：DSA、bridge-vlan、本机、CPU端口
来源：https://openwrt.org/docs/guide-user/network/vlan/switch_configuration

## 配置 Dumb AP 的核心

旁路 AP 通常只保留一个管理 LAN，关闭自身 DHCP 服务器，把上联口与无线 SSID 加入 LAN 桥，并给设备一个不冲突的静态管理地址或 DHCP client 地址。不要把 LAN 接到默认 WAN zone，也不要在上下游同时提供同一网段 DHCP。需要多 SSID 隔离时用 VLAN trunk 把各网络交给主路由。

标签：DumbAP、AP、DHCP、桥接
来源：https://openwrt.org/docs/guide-user/network/wifi/start

## 访客 Wi‑Fi 隔离要同时做三层和二层

独立 guest interface、DHCP 池和 firewall zone 解决三层策略；禁止 guest→lan forwarding 并只允许 DNS、DHCP 和必要的 guest→wan。若同一 SSID 客户端也需互相隔离，还要启用 AP isolation。多 AP 场景用 VLAN 把 guest 端到端承载，不能只靠不同 SSID 名称。

标签：访客WiFi、隔离、防火墙、VLAN
来源：https://openwrt.org/docs/guide-user/network/wifi/start

## 静态路由优先级看最长前缀再看 metric

Linux 路由先选最长前缀，前缀相同再比较 metric；多个默认路由只改 metric 可做简单主备，但不能提供可靠健康检查、连接粘滞和复杂策略。排查用 `ip route show table all`、`ip rule`、`ip route get <目的地址> from <源地址>`，IPv6 使用对应 `-6` 参数。

标签：路由、metric、ip、rule、诊断
来源：https://openwrt.org/docs/guide-user/network/routing/basics

## PBR 与 mwan3 的边界

PBR 根据源/目的地址、端口、入接口或 mark 选择路由表，适合分流到特定 WAN/VPN；mwan3 在此基础上提供多 WAN 健康检查、故障转移和按连接负载均衡。只需固定设备走某 VPN 时优先 PBR；需要多链路探测和主备时使用 mwan3，避免多个策略路由插件同时争用 mark。

标签：PBR、mwan3、分流、VPN、多WAN
来源：https://openwrt.org/docs/guide-user/network/routing/pbr

## mwan3 负载均衡不是单连接带宽叠加

mwan3 依据策略把不同连接分配到多个出口，同一个 TCP/UDP flow 通常只走一个 WAN，所以单线程测速不会叠加带宽。相同 metric 的 member 按 weight 分配，新连接才体现比例；低 metric 优先，高 metric 用作备份。会话跨出口会改变公网源地址，因此银行、游戏、VoIP、VPN 等常需粘定线路。

标签：mwan3、负载均衡、单连接、权重
来源：https://openwrt.org/docs/guide-user/network/wan/multiwan/mwan3

## mwan3 排障顺序

先让每条 WAN 单独工作并拥有独立网关、DNS 和可达探测目标，再启用 mwan3。检查 `mwan3 status`、`logread -e mwan3`、`ip rule`、各策略路由表和 nft/iptables mark；探测目标应分散且真正代表互联网连通性。若接口有地址但无网关，或运营商拦 ICMP，会产生假故障。

标签：mwan3、故障转移、排障
来源：https://openwrt.org/docs/guide-user/network/wan/multiwan/mwan3
