// highlight.js : langages utiles à l'administration système et réseau + grammaires maison
// Copyright (c) 2026 JK-ASFC — licence MIT (voir LICENSE).
// pour named.conf (BIND), dhcpd.conf (ISC DHCP) et la configuration FreeRADIUS.
import hljs from 'highlight.js/lib/core';
import apache from 'highlight.js/lib/languages/apache';
import bash from 'highlight.js/lib/languages/bash';
import csharp from 'highlight.js/lib/languages/csharp';
import diff from 'highlight.js/lib/languages/diff';
import groovy from 'highlight.js/lib/languages/groovy';
import dns from 'highlight.js/lib/languages/dns';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import ini from 'highlight.js/lib/languages/ini';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import kotlin from 'highlight.js/lib/languages/kotlin';
import lua from 'highlight.js/lib/languages/lua';
import markdown from 'highlight.js/lib/languages/markdown';
import nginx from 'highlight.js/lib/languages/nginx';
import perl from 'highlight.js/lib/languages/perl';
import php from 'highlight.js/lib/languages/php';
import plaintext from 'highlight.js/lib/languages/plaintext';
import powershell from 'highlight.js/lib/languages/powershell';
import properties from 'highlight.js/lib/languages/properties';
import python from 'highlight.js/lib/languages/python';
import ruby from 'highlight.js/lib/languages/ruby';
import shell from 'highlight.js/lib/languages/shell';
import typescript from 'highlight.js/lib/languages/typescript';
import sql from 'highlight.js/lib/languages/sql';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';

const langs = { apache, bash, csharp, diff, dns, dockerfile, groovy, ini, java, javascript, json, kotlin, lua, markdown, nginx, perl, php, plaintext, powershell, properties, python, ruby, shell, sql, typescript, xml, yaml };
for (const [name, def] of Object.entries(langs)) hljs.registerLanguage(name, def);

function confLanguage(name, keywords, extraContains = []) {
  return (hl) => ({
    name,
    keywords: {
      $pattern: /[A-Za-z_][A-Za-z0-9_-]*/,
      keyword: keywords,
      literal: 'yes no true false on off none any localhost localnets',
    },
    contains: [
      hl.HASH_COMMENT_MODE,
      hl.C_LINE_COMMENT_MODE,
      hl.C_BLOCK_COMMENT_MODE,
      hl.QUOTE_STRING_MODE,
      { className: 'string', begin: /'/, end: /'/ },
      { className: 'variable', begin: /%\{/, end: /\}/, contains: [{ begin: /\{/, end: /\}/ }] },
      { className: 'variable', begin: /\$\{/, end: /\}/ },
      { className: 'variable', begin: /\$[A-Z_]+\$/ },
      { className: 'number', begin: /\b\d{1,3}(\.\d{1,3}){3}(\/\d{1,2})?\b/ },
      { className: 'number', begin: /\b(?:[0-9a-fA-F]{1,4}:){2,7}[0-9a-fA-F]{0,4}(\/\d{1,3})?/ },
      { className: 'number', begin: /\b(?:[0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}\b/ },
      { className: 'number', begin: /\b\d+[smhdwKMG]?\b/ },
      ...extraContains,
    ],
  });
}

hljs.registerLanguage(
  'named',
  confLanguage(
    'named.conf',
    'options acl zone view key controls logging channel category server primaries masters also-notify allow-query allow-query-cache ' +
      'allow-transfer allow-update allow-recursion allow-notify recursion forwarders forward type file directory listen-on listen-on-v6 ' +
      'notify dnssec-validation dnssec-policy inline-signing update-policy algorithm secret primary secondary master slave hint stub mirror ' +
      'static-stub redirect include match-clients match-destinations match-recursive-only severity print-time print-severity print-category ' +
      'versions size inet port keys tls http https rate-limit response-policy statistics-channels trust-anchors managed-keys max-cache-size ' +
      'querylog version hostname server-id blackhole empty-zones-enable minimal-responses prefetch recursive-clients tcp-clients ' +
      'notify-source transfer-source key-directory journal max-journal-size serial-update-method catalog-zones zone-directory ' +
      'keys signatures-validity nsec3param dnskey-ttl publish-safety retire-safety purge-keys parent-ds-ttl parent-propagation-delay ' +
      'zone-propagation-delay lifetime ksk zsk csk unlimited dyndb plugin pid-file dump-file statistics-file memstatistics-file ' +
      'auth-nxdomain qname-minimization responses-per-second window log-only exempt-clients grant deny name subdomain zonesub ' +
      'self selfsub wildcard krb5-self ms-self tcp-self 6to4-self external local only first fail warn ignore ' +
      'default_syslog default_debug default_stderr null syslog stderr daemon dynamic info notice debug critical error',
  ),
);

hljs.registerLanguage(
  'dhcpd',
  confLanguage(
    'dhcpd.conf',
    'subnet subnet6 netmask range range6 prefix6 option host hardware ethernet fixed-address fixed-address6 fixed-prefix6 group ' +
      'class subclass match if else elsif pool pool6 allow deny ignore members of failover peer primary secondary address port ' +
      'split mclt hba load balance max-response-delay max-unacked-updates max-balance min-balance auto-partner-down ' +
      'authoritative not default-lease-time max-lease-time min-lease-time preferred-lifetime ddns-update-style ddns-updates ' +
      'ddns-domainname ddns-rev-domainname ddns-hostname ddns-ttl update-static-leases update-conflict-detection update-optimization ' +
      'key zone algorithm secret shared-network next-server filename server-name log-facility on commit release expiry execute set ' +
      'define include known unknown unknown-clients known-clients booting bootp dynamic-bootp lease-file-name pid-file-name ' +
      'server-identifier ping-check ping-timeout get-lease-hostnames use-host-decl-names one-lease-per-client local-address ' +
      'omapi-port omapi-key code space vendor-option-space encapsulate substring binary-to-ascii concat suffix exists ' +
      'packet hardware option agent circuit-id remote-id spawn with lease limit dhcp-lease-time ignore-client-uids ' +
      'interface vendor-class-identifier user-class client-identifier dhcp-client-identifier text string integer unsigned ' +
      'boolean ip-address array encapsulate log info always-broadcast stash-agent-options deny-unknown-clients',
  ),
);

hljs.registerLanguage(
  'radius',
  confLanguage(
    'FreeRADIUS',
    'client server listen authorize authenticate preacct accounting post-auth pre-proxy post-proxy session recv send ' +
      'if elsif else update switch case return reject ok fail noop handled updated notfound userlock invalid redundant load-balance ' +
      'redundant-load-balance parallel foreach break control request reply proxy-request proxy-reply outer session-state config ' +
      'ipaddr ipv4addr ipv6addr secret shortname nastype nas_type require_message_authenticator limit_proxy_state proto virtual_server ' +
      'Auth-Type Autz-Type Acct-Type Post-Auth-Type Session-Type eap mschap pap chap ldap sql files detail unix exec expr expiration ' +
      'logintime preprocess suffix ntdomain realm home_server home_server_pool policy instantiate modules thread pool tls tls-config ' +
      'peap ttls md5 gtc default_eap_type private_key_file certificate_file ca_file ca_path dh_file tls_min_version tls_max_version ' +
      'cipher_list ecdh_curve cache verify ocsp identity password base_dn filter base_filter membership_filter groupname_attribute ' +
      'driver dialect radius_db login read_clients client_table ntlm_auth with_ntdomain_hack use_mppe require_encryption ' +
      'require_strong authorize_check_query authorize_reply_query accounting_onoff_query sqlcounter counter_name check_name ' +
      'reply_name reset key query type nostrip fallback status_server response_window zombie_period revive_interval ' +
      'virtual_server copy_request_to_tunnel use_tunneled_reply max_requests max_request_time cleanup_delay start_servers ' +
      'max_servers min_spare_servers max_spare_servers max_queue_size auth auth_badpass auth_goodpass destination stripped_names ' +
      'regular_expressions extended_expressions prefix delimiter ignore_default ignore_null',
    [
      { className: 'attr', begin: /\b[A-Z][A-Za-z0-9]*(?:-[A-Z0-9][A-Za-z0-9]*)+\b/ },
      { className: 'operator', begin: /:=|==|\+=|-=|!=|=~|!~|>=|<=|=\*|!\*/ },
    ],
  ),
);

hljs.registerLanguage('cisco', (hl) => ({
  name: 'Cisco IOS',
  keywords: {
    $pattern: /[a-z][a-z0-9-]*/,
    keyword:
      'interface ip ipv6 no shutdown description switchport mode access trunk vlan native allowed aaa new-model radius tacacs server ' +
      'group dot1x authentication authorization accounting mab port-control auto host-mode multi-auth multi-domain single-host ' +
      'periodic timer reauthenticate tx-period violation restrict protect snmp-server community view user host enable traps ' +
      'logging ntp router network hostname secret password line vty console login local transport input ssh crypto key generate rsa ' +
      'address helper-address dhcp snooping trust spanning-tree portfast bpduguard default exec commands start-stop stop-only ' +
      'source-interface deadtime dead-criteria automate-tester probe pac encryption dynamic-author client server-key ' +
      'event fail action authorize order priority control-direction identity profile policy-map service-policy class-map ' +
      'privilege level username system-auth-control radius-server attribute include send authorize-vlan access-session',
    literal: 'enable disable',
  },
  contains: [
    { className: 'comment', begin: /^\s*!/, end: /$/ },
    hl.QUOTE_STRING_MODE,
    { className: 'number', begin: /\b\d{1,3}(\.\d{1,3}){3}(\/\d{1,2})?\b/ },
    { className: 'title', begin: /\b(?:Gi|Fa|Te|Twe|Fo|Hu|GigabitEthernet|FastEthernet|TenGigabitEthernet|Vlan|Port-channel|Loopback)[\d/.]+/ },
    { className: 'number', begin: /\b\d+\b/ },
  ],
}));

hljs.registerAliases(['sh', 'zsh', 'console', 'linux'], { languageName: 'bash' });
hljs.registerAliases(['ps', 'ps1', 'pwsh', 'cmd', 'bat', 'batch'], { languageName: 'powershell' });
hljs.registerAliases(['zone'], { languageName: 'dns' });
hljs.registerAliases(['bind', 'bind9', 'namedconf'], { languageName: 'named' });
hljs.registerAliases(['dhcp', 'isc-dhcp', 'dhcpd.conf'], { languageName: 'dhcpd' });
hljs.registerAliases(['freeradius', 'unlang', 'raddb'], { languageName: 'radius' });
hljs.registerAliases(['conf', 'cfg', 'toml', 'systemd'], { languageName: 'ini' });
hljs.registerAliases(['text', 'txt', 'output', 'log'], { languageName: 'plaintext' });
hljs.registerAliases(['html', 'webconfig', 'config'], { languageName: 'xml' });
hljs.registerAliases(['ios', 'iosxe', 'nxos'], { languageName: 'cisco' });
hljs.registerAliases(['junos'], { languageName: 'plaintext' });

hljs.registerLanguage(
  'haproxy',
  confLanguage(
    'HAProxy',
    'global defaults frontend backend listen peers resolvers userlist program cache ring mailers http-errors ' +
      'bind mode server server-template default-server default_backend use_backend acl balance option timeout maxconn ' +
      'log log-format stats http-request http-response http-after-response tcp-request tcp-response stick-table stick ' +
      'redirect errorfile hash-type cookie check inter fall rise weight backup ssl crt ca-file verify alpn sni send-proxy ' +
      'send-proxy-v2 accept-proxy daemon user group chroot nbthread cpu-map ssl-default-bind-options ssl-default-bind-ciphers ' +
      'ssl-default-bind-ciphersuites tune if unless deny allow set-header add-header del-header replace-header return track-sc0 ' +
      'track-sc1 capture compression filter monitor-uri http-check tcp-check expect agent-check init-addr resolvers nameserver ' +
      'master-worker hard-stop-after strict-limits description',
  ),
);

hljs.registerLanguage(
  'squid',
  confLanguage(
    'Squid',
    'acl http_access http_reply_access http_port https_port cache_dir cache_mem maximum_object_size minimum_object_size ' +
      'maximum_object_size_in_memory cache_peer never_direct always_direct refresh_pattern auth_param external_acl_type ' +
      'visible_hostname dns_nameservers access_log cache_log logformat coredump_dir ssl_bump sslcrtd_program sslcrtd_children ' +
      'tls_outgoing_options icap_enable icap_service adaptation_access url_rewrite_program delay_pools delay_class delay_access ' +
      'delay_parameters forwarded_for via request_header_access reply_header_access cache_effective_user workers deny allow ' +
      'src dst dstdomain dstdom_regex url_regex urlpath_regex port proto method time proxy_auth proxy_auth_regex ssl::server_name ' +
      'peek splice bump terminate stare all localnet SSL_ports Safe_ports CONNECT intercept tproxy ssl-bump generate-host-certificates ' +
      'dynamic_cert_mem_cache_size tls-cert tls-key',
  ),
);

hljs.registerLanguage('vcl', (hl) => ({
  name: 'VCL',
  keywords: {
    $pattern: /[a-z_][a-z0-9_.]*/,
    keyword: 'vcl sub if else elsif elseif return set unset call new import include backend probe acl synthetic ban hash_data std regsub regsuball',
    built_in:
      'vcl_recv vcl_pipe vcl_pass vcl_hash vcl_purge vcl_miss vcl_hit vcl_deliver vcl_synth vcl_backend_fetch vcl_backend_response ' +
      'vcl_backend_error vcl_init vcl_fini lookup pass pipe hash purge deliver fetch restart synth abandon retry ok fail',
    literal: 'true false',
  },
  contains: [
    hl.C_LINE_COMMENT_MODE,
    hl.C_BLOCK_COMMENT_MODE,
    hl.HASH_COMMENT_MODE,
    hl.QUOTE_STRING_MODE,
    { className: 'string', begin: /\{"/, end: /"\}/ },
    { className: 'variable', begin: /\b(?:req|bereq|resp|beresp|obj|client|server|local|remote|storage)\.[A-Za-z0-9_.-]+/ },
    { className: 'number', begin: /\b\d+(?:\.\d+)?(?:ms|s|m|h|d|w|y)?\b/ },
  ],
}));

hljs.registerLanguage(
  'caddy',
  confLanguage(
    'Caddyfile',
    'reverse_proxy file_server root encode tls header redir rewrite uri handle handle_path handle_errors route respond ' +
      'basicauth basic_auth php_fastcgi log import bind try_files templates request_body forward_auth abort error skip_log ' +
      'lb_policy lb_try_duration health_uri health_interval to transport http versions dial_timeout email acme_ca on_demand_tls ' +
      'admin servers protocols order debug auto_https internal issuer zerossl acme dns resolvers protocols metrics gzip zstd ' +
      'output file roll_size roll_keep format json console level not path host method header_up header_down',
  ),
);

hljs.registerLanguage(
  'unbound',
  confLanguage(
    'unbound.conf',
    'server remote-control forward-zone stub-zone auth-zone view rpz include interface port access-control do-ip4 do-ip6 ' +
      'do-udp do-tcp num-threads msg-cache-size rrset-cache-size cache-min-ttl cache-max-ttl prefetch prefetch-key hide-identity ' +
      'hide-version harden-glue harden-dnssec-stripped harden-below-nxdomain harden-referral-path use-caps-for-id qname-minimisation ' +
      'aggressive-nsec auto-trust-anchor-file trust-anchor-file val-clean-additional private-address private-domain domain-insecure ' +
      'local-zone local-data local-data-ptr name forward-addr forward-host forward-tls-upstream forward-first stub-addr stub-host ' +
      'tls-service-key tls-service-pem tls-port https-port tls-cert-bundle verbosity logfile use-syslog log-queries log-replies ' +
      'statistics-interval extended-statistics control-enable control-interface control-port server-key-file server-cert-file ' +
      'control-key-file control-cert-file so-reuseport so-rcvbuf so-sndbuf outgoing-range num-queries-per-thread serve-expired ' +
      'serve-expired-ttl ratelimit ip-ratelimit edns-buffer-size module-config zonefile primary master url fallback-enabled ' +
      'allow refuse deny allow_snoop static transparent redirect always_nxdomain inform_deny typetransparent',
  ),
);

hljs.registerLanguage(
  'hcl',
  confLanguage(
    'HCL / Terraform',
    'resource data provider variable output module locals terraform required_providers backend source version ' +
      'count for_each depends_on lifecycle dynamic content for in if null each self var local',
  ),
);

hljs.registerAliases(['terraform', 'tf'], { languageName: 'hcl' });

hljs.registerLanguage(
  'sshconfig',
  confLanguage(
    'ssh_config / sshd_config',
    'Include Host Match Port ListenAddress AddressFamily HostKey HostCertificate PermitRootLogin PasswordAuthentication ' +
      'KbdInteractiveAuthentication ChallengeResponseAuthentication PubkeyAuthentication AuthenticationMethods AuthorizedKeysFile ' +
      'AuthorizedKeysCommand AuthorizedKeysCommandUser AuthorizedPrincipalsFile TrustedUserCAKeys RevokedKeys UsePAM MaxAuthTries ' +
      'MaxSessions MaxStartups LoginGraceTime PermitEmptyPasswords AllowUsers AllowGroups DenyUsers DenyGroups ClientAliveInterval ' +
      'ClientAliveCountMax TCPKeepAlive X11Forwarding AllowTcpForwarding AllowAgentForwarding AllowStreamLocalForwarding PermitTunnel ' +
      'GatewayPorts PermitOpen PermitListen Subsystem ChrootDirectory ForceCommand Banner PrintMotd LogLevel SyslogFacility ' +
      'KexAlgorithms Ciphers MACs HostKeyAlgorithms PubkeyAcceptedAlgorithms CASignatureAlgorithms RequiredRSASize ' +
      'PerSourcePenalties PerSourcePenaltyExemptList StrictModes UseDNS GSSAPIAuthentication GSSAPICleanupCredentials ' +
      'KerberosAuthentication DisableForwarding ExposeAuthInfo HostName User IdentityFile IdentitiesOnly IdentityAgent ProxyJump ' +
      'ProxyCommand LocalForward RemoteForward DynamicForward ForwardAgent ControlMaster ControlPath ControlPersist ServerAliveInterval ' +
      'ServerAliveCountMax StrictHostKeyChecking UserKnownHostsFile CertificateFile AddKeysToAgent UpdateHostKeys VerifyHostKeyDNS ' +
      'SetEnv SendEnv AcceptEnv internal-sftp',
  ),
);

hljs.registerLanguage(
  'openvpn',
  confLanguage(
    'OpenVPN',
    'port proto dev dev-type topology server server-ipv6 ifconfig ifconfig-pool push route route-ipv6 iroute client-config-dir ' +
      'ccd-exclusive client-to-client duplicate-cn keepalive persist-key persist-tun user group ca cert key dh tls-crypt tls-crypt-v2 ' +
      'tls-auth tls-version-min tls-cipher tls-ciphersuites data-ciphers data-ciphers-fallback cipher auth crl-verify remote-cert-tls ' +
      'verify-client-cert username-as-common-name auth-user-pass auth-user-pass-verify auth-gen-token plugin script-security ' +
      'client remote remote-random resolv-retry nobind verb mute status log log-append management explicit-exit-notify max-clients ' +
      'redirect-gateway dhcp-option block-outside-dns tun-mtu mssfix fragment sndbuf rcvbuf fast-io port-share float multihome ' +
      'compress allow-compression ifconfig-push setenv pull-filter route-nopull mode tls-server tls-client up down learn-address ' +
      'connect-retry inactive reneg-sec disable-dco secret peer-fingerprint',
  ),
);

hljs.registerLanguage(
  'swanctl',
  confLanguage(
    'swanctl.conf / strongSwan',
    'connections pools secrets authorities include local remote children version local_addrs remote_addrs local_port remote_port ' +
      'proposals esp_proposals ah_proposals vips pools send_cert send_certreq encap mobike fragmentation dpd_delay dpd_timeout ' +
      'rekey_time reauth_time over_time rand_time unique keyingtries auth id certs cacerts pubkeys eap_id aaa_id local_ts remote_ts ' +
      'mode start_action close_action dpd_action life_time updown hostaccess if_id_in if_id_out policies addrs dns subnet split_include ' +
      'split_exclude secret ike eap xauth private rsa ecdsa pkcs12 file cacert crl_uris ocsp_uris psk pubkey eap-mschapv2 eap-tls ' +
      'eap-radius eap-dynamic tunnel transport start trap none restart clear hold yes no charon filelog syslog default',
  ),
);

hljs.registerAliases(['ssh', 'sshd', 'ssh_config', 'sshd_config'], { languageName: 'sshconfig' });
hljs.registerAliases(['ovpn'], { languageName: 'openvpn' });
hljs.registerAliases(['strongswan', 'ipsec'], { languageName: 'swanctl' });
hljs.registerAliases(['wireguard', 'wg'], { languageName: 'ini' });
hljs.registerAliases(['httpd', 'apacheconf', 'htaccess'], { languageName: 'apache' });
hljs.registerAliases(['caddyfile'], { languageName: 'caddy' });
hljs.registerAliases(['dnsmasq', 'pdns', 'powerdns', 'recursor', 'env', 'service'], { languageName: 'ini' });
hljs.registerAliases(['dnsdist'], { languageName: 'lua' });
hljs.registerAliases(['squid.conf'], { languageName: 'squid' });
hljs.registerAliases(['smb', 'smbconf', 'samba', 'vsftpd', 'krb5', 'nfsconf', 'idmapd'], { languageName: 'ini' });
hljs.registerAliases(['proftpd'], { languageName: 'apache' });
hljs.registerAliases(['nft', 'nftables'], { languageName: 'bash' });
hljs.registerAliases(['postfix', 'maincf', 'dovecot', 'exim', 'opendkim'], { languageName: 'ini' });
hljs.registerAliases(['mastercf', 'sieve', 'eml', 'email'], { languageName: 'plaintext' });
hljs.registerAliases(['rspamd', 'ucl'], { languageName: 'nginx' });
hljs.registerAliases(['spamassassin'], { languageName: 'bash' });
hljs.registerAliases(['mycnf', 'pgconf', 'postgresqlconf', 'memcached', 'couchdb'], { languageName: 'ini' });
hljs.registerAliases(['mysql', 'mariadb', 'psql', 'pgsql', 'postgresql', 'plpgsql'], { languageName: 'sql' });
hljs.registerAliases(['pghba', 'redis', 'redisconf'], { languageName: 'bash' });
hljs.registerAliases(['mongosh', 'mongo'], { languageName: 'javascript' });
hljs.registerAliases(['rabbitmq', 'kibana'], { languageName: 'ini' });
hljs.registerAliases(['kafka', 'log4j'], { languageName: 'properties' });
hljs.registerAliases(['mosquitto'], { languageName: 'bash' });
hljs.registerAliases(['emqx', 'hocon'], { languageName: 'nginx' });
hljs.registerAliases(['containerfile'], { languageName: 'dockerfile' });
hljs.registerAliases(['jenkinsfile'], { languageName: 'groovy' });
hljs.registerAliases(['gitlab-rb', 'gitlabrb'], { languageName: 'ruby' });
hljs.registerAliases(['gitconfig', 'appini', 'gitea', 'forgejo'], { languageName: 'ini' });
hljs.registerAliases(['promql', 'flux', 'influxql', 'logql'], { languageName: 'plaintext' });
hljs.registerAliases(['nagios', 'icinga', 'icinga2'], { languageName: 'nginx' });
hljs.registerAliases(['telegraf'], { languageName: 'ini' });
hljs.registerAliases(['logstash'], { languageName: 'ruby' });
hljs.registerAliases(['rsyslog', 'rainerscript'], { languageName: 'nginx' });
hljs.registerAliases(['spl', 'splunk', 'graylog'], { languageName: 'plaintext' });
hljs.registerAliases(['ossec', 'wazuh'], { languageName: 'xml' });
hljs.registerAliases(['fluentbit', 'splunkconf'], { languageName: 'ini' });
hljs.registerAliases(['fail2ban', 'jail'], { languageName: 'ini' });
hljs.registerAliases(['suricata', 'snortrules', 'rules', 'aide', 'zeek'], { languageName: 'plaintext' });
hljs.registerAliases(['clamav'], { languageName: 'bash' });
hljs.registerAliases(['ldif'], { languageName: 'plaintext' });
hljs.registerAliases(['kdc', 'keycloak'], { languageName: 'ini' });
hljs.registerAliases(['puppet', 'pp'], { languageName: 'ruby' });
hljs.registerAliases(['salt', 'sls', 'jinja', 'j2'], { languageName: 'yaml' });
hljs.registerAliases(['compose', 'k8s', 'kubernetes', 'helm'], { languageName: 'yaml' });
hljs.registerAliases(['pureftpd', 'pure-ftpd', 'exports'], { languageName: 'plaintext' });
hljs.registerAliases(['chrony', 'ntpconf'], { languageName: 'ini' });
hljs.registerAliases(['kea'], { languageName: 'json' });
hljs.registerAliases(['cups', 'cupsd'], { languageName: 'apache' });
hljs.registerAliases(['bacula', 'seafile', 'urbackup'], { languageName: 'ini' });
hljs.registerAliases(['restic', 'borg'], { languageName: 'bash' });
hljs.registerAliases(['kql', 'kusto'], { languageName: 'sql' });
hljs.registerAliases(['tsql', 'mssql', 'mdx'], { languageName: 'sql' });
hljs.registerAliases(['jsonc'], { languageName: 'javascript' });
hljs.registerAliases(['dante', 'sockd', 'icecastconf'], { languageName: 'ini' });
hljs.registerAliases(['cypher'], { languageName: 'sql' });
hljs.registerAliases(['interfaces', 'pve'], { languageName: 'ini' });

// CLI réseau multi-constructeurs (FortiOS, Comware/VRP, AOS, PAN-OS, Junos, RouterOS, SNS…)
hljs.registerLanguage('netcli', (hl) => ({
  name: 'CLI réseau',
  case_insensitive: true,
  keywords: {
    $pattern: /[a-z][a-z0-9-]*/,
    keyword:
      'interface vlan vlans ip ipv6 address set unset config edit next end show display undo system-view quit return commit ' +
      'rollback configure terminal exit no shutdown description router ospf bgp rip static route routing permit deny allow drop ' +
      'accept reject policy policies nat source destination service port trunk access tagged untagged link-aggregation ' +
      'port-channel lacp spanning-tree stp mstp user username password snmp ntp syslog logging save write memory copy ' +
      'reload reboot reset delete add remove ping traceroute diagnose diag execute get sniffer zone security rule from to ' +
      'application action log vdom firewall addrgrp schedule member members gateway dst device protocol neighbor area ' +
      'network peer-group remote-as group local-address hostname sysname system dhcp server relay dns domain-name filter ' +
      'acl rule-name activate modify update insert vrrp standby priority track monitor mirror qos stack irf member-id',
    literal: 'enable disable on off true false yes',
  },
  contains: [
    { className: 'comment', begin: /^\s*[#!]/, end: /$/ },
    { className: 'comment', begin: /\/\*/, end: /\*\// },
    hl.QUOTE_STRING_MODE,
    { className: 'number', begin: /\b\d{1,3}(\.\d{1,3}){3}(\/\d{1,2})?\b/ },
    { className: 'title', begin: /\b(?:Gi|Fa|Te|GigabitEthernet|XGigabitEthernet|Ten-GigabitEthernet|FortyGigE|Bridge-Aggregation|Eth-Trunk|Vlanif|Vlan-interface|port|ether|sfp|ge|xe|et|ethernet|lag|trk)[\d/.:-]+/ },
    { className: 'number', begin: /\b\d+\b/ },
  ],
}));
hljs.registerAliases(['asa', 'comware', 'huawei', 'vrp', 'aruba', 'aoscx', 'aoss', 'provision', 'fortios', 'fortigate',
  'stormshield', 'sns', 'panos', 'paloalto', 'routeros', 'mikrotik', 'eos', 'arista', 'aos', 'omniswitch', 'edgeos', 'vyos',
  'dlink', 'tplink', 'netgear', 'zyxel', 'clish', 'gaia', 'sfos', 'watchguard', 'junos', 'unifi', 'mitel', 'sophos', 'checkpoint'],
  { languageName: 'netcli' });

// Téléphonie IP
hljs.registerAliases(['asterisk', 'pjsip', 'dialplan', 'yealink', 'provisioning'], { languageName: 'ini' });
hljs.registerAliases(['kamailio', 'opensips'], { languageName: 'perl' });
hljs.registerAliases(['audiocodes', 'oxe'], { languageName: 'netcli' });

export default hljs;
