import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import { GoogleMap, LoadScript, MarkerF, Autocomplete } from "@react-google-maps/api";
import "./Geolocalizacao.css";


const Geolocalizacao = () => {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [autocomplete, setAutocomplete] = useState(null);

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

    const onMarkerDragEnd = (e) => {
        const newLat = e.latLng.lat();
        const newLng = e.latLng.lng();
        setLocation({
            latitude: newLat,
            longitude: newLng
        });
    };

    const onLoad = (autocompleteInstance) => {
        setAutocomplete(autocompleteInstance);
    };

    const onPlaceChanged = () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();
            if (place.geometry) {
                const newLat = place.geometry.location.lat();
                const newLng = place.geometry.location.lng();
                setLocation({
                    latitude: newLat,
                    longitude: newLng
                });
            }
        } else {
            console.log("Autocomplete is not loaded yet!");
        }
    };

    return (
        <div className="form-geral">
            <Button type="button" onClick={getLocation}>BUSCAR LOCAL</Button>
            <div className="mt-3">
                <LoadScript googleMapsApiKey="546464" libraries={['places']}>
                    <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                        <input
                            type="text"
                            placeholder="Pesquise no Google Maps"
                            className="form-control"
                            style={{ marginBottom: '10px' }}
                        />
                    </Autocomplete>
                    {location ? (
                        <div>
                            <p>
                                Latitude: {location.latitude} <br />
                                Longitude: {location.longitude}
                            </p>
                            <GoogleMap
                                mapContainerStyle={containerStyle}
                                center={center}
                                zoom={15}
                            >
                                <MarkerF
                                    position={center}
                                    draggable={true}
                                    onDragEnd={onMarkerDragEnd} // Função chamada ao soltar o marcador
                                />
                            </GoogleMap>
                        </div>
                    ) : (
                        <p>{error || "Clique no botão para que possamos utilizar suas coordenada para uma melhor experiência."}</p>
                    )}
                </LoadScript>
            </div>
        </div>
    );
};

export default Geolocalizacao;
