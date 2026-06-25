import { useEffect, useState } from "react";

function getDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(
    Math.sqrt(a),
    Math.sqrt(1 - a)
  );

  return (R * c).toFixed(1);
}

export default function NearbyHospitals() {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [userLocation, setUserLocation] = useState({
    lat: 0,
    lng: 0,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setUserLocation({
          lat,
          lng,
        });

        console.log("Latitude:", lat);
        console.log("Longitude:", lng);

        try {
          const response = await fetch(
            `http://localhost:5000/api/nearby-hospitals?lat=${lat}&lng=${lng}`
          );

          console.log(
            "Response Status:",
            response.status
          );

          const data = await response.json();

          console.log("Hospital Data:", data);

          setHospitals(data);
        } catch (err) {
          console.error(
            "FETCH ERROR:",
            err
          );
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error(
          "Location Error:",
          error
        );
        setLoading(false);
      }
    );
  }, []);

  return (
    <main className="flex-1 p-8">
      <h1 className="text-4xl font-bold mb-6">
        Nearby Hospitals
      </h1>

      <p className="mb-4 text-lg">
        Total Hospitals: {hospitals.length}
      </p>

      {loading ? (
        <p>Loading hospitals...</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {[...hospitals]
  .sort((a, b) => {
    const distA = parseFloat(
      getDistance(
        userLocation.lat,
        userLocation.lng,
        a.lat || a.center?.lat,
        a.lon || a.center?.lon
      )
    );

    const distB = parseFloat(
      getDistance(
        userLocation.lat,
        userLocation.lng,
        b.lat || b.center?.lat,
        b.lon || b.center?.lon
      )
    );

    return distA - distB;
  })
  .slice(0, 10)
  .map((hospital, index) => (
              <div
  key={index}
  className={`border rounded-xl p-4 shadow-sm ${
    index === 0
      ? "bg-green-50 border-green-400"
      : "bg-white"
  }`}
>
                <h2 className="font-bold text-lg">
                  {hospital.tags?.name ||
                    "Unnamed Hospital"}
                </h2>

                {index === 0 && (
  <span className="inline-block bg-green-600 text-white text-xs px-2 py-1 rounded-full mt-2">
    Nearest Hospital
  </span>
)}

                <p className="text-gray-500 mt-1">
                  {hospital.tags?.healthcare ||
                    "Hospital"}
                </p>

                <p className="text-green-600 text-sm mt-2">
                  {getDistance(
                    userLocation.lat,
                    userLocation.lng,
                    hospital.lat ||
                      hospital.center?.lat,
                    hospital.lon ||
                      hospital.center?.lon
                  )}{" "}
                  km away
                </p>

                <a
                  href={`https://www.google.com/maps?q=${
                    hospital.lat ||
                    hospital.center?.lat
                  },${
                    hospital.lon ||
                    hospital.center?.lon
                  }`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Open in Maps
                </a>
              </div>
            ))}
        </div>
      )}
    </main>
  );
}