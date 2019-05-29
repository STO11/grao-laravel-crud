
    @if($id)
        {!! Form::model($apiatendimento,['route' => 'controle.apiatendimento.update', 'files' => true]) !!}
    @else 
        {!! Form::model(null,['route' => 'controle.apiatendimento.create', 'files' => true]) !!}
    @endif

    
                                    <div class="form-group">
                <label for="titulo">cliente_id*</label>
                {!! Form::select('cliente_id', [], null, ['class' => 'form-control', 'required']) !!}
            </div>
                                                    
                                    <div class="form-group">
                <label for="titulo">cliente_login_id*</label>
                {!! Form::select('cliente_login_id', [], null, ['class' => 'form-control', 'required']) !!}
            </div>
                                                    
                                    <div class="form-group">
                <label for="titulo">solicitacoes_id*</label>
                {!! Form::select('solicitacoes_id', [], null, ['class' => 'form-control', 'required']) !!}
            </div>
                                                    
                                    <div class="form-group">
                <label for="titulo">grupo_usuario_id*</label>
                {!! Form::select('grupo_usuario_id', [], null, ['class' => 'form-control', 'required']) !!}
            </div>
                                                    
                                    <div class="form-group">
                <label for="titulo">chamado_id*</label>
                {!! Form::select('chamado_id', [], null, ['class' => 'form-control', 'required']) !!}
            </div>
                                                    
                                                                
                                                                
                                                                
                                                                
                        <div class="form-group">
                <label for="titulo">origem*</label>
                {!! Form::text('origem', null, ['class' => 'form-control', 'required']) !!}
            </div>
                                                                
                                                                
                                                                
                                                <div class="form-group">
                <label for="titulo">emailheader*</label>
                {!! Form::textarea('emailheader',null, ['class' => 'form-control', 'required']) !!}
            </div>
                                        
                                                <div class="form-group">
                <label for="titulo">emailbody*</label>
                {!! Form::textarea('emailbody',null, ['class' => 'form-control', 'required']) !!}
            </div>
                                        
                        <div class="form-group">
                <label for="titulo">emailcliente*</label>
                {!! Form::text('emailcliente', null, ['class' => 'form-control', 'required']) !!}
            </div>
                                                                
                        <div class="form-group">
                <label for="titulo">nomeclienteemail*</label>
                {!! Form::text('nomeclienteemail', null, ['class' => 'form-control', 'required']) !!}
            </div>
                                                                
                                                                
                                                                
                                                                        
    @if($id)
        @can('controle.apiatendimento.alterar')
            <button type="submit" class="btn btn-primary">Salvar</button>
        @endcan
    @else 
        @can('controle.apiatendimento.cadastrar')
            <button type="submit" class="btn btn-primary">Salvar</button>
        @endcan
    @endif
{!! Form::close() !!}
