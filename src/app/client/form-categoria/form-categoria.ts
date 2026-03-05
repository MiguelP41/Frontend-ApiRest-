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
  
  // 🆕 ESTA ES LA PROPIEDAD QUE TE FALTABA
  tipoSeleccionado: string = 'V'; 

  @Output() comprobanteGuardado = new EventEmitter<void>(); 

  selectedFile1: File | null = null; 
  selectedFile2: File | null = null;
  selectedFile3: File | null = null;

  constructor(
    private fb: FormBuilder, 
    private _comprobantes: Comprobantes 
  ) {
    this.comprobanteForm = this.fb.group({
      // Agregamos una validación de patrón para que solo acepte números
      clienteId: ['', [Validators.required, Validators.maxLength(50), Validators.pattern("^[0-9]*$")]],
      referenciaBancaria: ['', [Validators.required, Validators.maxLength(50),Validators.pattern("^[0-9]*$")]],
      monto: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/^-?\d*\.?\d*$/)]],
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
        next: () => {
          alert('Comprobante guardada con éxito!');
          this.comprobanteForm.reset();
          this.selectedFile1 = null;
          this.selectedFile2 = null;
          this.selectedFile3 = null;
          this.comprobanteGuardado.emit();
        },
        error: (err) => {
          console.error('Error al guardar:', err);
          alert('Hubo un error al guardar la categoría.');
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
}