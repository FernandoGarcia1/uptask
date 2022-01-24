
import Swal  from 'sweetalert2';

export const actualizarAvance = ()=>{
    //Seleccionar las tareas existentes

    const tareas = document.querySelectorAll('li.tarea');

    if (tareas.length){
        //Seleccionar las tareas completas 
        const tareasCompletadas = document.querySelectorAll('i.completo');// i.completo selecciona todos los elementos con etiqueta 'i' y clase 'completo' 
        //Calcular avance
        const porcentajeAvance= Math.round((tareasCompletadas.length / tareas.length)*100);
        //Mostrar el avnace

        const porcentaje  = document.querySelector('#porcentaje') //# (Selecciona id)
        porcentaje.style.width =  porcentajeAvance + '%';

        if(porcentajeAvance == 100){
            Swal.fire(
                'Proyecto completado.',
                'Felicidades, por tu duro trabajo.',
                'success'
            )
        }
        
    }
    



}