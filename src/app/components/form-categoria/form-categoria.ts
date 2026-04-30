 import { Component, EventEmitter, Output, OnInit} from '@angular/core';
 import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
 import { CommonModule } from '@angular/common'; 
 import { Categorias } from '../../services/categorias'; 

  @Component({
    selector: 'app-form-categoria',
    standalone: true, 
    imports: [CommonModule, ReactiveFormsModule], 
    templateUrl: './form-categoria.html',
    styleUrls: ['./form-categoria.css']
  })


  export class FormCategoriaComponent implements OnInit { // Implementa OnInit para usar el hook

    mostrarModalSuccess: boolean = false;
     mostrarModalError: boolean = false;
    tipoSeleccionado: string = 'V';
    categoriaForm: FormGroup;
    
    @Output() categoriaGuardada = new EventEmitter<void>(); 

    // Inyectar FormBuilder y el servicio Categorias
    constructor(
      private fb: FormBuilder, 
      private _categorias: Categorias 
    ) {
      // Inicializar el formulario en el constructor
      this.categoriaForm = this.fb.group({
        // Definir los controles (campos) y sus validaciones
        nombre: ['', [Validators.required, Validators.maxLength(50)]],
        apellidos: ['', [Validators.required, Validators.maxLength(50)]],
        correo: ['', [Validators.required, Validators.maxLength(50)]],
        descripcion: ['', [Validators.required, Validators.maxLength(255)]],
        tipo_docu: ['', [Validators.required, Validators.maxLength(50)]],
        documento: ['', [Validators.required, Validators.maxLength(50)]]
        
      });
    }

    ngOnInit(): void {}


    // 2. Método para cerrar el modal y resetear
    cerrarExito() {
      this.mostrarModalSuccess = false; // Aquí se cierra
      this.categoriaForm.reset();       // Aquí se limpia el form
      this.selectedFile1 = null;        // Limpias archivos
      this.categoriaGuardada.emit();    // Recargas la tabla
    }


    cerrarError() {
      this.mostrarModalError = false; // Aquí se cierra
      this.categoriaForm.reset();       // Aquí se limpia el form
      this.selectedFile1 = null;        // Limpias archivos
      this.categoriaGuardada.emit();    // Recargas la tabla
    }

    formatearCedula(event: any) {
      const input = event.target as HTMLInputElement;
      // Remueve cualquier caracter que no sea un número
      input.value = input.value.replace(/[^0-9]/g, '');
      // Actualiza el valor en el formulario
      this.categoriaForm.get('documento')?.setValue(input.value, { emitEvent: false });
    }

    guardarCategoria() {
      if (this.categoriaForm.invalid) {
        alert('Por favor, revisa los campos requeridos.');
        return;
      }

      const nuevaCategoria = this.categoriaForm.value;

      this._categorias.crearCategoria(nuevaCategoria)
        .subscribe({
          next: (any) => {
            alert('Categoría guardada con éxito!');
            this.categoriaForm.reset();
            this.categoriaGuardada.emit(); // Notifica a Body para recargar la tabla
          },
          error: (err) => {
            console.error('Error al guardar:', err);
            alert('Hubo un error al guardar la categoría.');
          }
        });
    }

    selectedFile1: File | null = null;
    selectedFile2: File | null = null;
    selectedFile3: File | null = null;



    guardarCategoria2() {
      if (this.categoriaForm.invalid) {
        alert('Por favor, revisa los campos requeridos.');
        return;
      }

      const formData = new FormData();
      const nuevaCategoria = this.categoriaForm.value;

      formData.append('categoria', JSON.stringify(nuevaCategoria));

      if (this.selectedFile1) {
        formData.append('imagen1', this.selectedFile1, this.selectedFile1.name);
      }


      this._categorias.crearCategoriaConImagenes(formData)
        .subscribe({
          next: () => {
            this.mostrarModalSuccess = true;
            //alert('Categoría guardada con éxito!');
          //  this.categoriaForm.reset();
            this.selectedFile = null; // Limpiar la referencia al archivo
          //  this.categoriaGuardada.emit(); // Notifica para recargar
          },
          error: (err) => {

            this.mostrarModalError = true;
           // console.error('Error al guardar:', err);
           // alert('Hubo un error al guardar la categoría.');
          }
        });
    }


    cancelarFormulario() {
      this.categoriaForm.reset();
      // Llama a la propiedad de este COMPONENTE. Si da error, solo REINICIA 'ng serve'.
      this.categoriaGuardada.emit();
    }


    selectedFile: File | null = null;

    onFileSelected(event: any, imagenIndex: number) {
      const file = event.target.files[0];

      if (!file) return;

      // Asigna el archivo a la propiedad correcta
      if (imagenIndex === 1) {
        this.selectedFile1 = file;
      } else if (imagenIndex === 2) {
        this.selectedFile2 = file;
      } else if (imagenIndex === 3) {
        this.selectedFile3 = file;
      }
    }







  }