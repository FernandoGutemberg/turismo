import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';


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

    return (
        <div>
            <h1>Geolocalizacao</h1>
            <Button type="button" onClick={getLocation}>AQUI</Button>
            <div className="mt-3">
                {location ? (
                    <p>
                        Latitude: {location.latitude} <br />
                        Longitude: {location.longitude}
                    </p>
                ) : (
                    <p>{error || "Clique no botão para que possamos utilizar suas coordenada para uma melhor experiência."}</p>
                )}
            </div>
        </div>
    );
};

export default Geolocalizacao;