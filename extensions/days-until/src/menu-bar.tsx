import { MenuBarExtra, Icon } from "@raycast/api";
import { getTitle } from "./lib";
import { useState, useEffect } from "react";

export default function Command() {
  const [title, setTitle] = useState<string>("Loading...");

  useEffect(() => {
    const loadTitle = async () => {
      const result = await getTitle();
      setTitle(result);
    };

    loadTitle();
  }, []);

  return <MenuBarExtra icon={{ source: Icon.Clock }} title={title} />;
}
