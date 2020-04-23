import React from "react";
import { Menu } from "semantic-ui-react";

export const Navbar = () => {
  return (
    <div>
      <Menu>
        <Menu.Item
          name="home"
        />
        <Menu.Item
          name="messages"
        />
        <Menu.Item
          name="friends"
        />
      </Menu>
    </div>
  );
};
