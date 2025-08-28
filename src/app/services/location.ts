

export const fetchNigeriaGeoData = async() =>{
  try {
    const response = await fetch('https://temikeezy.github.io/nigeria-geojson-data/data/full.json');
    if (!response.ok) throw new Error("Failed to fetch Nigeria geo data");
    return await response.json();
  } catch (err) {
    console.error("Geo data fetch error:", err);
  }
}
