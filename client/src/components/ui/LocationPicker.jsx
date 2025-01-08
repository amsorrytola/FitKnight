import React, { useState } from "react";
import Modal from "react-modal";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Import the marker icons explicitly as URLs
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Configure the default icon for Leaflet
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});


// Location Picker Component
const LocationPicker = ({ onLocationChange, onAddressChange }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [location, setLocation] = useState({ lat: 51.505, lng: -0.09 }); // Default coordinates
  const [address, setAddress] = useState(""); // Display selected location address

  // Handle map click and update location
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const newLocation = { lat: e.latlng.lat, lng: e.latlng.lng };
        setLocation(newLocation);
        onLocationChange(newLocation); // Pass location to parent
      },
    });
    return null;
  };

  // Get user's current location
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = { lat: latitude, lng: longitude };
          setLocation(newLocation);
          onLocationChange(newLocation); // Pass location to parent
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  // Reverse geocoding to get an address (optional)
  const fetchAddress = async () => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`
    );
    const data = await response.json();
    const newAddress = data.display_name || "Unknown location";
    setAddress(newAddress);
    onAddressChange(newAddress); // Pass address to parent
  };

  return (
    <div className="w-[100%] h-fit">
      {/* Button to open modal */}
      <button
        onClick={() => setModalIsOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-full w-[100%] h-[50px]"
      >
        Set Location
      </button>

      {/* Modal for location picker */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={{
          content: {
            width: "80%",
            height: "80%",
            margin: "auto",
            borderRadius: "10px",
          },
        }}
        ariaHideApp={false}
      >
        <h2 className="text-lg font-semibold mb-4">Select Your Location</h2>

        {/* Map Container */}
        <MapContainer
          center={[location.lat, location.lng]}
          zoom={13}
          style={{ height: "70%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[location.lat, location.lng]} />
          <MapClickHandler />
        </MapContainer>

        {/* Actions */}
        <div className="mt-4">
          <button
            onClick={handleCurrentLocation}
            className="px-4 py-2 bg-green-500 text-white rounded-full mr-2"
          >
            Use Current Location
          </button>
          <button
            onClick={() => {
              fetchAddress();
              setModalIsOpen(false);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-full"
          >
            Confirm Location
          </button>
          <button
            onClick={() => setModalIsOpen(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded-full"
          >
            Cancel
          </button>
        </div>
      </Modal>

      
    </div>
  );
};

export default LocationPicker;
