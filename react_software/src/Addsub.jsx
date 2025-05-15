import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Modal, Button, Form } from 'react-bootstrap';




function Addsub() {
    const [ismodalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        fecha: '',
        nombre: '',
        direccion: '',
        colonia: '',
        repartidor: '',
        ruta: '',
        cantidad: '',
        producto: '',
        rango1: '',
        rango2: '',
        total: '',
        folio: '',
        vigencia: '',
        created_at: '',

    });

    const handleOpenModal = () => {
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSend = {
            ...formData,
            created_at: new Date().toISOString().split("T")[0] 
        };

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/new', dataToSend);
            if (response.status === 201) {
                setIsModalOpen(false);
                console.log('Agregado exitosamente');
                alert('Agregado exitosamente');
                window.location.reload();
            }

        } catch (error) {
            console.error('Error al agregar:', error);
            alert('Error al agregar');
        }

    }


    return <>
        <button className="btn btn-sm btn-primary" style={{ backgroundColor: 'green', color: 'white', margin: '10px', position : 'absolute', top : '14rem' }}
            type='button'
            onClick={() => (handleOpenModal())}
        >Agregar
        </button>

        <Modal show={ismodalOpen} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Agregar Suscripción</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Fecha</Form.Label>
                        <Form.Control
                            name="fecha"
                            type="date"
                            value={formData.fecha}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            name="nombre"
                            type="text"
                            value={formData.nombre}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>direccion</Form.Label>
                        <Form.Control
                            name="direccion"
                            type="text"
                            value={formData.direccion}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Colonia</Form.Label>
                        <Form.Control
                            name="colonia"
                            type="text"
                            value={formData.colonia}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Repartidor</Form.Label>
                        <Form.Control
                            name="repartidor"
                            type="text"
                            value={formData.repartidor}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Ruta</Form.Label>
                        <Form.Control
                            name="ruta"
                            type="text"
                            value={formData.ruta}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Cantidad</Form.Label>
                        <Form.Control
                            name="cantidad"
                            type="number"
                            value={formData.cantidad}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Producto</Form.Label>
                        <Form.Control
                            name="producto"
                            type="text"
                            value={formData.producto}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Rango 1</Form.Label>
                        <Form.Control
                            name="rango1"
                            type="date"
                            value={formData.rango1}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Rango 2</Form.Label>
                        <Form.Control
                            name="rango2"
                            type="date"
                            value={formData.rango2}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Total</Form.Label>
                        <Form.Control
                            name="total"
                            type="number"
                            value={formData.total}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Folio</Form.Label>
                        <Form.Control
                            name="folio"
                            type="text"
                            value={formData.folio}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Vigencia</Form.Label>
                        <Form.Control
                            name="vigencia"
                            type="date"
                            value={formData.vigencia}
                            onChange={handleChange}
                        />
                    </Form.Group>

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Agregar
                </Button>
            </Modal.Footer>
        </Modal>

    </>
}

export default Addsub;