import React from 'react';
import clsx from 'clsx';
import { usePluginData } from '@docusaurus/useGlobalData';

import styles from './IxStats.module.scss';

interface VlanEntry {
  vlan_id: number;
}

interface Connection {
  vlan_list: VlanEntry[];
}

interface Member {
  asnum: number;
  connection_list: Connection[];
}

interface IXFData {
  member_list: Member[];
}

interface Stat {
  value: string;
  label: string;
  accent: 'blue' | 'crimson' | 'green';
}

export default function IxStats(): React.ReactElement {
  const data = usePluginData('oix-members-plugin') as IXFData;

  // Same counting rule as NetworksTable: unique ASNs with a peering VLAN
  // entry, so the two pages never disagree about the network count.
  const networkCount = new Set(
    data.member_list
      .filter((member) =>
        member.connection_list.some((conn) =>
          conn.vlan_list.some((vlan) => vlan.vlan_id === 1)
        )
      )
      .map((member) => member.asnum)
  ).size;

  const stats: Stat[] = [
    {
      value: String(networkCount),
      label: 'Networks connected at OpenIX Beirut',
      accent: 'blue',
    },
    {
      value: '25 of 30',
      label: "Of Lebanon's top networks peering",
      accent: 'crimson',
    },
    {
      value: '~73%',
      label: "Of Lebanon's internet traffic represented",
      accent: 'green',
    },
  ];

  return (
    <ul className={styles.strip}>
      {stats.map((stat) => (
        <li key={stat.label} className={clsx(styles.stat, styles[stat.accent])}>
          <span className={styles.tick} aria-hidden="true" />
          <span className={styles.value}>{stat.value}</span>
          <span className={styles.label}>{stat.label}</span>
        </li>
      ))}
    </ul>
  );
}
