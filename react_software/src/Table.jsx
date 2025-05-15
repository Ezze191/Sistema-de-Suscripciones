import React, { useEffect, useState } from 'react'
import axios from 'axios'


function Table() {
    const [suscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;



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

    if (loading) return <p className='loading'>Cargando ...</p>


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
                            </tr>
                        ))}
                    </tbody>
                </table>
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
        </>
    )
}

export default Table

