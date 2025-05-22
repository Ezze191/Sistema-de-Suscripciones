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

    const [pdfmodal, setPdfmodal] = useState(false);
    const [pdfData, setPdfData] = useState([
        {
            leyenda: 'Cupon No Transferible',
            mostrarvigencia: false
        }
    ]);

    const openPdfModal = () => {
        setPdfmodal(true);
    }

    const closePdfModal = () => {
        setPdfmodal(false);
    }


    const hanldeopenModal = (suscription) => {
        setSelectedSub(suscription);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);




    const formatDate = (dateStr) => {
        return new Date(dateStr).toISOString().split('T')[0]; // Devuelve solo la parte de la fecha
    };

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/suscriptions')
            .then(response => {
                const formattedData = response.data.map(suscription => ({
                    ...suscription,
                    fecha: formatDate(suscription.fecha),
                    rango1: formatDate(suscription.rango1),
                    rango2: formatDate(suscription.rango2),
                    vigencia: formatDate(suscription.vigencia),
                }));
                setSubscriptions(formattedData);
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
        setPdfmodal(false); // Cerrar modal
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
                                <td>${suscription.total}.00</td>
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
                                    >Editar</button>
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
                    Exportar A EXCEL
                </button>
                <button
                    className="btn btn-sm btn-primary"
                    style={{ marginLeft: '10px' }}
                    onClick={() => {
                        openPdfModal();
                    }}
                >
                    Exportar a PDF
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
                                padding: '20px',
                                margin: '40px auto',
                                fontSize: '10px',
                                background: 'white',
                                border: '1px solid #ccc',
                                boxSizing: 'border-box'
                            }}
                        >
                            {/* Título centrado arriba */}
                            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                                <p style={{ fontWeight: 'bold', margin: 0 }}>
                                    SUSCRIPCIÓN POR SEMANA
                                </p>
                                {pdfData[0].mostrarvigencia && (
                                    <p style={{ margin: 0 }}>
                                        Vigencia: {suscription.vigencia}
                                    </p>
                                )}
                            </div>

                            {/* Cabecera con dos columnas */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                {/* Izquierda: Editorial alineado con el título */}
                                <div style={{ marginTop: '-40px' }}>
                                    <p style={{ fontWeight: 'bold', margin: 0 }}>EDITORIAL LA OPINION, S.A.</p>
                                    <p style={{ margin: 0 }}>Avenida Allende S/N</p>
                                    <p style={{ margin: 0 }}>Tel. 749-11-00, ext 312-62</p>
                                    <p style={{ margin: 0 }}>Torreón, Coah, México.</p>
                                </div>

                                {/* Derecha: Solo RECIBO alineado con el título */}
                                <div style={{ textAlign: 'right', marginTop: '-40px' }}>
                                    <p style={{ fontWeight: 'bold', margin: 0 }}>RECIBO: {suscription.folio}</p>
                                </div>
                            </div>

                            
                            <p style={{ marginTop: '10px', textAlign: 'right' }}>
                                <strong>Repartidor:</strong> {suscription.repartidor}
                                <p style={{ margin: 0 }}><strong>Ruta:</strong>{suscription.ruta}</p>
                            </p>

                            {/* Datos del cliente */}
                            <p style={{ marginTop: '10px' }}>
                                <strong>Nombre:</strong> {suscription.nombre}<br />
                                <p style={{ margin: 0 }}><strong>Domicilio:</strong> {suscription.direccion}</p>
                                <p style={{ margin: 0 }}><strong>Colonia y Cd.:</strong>{suscription.colonia}</p>

                            </p>

                            {/* Tabla */}
                            <table className="table table-bordered" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead className="thead-light">
                                    <tr>
                                        <th style={{ border: '1px solid #000' }}>CANTIDAD</th>
                                        <th style={{ border: '1px solid #000' }}>DESCRIPCIÓN</th>
                                        <th style={{ border: '1px solid #000' }}>SEMANA</th>
                                        <th style={{ border: '1px solid #000' }}>IMPORTE TOTAL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{ border: '1px solid #000', textAlign: 'center' }}>{suscription.cantidad}</td>
                                        <td style={{ border: '1px solid #000' }}>{suscription.producto}</td>
                                        <td style={{ border: '1px solid #000' }}>{suscription.rango1} - {suscription.rango2}</td>
                                        <td style={{ border: '1px solid #000' }}>${suscription.total}.00</td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* Leyenda final */}
                            <p style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '10px' }}>
                                {pdfData[0].leyenda}
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


            {/* Modal para PDF */}
            <Modal show={pdfmodal} onHide={closePdfModal}>
                <Modal.Header closeButton>
                    <Modal.Title>PDF PLANTILLA</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Leyenda</Form.Label>
                            <Form.Control
                                name='leyenda'
                                type='text'
                                value={pdfData[0].leyenda}
                                onChange={(e) => {
                                    const newValue = e.target.value;
                                    setPdfData(prev => [{ ...prev[0], leyenda: newValue }]);
                                }}
                            />
                        </Form.Group>
                        <Form.Group controlId="mostrarvigenciaCheckbox">
                            <Form.Check
                                type="checkbox"
                                label="Mostrar vigencia"
                                checked={pdfData[0].mostrarvigencia}
                                onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    setPdfData(prev => [{ ...prev[0], mostrarvigencia: isChecked }]);
                                }}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closePdfModal}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={generarPDF}>
                        Exportar PDF
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    )
}

export default Table

