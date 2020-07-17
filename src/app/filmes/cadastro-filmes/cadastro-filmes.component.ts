import { AlertaComponent } from '../../shared/components/alerta/alerta.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidarCamposService } from 'src/app/shared/components/campos/validar-campos.service';
import { FilmesService } from '../../core/filmes.service';
import { Filme } from '../../shared/models/filme';
import { Alerta } from 'src/app/shared/models/alerta';

@Component({
  selector: 'dio-cadastro-filmes',
  templateUrl: './cadastro-filmes.component.html',
  styleUrls: ['./cadastro-filmes.component.scss']
})
export class CadastroFilmesComponent implements OnInit {

  cadastro: FormGroup;
  generos: Array<string>
 
  constructor(public validacao: ValidarCamposService, 
    public dialog: MatDialog,
    private fb: FormBuilder,
    private filmeService: FilmesService,
    private router: Router
    ) { }

  get f(){
    return this.cadastro.controls
  }

  ngOnInit(): void {
    this.cadastro = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(256)]]
      ,urlFoto: ['', [Validators.minLength(10)]]
      ,dtLancamento: ['', [Validators.required]]
      ,descricao: ['']
      ,nota: [0, [Validators.required, Validators.min(0), Validators.max(10)]]
      ,urlIMDb: ['', Validators.minLength(10)]
      ,genero: ['', Validators.required]
    });

    this.generos = ['Ação', 'Aventura', 'Comédia', 'Ficção Científica', 'Romance', 'Terror']

  }
    
  submit(): void {
    this.cadastro.markAllAsTouched()
    if(this.cadastro.invalid){
      return
    }

    const filme = this.cadastro.getRawValue() as Filme
    this.salvar(filme)

  }
  
  reiniciarForm(): void {
    this.cadastro.reset()
  }

  private salvar(filme: Filme): void{
    this.filmeService.salvar(filme).subscribe(() =>{
      const config ={
        data: {
          btnSucesso: 'Ir para listagem',
          btnCancelar: 'Cadastrar novo filme',
          corBtnCancelar: 'primary',
          possuirBtnFechar: true
        } as Alerta
      }
      const dialogRef = this.dialog.open(AlertaComponent, config)
      dialogRef.afterClosed().subscribe((opcao: boolean)=>{
        if(opcao === true){
          this.router.navigateByUrl('filmes')
        }
        if(opcao === false){
          this.reiniciarForm()
        }
      })
    },
    () => {
      const config ={
        data: {
          titulo: 'Erro ao salvar',
          descricao: 'Não foi possível salvar o registro!',
          corBtnSucesso: 'warn',
          btnSucesso: 'Fechar'
        } as Alerta
      }
      this.dialog.open(AlertaComponent, config)
    }
    )

  }
  

}
