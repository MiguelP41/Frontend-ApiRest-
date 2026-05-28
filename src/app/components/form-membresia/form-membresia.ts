import { Component, EventEmitter, Output, OnInit} from '@angular/core';
 import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
 import { CommonModule } from '@angular/common'; 
 import { MembresiaService } from '../../services/membresia'; 
 import { Router } from '@angular/router'; // ← agregar este import

  @Component({
    selector: 'app-form-categoria',
    standalone: true, 
    imports: [CommonModule, ReactiveFormsModule], 
    templateUrl: './form-membresia.html',
    styleUrls: ['./form-membresia.css']
  })


  export class FormMembresiaComponent implements OnInit { // Implementa OnInit para usar el hook

    mostrarModalSuccess: boolean = false;
     mostrarModalError: boolean = false;
    tipoSeleccionado: string = 'V';
    membresiaForm: FormGroup;
    
    @Output() membresiaGuardada = new EventEmitter<void>(); 

    // Inyectar FormBuilder y el servicio Membresias
    constructor(
      private fb: FormBuilder, 
      private _membresia: MembresiaService ,
      private router: Router
    ) {
      // Inicializar el formulario en el constructor
      this.membresiaForm = this.fb.group({
        tipo_docu: ['V'],
        cedula: ['', Validators.required],
        fecha_inicio: ['', Validators.required],
        planId: ['', Validators.required],
        descripcion: [''],
      });
    }

    ngOnInit(): void {}


    // 2. Método para cerrar el modal y resetear
    cerrarExito() {
      this.mostrarModalSuccess = false;
      this.membresiaForm.reset();
      this.selectedFile1 = null;


      this.router.navigate(['/Dasboard/membresias']);
    }


    cerrarError() {
      this.mostrarModalError = false; // Aquí se cierra
      this.membresiaForm.reset();       // Aquí se limpia el form
      this.selectedFile1 = null;        // Limpias archivos
      this.membresiaGuardada.emit();    // Recargas la tabla
    }

    formatearCedula(event: any) {
      const input = event.target as HTMLInputElement;
      // Remueve cualquier caracter que no sea un número
      input.value = input.value.replace(/[^0-9]/g, '');
      // Actualiza el valor en el formulario
      this.membresiaForm.get('documento')?.setValue(input.value, { emitEvent: false });
    }

    guardarMembresia() {
      if (this.membresiaForm.invalid) {
        alert('Por favor, revisa los campos requeridos.');
        return;
      }

      const nuevaMembresia = this.membresiaForm.value;

      this._membresia.crearMembresia(nuevaMembresia)
        .subscribe({
          next: (any) => {
            this.mostrarModalSuccess = true;
         //   alert('Membresia guardada con éxito!');
            this.membresiaForm.reset();
            this.membresiaGuardada.emit(); // Notifica a Body para recargar la tabla
          },
          error: (err) => {
            console.error('Error al guardar:', err);
             this.mostrarModalError = true;
           // alert('Hubo un error al guardar la Membresia.');
          }
        });
    }

    selectedFile1: File | null = null;
    selectedFile2: File | null = null;
    selectedFile3: File | null = null;



    

    cancelarFormulario() {
      this.membresiaForm.reset();
      // Llama a la propiedad de este COMPONENTE. Si da error, solo REINICIA 'ng serve'.
      this.membresiaGuardada.emit();
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