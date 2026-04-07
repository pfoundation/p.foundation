import React from 'react';
import { usePluginData } from '@docusaurus/useGlobalData';
import styles from './NetworksTable.module.scss';

interface VlanEntry {
  ipv4?: { address: string };
  ipv6?: { address: string };
}

interface Connection {
  ixp_id: number;
  state: string;
  if_list: Array<{ if_speed: number }>;
  vlan_list: VlanEntry[];
}

interface Member {
  asnum: number;
  name: string;
  url?: string;
  member_since: string;
  connection_list: Connection[];
}

interface IXFData {
  member_list: Member[];
}

interface TableRow {
  asn: number;
  name: string;
  url?: string;
  ipv4: string;
  ipv6: string;
  speed: string;
  joinDate: string;
}

function formatSpeed(speedMbps: number): string {
  if (speedMbps >= 1000) return `${speedMbps / 1000}G`;
  return `${speedMbps}M`;
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function NetworksTable(): React.ReactElement {
  const data = usePluginData('oix-members-plugin') as IXFData;

  const rows: TableRow[] = [];
  for (const member of data.member_list) {
    for (const conn of member.connection_list) {
      const speed = conn.if_list?.[0]?.if_speed;
      for (const vlan of conn.vlan_list) {
        rows.push({
          asn: member.asnum,
          name: member.name,
          url: member.url || undefined,
          ipv4: vlan.ipv4?.address || '-',
          ipv6: vlan.ipv6?.address || '-',
          speed: speed ? formatSpeed(speed) : '-',
          joinDate: member.member_since ? formatDate(member.member_since) : '-',
        });
      }
    }
  }

  rows.sort((a, b) => a.asn - b.asn);

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.networksTable}>
        <thead>
          <tr>
            <th>ASN</th>
            <th>Network Name</th>
            <th>IPv4</th>
            <th>IPv6</th>
            <th>Speed</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={`${row.asn}-${row.ipv4}-${idx}`}>
              <td>{row.asn}</td>
              <td>
                {row.url ? (
                  <a href={row.url} target="_blank" rel="noopener noreferrer">
                    {row.name}
                  </a>
                ) : (
                  row.name
                )}
              </td>
              <td>
                <code>{row.ipv4}</code>
              </td>
              <td>
                <code>{row.ipv6}</code>
              </td>
              <td>{row.speed}</td>
              <td>{row.joinDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className={styles.memberCount}>
        {data.member_list.length} connected networks
      </p>
    </div>
  );
}
