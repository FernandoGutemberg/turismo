import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const Geolocalizacao = () => {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            setError("Geolocation is not supported by this browser.");
        }
    };

    const showPosition = (position) => {
        setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        });
    };

    const showError = (error) => {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                setError("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                setError("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                setError("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                setError("An unknown error occurred.");
                break;
            default:
                setError("An unknown error occurred.");
        }
    };

    const containerStyle = {
        width: '100%',
        height: '600px',
        marginTop: '20px',
    };

    const center = location ? {
        lat: location.latitude,
        lng: location.longitude
    } : {
        lat: -3.745,
        lng: -38.523
    };

    return (
        <div className="form-geral">
            <h1 className='titulo-principal'>Geolocalização</h1>
            <Button type="button" onClick={getLocation}>BUSCAR MEU LOCAL</Button>
            <div className="mt-3">
                {location ? (
                    <div>
                        <p>
                            Latitude: {location.latitude} <br />
                            Longitude: {location.longitude}
                        </p>
                        <LoadScript googleMapsApiKey="AIzaSyBQt4VtdKVpG5R1Ernbwe9eTxHnYSWvHjc">
                            <GoogleMap
                                mapContainerStyle={containerStyle}
                                center={center}
                                zoom={15}
                            >
                                <Marker position={center} />
                            </GoogleMap>
                        </LoadScript>
                    </div>
                ) : (
                    <p>{error || "Clique no botão para que possamos utilizar suas coordenada para uma melhor experiência."}</p>
                )}
            </div>
        </div>
    );
};

export default Geolocalizacao;
