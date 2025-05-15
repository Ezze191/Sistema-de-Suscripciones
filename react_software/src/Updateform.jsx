import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UpdateForm() {
    const [updateform, setUpdateForm] = useState({
        fecha: '',
        rango1: '',
        rango2: '',
        vigencia: ''
    });

    

    const handleChange = (e) => {
        setUpdateForm({
            ...updateform,
            [e.target.id]: e.target.value
        });
    };

    const handlesubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put('http://127.0.0.1:8000/api/updateall', updateform);
            if (response.status === 200) {
                console.log('Actualización exitosa');
                alert('Actualización exitosa');
                window.location.reload();
            }
        } catch (error) {
            console.error('Error al actualizar:', error);
            alert('Error al actualizar');
        }
    };

    return (
        <form className="p-2 " onSubmit={handlesubmit} style={{ position: 'absolute', top: '7rem' }}>
            <div className="row g-2 align-items-center">
                <div className="col-auto">
                    <label className="col-form-label col-form-label-sm">FECHA</label>
                    <input
                        type="date"
                        className="form-control form-control-sm"
                        id="fecha"
                        value={updateform.fecha}
                        onChange={handleChange}
                    />
                </div>

                <div className="col-auto">
                    <label className="col-form-label col-form-label-sm">RANGO 1</label>
                    <input
                        type="date"
                        className="form-control form-control-sm"
                        id="rango1"
                        value={updateform.rango1}
                        onChange={handleChange}
                    />
                </div>

                <div className="col-auto">
                    <label className="col-form-label col-form-label-sm">RANGO 2</label>
                    <input
                        type="date"
                        className="form-control form-control-sm"
                        id="rango2"
                        value={updateform.rango2}
                        onChange={handleChange}
                    />
                </div>

                <div className="col-auto">
                    <label className="col-form-label col-form-label-sm">VIGENCIA</label>
                    <input
                        type="date"
                        className="form-control form-control-sm"
                        id="vigencia"
                        value={updateform.vigencia}
                        onChange={handleChange}
                    />
                </div>

                <div className="col-auto">
                    <hr />
                    <button type="submit" className="btn btn-sm btn-primary">Actualizar</button>
                </div>
            </div>
        </form>
    );
}

export default UpdateForm;
