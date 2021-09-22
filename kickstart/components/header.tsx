import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';

export default function header() {
  return (
    <Menu style={{ marginTop: '10px' }}>
      <Menu.Item>CrowdCoin</Menu.Item>

      <Menu.Menu position="right">
        <Menu.Item name="signup">Campaigns</Menu.Item>
        <Menu.Item name="add_campaign">+</Menu.Item>
      </Menu.Menu>
    </Menu>
  );
}
