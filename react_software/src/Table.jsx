import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Modal, Button, Form } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


function Table() {
    const [suscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 3;

    const [ismodalOpen, setIsModalOpen] = useState(false);
    const [selectedSub, setSelectedSub] = useState({
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
        vigencia: ''
    });

    const [mostrarTarjetas, setMostrarTarjetas] = useState(false);


    const hanldeopenModal = (suscription) => {
        setSelectedSub(suscription);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);




    //carga todas las suscripciones
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/suscriptions')
            .then(response => {
                setSubscriptions(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al cargar los datos:', error);
                setLoading(false);
            });

    }, []);

    //loader
    if (loading) return <p className='loading'>Cargando ...</p>

    //filtra los datos y agrega paginacion y el input de buscar
    const filteredData = suscriptions.filter(item =>
        Object.values(item).some(value =>
            String(value).toLowerCase().includes(search.toLowerCase())
        )
    );

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    const paginatedData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );


    //mostrar un confirmacion antes de eliminar
    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta suscripción?')) {
            deleteItem(id);
        }
    }


    //eliminar una suscripcion
    const deleteItem = async (id) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/api/delete/${id}`);

            if (response.status === 200) {
                console.log('Eliminado correctamente');
                alert('Eliminado correctamente');
                window.location.reload();
            }
            else {
                console.error('Error al eliminar:', response.status);
                alert('Error al eliminar');
            }

        } catch (error) {
            console.error('Error al eliminar:', error);
        }
    }

    const handleUpdate = async () => {
        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/update/${selectedSub.id}`, selectedSub);

            if (response.status === 200) {
                alert('Suscripción actualizada correctamente');
                setIsModalOpen(false);
                // Vuelve a cargar los datos sin recargar la página
                const updatedSubs = await axios.get('http://127.0.0.1:8000/api/suscriptions');
                setSubscriptions(updatedSubs.data);
            } else {
                alert('Error al actualizar la suscripción');
            }
        } catch (error) {
            console.error('Error al actualizar:', error);
            alert('Error al actualizar');
        }
    };


    //exportar a excel
    const ExportExcel = () => {

        const datosFiltrados = suscriptions.map(({ created_at, updated_at, ...rest }) => rest);

        const ws = XLSX.utils.json_to_sheet(datosFiltrados);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Suscripciones');
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, 'suscripciones.xlsx');
    }


    //generar PDF
    const generarPDF = async () => {
        setMostrarTarjetas(true); // Mostrar tarjetas
        await new Promise(resolve => setTimeout(resolve, 100)); // Esperar a que se rendericen

        const doc = new jsPDF();
        const elements = document.querySelectorAll('.pdf-card');

        for (let i = 0; i < elements.length; i++) {
            const canvas = await html2canvas(elements[i]);
            const imgData = canvas.toDataURL('image/png');

            const yOffset = (i % 3) * 90; // Posición Y: 0, 90, 180

            if (i > 0 && i % 3 === 0) doc.addPage(); // Nueva página cada 3 tarjetas

            doc.addImage(imgData, 'PNG', 10, 10 + yOffset, 190, 80); // Ajusta altura y posición
        }

        doc.save('suscripciones.pdf');
        setMostrarTarjetas(false); // Ocultar tarjetas de nuevo
    };




    return (
        <>

            <div>
                <h2 className='lb-subs'>Lista de Suscripciones</h2>
                <input
                    type="text"
                    className="form-control form-control-sm toleft"
                    placeholder="Buscar..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
                    style={{ marginBottom: '10px', padding: '5px', width: '300px' }}
                />
                <table className="table">
                    <thead className="thead-light">
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">FECHA</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">DIRECCION</th>
                            <th scope="col">COLONIA</th>
                            <th scope="col">REPARTIDOR</th>
                            <th scope="col">RUTA</th>
                            <th scope="col">CANTIDAD</th>
                            <th scope="col">PRODUCTO</th>
                            <th scope="col">RANGO 1</th>
                            <th scope="col">RANGO 2</th>
                            <th scope="col">TOTAL</th>
                            <th scope="col">FOLIO</th>
                            <th scope="col">VIGENCIA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map(suscription => (
                            <tr key={suscription.id}>
                                <th scope="row">{suscription.id}</th>
                                <td>{suscription.fecha}</td>
                                <td>{suscription.nombre}</td>
                                <td>{suscription.direccion}</td>
                                <td>{suscription.colonia}</td>
                                <td>{suscription.repartidor}</td>
                                <td>{suscription.ruta}</td>
                                <td>{suscription.cantidad}</td>
                                <td>{suscription.producto}</td>
                                <td>{suscription.rango1}</td>
                                <td>{suscription.rango2}</td>
                                <td>{suscription.total}</td>
                                <td>{suscription.folio}</td>
                                <td>{suscription.vigencia}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => handleDelete(suscription.id)}
                                        style={{ backgroundColor: 'red', color: 'white', marginBottom: '10px' }}
                                    >Eliminar</button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        style={{ backgroundColor: 'green', color: 'white' }}
                                        onClick={() => {
                                            hanldeopenModal(suscription);
                                            setIsModalOpen(true);
                                        }}
                                    >Actualizar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button
                    className="btn btn-sm btn-primary"
                    onClick={ExportExcel}
                    style={{ marginLeft: '10px' }}
                >
                    Excel
                </button>
                <button
                    className="btn btn-sm btn-primary"
                    style={{ marginLeft: '10px' }}
                    onClick={generarPDF}
                >
                    Pdf
                </button>
                <div style={{ marginTop: '10px' }} className='paginationleft'>

                    <button
                        className="btn btn-sm btn-primary"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Anterior
                    </button>

                    <span style={{ margin: '0 10px' }}>
                        Página {currentPage} de {totalPages}
                    </span>

                    <button
                        className="btn btn-sm btn-primary"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Siguiente
                    </button>
                </div>
            </div>


            {/* Generar PDF plantilla */}
            {mostrarTarjetas && (
                <div style={{ position: 'absolute', left: '-9999px' }}>
                    {suscriptions.map((suscription, index) => (
                        <div
                            key={index}
                            className="pdf-card"
                            style={{
                                width: '600px',
                                height: '250px',
                                padding: '10px',
                                margin: '20px auto',
                                border: '1px solid black',
                                fontSize: '11px',
                                background: 'white',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}
                        >
                            <div>
                                <p style={{ fontWeight: 'bold', textAlign: 'center' }}>
                                    EDITORIAL LA OPINION, S.A. SUSCRIPCION POR SEMANA RECIBO:{' '}
                                    {suscription.folio}
                                </p>
                                <p style={{ textAlign: 'center', marginBottom: '4px' }}>
                                    Avenida Allende S/N<br />
                                    Tel. 749-11-00, ext 312-62 Vigencia: {suscription.vigencia} RUTA:{' '}
                                    {suscription.ruta}<br />
                                    Torreón, Coah, México. Domicilio: {suscription.direccion}
                                </p>
                                <p>
                                    <strong>Nombre:</strong> {suscription.nombre}<br />
                                    <strong>Colonia y Cd.:</strong> {suscription.colonia}<br />
                                    <strong>Repartidor:</strong> {suscription.repartidor}
                                </p>
                                <p>
                                    <strong>CANTIDAD:</strong> {suscription.cantidad}{' '}
                                    <strong>DESCRIPCION:</strong> {suscription.producto}{' '}
                                    <strong>SEMANA:</strong> {suscription.rango1} - {suscription.rango2}{' '}
                                    <strong>IMPORTE TOTAL:</strong> ${suscription.total}
                                </p>
                            </div>
                            <p style={{ textAlign: 'center', fontWeight: 'bold' }}>
                                Cupón No Transferible 
                            </p>
                        </div>
                    ))}
                </div>
            )}


            {/* Modal para actualizar */}

            <Modal show={ismodalOpen} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Actualizar Suscripción</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Fecha</Form.Label>
                            <Form.Control
                                type="date"
                                value={selectedSub.fecha}
                                onChange={(e) => setSelectedSub({ ...selectedSub, fecha: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                value={selectedSub.nombre}
                                onChange={(e) => setSelectedSub({ ...selectedSub, nombre: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control
                                type="text"
                                value={selectedSub.direccion}
                                onChange={(e) => setSelectedSub({ ...selectedSub, direccion: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Colonia</Form.Label>
                            <Form.Control
                                type="text"
                                value={selectedSub.colonia}
                                onChange={(e) => setSelectedSub({ ...selectedSub, colonia: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Repartidor</Form.Label>
                            <Form.Control
                                type="text"
                                value={selectedSub.repartidor}
                                onChange={(e) => setSelectedSub({ ...selectedSub, repartidor: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Ruta</Form.Label>
                            <Form.Control
                                type="text"
                                value={selectedSub.ruta}
                                onChange={(e) => setSelectedSub({ ...selectedSub, ruta: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Cantidad</Form.Label>
                            <Form.Control
                                type="number"
                                value={selectedSub.cantidad}
                                onChange={(e) => setSelectedSub({ ...selectedSub, cantidad: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Producto</Form.Label>
                            <Form.Control
                                type="text"
                                value={selectedSub.producto}
                                onChange={(e) => setSelectedSub({ ...selectedSub, producto: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Rango 1</Form.Label>
                            <Form.Control
                                type="date"
                                value={selectedSub.rango1}
                                onChange={(e) => setSelectedSub({ ...selectedSub, rango1: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Rango 2</Form.Label>
                            <Form.Control
                                type="date"
                                value={selectedSub.rango2}
                                onChange={(e) => setSelectedSub({ ...selectedSub, rango2: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Total</Form.Label>
                            <Form.Control
                                type="number"
                                value={selectedSub.total}
                                onChange={(e) => setSelectedSub({ ...selectedSub, total: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Folio</Form.Label>
                            <Form.Control
                                type="text"
                                value={selectedSub.folio}
                                onChange={(e) => setSelectedSub({ ...selectedSub, folio: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Vigencia</Form.Label>
                            <Form.Control
                                type="date"
                                value={selectedSub.vigencia}
                                onChange={(e) => setSelectedSub({ ...selectedSub, vigencia: e.target.value })}
                            />
                        </Form.Group>




                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    )
}

export default Table

