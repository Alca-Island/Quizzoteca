const BASE = import.meta.env.BASE_URL.endsWith('/') 
  ? import.meta.env.BASE_URL.slice(0, -1) 
  : import.meta.env.BASE_URL;

export const AVAILABLE_MAPS = [
  { id: 'kanto', name: 'Kanto', url: `${BASE}/MAPS_IMAGE/1_Kanto_map.jpeg` },
  { id: 'johto', name: 'Johto', url: `${BASE}/MAPS_IMAGE/2_Johto_map.jpeg` },
  { id: 'hoenn', name: 'Hoenn', url: `${BASE}/MAPS_IMAGE/3_Hoenn_map.jpeg` },
  { id: 'sinnoh', name: 'Sinnoh', url: `${BASE}/MAPS_IMAGE/4_Sinnoh_map.jpeg` },
  { id: 'unova', name: 'Unova', url: `${BASE}/MAPS_IMAGE/5_Unova_map.jpeg` },
  { id: 'kalos', name: 'Kalos', url: `${BASE}/MAPS_IMAGE/6_Kalos_map.jpeg` },
  { id: 'alola', name: 'Alola', url: `${BASE}/MAPS_IMAGE/7_Alola_map.jpeg` },
];

export const getMapUrl = (mapId: string) => {
    return AVAILABLE_MAPS.find(m => m.id === mapId)?.url || '';
}
