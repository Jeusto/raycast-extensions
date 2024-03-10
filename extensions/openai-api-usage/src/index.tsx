import { Color, Icon, MenuBarExtra, getPreferenceValues, open } from "@raycast/api";
import { useFetch } from '@raycast/utils'

interface ApiResponse {
  object: string;
  daily_costs: DailyCostsItem[];
  total_usage: number;
}
interface DailyCostsItem {
  timestamp: number;
  line_items: LineItemsItem[];
}
interface LineItemsItem {
  name: string;
  cost: number;
}

interface Preferences {
  openAiSessionKey: string;
}


export default function Command() {
  const preferences = getPreferenceValues<Preferences>();
  if (preferences.openAiSessionKey === "") {
    return (
      <MenuBarExtra title="No session key set" icon={{ source: Icon.Warning, tintColor: Color.Red }} />
    )
  }

  const { isLoading, data, revalidate } =
    useFetch<ApiResponse>(
      'https://api.openai.com/dashboard/billing/usage?end_date=2024-04-01&start_date=2024-03-01',
      {
        headers: {
          Authorization: `Bearer ${preferences.openAiSessionKey}`,
        }
      }
    );

  const totalUsage = (data?.total_usage || 0) / 100;

  return (
    <MenuBarExtra title={`$${totalUsage.toFixed(2)}`} isLoading={isLoading} >
      <MenuBarExtra.Item title="Open usage page" onAction={() => open("https://platform.openai.com/usage")} icon={Icon.Link} />
      <MenuBarExtra.Item title="Refresh" onAction={revalidate} icon={Icon.RotateClockwise} />
    </MenuBarExtra >
  )
}
