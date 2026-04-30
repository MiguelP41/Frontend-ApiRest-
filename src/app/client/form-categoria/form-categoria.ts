import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { Comprobantes } from '../../services/comprobantes'; 

@Component({
  selector: 'app-form-comprobante',
  standalone: true, 
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './form-categoria.html',
  styleUrls: ['./form-categoria.css']
})


export class FormCategoriaComponent implements OnInit {

  comprobanteForm: FormGroup;
  
  mostrarModalError : boolean = false;
  mostrarModalSuccess: boolean = false;
  tipoSeleccionado: string = 'V'; 
  mensajeErrorBackend: string = '';

  @Output() comprobanteGuardado = new EventEmitter<void>(); 

  selectedFile1: File | null = null; 
  selectedFile2: File | null = null;
  selectedFile3: File | null = null;

  constructor(
    private fb: FormBuilder, 
    private _comprobantes: Comprobantes 
  ) {
    this.comprobanteForm = this.fb.group({
      cedula: ['', [Validators.required, Validators.maxLength(50), Validators.pattern("^[0-9]*$")]],
      referencia: ['', [Validators.required, Validators.maxLength(50),Validators.pattern("^[0-9]*$")]],
      monto: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/^-?\d*\.?\d*$/)]],
      banco_ori: ['', Validators.required],
      telefo_pag: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      fecha_pag: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  // 🆕 ESTA ES LA FUNCIÓN QUE TE FALTABA
  formatearCedula(event: any) {
    const input = event.target as HTMLInputElement;
    // Remueve cualquier caracter que no sea un número
    input.value = input.value.replace(/[^0-9]/g, '');
    // Actualiza el valor en el formulario
    this.comprobanteForm.get('clienteId')?.setValue(input.value, { emitEvent: false });
  }

  guardarComprobante2() {
    if (this.comprobanteForm.invalid) {
      alert('Por favor, revisa los campos requeridos.');
      return;
    }

    const formData = new FormData();
    const formValues = this.comprobanteForm.value;

    // 🆕 COMBINAMOS EL TIPO CON EL NÚMERO
   const nuevoComprobante = {
    ...formValues,
   // nombre: `${this.tipoSeleccionado}-${formValues.nombre}`
    tipoDocumento: this.tipoSeleccionado,
      };

    formData.append('comprobante', JSON.stringify(nuevoComprobante));

    if (this.selectedFile1) {
      formData.append('imagen1', this.selectedFile1, this.selectedFile1.name);
    } 
    
    
    if (this.selectedFile2) {
      formData.append('imagen2', this.selectedFile2, this.selectedFile2.name);
    } else {
      const blobVacio = new Blob([], { type: 'application/octet-stream' });
      formData.append('imagen2', blobVacio, 'vacio.bin');
    }

    if (this.selectedFile3) {
      formData.append('imagen3', this.selectedFile3, this.selectedFile3.name);
    } else {
      const blobVacio = new Blob([], { type: 'application/octet-stream' });
      formData.append('imagen3', blobVacio, 'vacio.bin');
    }

    this._comprobantes.crearComprobanteConImagenes(formData)
      .subscribe({
        next: (res: any) => {
         
          if (res.code === 1010 || res.data === null) {
            this.mensajeErrorBackend = res.message; // "No se pudo validar el movimiento..."
            console.log('Mensaje de error capturado:', this.mensajeErrorBackend);
            this.mostrarModalError = true;
          } else {
            // ÉXITO REAL
            this.mostrarModalSuccess = true;
            this.selectedFile2 = null;
            this.selectedFile3 = null;
          }

        },
        error: (err) => {
          console.log('Objeto de error completo:', err);
          this.mostrarModalError = true;
          if (err.error && err.error.metadata && err.error.metadata.length > 0) {
            this.mensajeErrorBackend = err.error.metadata[0].date;
          } else {
            // Mensaje de respaldo por si la estructura cambia
            this.mensajeErrorBackend = 'Ocurrió un error inesperado en la validación.';
          }
        }
      });
  }

  cancelarFormulario() {
    this.comprobanteForm.reset();
    this.comprobanteGuardado.emit(); 
  }

  onFileSelected(event: any, imagenIndex: number) {
    const file = event.target.files[0];
    if (!file) return;

    if (imagenIndex === 1) this.selectedFile1 = file;
    else if (imagenIndex === 2) this.selectedFile2 = file;
    else if (imagenIndex === 3) this.selectedFile3 = file;
  }


  onMontoInput(event: any) {
  // 1. Obtener solo los números del input
  let value = event.target.value.replace(/\D/g, '');

  // 2. Si no hay valor, ponerlo en vacío o 0.00
  if (!value) {
    this.comprobanteForm.get('monto')?.setValue('');
    return;
  }

  // 3. Convertir a número y dividir por 100 para crear el efecto decimal
  const numericValue = (parseInt(value) / 100).toFixed(2);

  // 4. Actualizar el valor del formulario
  this.comprobanteForm.get('monto')?.setValue(numericValue, { emitEvent: false });
}



limpiarNoNumericos(event: any, controlName: string) {
  const input = event.target as HTMLInputElement;
  // Reemplaza cualquier cosa que no sea número por vacío
  const valorLimpio = input.value.replace(/[^0-9]/g, '');
  
  // Actualiza el formulario. Esto hará que tus Validators.pattern sean felices.
  this.comprobanteForm.get(controlName)?.setValue(valorLimpio, { emitEvent: true });
}


// 2. Método para cerrar el modal y resetear
    cerrarExito() {
      this.mostrarModalSuccess = false; // Aquí se cierra
      this.comprobanteForm.reset();       // Aquí se limpia el form
      this.selectedFile1 = null;        // Limpias archivos
      this.comprobanteGuardado.emit();    // Recargas la tabla
    }


    cerrarError() {
      this.mostrarModalError = false; // Aquí se cierra
     // this.comprobanteForm.reset();       // Aquí se limpia el form
     // this.selectedFile1 = null;        // Limpias archivos
     // this.comprobanteGuardado.emit();    // Recargas la tabla
    }

}