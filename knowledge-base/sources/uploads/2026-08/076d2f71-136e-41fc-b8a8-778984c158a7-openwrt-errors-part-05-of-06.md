# OpenWrt 安装与运行报错解决字典（5/6）

按报错原文组织的原因、验证、处理与风险说明；核验日期 2026-08-03。

每条知识末尾保留其独立来源。此文件是为网页结构化模型控制单次输出规模而拆分的导入分片。

## 报错：dnsmasq failed to create listening socket for port 53

端口 53 已被其他 DNS 服务占用，或 dnsmasq 被配置到不存在地址。用 `ss -lnup | grep ':53'`、`ps` 和 `uci show dhcp` 查占用者。AdGuardHome/MosDNS/SmartDNS 与 dnsmasq 并用时，应让一个监听 LAN:53，另一个监听 127.0.0.1 的非 53 端口，禁止相互回指形成循环。

标签：报错、dnsmasq、Port53、AddressInUse、DNS
来源：https://openwrt.org/docs/guide-user/base-system/dhcp_configuration

## 报错：Wireless is not associated / radio is disabled

先看 `wifi status`、`ubus call network.wireless status`、`logread -e hostapd -e netifd` 和 `iw phy`。原因包括国家码/信道非法、缺少固件、wpad 功能不够、radio disabled、校准数据缺失或 AP+STA 并发限制。恢复默认无线配置前先备份；若 phy 都不存在，应查驱动和设备树而不是继续改 SSID。

标签：报错、WirelessDisabled、NoPhy、hostapd
来源：https://openwrt.org/docs/guide-user/network/wifi/start

## 报错：ACS failed / could not select channel

自动选信道无法完成时，可能没有可用信道、国家码错误、所有 DFS 信道处于禁用期、扫描失败或驱动不支持所选带宽。查看 hostapd 的 ACS/DFS 日志，临时选择当地合法的固定非 DFS 信道和较窄带宽验证。不要把 country 设为他国来绕开限制。

标签：报错、ACSFailed、Channel、WiFi、DFS
来源：https://openwrt.org/docs/guide-user/network/wifi/start

## 报错：DFS-CAC-START 后 Wi‑Fi 很久才出现或突然消失

DFS 信道启动前需要 CAC，检测雷达后必须换信道并进入 non-occupancy period，这是法规行为。日志若出现 radar detected 并非硬件必然故障。需要快速上线或极高稳定性时选择当地允许的非 DFS 信道；否则等待 CAC 完成并避免频繁重启 AP。

标签：报错、DFS、CAC、RadarDetected、WiFi
来源：https://openwrt.org/docs/guide-user/network/wifi/start

## 报错：wireless setup failed，启用 802.11k/v 后无线全灭

OpenWrt 24.10 中 `wpad-basic-mbedtls` 等精简变体可能不含完整 802.11k/r/v 功能。核对已安装 wpad 变体，先移除冲突的 basic 包，再安装匹配版本的完整 wpad；切换过程会短暂中断无线，必须通过网线操作。usteer 与 DAWN 只能选一个，参数过激也会让客户端频繁被踢。

标签：报错、WirelessSetupFailed、wpad、80211k、80211v
来源：https://openwrt.org/docs/guide-user/network/wifi/roaming

## 报错：Failed to start firewall / nft syntax error

运行 `fw4 check`、`fw4 print` 和 `nft -c -f` 对生成规则做语法检查，日志通常会给出文件、行列或缺失 symbol。暂时移走最近加入的 `/usr/share/nftables.d/*.nft` 或禁用相关插件，再重启 firewall。旧 iptables 脚本、ipset 语法和第三方透明代理规则是常见来源；不要在防火墙失败状态长期联网。

标签：报错、FirewallStartFailed、nft、SyntaxError、fw4
来源：https://openwrt.org/docs/guide-user/firewall/firewall_configuration

## 报错：mwan3 interface offline despite interface is online

mwan3 的 online 取决于 tracking 探测，不等同于 netifd 接口 up。检查探测目标是否允许 ICMP、DNS 是否依赖同一故障链路、路由表是否把探测包送对出口，以及 metric/mark 是否冲突。为每条 WAN 选多个分散目标，并在独立工作正常后再纳入 mwan3。

标签：报错、mwan3、Offline、Tracking、多WAN
来源：https://openwrt.org/docs/guide-user/network/wan/multiwan/mwan3
