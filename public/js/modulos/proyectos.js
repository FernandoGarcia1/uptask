import Swal from 'sweetalert2'
import axios from 'axios'

const btnEliminar = document.querySelector('#eliminar-proyecto');

if(btnEliminar){
  
  btnEliminar.addEventListener('click', (e)=>{

    const urlProyecto = e.target.dataset.proyectoUrl;
    //console.log(urlProyecto)
    Swal.fire({
        title: 'Seguro quieres eliminar el proyecto?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: 'No',
        customClass: {
          actions: 'my-actions',
          cancelButton: 'order-1 right-gap',
          confirmButton: 'order-2',
          denyButton: 'order-3',
        }
      }).then((result) => {
        if (result.isConfirmed) {


          const url = `${location.origin}/proyectos/${urlProyecto}`;
          console.log(url)

          axios.delete(url, {params: {urlProyecto} })
          .then(function(respuesta){
            console.log(respuesta)

            Swal.fire('Proyecto Eliminado!', respuesta.data, 'success')
            .then((result) => {
              if(result.isConfirmed){
                window.location.href = '/'              }
            })            
          })
          .catch(() =>{
            Swal.fire({type:'error',title:'Hubo un error',text:'No fue posible eliminar el proyecto'})
          })
          
        } else if (result.isDenied) {
          Swal.fire('Changes are not saved', '', 'info')
        }
      })
})
}

export default btnEliminar;