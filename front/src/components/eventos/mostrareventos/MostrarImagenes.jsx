import { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import { getEventos } from '../../../services/api';



function MostrarImagenes() {
    const [index, setIndex] = useState(0);
    const [eventos, setEventos] = useState([])
    const handleSelect = (indexSeleccionado) => {
        setIndex(indexSeleccionado)
    };

    useEffect(() => {
        const cargarEvento = async() => {
            const data = await getEventos();
            setEventos(data);
        };
        cargarEvento();
    }, []);
  return (
    <Carousel className='carousel-mostrar-imagenes'  activeIndex={index} onSelect={handleSelect}>
        {eventos.map((evento) => (
            <Carousel.Item key={evento.id}>
                <img className='mostrar-imagenes'
               
                src={evento.imagen}

                alt={evento.nombreEvento}
                />
            </Carousel.Item>
        ))}
    </Carousel>
  );
}

export default MostrarImagenes;