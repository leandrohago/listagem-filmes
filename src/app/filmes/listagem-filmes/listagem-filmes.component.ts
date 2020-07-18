import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FilmesService } from '../../core/filmes.service';
import { Filme } from 'src/app/shared/models/filme';
import { ConfigParams } from '../../shared/models/config-params';

@Component({
  selector: 'dio-listagem-filmes',
  templateUrl: './listagem-filmes.component.html',
  styleUrls: ['./listagem-filmes.component.scss']
})
export class ListagemFilmesComponent implements OnInit {

  config: ConfigParams = {
    limite: 4,
    pagina: 0
  }
  filmes: Filme[] = []
  filtrosListagem: FormGroup
  generos: Array<string>

  constructor(private filmesService: FilmesService,
    private fb: FormBuilder
    ) { }

  ngOnInit(): void {
    this.filtrosListagem = this.fb.group({
        texto: [''],
        genero: ['']
      })

    this.filtrosListagem.get('texto').valueChanges.subscribe((val: string) =>{
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

  open() {
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
