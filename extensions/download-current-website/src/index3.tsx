import { Clipboard } from "@raycast/api";
import { useExec } from "@raycast/utils";
import { useEffect } from "react";

export default function Command() {
  // useExec("single-file", ["jeusto.com --help"], { env: { PATH: "/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/System/Cryptexes/App/usr/bin:/usr/bin:/bin:/usr/sbin:/sbin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/local/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/appleinternal/bin:/Library/Apple/usr/bin:/Users/asaday/.cargo/bin:/Users/asaday/.deno/bin:/Users/asaday/.local:/Users/asaday/.local/bin:/Users/asaday/.local/scripts:/home/asaday/.local/share/pnpm:/Users/asaday/.go/bin:/Users/asaday/.local/vcpkg:/Applications/Android Studio.app/Contents/jbr/Contents/Home/bin" } });
  useEffect(() => {
    async function exec() {
      return useExec("single-file", ["jeusto.com --help"], { env: { PATH: "/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/System/Cryptexes/App/usr/bin:/usr/bin:/bin:/usr/sbin:/sbin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/local/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/appleinternal/bin:/Library/Apple/usr/bin:/Users/asaday/.cargo/bin:/Users/asaday/.deno/bin:/Users/asaday/.local:/Users/asaday/.local/bin:/Users/asaday/.local/scripts:/home/asaday/.local/share/pnpm:/Users/asaday/.go/bin:/Users/asaday/.local/vcpkg:/Applications/Android Studio.app/Contents/jbr/Contents/Home/bin" } });
    }

    Clipboard.paste(JSON.stringify(exec()));
  }, []);
  // Clipboard.paste(JSON.stringify(process.env));
  // useExec("/opt/homebrew/bin/single-file", ["--help"]);
  // showHUD("Test");
  // return <></>
  // const { isLoading, data, revalidate } = useExec("brew", ["info", "--json=v2", "--installed"], { env: { PATH: "/opt/homebrew/bin" } });
  // const results = useMemo<{}[]>(() => JSON.parse(data || "[]"), [data]) as { id: string; name: string }[];

  // return (
  //   <List isLoading={isLoading}>
  //     {(data).map((item) => (
  //       <List.Item key={item.id} title={item.name} />
  //     ))}
  //   </List>
  // );

  return <></>;
}
