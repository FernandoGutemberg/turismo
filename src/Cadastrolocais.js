import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from "react-toastify";
import { Col, Form, Row, Button } from 'react-bootstrap';
import './Cadastros.css';
import { GoogleMap, LoadScript, MarkerF, Autocomplete } from "@react-google-maps/api";


const Cadastrolocais = () => {
  const navigate = useNavigate();

  const [paisLocal, setPaisLocal] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [rua, setRua] = useState("");
  const [cep, setCep] = useState("");
  const [local, setLocal] = useState("");


  // State to hold the image as a base64 string
  const [fotoBase64, setFotoBase64] = useState("");

  const [tokenValido, setTokenValido] = useState(false);

  // Estados para Geolocalização
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      fetch('http://localhost:9000/verificarToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.validado) {
            setTokenValido(true);
          } else {
            setTokenValido(false);
            alert('Token inválido. Redirecionando para a tela de login.');
            navigate('/');
          }
        })
        .catch(error => {
          console.error('Erro:', error);
        });

    } else {
      alert('Token não encontrado. Redirecionando para a tela de login.');
      navigate('/');
    }
  }, [navigate]);


  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:9000/getCadastrolocaisFromId/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((response) => response.json())
        .then((data) => {
          setPaisLocal(data.paisLocal);
          setEstado(data.estado);
          setCidade(data.cidade);
          setBairro(data.bairro);
          setRua(data.rua);
          setCep(data.cep);
          setFotoBase64(data.foto); // Assuming 'foto' is already stored as base64 in MongoDB
          setLocal(data.local);

          getLocation();

        })
        .catch((error) => {
          console.error("Erro ao carregar dados dos locais:", error);
        });
    }
  }, [id]);

  const handleChangePaisLocal = (event) => {
    setPaisLocal(event.target.value);
  };

  const handleChangeEstado = (event) => {
    setEstado(event.target.value);
  };

  const handleChangeCidade = (event) => {
    setCidade(event.target.value);
  };
  const handleChangeBairro = (event) => {
    setBairro(event.target.value);
  };
  const handleChangeRua = (event) => {
    setRua(event.target.value);
  };
  const handleChangeCep = (event) => {
    setCep(event.target.value);
  };
  const handleChangeLocal = (event) => {
    setLocal(event.target.value);
  };


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setFotoBase64(reader.result);
    };
  };



  const handleOnClickSalvar = () => {
    const dados = {
      paisLocal,
      estado,
      cidade,
      bairro,
      rua,
      cep,
      local,
      foto: fotoBase64, // Send the base64 string to the backend
      latitude: location ? location.latitude : null,
      longitude: location ? location.longitude : null,
    };

    const configuracaoEnvio = {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    };

    if (!id) {
      configuracaoEnvio.method = "POST";
    } else {
      configuracaoEnvio.method = "PATCH";
    }

    fetch(`http://localhost:9000/Cadastrolocais${id ? `/${id}` : ""}`, configuracaoEnvio)
      .then((response) => response.json())
      .then((data) => {
        console.log("Dados salvos:", data);
        localStorage.setItem("notificacao", "true");
        navigate('/Tabelalocais');
      })
      .catch((error) => {
        console.error("Erro ao salvar dados:", error);
      });
  };


  // Função para buscar localização
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
      default:
        setError("An unknown error occurred.");
        break;
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

  // Função para limpar os campos relacionados ao CEP
  const limpaFormularioCep = () => {
    setRua("");
    setBairro("");
    setCidade("");
    setEstado("");
  };

  // Função para buscar o CEP na API ViaCEP
  const pesquisacep = (valor) => {
    const cepNumeros = valor.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (cepNumeros.length === 8) {
      fetch(`https://viacep.com.br/ws/${cepNumeros}/json/`)
        .then(response => response.json())
        .then(data => {
          if (!data.erro) {
            setRua(data.logradouro);
            setBairro(data.bairro);
            setCidade(data.localidade);
            setEstado(data.uf);
          } else {
            limpaFormularioCep();
            alert("CEP não encontrado.");
          }
        })
        .catch(() => {
          limpaFormularioCep();
          alert("Erro ao buscar o CEP.");
        });
    } else {
      limpaFormularioCep();
      alert("Formato de CEP inválido.");
    }
  };

  const handleCepChange = (e) => {
    const valor = e.target.value;
    setCep(valor);
    if (valor.length >= 8) {
      pesquisacep(valor);
      getLocation();
    }
  };


  return (
    <div className="form-geral">
      <h1 className='titulo-principal'>Cadastro dos Locais Turistado</h1>



      <Form className="form-container">
        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Form.Label column sm="2">
            País:
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" placeholder="Nome do País visitado" name="nome" value={paisLocal} onChange={handleChangePaisLocal} />
          </Col>
        </Form.Group>


        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">CEP:</Form.Label>
          <Col sm="10">
            <Form.Control type="text" value={cep} onChange={handleCepChange} maxLength={9} placeholder="Digite o CEP" />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">Rua:</Form.Label>
          <Col sm="10">
            <Form.Control type="text" value={rua} onChange={handleChangeRua} placeholder="Rua" />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">Bairro:</Form.Label>
          <Col sm="10">
            <Form.Control type="text" value={bairro} onChange={handleChangeBairro} placeholder="Bairro" />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">Cidade:</Form.Label>
          <Col sm="10">
            <Form.Control type="text" value={cidade} onChange={handleChangeCidade} placeholder="Cidade" />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">Estado:</Form.Label>
          <Col sm="10">
            <Form.Control type="text" value={estado} onChange={handleChangeEstado} placeholder="Estado" />
          </Col>
        </Form.Group>


        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Form.Label column sm="2">
            Local:
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" placeholder="Nome do Lugar visitada" name="nome" value={local} onChange={handleChangeLocal} />
          </Col>
        </Form.Group>


        {/* Nome do lugar */}


        <Form.Group as={Row} className="mb-3" controlId="formFile">
          <Form.Label column sm="2">
            Foto do Local:
          </Form.Label>
          <Col sm="10">
            <Form.Control
              type="file"
              name="foto"
              onChange={handleFileChange}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <input type="hidden" name="latitude" value={location ? location.latitude : ''} />
          <input type="hidden" name="longitude" value={location ? location.longitude : ''} />
        </Form.Group>



        <div className="form-geral">
          <Button type="button" onClick={getLocation}>BUSCAR LOCAL</Button>
          <div className="mt-3">
            <LoadScript googleMapsApiKey="51515151515151151515151515" libraries={['places']}>
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
          <Button
            variant="success"
            type="button"
            onClick={handleOnClickSalvar}>
            Salvar
          </Button>
          &nbsp;

          <Button
            variant="secondary"
            className='voltar'
            type='button'
            onClick={() => window.location.href = '/Tabelalocais/'}
          >
            Voltar
          </Button>
        </div>


        <ToastContainer />
      </Form>

      {/* colocar estrutura do código Geolocalizacao aqui */}





    </div>
  );
};

export default Cadastrolocais;
