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
  if (preferences.openAiSessionKey === "") { return (<MenuBarExtra title="No session key set" icon={{ source: Icon.Warning, tintColor: Color.Red }} />) }

  const { formattedEndDate, formattedStartDate } = getStartAndEndDates();

  const { isLoading, data, revalidate } =
    useFetch<ApiResponse>(
      `https://api.openai.com/dashboard/billing/usage?end_date=${formattedEndDate}&start_date=${formattedStartDate}`,
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

const getStartAndEndDates = () => {
  const date = new Date();
  const startYear = date.getFullYear();
  const startMonth = date.getMonth();
  const startDate = new Date(startYear, startMonth, 1);

  const endYear = date.getFullYear();
  const endMonth = date.getMonth();
  const endDate = new Date(endYear, endMonth + 1, 0);

  // YYYY-MM-DD format
  const formattedStartDate = `${startYear}-${('0' + (startMonth + 1)).slice(-2)}-${('0' + startDate.getDate()).slice(-2)}`;
  const formattedEndDate = `${endYear}-${('0' + (endMonth + 1)).slice(-2)}-${('0' + endDate.getDate()).slice(-2)}`;

  return {
    formattedStartDate,
    formattedEndDate
  }
}
