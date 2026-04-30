import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Comprobantes {


  url: any = 'https://apirest-books.onrender.com/v1/comprobantes';
  //url: any = 'http://localhost:8080/v1/comprobantes';
  //url: any ='d3id4ip19bf03j.cloudfront.net/v1/categorias';
  urlConImagenes: string = 'https://apirest-books.onrender.com/v1/comprobante-con-imagenes';
  //urlConImagenes: string = 'http://localhost:8080/v1/comprobante-con-imagenes';

  constructor(private http: HttpClient) { }


  obtenerComprobantes() {

    const headers = new HttpHeaders({
      //authorization : 'Basic ' + btoa("miguel" + ':' + "miguel12")
    });
    return this.http.get(this.url, { headers: headers });
  }


  descargarPdf(id: number): void {
    const pdfUrl = `${this.url}/pdf/${id}`;
    // ^^^ Construye la URL del endpoint de Spring Boot que genera el PDF

    // 1. Petición GET con responseType: 'blob'
    this.http.get(pdfUrl, { responseType: 'blob' })
      .subscribe({
        next: (response: Blob) => {
          // 2. Simular la descarga en el navegador
          const fileURL = URL.createObjectURL(response);
          const link = document.createElement('a');

          link.href = fileURL;
          link.download = `categoria_${id}_reporte.pdf`; // Nombre del archivo

          document.body.appendChild(link);
          link.click();

          // 3. Limpieza de elementos temporales
          document.body.removeChild(link);
          URL.revokeObjectURL(fileURL);

          console.log(`Descarga iniciada para la Categoría ID: ${id}`);
        },
        error: (error) => {
          console.error('Error al descargar el PDF:', error);
          // Puedes añadir lógica para mostrar un Toast o un Alert de error aquí
        }
      });
  }


  crearComprobante(comprobante: any) {
    console.log('Datos de Comprobante a enviar al Backend:', comprobante);

    const headers = new HttpHeaders({
      // Aquí puedes agregar headers, como el de Autorización si lo necesitas
    });

    // Utiliza el método POST para enviar los datos al backend
    return this.http.post(this.url, comprobante, { headers: headers });
  }


  /**
   * Envía datos de formulario (JSON + archivos) al endpoint /categorias-con-imagenes.
   * @param formData Objeto FormData que contiene archivos binarios y JSON serializado.
   */
  crearComprobanteConImagenes(formData: FormData): Observable<any> {

    console.log('Enviando FormData al endpoint de imágenes...');
    const datosParaVer = Object.fromEntries(formData.entries());
    console.log("Contenido del FormData:", datosParaVer);

    return this.http.post(this.urlConImagenes, formData);

  }





  obtenerRegistroPorId(id: number): Observable<any> {
    const detalleUrl = `${this.url}/${id}`;

    // Opcional: Si necesitas headers de autorización, inclúyelos aquí
    // const headers = new HttpHeaders({ /* ... */ });

    // 1. Realiza la petición GET. 
    // 2. Usamos pipe(map) para extraer el objeto de la categoría de la respuesta anidada.
    return this.http.get<any>(detalleUrl).pipe(
      map((respuesta) => {
        // Tu API devuelve la categoría dentro de: 
        // respuesta.categoriaResponse.categoria[0]

        // Retornamos solo el objeto de la categoría
        if (respuesta && respuesta.categoriaResponse && respuesta.categoriaResponse.categoria) {
          return respuesta.categoriaResponse.categoria[0];
        }

        // Si la estructura no se encuentra o no hay datos:
        return null;
      })
    );
  }


}


