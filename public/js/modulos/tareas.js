import axios from 'axios'
import Swal  from 'sweetalert2';
const tareas = document.querySelector('.listado-pendientes');
import {actualizarAvance} from '../funciones/avance.js';

if (tareas){
    tareas.addEventListener('click',(e) =>{
        if(e.target.classList.contains('fa-check-circle')){
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;
            
            //construyendo la url para redireccionar
            const url= `${location.origin}/tareas/${idTarea}`
            axios.patch(url, {idTarea})
            .then(function(respuesta){
                if (respuesta.status === 200){
                    icono.classList.toggle('completo');
                    actualizarAvance();
                }
            })
        }

        if(e.target.classList.contains('fa-trash')){
            const tareaHTML = e.target.parentElement.parentElement;
            const idTarea = tareaHTML.dataset.tarea;
            console.log(idTarea);

            Swal.fire({
                title: 'Seguro quieres eliminar la tarea?',
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Yes',
                denyButtonText: 'No',
                customClass: {
                  actions: 'my-actions',
                  cancelButton: 'order-1 right-gap',
                  confirmButton: 'order-2',
                  denyButton: 'order-3',
                }
              }).then((result) => {
                if (result.isConfirmed){

                    const url = `${location.origin}/tareas/${idTarea}`
                    

                            axios.delete(url, { params:{idTarea}})
                            .then(function(respuesta){
                                console.log(respuesta)
                                if(respuesta.status==200) {
                                    tareaHTML.remove()
                                    Swal.fire(
                                        'Tarea Eliminada',
                                        respuesta.data,
                                        'success'
                                    )
                                    actualizarAvance();
                                };
                            })
                            
                            //window.location.href = '#'              
                    

            }});
        }
    })
}

export default tareas;