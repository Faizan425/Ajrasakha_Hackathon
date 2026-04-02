import { useMap } from "react-leaflet";
import { useEffect } from "react";
import type { StateInfo } from "../data/indiaStates";

type Props = {
  selectedState: StateInfo | null;
};

export default function MapController({ selectedState }: Props) {
  const map = useMap();

  useEffect(() => {
    if (selectedState) {
      console.log(`🗺️ Map flying to ${selectedState.name}`);
      map.flyTo(selectedState.center, selectedState.zoom, {
        duration: 1.2,
      });
    } else {
      console.log("🇮🇳 Map resetting to national view");
      // Fly back to default India View
      map.flyTo([22.5, 78.9], 5, {
        duration: 1.5,
      });
    }
  }, [selectedState, map]);

  return null;
}
