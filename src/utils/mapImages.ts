const BASE = import.meta.env.BASE_URL.endsWith('/') 
  ? import.meta.env.BASE_URL.slice(0, -1) 
  : import.meta.env.BASE_URL;

export const AVAILABLE_MAPS = [
  {
    id: 'world_map',
    name: 'Mappamondo',
    url: `${BASE}/MAPS_IMAGE/world_map.png`
  },
  {
    id: 'italy_map',
    name: 'Italia',
    url: `${BASE}/MAPS_IMAGE/italy_map.png`
  }
];

export const getMapUrl = (mapId: string) => {
    return AVAILABLE_MAPS.find(m => m.id === mapId)?.url || '';
}
