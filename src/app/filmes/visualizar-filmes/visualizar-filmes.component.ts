import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilmesService } from '../../core/filmes.service';
import { Filme } from 'src/app/shared/models/filme';
import { Alerta } from 'src/app/shared/models/alerta';
import { MatDialog } from '@angular/material/dialog';
import { AlertaComponent } from 'src/app/shared/components/alerta/alerta.component';

@Component({
  selector: 'dio-visualizar-filmes',
  templateUrl: './visualizar-filmes.component.html',
  styleUrls: ['./visualizar-filmes.component.scss']
})
export class VisualizarFilmesComponent implements OnInit {
  readonly semFoto = 'https://www.aracas.ba.gov.br/visao/assets/images/no-image.jpg' 
  filme: Filme
  id: number
  constructor(private activatedRoute: ActivatedRoute,
    private filmesService: FilmesService,
    public dialog: MatDialog,
    private router: Router
    ) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id']
    this.visualizar()
  }

  excluir(): void{
    const config ={
      data: {
        titulo: 'Você tem certeza que deseja excluir?',
        descricao: 'Caso tenha cereza clique em OK',
        corBtnCancelar: 'primary',
        corBtnSucesso: 'warn',
        possuirBtnFechar: true
      } as Alerta
    }
    const dialogRef = this.dialog.open(AlertaComponent, config)
    dialogRef.afterClosed().subscribe((opcao: boolean)=>{
      if(opcao === true){
        this.filmesService.excluir(this.id)
        .subscribe(()=> this.router.navigateByUrl('/filmes'))
      }
    })



  }

  private visualizar(){
    return this.filmesService.visualizar(this.id).subscribe((filme: Filme) => this.filme = filme) 
  }

}
