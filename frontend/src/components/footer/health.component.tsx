import {useHealth} from "../../providers/health/health.context.tsx";
import {Button} from "../button/button.component.tsx";

export function Health() {
  const {health, refresh, loading, error} = useHealth();

  // TODO: should we return "checking health..." or not (?)
  if (loading) return <p>Checking health...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <p>
      <span style={{"marginRight": "12px"}}>Status: {health?.status} — Uptime: {health?.uptime.toFixed(1)}s</span>
      <Button onClick={refresh}>Refresh</Button>
    </p>
  )
}
