import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FilmesService } from '../../core/filmes.service';
import { Filme } from 'src/app/shared/models/filme';
import { ConfigParams } from '../../shared/models/config-params';
import { debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'dio-listagem-filmes',
  templateUrl: './listagem-filmes.component.html',
  styleUrls: ['./listagem-filmes.component.scss']
})
export class ListagemFilmesComponent implements OnInit {

  readonly semFoto = 'https://www.aracas.ba.gov.br/visao/assets/images/no-image.jpg'

  config: ConfigParams = {
    limite: 4,
    pagina: 0
  }
  filmes: Filme[] = []
  filtrosListagem: FormGroup
  generos: Array<string>

  constructor(private filmesService: FilmesService,
    private fb: FormBuilder,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.filtrosListagem = this.fb.group({
        texto: [''],
        genero: ['']
      })

    this.filtrosListagem.get('texto').valueChanges
    .pipe(debounceTime(500))
    .subscribe((val: string) =>{
      this.config.pesquisa = val
      this.resetarConsulta()
    })
    
    this.filtrosListagem.get('genero').valueChanges.subscribe((val: string) =>{
      this.config.campo = {tipo: 'genero', valor: val}
      this.resetarConsulta()
    })

    this.generos = ['Ação', 'Aventura', 'Comédia', 'Ficção Científica', 'Romance', 'Terror']
    this.listarFilmes()
  }

  abrir(id: number): void {
    this.router.navigateByUrl('/filmes/'+ id)
  }

  onScroll(): void{
    this.listarFilmes()
  }

  private listarFilmes(): void{
    this.config.pagina++
    this.filmesService.listar(this.config)
    .subscribe((filmes: Filme[]) => this.filmes.push(...filmes))
  }

  private resetarConsulta(): void{
    this.config.pagina = 0
    this.filmes = []
    this.listarFilmes()
  }

}
