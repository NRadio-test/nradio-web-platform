# OpenWrt 社区、插件与进阶用法（2/5）

社区证据等级、插件兼容边界与进阶架构；核验日期 2026-08-03。

每条知识末尾保留其独立来源。此文件是为网页结构化模型控制单次输出规模而拆分的导入分片。

## adblock、adblock-fast 与 AdGuard Home 怎么选

adblock/adblock-fast 更贴近 OpenWrt，可与 dnsmasq/Unbound/SmartDNS 协作，资源开销通常较低；AdGuard Home 提供独立 Web UI、统计和过滤能力，但占内存更高且会竞争 53 端口。只选一个主过滤路径，合理控制列表规模并维护 allowlist；DNS 过滤不能代替浏览器内容过滤。

标签：插件、adblock、AdGuardHome、DNS过滤
来源：https://openwrt.org/docs/guide-user/services/ad-blocking

## MosDNS、SmartDNS、dnsmasq 与加密 DNS 的组合原则

dnsmasq 适合 DHCP、本地域名和缓存入口；MosDNS/SmartDNS/Unbound/https-dns-proxy 可承担分流、测速或加密上游。稳定组合只有一个 LAN:53 入口，后端监听 loopback 非 53 端口，并明确 bootstrap DNS，防止循环依赖。代理插件若也劫持 DNS，应把整条调用链画出来再配置。

标签：插件、MosDNS、SmartDNS、dnsmasq、DoH、DNS
来源：https://github.com/sbwml/luci-app-mosdns

## DDNS 插件的正确使用边界

ddns-scripts 每个 section 通常维护一个主机名和一种地址族。先确认 WAN 获取的是可入站公网 IPv4 或有效 IPv6；CGNAT 下 DDNS 只能发布不可直连的地址，不能创造端口映射。使用 interface、web 或 script 取地址时要防止发布 VPN/ULA/私网地址，并查 `logread -e ddns` 与提供商返回码。

标签：插件、DDNS、公网IP、CGNAT、IPv6
来源：https://openwrt.org/docs/guide-user/base-system/ddns

## banIP 与普通防火墙的分工

banIP 把地址列表加载到 nft set 并生成规则，适合地区/威胁源批量拦截；基础 zone、端口和服务访问控制仍应写在 firewall4。大列表会占 RAM、延长 reload，误封 DNS/CDN/云服务也很常见。先以 report/log 模式验证，并给管理地址、VPN peer 和必要服务设置 allowlist。

标签：插件、banIP、nftables、防火墙、黑名单
来源：https://openwrt.org/docs/guide-user/services/start

## SQM/CAKE 的进阶玩法

先关闭 flow offload，在真实瓶颈接口设置略低于可持续带宽的上下行；PPPoE/VLAN/蜂窝链路要配置开销。CAKE 的 besteffort、diffserv4、dual-srchost/dsthost 等选项影响公平性和分类，只有在基线稳定后再调。用满载上下行同时测延迟，而不是只看空载测速。

标签：插件、SQM、CAKE、DiffServ、Bufferbloat
来源：https://openwrt.org/docs/guide-user/network/traffic-shaping/sqm_configuration

## mwan3 的进阶策略设计

member 的 metric 决定优先级、weight 决定同 metric 新连接分配比例；policy 决定组合，rule 决定哪些流量使用 policy。给支付、游戏、VoIP、VPN 和入站回程配置线路粘滞，给大流量下载做均衡。探测目标、DNS 和路由器自身流量也必须能够绑定正确 WAN。

标签：插件、mwan3、多WAN、策略、负载均衡
来源：https://openwrt.org/docs/guide-user/network/wan/multiwan/mwan3

## PBR 的域名策略为什么会漂移

域名会解析到 CDN 多地址并随时间改变，PBR 需要 dnsmasq nft set/ipset 或解析器把结果动态加入集合。客户端若使用 DoH、硬编码 DNS 或 QUIC，路由器可能看不到域名；同 IP 也可能承载多个域名。重要策略优先使用源设备/网段和明确 IP/CIDR，域名规则作为便利层。

标签：插件、PBR、域名、nftset、DoH、CDN
来源：https://openwrt.org/docs/guide-user/network/routing/pbr
