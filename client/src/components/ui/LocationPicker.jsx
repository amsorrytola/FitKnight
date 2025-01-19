import React, { useState } from "react";
import Modal from "react-modal";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Configure Leaflet default icons
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const LocationPicker = ({ onLocationChange, onAddressChange }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [location, setLocation] = useState({ lat: 51.505, lng: -0.09 }); // Default location
  const [address, setAddress] = useState(""); // Address for display
  const [loading, setLoading] = useState(false); // Loading state for geocoding

  // Handle map click to update location
  const MapClickHandler = () => {
    useMapEvents({
      click: async (e) => {
        const newLocation = { lat: e.latlng.lat, lng: e.latlng.lng };
        setLocation(newLocation);
        onLocationChange(newLocation);
        await fetchAddress(newLocation);
      },
    });
    return null;
  };

  // Fetch address using reverse geocoding
  const fetchAddress = async (loc) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${loc.lat}&lon=${loc.lng}`
      );
      const data = await response.json();
      const fetchedAddress = data.display_name || "Unknown location";
      setAddress(fetchedAddress);
      onAddressChange(fetchedAddress);
    } catch (error) {
      console.error("Failed to fetch address:", error);
      setAddress("Unable to fetch address");
    } finally {
      setLoading(false);
    }
  };

  // Get current location using geolocation
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(newLocation);
          onLocationChange(newLocation);
          await fetchAddress(newLocation);
        },
        (error) => {
          console.error("Error getting current location:", error);
          alert("Unable to fetch current location. Please try again.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="w-full">
      {/* Button to open modal */}
      <button
        onClick={() => setModalIsOpen(true)}
        className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold rounded-full w-full h-[50px]  hover:from-purple-700 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 text-lg 
                  shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105    p-2"
      >
        Set Location
      </button>

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={{
          content: {
            width: "90%",
            maxWidth: "600px",
            height: "85%",
            margin: "auto",
            borderRadius: "15px",
            padding: "20px",
            overflow: "hidden",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.75)",
          },
        }}
        ariaHideApp={false}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
          Select Your Location
        </h2>

        {/* Map Section */}
        <div className="relative w-full h-[60%] rounded-lg overflow-hidden">
          <MapContainer
            center={[location.lat, location.lng]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[location.lat, location.lng]} />
            <MapClickHandler />
          </MapContainer>
        </div>

        {/* Address Display */}
        <div className="mt-4 text-center">
          {loading ? (
            <p className="text-gray-500 italic">Fetching address...</p>
          ) : (
            <p className="text-gray-700 font-medium">
              {address || "Click on the map to set a location"}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={handleCurrentLocation}
            className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300"
          >
            Use Current Location
          </button>
          <button
            onClick={() => {
              setModalIsOpen(false);
            }}
            className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition duration-300"
          >
            Cancel
          </button>
          <button
            onClick={() => setModalIsOpen(false)}
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
          >
            Confirm Location
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default LocationPicker;
